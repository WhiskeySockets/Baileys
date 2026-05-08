use async_trait::async_trait;
use base64::prelude::*;
use js_sys::{Promise, Uint8Array};
use prost::Message;
use serde::Deserialize;
use serde::de::DeserializeOwned;
use serde_bytes::ByteBuf;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use waproto::whatsapp::{
    RecordStructure, SenderKeyRecordStructure, SenderKeyStateStructure, SessionStructure,
    sender_key_state_structure::{SenderChainKey, SenderMessageKey, SenderSigningKey},
    session_structure::{
        Chain,
        chain::{ChainKey, MessageKey},
    },
};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

use wacore_libsignal::protocol::{
    self as libsignal, Direction as StoreDirection, GenericSignedPreKey as _, IdentityChange,
    IdentityKey, IdentityKeyPair, IdentityKeyStore, KeyPair, PreKeyId, PreKeyRecord, PreKeyStore,
    PrivateKey, SenderKeyStore, SessionStore, SignedPreKeyId, SignedPreKeyRecord,
    SignedPreKeyStore,
};
type SignalResult<T> = wacore_libsignal::protocol::error::Result<T>;

use wacore_libsignal::protocol::SenderKeyRecord as CoreSenderKeyRecord;
use wacore_libsignal::protocol::SessionRecord as CoreSessionRecord;
use wacore_libsignal::protocol::SignalProtocolError;
use wacore_libsignal::protocol::Timestamp;
use wacore_libsignal::store::sender_key_name::SenderKeyName as CoreSenderKeyName;

use crate::session_record::SessionRecord;

#[wasm_bindgen(typescript_custom_section)]
const TS_SIGNAL_STORAGE: &str = r#"
export interface SignalStorage {
    loadSession(address: string): Uint8Array | null | undefined | Promise<Uint8Array | null | undefined>;
    storeSession(address: string, record: SessionRecord): void | Promise<void>;
    getOurIdentity(): KeyPair | Promise<KeyPair>;
    getOurRegistrationId(): number | Promise<number>;
    isTrustedIdentity(name: string, identityKey: Uint8Array, direction: number): boolean | Promise<boolean>;
    loadPreKey(id: number): KeyPair | null | undefined | Promise<KeyPair | null | undefined>;
    removePreKey(id: number): void | Promise<void>;
    loadSignedPreKey(id: number): SignedPreKey | null | undefined | Promise<SignedPreKey | null | undefined>;
    loadSenderKey(keyId: string): Uint8Array | null | undefined | Promise<Uint8Array | null | undefined>;
    storeSenderKey(keyId: string, record: Uint8Array): void | Promise<void>;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SignalStorage")]
    #[derive(Clone)]
    pub type SignalStorage;

    #[wasm_bindgen(structural, method, catch, js_name = loadSession)]
    fn js_load_session(this: &SignalStorage, address: &str) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = storeSession)]
    fn js_store_session(
        this: &SignalStorage,
        address: &str,
        record: JsValue,
    ) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = storeSessionRaw)]
    fn js_store_session_raw(
        this: &SignalStorage,
        address: &str,
        data: &Uint8Array,
    ) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = getOurIdentity)]
    fn js_get_our_identity(this: &SignalStorage) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = getOurRegistrationId)]
    fn js_get_our_registration_id(this: &SignalStorage) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = isTrustedIdentity)]
    fn js_is_trusted_identity(
        this: &SignalStorage,
        name: &str,
        identity_key: &Uint8Array,
        direction: u32,
    ) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = loadPreKey)]
    fn js_load_pre_key(this: &SignalStorage, id: u32) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = removePreKey)]
    fn js_remove_pre_key(this: &SignalStorage, id: u32) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(structural, method, catch, js_name = loadSignedPreKey)]
    fn js_load_signed_pre_key(this: &SignalStorage, id: u32) -> Result<JsValue, JsValue>;

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
    cached_identity_key_pair: Rc<RefCell<Option<IdentityKeyPair>>>,
    cached_registration_id: Rc<RefCell<Option<u32>>>,
    cached_sessions: Rc<RefCell<HashMap<String, CoreSessionRecord>>>,
    cached_sender_keys: Rc<RefCell<HashMap<String, CoreSenderKeyRecord>>>,
    cached_identities: Rc<RefCell<HashMap<String, Vec<u8>>>>,
    has_store_session_raw: Rc<RefCell<Option<bool>>>,
    last_address_cache: Rc<RefCell<Option<(String, String)>>>,
    last_sender_key_cache: Rc<RefCell<Option<(String, String, String)>>>,
}

impl JsStorageAdapter {
    pub fn new(js_storage: SignalStorage) -> Self {
        Self {
            js_storage,
            cached_identity_key_pair: Rc::new(RefCell::new(None)),
            cached_registration_id: Rc::new(RefCell::new(None)),
            cached_sessions: Rc::new(RefCell::new(HashMap::new())),
            cached_sender_keys: Rc::new(RefCell::new(HashMap::new())),
            cached_identities: Rc::new(RefCell::new(HashMap::new())),
            has_store_session_raw: Rc::new(RefCell::new(None)),
            last_address_cache: Rc::new(RefCell::new(None)),
            last_sender_key_cache: Rc::new(RefCell::new(None)),
        }
    }

    fn has_store_session_raw(&self) -> bool {
        if let Some(has_raw) = *self.has_store_session_raw.borrow() {
            return has_raw;
        }

        let has_raw = js_sys::Reflect::has(&self.js_storage, &JsValue::from_str("storeSessionRaw"))
            .unwrap_or(false);
        self.has_store_session_raw.borrow_mut().replace(has_raw);
        has_raw
    }

    #[inline]
    fn get_address_string(&self, address: &libsignal::ProtocolAddress) -> String {
        let name = address.name();
        let cache = self.last_address_cache.borrow();
        if let Some((cached_name, cached_str)) = cache.as_ref()
            && cached_name == name
        {
            return cached_str.clone();
        }
        drop(cache);

        let addr_str = address.to_string();
        self.last_address_cache
            .borrow_mut()
            .replace((name.to_string(), addr_str.clone()));
        addr_str
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

    async fn migrate_legacy_json(&self, value: JsValue) -> SignalResult<Option<Vec<u8>>> {
        let has_reg_id =
            js_sys::Reflect::has(&value, &JsValue::from_str("registrationId")).unwrap_or(false);
        let has_ratchet =
            js_sys::Reflect::has(&value, &JsValue::from_str("currentRatchet")).unwrap_or(false);

        let session_data = if has_reg_id && has_ratchet {
            value
        } else {
            let has_sessions =
                js_sys::Reflect::has(&value, &JsValue::from_str("_sessions")).unwrap_or(false);
            if !has_sessions {
                return Ok(None);
            }

            let sessions = get_object(&value, "_sessions")
                .ok_or_else(|| invalid_js_data("migrate", "Missing _sessions"))?;
            let sessions_obj = sessions
                .dyn_ref::<js_sys::Object>()
                .ok_or_else(|| invalid_js_data("migrate", "Invalid _sessions object"))?;
            let keys = js_sys::Object::keys(sessions_obj);

            if keys.length() == 0 {
                return Ok(None);
            }

            let key = keys.get(0);
            js_sys::Reflect::get(&sessions, &key).map_err(js_to_signal_error)?
        };

        let has_reg_id_inner =
            js_sys::Reflect::has(&session_data, &JsValue::from_str("registrationId"))
                .unwrap_or(false);
        if !has_reg_id_inner {
            return Ok(None);
        }

        let local_identity = self.get_identity_key_pair().await?;
        let local_identity_public = local_identity.public_key().serialize().into();

        let registration_id = get_number(&session_data, "registrationId").unwrap_or(0.0) as u32;

        let current_ratchet = get_object(&session_data, "currentRatchet")
            .ok_or_else(|| invalid_js_data("migrate", "Missing currentRatchet"))?;
        let root_key_b64 = get_string(&current_ratchet, "rootKey").unwrap_or_default();
        let root_key = BASE64_STANDARD.decode(root_key_b64).unwrap_or_default();

        let previous_counter =
            get_number(&current_ratchet, "previousCounter").unwrap_or(0.0) as u32;

        let ephemeral_key_pair = get_object(&current_ratchet, "ephemeralKeyPair")
            .ok_or_else(|| invalid_js_data("migrate", "Missing ephemeralKeyPair"))?;
        let sender_ratchet_pub_b64 = get_string(&ephemeral_key_pair, "pubKey").unwrap_or_default();
        let sender_ratchet_priv_b64 =
            get_string(&ephemeral_key_pair, "privKey").unwrap_or_default();

        let sender_ratchet_pub = BASE64_STANDARD
            .decode(sender_ratchet_pub_b64)
            .unwrap_or_default();
        let sender_ratchet_priv = BASE64_STANDARD
            .decode(sender_ratchet_priv_b64)
            .unwrap_or_default();

        let index_info = get_object(&session_data, "indexInfo")
            .ok_or_else(|| invalid_js_data("migrate", "Missing indexInfo"))?;
        let remote_identity_b64 = get_string(&index_info, "remoteIdentityKey").unwrap_or_default();
        let remote_identity = BASE64_STANDARD
            .decode(remote_identity_b64)
            .unwrap_or_default();

        let base_key_b64 = get_string(&index_info, "baseKey").unwrap_or_default();
        let base_key = BASE64_STANDARD.decode(base_key_b64).unwrap_or_default();

        let chains = get_object(&session_data, "_chains")
            .ok_or_else(|| invalid_js_data("migrate", "Missing _chains"))?;
        let chains_obj = chains
            .dyn_ref::<js_sys::Object>()
            .ok_or_else(|| invalid_js_data("migrate", "_chains expected to be an object"))?;
        let chain_keys = js_sys::Object::keys(chains_obj);

        let mut sender_chain = None;
        let mut receiver_chains = Vec::new();

        for i in 0..chain_keys.length() {
            let key = chain_keys.get(i);
            let chain = js_sys::Reflect::get(&chains, &key).map_err(|err| {
                invalid_js_data(
                    "migrate",
                    format!(
                        "Failed to read chain entry {:?}: {:?}",
                        key.as_string(),
                        err
                    ),
                )
            })?;
            let chain_type = get_number(&chain, "chainType").unwrap_or(0.0) as u32;

            let chain_key_obj = get_object(&chain, "chainKey").ok_or_else(|| {
                invalid_js_data("migrate", "Missing chainKey for legacy chain entry")
            })?;
            let counter = get_number(&chain_key_obj, "counter").unwrap_or(0.0) as u32;
            let key_b64 = get_string(&chain_key_obj, "key").unwrap_or_default();
            let key_bytes = BASE64_STANDARD.decode(key_b64).unwrap_or_default();

            let message_keys_obj = get_object(&chain, "messageKeys").ok_or_else(|| {
                invalid_js_data("migrate", "Missing messageKeys for legacy chain entry")
            })?;
            let message_keys_object = message_keys_obj
                .dyn_ref::<js_sys::Object>()
                .ok_or_else(|| invalid_js_data("migrate", "Invalid messageKeys object"))?;
            let msg_keys_list = js_sys::Object::keys(message_keys_object);
            let mut message_keys = Vec::new();

            for j in 0..msg_keys_list.length() {
                let idx_val = msg_keys_list.get(j);
                let idx = idx_val.as_f64().ok_or_else(|| {
                    invalid_js_data("migrate", "Message key index is not a number")
                })? as u32;
                let msg_key_b64 = js_sys::Reflect::get(&message_keys_obj, &idx_val)
                    .map_err(|err| {
                        invalid_js_data(
                            "migrate",
                            format!("Missing message key {}: {:?}", idx, err),
                        )
                    })?
                    .as_string()
                    .unwrap_or_default();
                let msg_key_bytes = BASE64_STANDARD.decode(msg_key_b64).unwrap_or_default();
                message_keys.push((idx, msg_key_bytes));
            }

            if chain_type == 1 {
                sender_chain = Some((
                    sender_ratchet_pub.clone(),
                    sender_ratchet_priv.clone(),
                    key_bytes,
                    counter,
                    message_keys,
                ));
            } else if chain_type == 2 {
                let sender_ratchet_key_b64 = key.as_string().unwrap_or_default();
                let sender_ratchet_key = BASE64_STANDARD
                    .decode(sender_ratchet_key_b64)
                    .unwrap_or_default();
                receiver_chains.push((sender_ratchet_key, key_bytes, counter, message_keys));
            }
        }

        let mut sender_chain_struct = None;

        if let Some((pub_key, priv_key, chain_key, counter, msg_keys)) = sender_chain {
            let mut message_keys_vec = Vec::new();
            for (idx, key) in msg_keys {
                message_keys_vec.push(MessageKey {
                    index: Some(idx),
                    cipher_key: Some(key.into()),
                    mac_key: Some(vec![0u8; 32].into()),
                    iv: Some(vec![0u8; 16].into()),
                });
            }

            sender_chain_struct = Some(Chain {
                sender_ratchet_key: Some(pub_key),
                sender_ratchet_key_private: Some(priv_key),
                chain_key: Some(ChainKey {
                    index: Some(counter),
                    key: Some(chain_key.into()),
                }),
                message_keys: message_keys_vec,
            });
        }

        let mut receiver_chains_vec = Vec::new();
        for (sender_ratchet, chain_key, counter, msg_keys) in receiver_chains {
            let mut message_keys_vec = Vec::new();
            for (idx, key) in msg_keys {
                message_keys_vec.push(MessageKey {
                    index: Some(idx),
                    cipher_key: Some(key.into()),
                    mac_key: Some(vec![0u8; 32].into()),
                    iv: Some(vec![0u8; 16].into()),
                });
            }

            receiver_chains_vec.push(Chain {
                sender_ratchet_key: Some(sender_ratchet),
                sender_ratchet_key_private: None,
                chain_key: Some(ChainKey {
                    index: Some(counter),
                    key: Some(chain_key.into()),
                }),
                message_keys: message_keys_vec,
            });
        }

        let local_reg_id = self.get_local_registration_id().await?;

        let session = SessionStructure {
            session_version: Some(3),
            local_identity_public: Some(local_identity_public),
            remote_identity_public: Some(remote_identity),
            root_key: Some(root_key),
            previous_counter: Some(previous_counter),
            sender_chain: sender_chain_struct,
            receiver_chains: receiver_chains_vec,
            pending_key_exchange: None,
            pending_pre_key: None,
            remote_registration_id: Some(registration_id),
            local_registration_id: Some(local_reg_id),
            needs_refresh: None,
            alice_base_key: Some(base_key),
        };

        let record = RecordStructure {
            current_session: Some(session),
            previous_sessions: Vec::new(),
        };

        Ok(Some(record.encode_to_vec()))
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
            let seed =
                get_bytes_from_buffer_json(&sender_chain_key_obj, "seed").unwrap_or_default();

            let sender_signing_key_obj = get_object(&state_obj, "senderSigningKey")
                .ok_or_else(|| invalid_js_data("migrate_sender_key", "Missing senderSigningKey"))?;
            let public_key =
                get_bytes_from_buffer_json(&sender_signing_key_obj, "public").unwrap_or_default();
            let private_key = get_bytes_from_buffer_json(&sender_signing_key_obj, "private");

            let sender_message_keys_arr = get_object(&state_obj, "senderMessageKeys")
                .map(|v| js_sys::Array::from(&v))
                .unwrap_or_default();
            let mut sender_message_keys = Vec::new();

            for j in 0..sender_message_keys_arr.length() {
                let msg_key_obj = sender_message_keys_arr.get(j);
                let msg_iteration = get_number(&msg_key_obj, "iteration").unwrap_or(0.0) as u32;
                let msg_seed = get_bytes_from_buffer_json(&msg_key_obj, "seed").unwrap_or_default();

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
                sender_chain_key: Some(chain_key),
                sender_signing_key: Some(signing_key),
                sender_message_keys,
            });
        }

        let record = SenderKeyRecordStructure { sender_key_states };

        Ok(Some(record.encode_to_vec()))
    }
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsKeyPairBytes {
    #[serde(default, alias = "pubKey", alias = "publicKey", alias = "public")]
    public_key: Option<ByteBuf>,
    #[serde(default, alias = "privKey", alias = "privateKey", alias = "private")]
    private_key: Option<ByteBuf>,
}

impl JsKeyPairBytes {
    fn into_vecs(self) -> Option<(Vec<u8>, Vec<u8>)> {
        match (self.public_key, self.private_key) {
            (Some(public_key), Some(private_key)) => {
                Some((public_key.into_vec(), private_key.into_vec()))
            }
            _ => None,
        }
    }
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsKeyEnvelope {
    #[serde(flatten)]
    inline: JsKeyPairBytes,
    #[serde(default, rename = "keyPair", alias = "key_pair")]
    key_pair: Option<JsKeyPairBytes>,
}

impl JsKeyEnvelope {
    fn into_vecs(self) -> Option<(Vec<u8>, Vec<u8>)> {
        self.inline
            .into_vecs()
            .or_else(|| self.key_pair.and_then(|pair| pair.into_vecs()))
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsPreKeyRecordPayload {
    #[serde(default, alias = "preKeyId", alias = "keyId")]
    id: Option<u32>,
    #[serde(flatten)]
    keys: JsKeyEnvelope,
}

impl JsPreKeyRecordPayload {
    fn into_record(self, requested_id: PreKeyId) -> SignalResult<PreKeyRecord> {
        let effective_id = self.id.unwrap_or_else(|| requested_id.into());
        let (public_key, private_key) = self
            .keys
            .into_vecs()
            .ok_or_else(|| invalid_js_data("load_pre_key", "Missing public/private key bytes"))?;

        let normalized_public_key = ensure_curve_key_with_prefix(public_key);
        let key_pair = KeyPair::from_public_and_private(&normalized_public_key, &private_key)?;
        Ok(PreKeyRecord::new(PreKeyId::from(effective_id), &key_pair))
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsSignedPreKeyRecordPayload {
    #[serde(default, alias = "keyId")]
    id: Option<u32>,
    #[serde(default)]
    timestamp: Option<u64>,
    #[serde(default, alias = "sig", alias = "signatureBytes")]
    signature: Option<ByteBuf>,
    #[serde(flatten)]
    keys: JsKeyEnvelope,
}

impl JsSignedPreKeyRecordPayload {
    fn into_record(self, requested_id: SignedPreKeyId) -> SignalResult<SignedPreKeyRecord> {
        let effective_id = self.id.unwrap_or_else(|| requested_id.into());
        let (public_key, private_key) = self.keys.into_vecs().ok_or_else(|| {
            invalid_js_data("load_signed_pre_key", "Missing public/private key bytes")
        })?;
        let signature = self
            .signature
            .map(ByteBuf::into_vec)
            .ok_or_else(|| invalid_js_data("load_signed_pre_key", "Missing signature bytes"))?;
        let timestamp_ms = self.timestamp.unwrap_or(0);
        let normalized_public_key = ensure_curve_key_with_prefix(public_key);
        let key_pair = KeyPair::from_public_and_private(&normalized_public_key, &private_key)?;
        let timestamp = Timestamp::from_epoch_millis(timestamp_ms);
        Ok(SignedPreKeyRecord::new(
            SignedPreKeyId::from(effective_id),
            timestamp,
            &key_pair,
            &signature,
        ))
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsIdentityKeyPairPayload {
    #[serde(flatten)]
    keys: JsKeyEnvelope,
}

impl JsIdentityKeyPairPayload {
    fn into_pair(self) -> SignalResult<IdentityKeyPair> {
        let (public_key, private_key) = self.keys.into_vecs().ok_or_else(|| {
            invalid_js_data("get_identity_key_pair", "Missing public/private key bytes")
        })?;
        let normalized_public_key = ensure_curve_key_with_prefix(public_key);
        let identity_key = IdentityKey::try_from(normalized_public_key.as_slice())?;
        let private_key = PrivateKey::deserialize(&private_key)?;
        Ok(IdentityKeyPair::new(identity_key, private_key))
    }
}

fn invalid_js_data(context: &'static str, message: impl Into<String>) -> SignalProtocolError {
    SignalProtocolError::InvalidState(context, message.into())
}

fn ensure_curve_key_with_prefix(bytes: Vec<u8>) -> Vec<u8> {
    if bytes.len() == 33 && bytes.first().copied() == Some(0x05) {
        return bytes;
    }

    if bytes.len() == 32 {
        let mut prefixed = Vec::with_capacity(33);
        prefixed.push(0x05);
        prefixed.extend_from_slice(&bytes);
        return prefixed;
    }

    bytes
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
async fn resolve_maybe_promise_optional(value: JsValue) -> SignalResult<Option<JsValue>> {
    let resolved = resolve_maybe_promise(value)
        .await
        .map_err(js_to_signal_error)?;
    if resolved.is_null() || resolved.is_undefined() {
        Ok(None)
    } else {
        Ok(Some(resolved))
    }
}

#[inline]
fn deserialize_js_value<T: DeserializeOwned>(
    value: JsValue,
    context: &'static str,
) -> SignalResult<T> {
    serde_wasm_bindgen::from_value(value).map_err(|err| invalid_js_data(context, err.to_string()))
}

#[inline]
fn js_array_to_bytes(array: &js_sys::Array) -> Vec<u8> {
    let mut bytes = Vec::with_capacity(array.length() as usize);
    for i in 0..array.length() {
        if let Some(val) = array.get(i).as_f64() {
            bytes.push(val as u8);
        }
    }
    bytes
}

#[inline]
fn js_value_to_bytes(value: &JsValue) -> Option<Vec<u8>> {
    if let Some(arr) = value.dyn_ref::<Uint8Array>() {
        return Some(arr.to_vec());
    }

    if js_sys::Array::is_array(value) {
        return Some(js_array_to_bytes(&js_sys::Array::from(value)));
    }

    if let Ok(data) = js_sys::Reflect::get(value, &JsValue::from_str("data"))
        && js_sys::Array::is_array(&data)
    {
        return Some(js_array_to_bytes(&js_sys::Array::from(&data)));
    }

    None
}

fn is_legacy_session_object(value: &JsValue) -> bool {
    let has_sessions =
        js_sys::Reflect::has(value, &JsValue::from_str("_sessions")).unwrap_or(false);
    let has_reg_id =
        js_sys::Reflect::has(value, &JsValue::from_str("registrationId")).unwrap_or(false);
    let has_ratchet =
        js_sys::Reflect::has(value, &JsValue::from_str("currentRatchet")).unwrap_or(false);

    has_sessions || (has_reg_id && has_ratchet)
}

fn get_string(obj: &JsValue, key: &str) -> Option<String> {
    js_sys::Reflect::get(obj, &JsValue::from_str(key))
        .ok()
        .and_then(|v| v.as_string())
}

fn get_object(obj: &JsValue, key: &str) -> Option<JsValue> {
    js_sys::Reflect::get(obj, &JsValue::from_str(key)).ok()
}

fn get_number(obj: &JsValue, key: &str) -> Option<f64> {
    js_sys::Reflect::get(obj, &JsValue::from_str(key))
        .ok()
        .and_then(|v| v.as_f64())
}

fn get_bytes_from_buffer_json(obj: &JsValue, key: &str) -> Option<Vec<u8>> {
    let val = js_sys::Reflect::get(obj, &JsValue::from_str(key)).ok()?;
    if val.is_undefined() || val.is_null() {
        return None;
    }

    // Check for Buffer-like object { type: "Buffer", data: [...] }
    let type_prop = js_sys::Reflect::get(&val, &JsValue::from_str("type")).ok();
    let data_prop = js_sys::Reflect::get(&val, &JsValue::from_str("data")).ok();
    if let (Some(t), Some(d)) = (type_prop, data_prop)
        && t.as_string().as_deref() == Some("Buffer")
        && js_sys::Array::is_array(&d)
    {
        return Some(js_array_to_bytes(&js_sys::Array::from(&d)));
    }

    // Try Uint8Array
    if let Some(arr) = val.dyn_ref::<Uint8Array>() {
        return Some(arr.to_vec());
    }

    // Try plain JS array
    if js_sys::Array::is_array(&val) {
        return Some(js_array_to_bytes(&js_sys::Array::from(&val)));
    }

    // Try base64 string
    val.as_string()
        .and_then(|s| BASE64_STANDARD.decode(&s).ok())
}

#[async_trait(?Send)]
impl SessionStore for JsStorageAdapter {
    async fn load_session(
        &self,
        address: &libsignal::ProtocolAddress,
    ) -> SignalResult<Option<CoreSessionRecord>> {
        let address_str = self.get_address_string(address);

        if let Some(record) = self.cached_sessions.borrow().get(&address_str) {
            return Ok(Some(record.clone()));
        }

        let result = self
            .js_storage
            .js_load_session(&address_str)
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        if value.is_null() || value.is_undefined() {
            return Ok(None);
        }

        let bytes = if let Some(b) = js_value_to_bytes(&value) {
            Some(b)
        } else if is_legacy_session_object(&value) {
            self.migrate_legacy_json(value).await?
        } else {
            None
        };

        match bytes {
            Some(data) => {
                let record = CoreSessionRecord::deserialize(&data)?;
                // Insert into cache and return a clone - this is required since HashMap takes ownership
                let result = record.clone();
                self.cached_sessions
                    .borrow_mut()
                    .insert(address_str, record);
                Ok(Some(result))
            }
            None => Ok(None),
        }
    }

    async fn store_session(
        &mut self,
        address: &libsignal::ProtocolAddress,
        record: &CoreSessionRecord,
    ) -> SignalResult<()> {
        let address_str = self.get_address_string(address);

        self.cached_sessions
            .borrow_mut()
            .insert(address_str.clone(), record.clone());

        let bytes = record.serialize()?;

        let result = if self.has_store_session_raw() {
            let uint8 = Uint8Array::from(bytes.as_slice());
            self.js_storage.js_store_session_raw(&address_str, &uint8)
        } else {
            let session_record = SessionRecord::new(bytes);
            let js_record: JsValue = session_record.into();
            self.js_storage.js_store_session(&address_str, js_record)
        };

        let promise_value = result.map_err(js_to_signal_error)?;
        resolve_maybe_promise(promise_value)
            .await
            .map_err(js_to_signal_error)?;

        Ok(())
    }
}

#[async_trait(?Send)]
impl IdentityKeyStore for JsStorageAdapter {
    async fn get_identity_key_pair(&self) -> SignalResult<IdentityKeyPair> {
        if let Some(pair) = self.cached_identity_key_pair.borrow().as_ref().cloned() {
            return Ok(pair);
        }

        let result = self
            .js_storage
            .js_get_our_identity()
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise_optional(result).await?;

        let js_value = value.ok_or_else(|| {
            SignalProtocolError::InvalidState("get_identity_key_pair", "JS returned null".into())
        })?;

        let payload: JsIdentityKeyPairPayload =
            deserialize_js_value(js_value, "get_identity_key_pair")?;
        let key_pair = payload.into_pair()?;

        self.cached_identity_key_pair
            .borrow_mut()
            .replace(key_pair.clone());

        Ok(key_pair)
    }

    async fn get_local_registration_id(&self) -> SignalResult<u32> {
        if let Some(id) = *self.cached_registration_id.borrow() {
            return Ok(id);
        }

        let result = self
            .js_storage
            .js_get_our_registration_id()
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        let registration = value.as_f64().ok_or_else(|| {
            SignalProtocolError::InvalidState(
                "get_local_registration_id",
                "JS did not return a number".into(),
            )
        })? as u32;

        self.cached_registration_id
            .borrow_mut()
            .replace(registration);

        Ok(registration)
    }

    async fn is_trusted_identity(
        &self,
        address: &libsignal::ProtocolAddress,
        identity: &libsignal::IdentityKey,
        direction: StoreDirection,
    ) -> SignalResult<bool> {
        let address_name = address.name().to_string();
        let identity_bytes = identity.serialize();

        if let Some(cached_key) = self.cached_identities.borrow().get(&address_name)
            && cached_key.as_slice() == identity_bytes.as_slice()
        {
            return Ok(true);
        }

        let direction_val = match direction {
            StoreDirection::Sending => 0,
            StoreDirection::Receiving => 1,
        };

        let uint8 = Uint8Array::from(identity_bytes.as_slice());
        let result = self
            .js_storage
            .js_is_trusted_identity(&address_name, &uint8, direction_val)
            .map_err(js_to_signal_error)?;

        let value = resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        let trusted = value.as_bool().unwrap_or(false);

        if trusted {
            self.cached_identities
                .borrow_mut()
                .insert(address_name, identity_bytes.to_vec());
        }

        Ok(trusted)
    }

    async fn save_identity(
        &mut self,
        address: &libsignal::ProtocolAddress,
        identity: &libsignal::IdentityKey,
    ) -> SignalResult<IdentityChange> {
        let address_name = address.name().to_string();
        let identity_bytes = identity.serialize();

        let changed = if let Some(cached_key) = self.cached_identities.borrow().get(&address_name) {
            cached_key.as_slice() != identity_bytes.as_slice()
        } else {
            false
        };

        self.cached_identities
            .borrow_mut()
            .insert(address_name, identity_bytes.to_vec());

        Ok(IdentityChange::from_changed(changed))
    }

    async fn get_identity(
        &self,
        _address: &libsignal::ProtocolAddress,
    ) -> SignalResult<Option<libsignal::IdentityKey>> {
        Ok(None)
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl PreKeyStore for JsStorageAdapter {
    async fn get_pre_key(&self, prekey_id: PreKeyId) -> SignalResult<PreKeyRecord> {
        let result = self
            .js_storage
            .js_load_pre_key(prekey_id.into())
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise_optional(result).await?;

        let js_value = value.ok_or(SignalProtocolError::InvalidPreKeyId)?;
        let payload: JsPreKeyRecordPayload = deserialize_js_value(js_value, "load_pre_key")?;
        payload.into_record(prekey_id)
    }

    async fn save_pre_key(
        &mut self,
        _prekey_id: PreKeyId,
        _record: &PreKeyRecord,
    ) -> SignalResult<()> {
        Ok(())
    }

    async fn remove_pre_key(&mut self, prekey_id: PreKeyId) -> SignalResult<()> {
        let result = self
            .js_storage
            .js_remove_pre_key(prekey_id.into())
            .map_err(js_to_signal_error)?;
        resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;
        Ok(())
    }
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
impl SignedPreKeyStore for JsStorageAdapter {
    async fn get_signed_pre_key(
        &self,
        signed_prekey_id: SignedPreKeyId,
    ) -> SignalResult<SignedPreKeyRecord> {
        let result = self
            .js_storage
            .js_load_signed_pre_key(signed_prekey_id.into())
            .map_err(js_to_signal_error)?;
        let value = resolve_maybe_promise_optional(result).await?;

        let js_value = value.ok_or(SignalProtocolError::InvalidSignedPreKeyId)?;
        let payload: JsSignedPreKeyRecordPayload =
            deserialize_js_value(js_value, "load_signed_pre_key")?;
        payload.into_record(signed_prekey_id)
    }

    async fn save_signed_pre_key(
        &mut self,
        _id: SignedPreKeyId,
        _record: &SignedPreKeyRecord,
    ) -> SignalResult<()> {
        Ok(())
    }
}

#[async_trait(?Send)]
impl SenderKeyStore for JsStorageAdapter {
    async fn load_sender_key(
        &mut self,
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

        let bytes = js_value_to_bytes(&value);

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

        self.cached_sender_keys
            .borrow_mut()
            .insert(key_id, record.clone());
        Ok(Some(record))
    }

    async fn store_sender_key(
        &mut self,
        sender_key_name: &CoreSenderKeyName,
        record: &CoreSenderKeyRecord,
    ) -> SignalResult<()> {
        let key_id = self.get_sender_key_id(sender_key_name);

        self.cached_sender_keys
            .borrow_mut()
            .insert(key_id.clone(), record.clone());

        let bytes = record.serialize()?;
        let uint8 = Uint8Array::from(bytes.as_slice());

        let result = self
            .js_storage
            .js_store_sender_key(&key_id, &uint8)
            .map_err(js_to_signal_error)?;
        resolve_maybe_promise(result)
            .await
            .map_err(js_to_signal_error)?;

        Ok(())
    }
}
