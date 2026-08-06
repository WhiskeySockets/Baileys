use js_sys::{Array, Object, Uint8Array};
use std::borrow::Cow;
use std::cell::{RefCell, UnsafeCell};
use std::collections::HashMap;
use std::io::Write;
use std::mem;
use std::rc::Rc;
use wacore_binary::{
    marshal::{marshal_ref, marshal_ref_to_vec, unmarshal_ref},
    node::{AttrsRef, NodeContentRef, NodeRef, NodeStr, ValueRef},
    token::{TokenKind, get_double_token, get_single_token, index_of_token},
    util::unpack,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "EncodingNode")]
    pub type EncodingNode;

    #[wasm_bindgen(extends = Object, typescript_type = "{ [key: string]: string }")]
    #[derive(Clone, Debug, PartialEq, Eq)]
    pub type Attrs;

    #[wasm_bindgen(extends = Object, typescript_type = "BinaryNode[] | string | Uint8Array")]
    #[derive(Clone, Debug, PartialEq, Eq)]
    pub type Content;

    #[wasm_bindgen(structural, method, getter)]
    pub fn tag(this: &EncodingNode) -> String;

    #[wasm_bindgen(structural, method, getter)]
    pub fn attrs(this: &EncodingNode) -> Attrs;

    #[wasm_bindgen(structural, method, getter)]
    pub fn content(this: &EncodingNode) -> JsValue;
}

#[inline]
pub(crate) fn js_to_node_ref(val: &EncodingNode) -> Result<NodeRef<'static>, JsValue> {
    let attrs_obj = val.attrs().unchecked_into::<Object>();
    // keys + get rather than entries: entries allocates a two-element array per
    // attribute, and it was 12% of the encode profile.
    let keys = Object::keys(&attrs_obj);
    let len = keys.length();
    let mut attrs = Vec::with_capacity(len as usize);

    for i in 0..len {
        let key_js = keys.get(i);
        let value_js = match js_sys::Reflect::get(&attrs_obj, &key_js) {
            Ok(value) => value,
            Err(_) => continue,
        };

        let key = match key_js.as_string() {
            Some(k) => k,
            None => continue,
        };

        let value_str = if let Some(s) = value_js.as_string() {
            if s.is_empty() || s.chars().all(|c| c.is_whitespace()) {
                continue;
            }
            s
        } else if let Some(n) = value_js.as_f64() {
            n.to_string()
        } else if let Some(b) = value_js.as_bool() {
            b.to_string()
        } else {
            continue;
        };

        attrs.push((
            NodeStr::Owned(key.into()),
            ValueRef::String(NodeStr::Owned(value_str.into())),
        ));
    }

    let content_js = val.content();

    let content = if content_js.is_undefined() {
        Ok(None)
    } else if let Some(string_value) = content_js.as_string() {
        Ok(Some(NodeContentRef::String(NodeStr::Owned(
            string_value.into(),
        ))))
    } else if content_js.is_instance_of::<Uint8Array>() {
        let byte_array: Uint8Array = content_js.unchecked_into();
        Ok(Some(NodeContentRef::Bytes(Cow::Owned(byte_array.to_vec()))))
    } else if Array::is_array(&content_js) {
        let arr = Array::from(&content_js);
        let nodes = (0..arr.length())
            .map(|i| {
                let child_val = arr.get(i);
                let child_node = child_val.unchecked_into::<EncodingNode>();
                js_to_node_ref(&child_node)
            })
            .collect::<Result<Vec<NodeRef<'static>>, _>>()?;
        Ok(Some(NodeContentRef::Nodes(nodes.into_boxed_slice())))
    } else {
        Err(JsValue::from_str("Invalid content type"))
    };

    Ok(NodeRef::new(
        NodeStr::Owned(val.tag().into()),
        AttrsRef::from_vec(attrs),
        content?,
    ))
}

#[wasm_bindgen(typescript_custom_section)]
const T_NODE: &'static str = r#"
export interface BinaryNode {
    tag: string;
    attrs: { [key: string]: string };
    content?: BinaryNode[] | string | Uint8Array;
}
"#;

#[wasm_bindgen]
pub struct InternalBinaryNode {
    _owned_data: Rc<[u8]>,
    node_ref: NodeRef<'static>,
    cached_attrs: UnsafeCell<Option<Attrs>>,
    cached_content: UnsafeCell<Option<Content>>,
}

thread_local! {
    /// Tags and attribute names repeat across every stanza, and each
    /// `JsValue::from_str` decodes UTF-8 again on the JS side. Interning them
    /// turns that into a refcount bump. Bounded, and cleared wholesale rather
    /// than evicted: the working set is the token table, not user data.
    static INTERNED: RefCell<HashMap<String, JsValue>> = RefCell::new(HashMap::new());
}

const MAX_INTERNED: usize = 512;

fn intern(value: &str) -> JsValue {
    INTERNED.with(|cache| {
        let mut cache = cache.borrow_mut();
        if let Some(hit) = cache.get(value) {
            return hit.clone();
        }

        let js = JsValue::from_str(value);
        if cache.len() >= MAX_INTERNED {
            cache.clear();
        }

        cache.insert(value.to_owned(), js.clone());
        js
    })
}

impl InternalBinaryNode {
    #[inline(always)]
    fn node_ref(&self) -> &NodeRef<'static> {
        &self.node_ref
    }

    #[inline]
    fn convert_attrs(attrs: &AttrsRef<'_>) -> Attrs {
        let obj = Object::new();
        for (k, v) in attrs.as_slice().iter() {
            let _ = js_sys::Reflect::set(&obj, &intern(k), &intern(&value_string(v)));
        }
        obj.unchecked_into()
    }
}

/// An attribute value as the JS side spells it.
///
/// A jid with no user renders as bare `s.whatsapp.net` in the core, and
/// callers match those against a leading `@`: dropping it routes the server's
/// own notifications down the wrong branch.
fn value_string<'a>(value: &'a ValueRef<'_>) -> Cow<'a, str> {
    match value {
        ValueRef::Jid(jid) if jid.user.is_empty() => Cow::Owned(format!("@{jid}")),
        _ => value.as_str(),
    }
}

#[wasm_bindgen]
impl InternalBinaryNode {
    #[wasm_bindgen(getter)]
    pub fn tag(&self) -> String {
        self.node_ref().tag.to_string()
    }

    /// Materializes the whole subtree as plain JS objects in one pass.
    ///
    /// The walk stays on the Rust side: no child handle is created, and no
    /// per-node reflection or callback crosses the boundary. A caller that
    /// reads the entire tree, which the socket does for every stanza, pays for
    /// the nodes it reads once instead of on each getter.
    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> JsValue {
        // SAFETY: WASM is single-threaded
        let attrs_cache = unsafe { &*self.cached_attrs.get() };
        let content_cache = unsafe { &*self.cached_content.get() };

        // Nothing has been handed out, so nothing can have been changed and
        // the parsed node is the whole truth. Every reader takes this path.
        if attrs_cache.is_none() && content_cache.is_none() {
            return Self::node_to_json(self.node_ref());
        }

        // Past that, a caller may have written through the object a getter
        // gave it, assigned over it, or written to a child handle, and none of
        // those reach `node_ref`.
        let obj = Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("tag"),
            &intern(&self.node_ref().tag),
        );

        let attrs = match attrs_cache {
            Some(attrs) => attrs.clone().into(),
            None => Self::convert_attrs(&self.node_ref().attrs).into(),
        };
        let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("attrs"), &attrs);

        let content = match content_cache {
            Some(content) => Some(Self::serialize_cached_content(&content.clone().into())),
            None => Self::content_to_json(self.node_ref()),
        };

        if let Some(content) = content {
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("content"), &content);
        }

        obj.into()
    }

    /// Children come back from the getter as handles, which carry writes of
    /// their own, so each one serializes itself.
    fn serialize_cached_content(content: &JsValue) -> JsValue {
        if !Array::is_array(content) {
            return content.clone();
        }

        let items = Array::from(content);
        let out = Array::new_with_length(items.length());
        let to_json = JsValue::from_str("toJSON");
        for i in 0..items.length() {
            let item = items.get(i);
            let serialized = js_sys::Reflect::get(&item, &to_json)
                .ok()
                .filter(|f| f.is_function())
                .and_then(|f| f.unchecked_into::<js_sys::Function>().call0(&item).ok())
                .unwrap_or(item);
            out.set(i, serialized);
        }

        out.into()
    }

    fn node_to_json(node: &NodeRef<'_>) -> JsValue {
        let obj = Object::new();
        let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("tag"), &intern(&node.tag));
        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("attrs"),
            &Self::convert_attrs(&node.attrs).into(),
        );

        if let Some(content) = Self::content_to_json(node) {
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("content"), &content);
        }

        obj.into()
    }

    fn content_to_json(node: &NodeRef<'_>) -> Option<JsValue> {
        match node.content.as_ref() {
            Some(NodeContentRef::Bytes(bytes)) => Some(Uint8Array::from(bytes.as_ref()).into()),
            Some(NodeContentRef::String(s)) => Some(JsValue::from_str(s)),
            Some(NodeContentRef::Nodes(nodes)) => {
                let arr = Array::new_with_length(nodes.len() as u32);
                for (i, child) in nodes.iter().enumerate() {
                    arr.set(i as u32, Self::node_to_json(child));
                }

                Some(arr.into())
            }
            None => None,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn attrs(&self) -> Attrs {
        // SAFETY: WASM is single-threaded
        let cached = unsafe { &mut *self.cached_attrs.get() };
        if let Some(attrs) = cached.as_ref() {
            return attrs.clone();
        }

        let attrs = Self::convert_attrs(&self.node_ref().attrs);
        *cached = Some(attrs.clone());
        attrs
    }

    #[wasm_bindgen(setter)]
    pub fn set_attrs(&self, new_attrs: Attrs) {
        // SAFETY: WASM is single-threaded
        unsafe { *self.cached_attrs.get() = Some(new_attrs) };
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> Option<Content> {
        // SAFETY: WASM is single-threaded
        let cached = unsafe { &mut *self.cached_content.get() };
        if let Some(content) = cached.as_ref() {
            return Some(content.clone());
        }

        let result: Option<Content> = match self.node_ref().content.as_ref() {
            Some(NodeContentRef::Bytes(bytes)) => {
                Some(Uint8Array::from(bytes.as_ref()).unchecked_into())
            }
            Some(NodeContentRef::String(s)) => Some(JsValue::from_str(s).unchecked_into()),
            Some(NodeContentRef::Nodes(nodes)) => {
                let arr = Array::new_with_length(nodes.len() as u32);
                for (i, node_ref) in nodes.iter().enumerate() {
                    let child = InternalBinaryNode {
                        _owned_data: Rc::clone(&self._owned_data),
                        node_ref: node_ref.clone(),
                        cached_attrs: UnsafeCell::new(None),
                        cached_content: UnsafeCell::new(None),
                    };
                    arr.set(i as u32, child.into());
                }
                Some(arr.unchecked_into())
            }
            None => None,
        };

        *cached = result.clone();
        result
    }

    #[wasm_bindgen(setter)]
    pub fn set_content(&self, new_content: Content) {
        // SAFETY: WASM is single-threaded
        unsafe { *self.cached_content.get() = Some(new_content) };
    }
}

#[wasm_bindgen(js_name = encodeNode)]
pub fn encode_node(node_val: EncodingNode) -> Result<Uint8Array, JsValue> {
    let node_ref = js_to_node_ref(&node_val)?;
    let bytes = marshal_ref(&node_ref).map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(Uint8Array::from(bytes.as_slice()))
}

#[wasm_bindgen(js_name = decodeNode)]
pub fn decode_node(data: Vec<u8>) -> Result<InternalBinaryNode, JsValue> {
    if data.is_empty() {
        return Err(JsValue::from_str("Input data cannot be empty"));
    }

    let unpacked_cow = unpack(&data).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let owned_data: Rc<[u8]> = match unpacked_cow {
        Cow::Owned(vec) => Rc::from(vec.into_boxed_slice()),
        Cow::Borrowed(slice) => Rc::from(slice),
    };

    let static_data: &'static [u8] = unsafe { mem::transmute(owned_data.as_ref()) };
    let node_ref = unmarshal_ref(static_data).map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(InternalBinaryNode {
        _owned_data: owned_data,
        node_ref,
        cached_attrs: UnsafeCell::new(None),
        cached_content: UnsafeCell::new(None),
    })
}

/// One buffer holding the whole decoded tree.
///
/// Building JS objects from Rust costs a boundary crossing per field, which is
/// what makes the handle path lose to the local decoder. This hands the tree
/// over as bytes and lets JS assemble it, where the JIT can see the loop.
///
/// Layout, all sections aligned to 4 so JS can take views without copying:
///   u32 stringBytes, u32 offsetCount, u32 layoutCount, u32 blobBytes
///   string data | u32 offsets | u32 layout | blob data
/// The token table, flattened, so JS can index it the way the local decoder
/// indexes its own. Read once at boot: a decode then refers to a known tag by
/// index instead of shipping and decoding its bytes again.
#[wasm_bindgen(js_name = tokenTable)]
pub fn token_table() -> Array {
    let out = Array::new();
    for index in 0..=u8::MAX {
        match get_single_token(index) {
            Some(token) => out.push(&JsValue::from_str(token)),
            None => out.push(&JsValue::UNDEFINED),
        };
    }

    for dict in 0..DOUBLE_DICTS {
        for index in 0..=u8::MAX {
            match get_double_token(dict, index) {
                Some(token) => out.push(&JsValue::from_str(token)),
                None => out.push(&JsValue::UNDEFINED),
            };
        }
    }

    out
}

const DOUBLE_DICTS: u8 = 4;
/// Indices at or above this refer to the token table rather than the pool.
const TOKEN_BASE: u32 = 1 << 24;

fn token_index(value: &str) -> Option<u32> {
    match index_of_token(value)? {
        TokenKind::Single(i) => Some(TOKEN_BASE + u32::from(i)),
        TokenKind::Double(d, i) if d < DOUBLE_DICTS => {
            Some(TOKEN_BASE + 256 + u32::from(d) * 256 + u32::from(i))
        }
        TokenKind::Double(..) => None,
    }
}

/// Where the last flat call left its output, as four `(offset, length)` pairs
/// into linear memory: strings, string offsets, layout, blobs. The address is
/// fixed, so the JS side reads it without a second crossing.
///
/// Handing back a `Uint8Array` instead cost around 500ns a call in JS object
/// churn, which on a small stanza was most of the decode, and forced the four
/// sections to be concatenated into a fifth buffer first.
type FlatResult = [u32; 8];

thread_local! {
    static FLAT_RESULT: UnsafeCell<FlatResult> = const { UnsafeCell::new([0; 8]) };
}

#[wasm_bindgen(js_name = __flatResultPtr)]
pub fn flat_result_ptr() -> u32 {
    FLAT_RESULT.with(|cell| cell.get() as u32)
}

/// The sections stay borrowed from thread-local buffers that live until the
/// next call, which is the window the caller is given to read them.
fn publish(sections: [&[u8]; 4]) {
    let mut result: FlatResult = [0; 8];
    for (i, section) in sections.iter().enumerate() {
        result[i * 2] = section.as_ptr() as u32;
        result[i * 2 + 1] = section.len() as u32;
    }

    // SAFETY: wasm32 is single threaded and nothing holds a reference across
    // this write.
    FLAT_RESULT.with(|cell| unsafe { *cell.get() = result });
}

/// Takes the frame already inflated and without its prefix byte. Inflating
/// here would do it synchronously on the main thread, and a compressed group
/// stanza is large enough that the stall shows up as missed deadlines; node's
/// zlib runs on the thread pool instead.
#[wasm_bindgen(js_name = __decodeNodeFlat)]
pub fn decode_node_flat(data: &[u8]) -> Result<(), JsValue> {
    if data.is_empty() {
        return Err(JsValue::from_str("Input data cannot be empty"));
    }

    let node = unmarshal_ref(data).map_err(|e| JsValue::from_str(&e.to_string()))?;

    // Reused across calls: four fresh allocations per decode showed up as
    // dlmalloc time, and a stanza is decoded once per message.
    FLAT_BUILDER.with(|cell| {
        let mut builder = cell.borrow_mut();
        builder.reset();
        builder.push(&node);
        publish([
            &builder.strings,
            as_bytes(&builder.string_offsets),
            as_bytes(&builder.layout),
            &builder.bytes,
        ]);
    });

    Ok(())
}

thread_local! {
    static FLAT_BUILDER: RefCell<FlatBuilder> = RefCell::new(FlatBuilder {
        strings: Vec::new(),
        string_offsets: vec![0],
        seen: Box::new([Seen::default(); SEEN_SLOTS]),
        round: 0,
        layout: Vec::new(),
        bytes: Vec::new(),
    });
}

impl FlatBuilder {
    fn reset(&mut self) {
        self.strings.clear();
        self.string_offsets.clear();
        self.string_offsets.push(0);
        self.layout.clear();
        self.bytes.clear();
        self.round = self.round.wrapping_add(1);
    }
}

/// u32 slice as bytes. wasm32 is little endian, which is the layout the JS
/// side reads back with a `Uint32Array` view. Alignment carries over from the
/// element type, which is what lets that view exist.
fn as_bytes(values: &[u32]) -> &[u8] {
    // SAFETY: u32 has no padding and any bit pattern is a valid u8.
    unsafe {
        std::slice::from_raw_parts(values.as_ptr() as *const u8, std::mem::size_of_val(values))
    }
}

/// FxHash: the default SipHash is a cryptographic hash and showed up as 9% of
/// the flat decode. Keys here are tags and attribute names from a frame we
/// already parsed, so collision resistance buys nothing.
#[derive(Default)]
struct FxHasher(u64);

const FX_SEED: u64 = 0x51_7c_c1_b7_27_22_0a_95;

impl std::hash::Hasher for FxHasher {
    fn finish(&self) -> u64 {
        self.0
    }

    /// Eight bytes a round. A byte at a time was 23% of the flat decode, most
    /// of it spent on jids and message ids, which are the long strings.
    ///
    /// The tail is zero padded, so a value and the same value with trailing
    /// NULs collide. Hits are verified against the stored bytes, and a miss
    /// only costs the entry its dedup, so that is left alone.
    fn write(&mut self, bytes: &[u8]) {
        let mut hash = self.0;
        let mut rest = bytes;
        while let Some((chunk, tail)) = rest.split_first_chunk::<8>() {
            hash = (hash.rotate_left(5) ^ u64::from_le_bytes(*chunk)).wrapping_mul(FX_SEED);
            rest = tail;
        }

        if !rest.is_empty() {
            let mut last = [0u8; 8];
            last[..rest.len()].copy_from_slice(rest);
            hash = (hash.rotate_left(5) ^ u64::from_le_bytes(last)).wrapping_mul(FX_SEED);
        }

        self.0 = hash;
    }
}

/// One slot per hash, so the table cannot grow and never has to be cleared.
///
/// A `HashMap` here leaked: entries were aged out by `round` rather than
/// removed, so every distinct message id and jid a socket ever saw stayed in
/// it. Two million decodes took linear memory from 1.3 MB to 274 MB, and WASM
/// memory is never returned. Clearing instead would bound it, but then every
/// small stanza pays to wipe the buckets a group stanza left behind.
///
/// Dedup is best effort, which is what makes this sound: a collision evicts,
/// the caller writes the string twice, and the only cost is a longer pool.
#[derive(Clone, Copy, Default)]
struct Seen {
    hash: u64,
    round: u32,
    index: u32,
}

const SEEN_SLOTS: usize = 512;

struct FlatBuilder {
    strings: Vec<u8>,
    string_offsets: Vec<u32>,
    /// Keyed by content hash rather than by an owned String: the bytes are
    /// already in `strings`, and allocating a String per distinct tag on every
    /// decode showed up as allocator time.
    seen: Box<[Seen; SEEN_SLOTS]>,
    round: u32,
    layout: Vec<u32>,
    bytes: Vec<u8>,
}

impl FlatBuilder {
    fn intern(&mut self, value: &str) -> u32 {
        if let Some(index) = token_index(value) {
            return index;
        }

        let start = self.strings.len();
        self.strings.extend_from_slice(value.as_bytes());
        self.intern_written(start)
    }

    /// Interns an attribute value, writing a jid straight into the pool rather
    /// than through `ValueRef::as_str`, which builds a `String` for every one
    /// of them: a device fanout carries a jid per participant.
    fn intern_value(&mut self, value: &ValueRef<'_>) -> u32 {
        let jid = match value {
            ValueRef::String(text) => return self.intern(text),
            ValueRef::Jid(jid) => jid,
        };

        let start = self.strings.len();
        // See `value_string`: a jid with no user has to keep its `@`.
        if jid.user.is_empty() {
            self.strings.push(b'@');
        }

        let _ = write!(self.strings, "{jid}");
        self.intern_written(start)
    }

    /// Takes bytes already appended to the pool and gives them an index,
    /// dropping them again if this decode already wrote the same value.
    fn intern_written(&mut self, start: usize) -> u32 {
        let mut hasher = FxHasher::default();
        std::hash::Hasher::write(&mut hasher, &self.strings[start..]);
        let key = std::hash::Hasher::finish(&hasher);

        let slot = key as usize & (SEEN_SLOTS - 1);
        let hit = self.seen[slot];
        // The index bound also covers `round` wrapping back onto a stale entry
        // after four billion decodes, which would otherwise index out of range.
        if hit.round == self.round
            && hit.hash == key
            && hit.index as usize + 1 < self.string_offsets.len()
        {
            let from = self.string_offsets[hit.index as usize] as usize;
            let to = self.string_offsets[hit.index as usize + 1] as usize;
            if self.strings[from..to] == self.strings[start..] {
                self.strings.truncate(start);
                return hit.index;
            }
        }

        let index = self.string_offsets.len() as u32 - 1;
        self.string_offsets.push(self.strings.len() as u32);
        self.seen[slot] = Seen {
            hash: key,
            round: self.round,
            index,
        };
        index
    }

    fn push(&mut self, node: &NodeRef<'_>) {
        let tag = self.intern(&node.tag);
        self.layout.push(tag);

        let attrs = node.attrs.as_slice();
        self.layout.push(attrs.len() as u32);
        for (k, v) in attrs.iter() {
            let key = self.intern(k);
            let value = self.intern_value(v);
            self.layout.push(key);
            self.layout.push(value);
        }

        match node.content.as_ref() {
            None => self.layout.push(0),
            Some(NodeContentRef::Bytes(blob)) => {
                self.layout.push(1);
                self.layout.push(self.bytes.len() as u32);
                self.layout.push(blob.len() as u32);
                self.bytes.extend_from_slice(blob.as_ref());
            }
            Some(NodeContentRef::String(s)) => {
                let index = self.intern(s);
                self.layout.push(2);
                self.layout.push(index);
            }
            Some(NodeContentRef::Nodes(children)) => {
                self.layout.push(3);
                self.layout.push(children.len() as u32);
                for child in children.iter() {
                    self.push(child);
                }
            }
        }
    }
}

/// Reads a node from the flat buffer the caller built, mirroring
/// `decodeNodeFlat`. Pulling the tree field by field through `Reflect` was 56%
/// of the encode profile; this crosses the boundary once.
struct FlatReader<'a> {
    strings: &'a [u8],
    offsets: &'a [u8],
    layout: &'a [u8],
    blobs: &'a [u8],
    cursor: usize,
}

/// Reads a little-endian word out of a section.
///
/// The sections stay as bytes rather than being cast to `&[u32]`: the caller's
/// buffer is allocated as bytes, so nothing guarantees the four byte alignment
/// that cast needs, and wasm loads unaligned words at no cost anyway.
fn word_at(section: &[u8], index: usize) -> Option<u32> {
    let at = index.checked_mul(4)?;
    let bytes = section.get(at..at.checked_add(4)?)?;
    Some(u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]))
}

impl<'a> FlatReader<'a> {
    fn next(&mut self) -> Result<u32, JsValue> {
        let value = word_at(self.layout, self.cursor)
            .ok_or_else(|| JsValue::from_str("flat encode: layout ran out"))?;
        self.cursor += 1;
        Ok(value)
    }

    fn str_at(&self, index: u32) -> Result<NodeStr<'a>, JsValue> {
        if index >= TOKEN_BASE {
            let token = index - TOKEN_BASE;
            let text = if token < 256 {
                get_single_token(token as u8)
            } else {
                let flat = token - 256;
                get_double_token((flat / 256) as u8, (flat % 256) as u8)
            };

            return text
                .map(NodeStr::Borrowed)
                .ok_or_else(|| JsValue::from_str("flat encode: unknown token index"));
        }

        let start = word_at(self.offsets, index as usize).ok_or_else(bad_index)? as usize;
        let end = word_at(self.offsets, index as usize + 1).ok_or_else(bad_index)? as usize;
        let bytes = self.strings.get(start..end).ok_or_else(bad_index)?;
        std::str::from_utf8(bytes)
            .map(NodeStr::Borrowed)
            .map_err(|_| JsValue::from_str("flat encode: string is not utf-8"))
    }

    fn read(&mut self) -> Result<NodeRef<'a>, JsValue> {
        let tag_index = self.next()?;
        let tag = self.str_at(tag_index)?;
        let attr_count = self.next()? as usize;
        let mut attrs = Vec::with_capacity(attr_count);
        for _ in 0..attr_count {
            let key_index = self.next()?;
            let value_index = self.next()?;
            attrs.push((
                self.str_at(key_index)?,
                ValueRef::String(self.str_at(value_index)?),
            ));
        }

        let content = match self.next()? {
            0 => None,
            1 => {
                let offset = self.next()? as usize;
                let len = self.next()? as usize;
                let bytes = self.blobs.get(offset..offset + len).ok_or_else(bad_index)?;
                Some(NodeContentRef::Bytes(Cow::Borrowed(bytes)))
            }
            2 => {
                let index = self.next()?;
                Some(NodeContentRef::String(self.str_at(index)?))
            }
            3 => {
                let count = self.next()? as usize;
                let mut children = Vec::with_capacity(count);
                for _ in 0..count {
                    children.push(self.read()?);
                }
                Some(NodeContentRef::Nodes(children.into_boxed_slice()))
            }
            _ => return Err(JsValue::from_str("flat encode: unknown content kind")),
        };

        Ok(NodeRef {
            tag,
            attrs: AttrsRef::from_vec(attrs),
            content,
        })
    }
}

fn bad_index() -> JsValue {
    JsValue::from_str("flat encode: index out of range")
}

/// Splits `len` bytes off at `at` and advances it.
fn take<'a>(data: &'a [u8], at: &mut usize, len: usize) -> Result<&'a [u8], JsValue> {
    let end = at.checked_add(len).ok_or_else(bad_index)?;
    let slice = data.get(*at..end).ok_or_else(bad_index)?;
    *at = end;
    Ok(slice)
}

/// Byte length of `count` words. Checked because the counts come from the
/// caller's header: one whose byte length wraps would pass the bounds check
/// and then be read far past the buffer.
fn checked_bytes(count: usize) -> Result<usize, JsValue> {
    count.checked_mul(4).ok_or_else(bad_index)
}

thread_local! {
    static MARSHALLED: RefCell<Vec<u8>> = const { RefCell::new(Vec::new()) };
}

/// Reads the flat buffer the caller built and writes the frame, published the
/// same way a decode is. The caller copies it out: the frame outlives the call,
/// unlike the sections a decode hands back.
#[wasm_bindgen(js_name = __encodeNodeFlat)]
pub fn encode_node_flat(data: &[u8]) -> Result<(), JsValue> {
    if data.len() < 16 {
        return Err(JsValue::from_str("flat encode: buffer too small"));
    }

    let read_u32 =
        |at: usize| u32::from_le_bytes([data[at], data[at + 1], data[at + 2], data[at + 3]]);
    let string_bytes = read_u32(0) as usize;
    let offset_count = read_u32(4) as usize;
    let layout_count = read_u32(8) as usize;

    let mut at = 16;
    let strings = take(data, &mut at, string_bytes)?;
    let pad = (4 - (at % 4)) % 4;
    take(data, &mut at, pad)?;
    let offsets = take(data, &mut at, checked_bytes(offset_count)?)?;
    let layout = take(data, &mut at, checked_bytes(layout_count)?)?;
    let blobs = data.get(at..).ok_or_else(bad_index)?;

    let mut reader = FlatReader {
        strings,
        offsets,
        layout,
        blobs,
        cursor: 0,
    };
    let node = reader.read()?;
    MARSHALLED.with(|cell| {
        let mut out = cell.borrow_mut();
        out.clear();
        marshal_ref_to_vec(&node, &mut out).map_err(|e| JsValue::from_str(&e.to_string()))?;
        publish([&out, &[], &[], &[]]);
        Ok(())
    })
}
