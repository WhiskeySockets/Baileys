use js_sys::{Array, Object, Uint8Array};
use std::borrow::Cow;
use std::cell::UnsafeCell;
use std::mem;
use std::rc::Rc;
use wacore_binary::{
    marshal::{marshal_ref, unmarshal_ref},
    node::{NodeContentRef, NodeRef, ValueRef},
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
    let entries = Object::entries(&attrs_obj);
    let len = entries.length();
    let mut attrs = Vec::with_capacity(len as usize);

    for i in 0..len {
        let entry = entries.get(i);
        let entry_arr = entry.unchecked_into::<Array>();
        let key_js = entry_arr.get(0);
        let value_js = entry_arr.get(1);

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

        attrs.push((Cow::Owned(key), ValueRef::String(Cow::Owned(value_str))));
    }

    let content_js = val.content();

    let content = if content_js.is_undefined() {
        Ok(None)
    } else if let Some(string_value) = content_js.as_string() {
        Ok(Some(NodeContentRef::String(Cow::Owned(string_value))))
    } else if content_js.is_instance_of::<Uint8Array>() {
        let byte_array: Uint8Array = content_js.unchecked_into();
        let len = byte_array.length() as usize;
        let mut bytes = vec![0; len];
        byte_array.copy_to(&mut bytes);
        Ok(Some(NodeContentRef::Bytes(Cow::Owned(bytes))))
    } else if Array::is_array(&content_js) {
        let arr = Array::from(&content_js);
        let nodes = (0..arr.length())
            .map(|i| {
                let child_val = arr.get(i);
                let child_node = child_val.unchecked_into::<EncodingNode>();
                js_to_node_ref(&child_node)
            })
            .collect::<Result<Vec<NodeRef<'static>>, _>>()?;
        Ok(Some(NodeContentRef::Nodes(Box::new(nodes))))
    } else {
        Err(JsValue::from_str("Invalid content type"))
    };

    Ok(NodeRef::new(Cow::Owned(val.tag()), attrs, content?))
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
    #[wasm_bindgen(skip)]
    cached_attrs: UnsafeCell<Option<Attrs>>,
    #[wasm_bindgen(skip)]
    cached_content: UnsafeCell<Option<Content>>,
}

impl InternalBinaryNode {
    #[inline(always)]
    fn node_ref(&self) -> &NodeRef<'static> {
        &self.node_ref
    }

    #[inline]
    fn convert_attrs(attrs: &[(Cow<'_, str>, ValueRef<'_>)]) -> Attrs {
        let obj = Object::new();
        for (k, v) in attrs.iter() {
            let js_value = match v.as_str() {
                Some(s) => JsValue::from_str(s),
                None => JsValue::from_str(&v.to_string()),
            };
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str(k), &js_value);
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

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> JsValue {
        let obj = Object::new();

        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("tag"),
            &JsValue::from_str(&self.node_ref().tag),
        );
        let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("attrs"), &self.attrs().into());

        if let Some(content) = self.content() {
            let content_js: JsValue = content.into();
            let content_value = if Array::is_array(&content_js) {
                self.serialize_child_nodes(&content_js)
            } else {
                content_js
            };
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("content"), &content_value);
        }

        obj.into()
    }

    fn serialize_child_nodes(&self, content_js: &JsValue) -> JsValue {
        let arr = Array::from(content_js);
        let json_arr = Array::new_with_length(arr.length());
        let to_json_key = JsValue::from_str("toJSON");

        for i in 0..arr.length() {
            let item = arr.get(i);
            let serialized = js_sys::Reflect::get(&item, &to_json_key)
                .ok()
                .filter(|f| f.is_function())
                .and_then(|f| f.unchecked_into::<js_sys::Function>().call0(&item).ok())
                .unwrap_or(item);
            json_arr.set(i, serialized);
        }

        json_arr.into()
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
                let bytes_ref = bytes.as_ref();
                let u8arr = Uint8Array::new_with_length(bytes_ref.len() as u32);
                u8arr.copy_from(bytes_ref);
                Some(u8arr.unchecked_into())
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

    let result = Uint8Array::new_with_length(bytes.len() as u32);
    result.copy_from(&bytes);
    Ok(result)
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
