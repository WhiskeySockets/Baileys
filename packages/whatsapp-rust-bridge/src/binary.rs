use js_sys::{Array, Object, Uint8Array};
use std::borrow::Cow;
use std::cell::{RefCell, UnsafeCell};
use std::collections::HashMap;
use std::mem;
use std::rc::Rc;
use wacore_binary::{
    marshal::{marshal_ref, unmarshal_ref},
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
            let _ = js_sys::Reflect::set(&obj, &intern(k), &intern(&v.as_str()));
        }
        obj.unchecked_into()
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
        Self::node_to_json(self.node_ref())
    }

    fn node_to_json(node: &NodeRef<'_>) -> JsValue {
        let obj = Object::new();
        let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("tag"), &intern(&node.tag));
        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("attrs"),
            &Self::convert_attrs(&node.attrs).into(),
        );

        let content: Option<JsValue> = match node.content.as_deref() {
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
        };

        if let Some(content) = content {
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("content"), &content);
        }

        obj.into()
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

        let result: Option<Content> = match self.node_ref().content.as_deref() {
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

/// Takes the frame already inflated and without its prefix byte. Inflating
/// here would do it synchronously on the main thread, and a compressed group
/// stanza is large enough that the stall shows up as missed deadlines; node's
/// zlib runs on the thread pool instead.
#[wasm_bindgen(js_name = decodeNodeFlat)]
pub fn decode_node_flat(data: &[u8]) -> Result<Uint8Array, JsValue> {
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
        Ok(builder.finish())
    })
}

thread_local! {
    static FLAT_BUILDER: RefCell<FlatBuilder> = RefCell::new(FlatBuilder {
        string_offsets: vec![0],
        ..Default::default()
    });
}

impl FlatBuilder {
    fn reset(&mut self) {
        self.strings.clear();
        self.string_offsets.clear();
        self.string_offsets.push(0);
        self.seen.clear();
        self.layout.clear();
        self.bytes.clear();
    }

    fn finish(&mut self) -> Uint8Array {
        let pad = (4 - (self.strings.len() % 4)) % 4;
        let out = &mut self.out;
        out.clear();
        out.extend_from_slice(&(self.strings.len() as u32).to_le_bytes());
        out.extend_from_slice(&(self.string_offsets.len() as u32).to_le_bytes());
        out.extend_from_slice(&(self.layout.len() as u32).to_le_bytes());
        out.extend_from_slice(&(self.bytes.len() as u32).to_le_bytes());
        out.extend_from_slice(&self.strings);
        out.resize(out.len() + pad, 0);
        out.extend_from_slice(as_bytes(&self.string_offsets));
        out.extend_from_slice(as_bytes(&self.layout));
        out.extend_from_slice(&self.bytes);

        Uint8Array::from(out.as_slice())
    }
}

/// u32 slice as bytes. wasm32 is little endian, which is the layout the JS
/// side reads back with a `Uint32Array` view.
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

impl std::hash::Hasher for FxHasher {
    fn finish(&self) -> u64 {
        self.0
    }

    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0.rotate_left(5) ^ u64::from(b)).wrapping_mul(0x51_7c_c1_b7_27_22_0a_95);
        }
    }
}

type FxBuild = std::hash::BuildHasherDefault<FxHasher>;

#[derive(Default)]
struct FlatBuilder {
    strings: Vec<u8>,
    string_offsets: Vec<u32>,
    /// Content hash to string index. Keyed by hash rather than by an owned
    /// String: the bytes are already in `strings`, and allocating a String per
    /// distinct tag on every decode showed up as allocator time.
    seen: HashMap<u64, u32, FxBuild>,
    layout: Vec<u32>,
    bytes: Vec<u8>,
    out: Vec<u8>,
}

impl FlatBuilder {
    fn intern(&mut self, value: &str) -> u32 {
        if let Some(index) = token_index(value) {
            return index;
        }

        let mut hasher = FxHasher::default();
        std::hash::Hasher::write(&mut hasher, value.as_bytes());
        let key = std::hash::Hasher::finish(&hasher);

        if let Some(&index) = self.seen.get(&key) {
            let start = self.string_offsets[index as usize] as usize;
            let end = self.string_offsets[index as usize + 1] as usize;
            if &self.strings[start..end] == value.as_bytes() {
                return index;
            }
        }

        let index = self.string_offsets.len() as u32 - 1;
        self.strings.extend_from_slice(value.as_bytes());
        self.string_offsets.push(self.strings.len() as u32);
        self.seen.insert(key, index);
        index
    }

    fn push(&mut self, node: &NodeRef<'_>) {
        let tag = self.intern(&node.tag);
        self.layout.push(tag);

        let attrs = node.attrs.as_slice();
        self.layout.push(attrs.len() as u32);
        for (k, v) in attrs.iter() {
            let key = self.intern(k);
            let value = self.intern(&v.as_str());
            self.layout.push(key);
            self.layout.push(value);
        }

        match node.content.as_deref() {
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
    offsets: &'a [u32],
    layout: &'a [u32],
    blobs: &'a [u8],
    cursor: usize,
}

impl<'a> FlatReader<'a> {
    fn next(&mut self) -> Result<u32, JsValue> {
        let value = *self
            .layout
            .get(self.cursor)
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

        let start = *self.offsets.get(index as usize).ok_or_else(bad_index)? as usize;
        let end = *self.offsets.get(index as usize + 1).ok_or_else(bad_index)? as usize;
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
                Some(Box::new(NodeContentRef::Bytes(Cow::Borrowed(bytes))))
            }
            2 => {
                let index = self.next()?;
                Some(Box::new(NodeContentRef::String(self.str_at(index)?)))
            }
            3 => {
                let count = self.next()? as usize;
                let mut children = Vec::with_capacity(count);
                for _ in 0..count {
                    children.push(self.read()?);
                }
                Some(Box::new(NodeContentRef::Nodes(children.into_boxed_slice())))
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

#[wasm_bindgen(js_name = encodeNodeFlat)]
pub fn encode_node_flat(data: &[u8]) -> Result<Uint8Array, JsValue> {
    if data.len() < 16 {
        return Err(JsValue::from_str("flat encode: buffer too small"));
    }

    let read_u32 =
        |at: usize| u32::from_le_bytes([data[at], data[at + 1], data[at + 2], data[at + 3]]);
    let string_bytes = read_u32(0) as usize;
    let offset_count = read_u32(4) as usize;
    let layout_count = read_u32(8) as usize;

    let mut at = 16;
    let strings = data.get(at..at + string_bytes).ok_or_else(bad_index)?;
    at += string_bytes;
    at += (4 - (at % 4)) % 4;

    // SAFETY: the caller writes these sections 4-aligned, which the decode side
    // relies on too; the length check above bounds the read.
    let offsets = unsafe {
        std::slice::from_raw_parts(
            data.get(at..at + offset_count * 4)
                .ok_or_else(bad_index)?
                .as_ptr() as *const u32,
            offset_count,
        )
    };
    at += offset_count * 4;
    let layout = unsafe {
        std::slice::from_raw_parts(
            data.get(at..at + layout_count * 4)
                .ok_or_else(bad_index)?
                .as_ptr() as *const u32,
            layout_count,
        )
    };
    at += layout_count * 4;
    let blobs = data.get(at..).ok_or_else(bad_index)?;

    let mut reader = FlatReader {
        strings,
        offsets,
        layout,
        blobs,
        cursor: 0,
    };
    let node = reader.read()?;
    let bytes = marshal_ref(&node).map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(Uint8Array::from(bytes.as_slice()))
}
