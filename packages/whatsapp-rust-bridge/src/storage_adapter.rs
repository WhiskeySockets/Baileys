use async_trait::async_trait;
use base64::prelude::*;
use buffa::{Message as _, MessageField};
use js_sys::{Promise, Uint8Array};
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use waproto::whatsapp::{
    SenderKeyRecordStructure, SenderKeyStateStructure,
    sender_key_state_structure::{SenderChainKey, SenderMessageKey, SenderSigningKey},
};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

use wacore_libsignal::protocol::{self as libsignal, SenderKeyStore};
type SignalResult<T> = wacore_libsignal::protocol::error::Result<T>;

use wacore_libsignal::protocol::SenderKeyRecord as CoreSenderKeyRecord;
use wacore_libsignal::protocol::SignalProtocolError;
use wacore_libsignal::store::sender_key_name::SenderKeyName as CoreSenderKeyName;

use crate::session_record::js_array_to_vec;

#[wasm_bindgen(typescript_custom_section)]
const TS_SIGNAL_STORAGE: &str = r#"
export interface SignalStorage {
    loadSenderKey(keyId: string): Uint8Array | null | undefined | Promise<Uint8Array | null | undefined>;
    storeSenderKey(keyId: string, record: Uint8Array): void | Promise<void>;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SignalStorage")]
    #[derive(Clone)]
    pub type SignalStorage;

    #[wasm_bindgen(structural, method, catch, js_name = loadSenderKey)]
    fn js_load_sender_key(this: &SignalStorage, key_id: &str) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = storeSenderKey)]
    fn js_store_sender_key(
        this: &SignalStorage,
        key_id: &str,
        record: &Uint8Array,
    ) -> Result<JsValue, JsValue>;
}

#[derive(Clone)]
pub struct JsStorageAdapter {
    pub js_storage: SignalStorage,
    cached_sender_keys: Rc<RefCell<HashMap<String, CoreSenderKeyRecord>>>,
    last_sender_key_cache: Rc<RefCell<Option<(String, String, String)>>>,
}

impl JsStorageAdapter {
    pub fn new(js_storage: SignalStorage) -> Self {
        Self {
            js_storage,
            cached_sender_keys: Rc::new(RefCell::new(HashMap::new())),
            last_sender_key_cache: Rc::new(RefCell::new(None)),
        }
    }

    #[inline]
    fn get_sender_key_id(&self, sender_key_name: &CoreSenderKeyName) -> String {
        let group_id = sender_key_name.group_id();
        let sender_id = sender_key_name.sender_id();

        let cache = self.last_sender_key_cache.borrow();
        if let Some((cached_group, cached_sender, cached_key_id)) = cache.as_ref()
            && cached_group == group_id
            && cached_sender == sender_id
        {
            return cached_key_id.clone();
        }
        drop(cache);

        let key_id = format!("{}::{}", group_id, sender_id);
        self.last_sender_key_cache.borrow_mut().replace((
            group_id.to_string(),
            sender_id.to_string(),
            key_id.clone(),
        ));
        key_id
    }

    fn migrate_legacy_sender_key(&self, data: &[u8]) -> SignalResult<Option<Vec<u8>>> {
        let json_str = match std::str::from_utf8(data) {
            Ok(s) => s,
            Err(_) => return Ok(None),
        };

        if !json_str.trim().starts_with('[') {
            return Ok(None);
        }

        let js_val = js_sys::JSON::parse(json_str).map_err(js_to_signal_error)?;

        if !js_sys::Array::is_array(&js_val) {
            return Ok(None);
        }

        let array = js_sys::Array::from(&js_val);
        let mut sender_key_states = Vec::new();

        for i in 0..array.length() {
            let state_obj = array.get(i);

            let sender_key_id = get_number(&state_obj, "senderKeyId").unwrap_or(0.0) as u32;

            let sender_chain_key_obj = get_object(&state_obj, "senderChainKey")
                .ok_or_else(|| invalid_js_data("migrate_sender_key", "Missing senderChainKey"))?;
            let iteration = get_number(&sender_chain_key_obj, "iteration").unwrap_or(0.0) as u32;
            // Defaulting a required key to empty produces a record that only
            // fails much later, with an error that says nothing about the row
            // it came from. Name it here instead.
            let seed = required_key_bytes(&sender_chain_key_obj, "seed", "senderChainKey.seed")?;

            let sender_signing_key_obj = get_object(&state_obj, "senderSigningKey")
                .ok_or_else(|| invalid_js_data("migrate_sender_key", "Missing senderSigningKey"))?;
            let public_key =
                required_key_bytes(&sender_signing_key_obj, "public", "senderSigningKey.public")?;
            // The JS backend wrote an empty Buffer for a state it has no private
            // key for, which is every sender key received from someone else. An
            // empty buffer is not a key: carrying it as Some() makes the record
            // fail validation the moment anything reads its components.
            let private_key = get_bytes_from_buffer_json(&sender_signing_key_obj, "private")?
                .filter(|key| !key.is_empty());

            let sender_message_keys_arr = get_object(&state_obj, "senderMessageKeys")
                .map(|v| js_sys::Array::from(&v))
                .unwrap_or_default();
            let mut sender_message_keys = Vec::new();

            for j in 0..sender_message_keys_arr.length() {
                let msg_key_obj = sender_message_keys_arr.get(j);
                let msg_iteration = get_number(&msg_key_obj, "iteration").unwrap_or(0.0) as u32;
                let msg_seed =
                    required_key_bytes(&msg_key_obj, "seed", "senderMessageKeys[].seed")?;

                sender_message_keys.push(SenderMessageKey {
                    iteration: Some(msg_iteration),
                    seed: Some(msg_seed.into()),
                });
            }

            let signing_key = SenderSigningKey {
                public: Some(public_key.into()),
                private: private_key.map(Into::into),
            };

            let chain_key = SenderChainKey {
                iteration: Some(iteration),
                seed: Some(seed.into()),
            };

            sender_key_states.push(SenderKeyStateStructure {
                sender_key_id: Some(sender_key_id),
                sender_chain_key: MessageField::some(chain_key),
                sender_signing_key: MessageField::some(signing_key),
                sender_message_keys,
            });
        }

        // Mirror of the order note in `legacy_sender_key::serialize`.
        sender_key_states.reverse();
        let record = SenderKeyRecordStructure { sender_key_states };

        Ok(Some(record.encode_to_vec()))
    }
}

fn invalid_js_data(context: &'static str, message: impl Into<String>) -> SignalProtocolError {
    SignalProtocolError::InvalidState(context, message.into())
}

#[inline]
fn js_to_signal_error(e: JsValue) -> libsignal::SignalProtocolError {
    libsignal::SignalProtocolError::FfiBindingError(format!("{:?}", e))
}

#[inline]
async fn resolve_maybe_promise(value: JsValue) -> Result<JsValue, JsValue> {
    if value.is_instance_of::<Promise>() {
        return JsFuture::from(Promise::unchecked_from_js(value)).await;
    }
    Ok(value)
}

#[inline]
fn js_array_to_bytes(array: &js_sys::Array) -> SignalResult<Vec<u8>> {
    js_array_to_vec(array).map_err(js_to_signal_error)
}

#[inline]
fn js_value_to_bytes(value: &JsValue) -> SignalResult<Option<Vec<u8>>> {
    if let Some(arr) = value.dyn_ref::<Uint8Array>() {
        return Ok(Some(arr.to_vec()));
    }

    if js_sys::Array::is_array(value) {
        return js_array_to_bytes(&js_sys::Array::from(value)).map(Some);
    }

    if let Ok(data) = js_sys::Reflect::get(value, &JsValue::from_str("data"))
        && js_sys::Array::is_array(&data)
    {
        return js_array_to_bytes(&js_sys::Array::from(&data)).map(Some);
    }

    Ok(None)
}

fn get_object(obj: &JsValue, key: &str) -> Option<JsValue> {
    let value = js_sys::Reflect::get(obj, &JsValue::from_str(key)).ok()?;
    if value.is_undefined() || value.is_null() {
        return None;
    }

    Some(value)
}

fn get_number(obj: &JsValue, key: &str) -> Option<f64> {
    js_sys::Reflect::get(obj, &JsValue::from_str(key))
        .ok()
        .and_then(|v| v.as_f64())
}

/// A key field the record cannot be built without.
fn required_key_bytes(obj: &JsValue, key: &str, label: &'static str) -> SignalResult<Vec<u8>> {
    get_bytes_from_buffer_json(obj, key)?
        .filter(|bytes| !bytes.is_empty())
        .ok_or_else(|| invalid_js_data("migrate_sender_key", label))
}

fn get_bytes_from_buffer_json(obj: &JsValue, key: &str) -> SignalResult<Option<Vec<u8>>> {
    let Ok(val) = js_sys::Reflect::get(obj, &JsValue::from_str(key)) else {
        return Ok(None);
    };
    if val.is_undefined() || val.is_null() {
        return Ok(None);
    }

    // Buffer-like object. `data` is an array when the value came from plain
    // JSON.stringify, and base64 text when it went through Baileys' own
    // BufferJSON.replacer; a store may have written either.
    let type_prop = js_sys::Reflect::get(&val, &JsValue::from_str("type")).ok();
    let data_prop = js_sys::Reflect::get(&val, &JsValue::from_str("data")).ok();
    if let (Some(t), Some(d)) = (type_prop, data_prop)
        && t.as_string().as_deref() == Some("Buffer")
    {
        if js_sys::Array::is_array(&d) {
            return js_array_to_bytes(&js_sys::Array::from(&d)).map(Some);
        }

        return Ok(d.as_string().and_then(|s| BASE64_STANDARD.decode(&s).ok()));
    }

    // Try Uint8Array
    if let Some(arr) = val.dyn_ref::<Uint8Array>() {
        return Ok(Some(arr.to_vec()));
    }

    // Try plain JS array
    if js_sys::Array::is_array(&val) {
        return js_array_to_bytes(&js_sys::Array::from(&val)).map(Some);
    }

    // Try base64 string
    Ok(val
        .as_string()
        .and_then(|s| BASE64_STANDARD.decode(&s).ok()))
}

#[async_trait(?Send)]
impl SenderKeyStore for JsStorageAdapter {
    async fn load_sender_key(
        &self,
        sender_key_name: &CoreSenderKeyName,
    ) -> SignalResult<Option<CoreSenderKeyRecord>> {
        let key_id = self.get_sender_key_id(sender_key_name);

        if let Some(record) = self.cached_sender_keys.borrow().get(&key_id) {
            return Ok(Some(record.clone()));
        }

        let result = self
            .js_storage
            .js_load_sender_key(&key_id)
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        if value.is_null() || value.is_undefined() {
            return Ok(None);
        }

        let bytes = js_value_to_bytes(&value)?;

        let Some(data) = bytes else {
            return Ok(None);
        };

        // Try direct deserialization first (standard protobuf format)
        let record = match CoreSenderKeyRecord::deserialize(&data) {
            Ok(record) => record,
            Err(_) => {
                // Fall back to legacy JSON format migration
                let migrated_bytes = self.migrate_legacy_sender_key(&data)?.ok_or_else(|| {
                    SignalProtocolError::InvalidState(
                        "load_sender_key",
                        "Failed to deserialize sender key record".into(),
                    )
                })?;
                CoreSenderKeyRecord::deserialize(&migrated_bytes)?
            }
        };

        let record = crate::counter_lease::waive_sender_key(record)?;
        // The record is rebuilt per operation, so its derivation memo is cold.
        crate::derivation_cache::warm(&record);

        self.cached_sender_keys
            .borrow_mut()
            .insert(key_id, record.clone());
        Ok(Some(record))
    }

    async fn store_sender_key(
        &mut self,
        sender_key_name: &CoreSenderKeyName,
        record: CoreSenderKeyRecord,
    ) -> SignalResult<()> {
        let key_id = self.get_sender_key_id(sender_key_name);

        // Mirror of the note in `store_session`.
        let record = crate::counter_lease::waive_sender_key(record)?;
        let bytes = record.serialize()?;
        let uint8 = Uint8Array::from(bytes.as_slice());

        let result = self
            .js_storage
            .js_store_sender_key(&key_id, &uint8)
            .map_err(js_to_signal_error)?;
        resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        self.cached_sender_keys.borrow_mut().insert(key_id, record);

        Ok(())
    }
}

/// The JS backend stored a sender-key record as UTF-8 JSON, and
/// `migrate_legacy_sender_key` above reads exactly that. Writing it back keeps
/// the row readable by a pre-WASM release: unlike a session, every field of a
/// sender-key state has a v1 counterpart, so nothing is lost either way.
pub mod legacy_sender_key {
    use serde::Serialize;
    use wacore_libsignal::protocol::SenderKeyRecord as CoreSenderKeyRecord;
    use wacore_libsignal::protocol::error::Result as SignalResult;

    /// `JSON.stringify` of a Buffer, which is the shape the JS backend wrote.
    #[derive(Serialize)]
    struct Bytes<'a> {
        #[serde(rename = "type")]
        kind: &'static str,
        data: &'a [u8],
    }

    fn bytes(data: &[u8]) -> Bytes<'_> {
        Bytes {
            kind: "Buffer",
            data,
        }
    }

    #[derive(Serialize)]
    #[serde(rename_all = "camelCase")]
    struct ChainKey<'a> {
        iteration: u32,
        seed: Bytes<'a>,
    }

    #[derive(Serialize)]
    #[serde(rename_all = "camelCase")]
    struct SigningKey<'a> {
        public: Bytes<'a>,
        /// Always written, empty when there is none: that is what the JS backend
        /// produced for every sender key received from someone else, and the
        /// point of this shape is to be indistinguishable from what it wrote.
        private: Bytes<'a>,
    }

    #[derive(Serialize)]
    #[serde(rename_all = "camelCase")]
    struct MessageKey<'a> {
        iteration: u32,
        seed: Bytes<'a>,
    }

    #[derive(Serialize)]
    #[serde(rename_all = "camelCase")]
    struct State<'a> {
        sender_key_id: u32,
        sender_chain_key: ChainKey<'a>,
        sender_signing_key: SigningKey<'a>,
        sender_message_keys: Vec<MessageKey<'a>>,
    }

    pub fn serialize(record: CoreSenderKeyRecord) -> SignalResult<Vec<u8>> {
        let components = record.into_components()?;
        // The core keeps the current state in front and prunes from the back;
        // the legacy shape is the mirror of that, current last and pruned from
        // the front. Writing the core order out unchanged would make a pre-WASM
        // build send under a stale key and evict the freshest one.
        let states: Vec<State<'_>> = components
            .states
            .iter()
            .rev()
            .map(|state| State {
                sender_key_id: state.key_id,
                sender_chain_key: ChainKey {
                    iteration: state.chain_key.iteration,
                    seed: bytes(&state.chain_key.seed),
                },
                sender_signing_key: SigningKey {
                    public: bytes(&state.signing_key.public),
                    private: bytes(state.signing_key.private.as_deref().unwrap_or(&[])),
                },
                sender_message_keys: state
                    .message_keys
                    .iter()
                    .map(|key| MessageKey {
                        iteration: key.iteration,
                        seed: bytes(&key.seed),
                    })
                    .collect(),
            })
            .collect();

        serde_json::to_vec(&states).map_err(|error| {
            wacore_libsignal::protocol::SignalProtocolError::InvalidState(
                "store_sender_key",
                format!("could not write the legacy shape: {error}"),
            )
        })
    }
}

#[cfg(test)]
mod js_value_tests {
    use super::{get_bytes_from_buffer_json, get_number, get_object};
    use wasm_bindgen::JsValue;
    // Alias `#[test]` -> wasm_bindgen_test so these run on wasm32 via
    // `wasm-pack test --node` (the crate has no native test target).
    use wasm_bindgen_test::wasm_bindgen_test as test;

    fn object_with(key: &str, value: JsValue) -> JsValue {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &JsValue::from_str(key), &value).unwrap();
        obj.into()
    }

    #[test]
    fn absent_property_reads_as_absent() {
        // Reflect::get answers Ok(undefined) here. Reporting that as present is
        // what fed undefined to Array::from and threw across the boundary on a
        // legacy sender-key state stored without senderMessageKeys.
        let obj: JsValue = js_sys::Object::new().into();

        assert!(get_object(&obj, "senderMessageKeys").is_none());
    }

    #[test]
    fn explicit_undefined_and_null_read_as_absent() {
        assert!(get_object(&object_with("k", JsValue::UNDEFINED), "k").is_none());
        assert!(get_object(&object_with("k", JsValue::NULL), "k").is_none());
    }

    #[test]
    fn a_present_value_is_returned() {
        let value = object_with("k", JsValue::from_str("v"));

        assert_eq!(
            get_object(&value, "k").and_then(|v| v.as_string()),
            Some("v".to_owned())
        );
    }

    #[test]
    fn an_empty_array_is_present() {
        // Distinct from absent: the state has no message keys, which is a value.
        let value = object_with("k", js_sys::Array::new().into());

        assert!(get_object(&value, "k").is_some());
    }

    #[test]
    fn a_number_is_read_or_defaulted() {
        let value = object_with("iteration", JsValue::from_f64(7.0));

        assert_eq!(get_number(&value, "iteration"), Some(7.0));
        assert_eq!(get_number(&value, "missing"), None);
    }

    #[test]
    fn a_buffer_json_envelope_decodes_to_bytes() {
        // The JS libsignal serialised Buffers as { type: 'Buffer', data: [...] }.
        let data = js_sys::Array::new();
        for byte in [1u8, 2, 3] {
            data.push(&JsValue::from_f64(byte as f64));
        }

        let envelope = js_sys::Object::new();
        js_sys::Reflect::set(&envelope, &JsValue::from_str("type"), &"Buffer".into()).unwrap();
        js_sys::Reflect::set(&envelope, &JsValue::from_str("data"), &data).unwrap();
        let holder = object_with("seed", envelope.into());

        assert_eq!(
            get_bytes_from_buffer_json(&holder, "seed").unwrap(),
            Some(vec![1, 2, 3])
        );
        assert_eq!(
            get_bytes_from_buffer_json(&holder, "missing").unwrap(),
            None
        );
    }

    #[test]
    fn a_buffer_json_envelope_with_base64_data_decodes_to_bytes() {
        // Baileys' own BufferJSON.replacer writes the payload as base64 text
        // rather than a byte array, so a store that round-trips through it
        // hands us this shape. Reading it as absent would silently default the
        // field to empty and leave the record unusable.
        let envelope = js_sys::Object::new();
        js_sys::Reflect::set(&envelope, &JsValue::from_str("type"), &"Buffer".into()).unwrap();
        js_sys::Reflect::set(&envelope, &JsValue::from_str("data"), &"AQID".into()).unwrap();
        let holder = object_with("seed", envelope.into());

        assert_eq!(
            get_bytes_from_buffer_json(&holder, "seed").unwrap(),
            Some(vec![1, 2, 3])
        );
    }

    #[test]
    fn a_buffer_json_envelope_with_unreadable_data_is_absent() {
        let envelope = js_sys::Object::new();
        js_sys::Reflect::set(&envelope, &JsValue::from_str("type"), &"Buffer".into()).unwrap();
        js_sys::Reflect::set(
            &envelope,
            &JsValue::from_str("data"),
            &JsValue::from_f64(7.0),
        )
        .unwrap();
        let holder = object_with("seed", envelope.into());

        assert_eq!(get_bytes_from_buffer_json(&holder, "seed").unwrap(), None);
    }
}

#[cfg(test)]
mod legacy_sender_key_tests {
    use super::legacy_sender_key;
    use wacore_libsignal::protocol::{KeyPair, SenderKeyRecord};
    use wasm_bindgen_test::wasm_bindgen_test as test;

    fn record() -> SenderKeyRecord {
        let mut rng = rand::make_rng::<rand::rngs::StdRng>();
        let signing = KeyPair::generate(&mut rng);
        let mut record = SenderKeyRecord::new_empty();
        record
            .add_sender_key_state(
                3,
                7,
                42,
                &[9u8; 32],
                signing.public_key,
                Some(signing.private_key),
            )
            .expect("valid state");
        record
    }

    #[test]
    fn writes_the_shape_the_js_backend_wrote() {
        let bytes = legacy_sender_key::serialize(record()).expect("serialize");
        let text = String::from_utf8(bytes).expect("utf8");

        assert!(
            text.starts_with('['),
            "legacy records are a JSON array: {text}"
        );
        for field in [
            "senderKeyId",
            "senderChainKey",
            "senderSigningKey",
            "senderMessageKeys",
        ] {
            assert!(text.contains(field), "missing {field} in {text}");
        }
        assert!(
            text.contains(r#""type":"Buffer""#),
            "bytes use the Buffer envelope"
        );
    }

    /// A sender key received from someone else has no private signing key, and
    /// the JS backend still wrote the field as an empty Buffer. Omitting it
    /// would make the row distinguishable from one that backend produced.
    #[test]
    fn keeps_an_empty_private_signing_key_rather_than_dropping_it() {
        let mut rng = rand::make_rng::<rand::rngs::StdRng>();
        let signing = KeyPair::generate(&mut rng);
        let mut record = SenderKeyRecord::new_empty();
        record
            .add_sender_key_state(3, 7, 42, &[9u8; 32], signing.public_key, None)
            .expect("state added");

        let bytes = legacy_sender_key::serialize(record).expect("serialize");
        let text = String::from_utf8(bytes).expect("utf8");

        assert!(
            text.contains(r#""private":{"type":"Buffer","data":[]}"#),
            "got {text}"
        );
    }
}
