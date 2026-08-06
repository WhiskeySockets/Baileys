//! Typed boundary for the decoded libsignal `SessionRecord` v1 model.

use bytes::Bytes;
use js_sys::Uint8Array;
use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wacore_libsignal::protocol::{
    IdentityKey, LegacyIndexedSessionV1 as CoreIndexedSession,
    LegacySessionBaseKeyRoleV1 as CoreBaseKeyRole, LegacySessionChainCounterV1 as CoreChainCounter,
    LegacySessionChainKeyV1 as CoreChainKey, LegacySessionChainRoleV1 as CoreChainRole,
    LegacySessionChainV1 as CoreChain, LegacySessionDispositionV1 as CoreDisposition,
    LegacySessionInteropError as CoreInteropError, LegacySessionKeyPairV1 as CoreKeyPair,
    LegacySessionLocalContext as CoreLocalContext, LegacySessionMessageKeyV1 as CoreMessageKey,
    LegacySessionPendingPreKeyV1 as CorePendingPreKey, LegacySessionRatchetV1 as CoreRatchet,
    LegacySessionRecordV1 as CoreRecord,
    LegacySessionUnrepresentableFieldV1 as CoreUnrepresentableField,
    LegacySessionV1 as CoreSession, SessionRecord,
};
use wasm_bindgen::prelude::*;

fn byte_array(bytes: &[u8]) -> Uint8Array {
    Uint8Array::from(bytes)
}

#[derive(Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionRecordV1 {
    pub sessions: Vec<LegacyIndexedSessionV1>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacyIndexedSessionV1 {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub index_key: Vec<u8>,
    pub session: LegacySessionV1,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionV1 {
    pub registration_id: u32,
    pub ratchet: LegacySessionRatchetV1,
    pub index: LegacySessionIndexV1,
    pub chains: Vec<LegacySessionChainV1>,
    pub pending_pre_key: Option<LegacySessionPendingPreKeyV1>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionRatchetV1 {
    pub key_pair: LegacySessionKeyPairV1,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub last_remote_ephemeral_key: Vec<u8>,
    /// v1 allows `-1` for a never-used sending chain; the core validates the
    /// `-1..=u32::MAX` range and owns the floor-to-zero translation.
    pub previous_counter: i64,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub root_key: Vec<u8>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionKeyPairV1 {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub public: Vec<u8>,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub private: Vec<u8>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionIndexV1 {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub base_key: Vec<u8>,
    pub base_key_role: u32,
    pub closed_timestamp: i64,
    pub used_at_ms: u64,
    pub created_at_ms: u64,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub remote_identity_key: Vec<u8>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionChainV1 {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub ratchet_key: Vec<u8>,
    pub role: u32,
    pub chain_key: LegacySessionChainKeyV1,
    pub message_keys: Vec<LegacySessionMessageKeyV1>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionChainKeyV1 {
    pub counter: i64,
    #[tsify(type = "Uint8Array | undefined")]
    #[serde(default, skip_serializing_if = "Option::is_none", with = "serde_bytes")]
    pub key: Option<Vec<u8>>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionMessageKeyV1 {
    pub index: u32,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub seed: Vec<u8>,
}

#[derive(Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionPendingPreKeyV1 {
    pub pre_key_id: Option<u32>,
    pub signed_pre_key_id: u32,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub base_key: Vec<u8>,
}

#[derive(Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionLocalContext {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub identity_key: Vec<u8>,
    pub registration_id: u32,
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(
    tag = "status",
    rename_all = "snake_case",
    rename_all_fields = "camelCase"
)]
pub enum LegacySessionProjectionV1 {
    Projected {
        record: LegacySessionRecordV1,
    },
    Unrepresentable {
        issue: LegacySessionProjectionIssueV1,
    },
}

#[derive(Serialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct LegacySessionProjectionIssueV1 {
    pub session: usize,
    pub chain: Option<usize>,
    pub field: LegacySessionUnrepresentableFieldV1,
}

#[derive(Serialize, Tsify)]
#[serde(rename_all = "snake_case")]
pub enum LegacySessionUnrepresentableFieldV1 {
    SessionVersion,
    SenderChain,
    PendingKeyExchange,
    PostQuantumPreKey,
    RefreshState,
    DerivedMessageKey,
    LastRemoteEphemeralKey,
}

impl TryFrom<LegacySessionRecordV1> for CoreRecord {
    type Error = CoreInteropError;

    fn try_from(value: LegacySessionRecordV1) -> Result<Self, Self::Error> {
        let sessions = value
            .sessions
            .into_iter()
            .map(TryInto::try_into)
            .collect::<Result<Vec<_>, _>>()?;
        Self::from_indexed_sessions(sessions)
    }
}

impl From<CoreRecord> for LegacySessionRecordV1 {
    fn from(value: CoreRecord) -> Self {
        Self {
            sessions: value
                .into_indexed_sessions()
                .into_iter()
                .map(Into::into)
                .collect(),
        }
    }
}

impl TryFrom<LegacyIndexedSessionV1> for CoreIndexedSession {
    type Error = CoreInteropError;

    fn try_from(value: LegacyIndexedSessionV1) -> Result<Self, Self::Error> {
        Ok(Self {
            index_key: Bytes::from(value.index_key),
            session: value.session.try_into()?,
        })
    }
}

impl From<CoreIndexedSession> for LegacyIndexedSessionV1 {
    fn from(value: CoreIndexedSession) -> Self {
        Self {
            index_key: value.index_key.into(),
            session: value.session.into(),
        }
    }
}

impl TryFrom<LegacySessionV1> for CoreSession {
    type Error = CoreInteropError;

    fn try_from(value: LegacySessionV1) -> Result<Self, Self::Error> {
        Ok(Self {
            registration_id: value.registration_id,
            ratchet: value.ratchet.into(),
            index: value.index.try_into()?,
            chains: value
                .chains
                .into_iter()
                .map(TryInto::try_into)
                .collect::<Result<Vec<_>, _>>()?,
            pending_pre_key: value.pending_pre_key.map(Into::into),
        })
    }
}

impl From<CoreSession> for LegacySessionV1 {
    fn from(value: CoreSession) -> Self {
        Self {
            registration_id: value.registration_id,
            ratchet: value.ratchet.into(),
            index: value.index.into(),
            chains: value.chains.into_iter().map(Into::into).collect(),
            pending_pre_key: value.pending_pre_key.map(Into::into),
        }
    }
}

impl From<LegacySessionRatchetV1> for CoreRatchet {
    fn from(value: LegacySessionRatchetV1) -> Self {
        Self {
            key_pair: value.key_pair.into(),
            last_remote_ephemeral_key: value.last_remote_ephemeral_key.into(),
            previous_counter: value.previous_counter,
            root_key: value.root_key.into(),
        }
    }
}

impl From<CoreRatchet> for LegacySessionRatchetV1 {
    fn from(value: CoreRatchet) -> Self {
        Self {
            key_pair: value.key_pair.into(),
            last_remote_ephemeral_key: value.last_remote_ephemeral_key.into(),
            previous_counter: value.previous_counter,
            root_key: value.root_key.into(),
        }
    }
}

impl From<LegacySessionKeyPairV1> for CoreKeyPair {
    fn from(value: LegacySessionKeyPairV1) -> Self {
        Self {
            public: value.public.into(),
            private: value.private.into(),
        }
    }
}

impl From<CoreKeyPair> for LegacySessionKeyPairV1 {
    fn from(value: CoreKeyPair) -> Self {
        Self {
            public: value.public.into(),
            private: value.private.into(),
        }
    }
}

impl TryFrom<LegacySessionIndexV1> for wacore_libsignal::protocol::LegacySessionIndexV1 {
    type Error = CoreInteropError;

    fn try_from(value: LegacySessionIndexV1) -> Result<Self, Self::Error> {
        Ok(Self {
            base_key: value.base_key.into(),
            base_key_role: CoreBaseKeyRole::try_from(value.base_key_role)?,
            disposition: CoreDisposition::from_closed_timestamp(value.closed_timestamp)?,
            used_at_ms: value.used_at_ms,
            created_at_ms: value.created_at_ms,
            remote_identity_key: value.remote_identity_key.into(),
        })
    }
}

impl From<wacore_libsignal::protocol::LegacySessionIndexV1> for LegacySessionIndexV1 {
    fn from(value: wacore_libsignal::protocol::LegacySessionIndexV1) -> Self {
        Self {
            base_key: value.base_key.into(),
            base_key_role: u32::try_from(value.base_key_role.code())
                .expect("legacy base-key role wire code is non-negative"),
            closed_timestamp: value.disposition.closed_timestamp(),
            used_at_ms: value.used_at_ms,
            created_at_ms: value.created_at_ms,
            remote_identity_key: value.remote_identity_key.into(),
        }
    }
}

impl TryFrom<LegacySessionChainV1> for CoreChain {
    type Error = CoreInteropError;

    fn try_from(value: LegacySessionChainV1) -> Result<Self, Self::Error> {
        Ok(Self {
            ratchet_key: value.ratchet_key.into(),
            role: CoreChainRole::try_from(value.role)?,
            chain_key: value.chain_key.try_into()?,
            message_keys: value.message_keys.into_iter().map(Into::into).collect(),
        })
    }
}

impl From<CoreChain> for LegacySessionChainV1 {
    fn from(value: CoreChain) -> Self {
        Self {
            ratchet_key: value.ratchet_key.into(),
            role: u32::try_from(value.role.code())
                .expect("legacy chain role wire code is non-negative"),
            chain_key: value.chain_key.into(),
            message_keys: value.message_keys.into_iter().map(Into::into).collect(),
        }
    }
}

impl TryFrom<LegacySessionChainKeyV1> for CoreChainKey {
    type Error = CoreInteropError;

    fn try_from(value: LegacySessionChainKeyV1) -> Result<Self, Self::Error> {
        Ok(Self {
            counter: CoreChainCounter::new(value.counter)?,
            key: value.key.map(Into::into),
        })
    }
}

impl From<CoreChainKey> for LegacySessionChainKeyV1 {
    fn from(value: CoreChainKey) -> Self {
        Self {
            counter: value.counter.value(),
            key: value.key.map(Into::into),
        }
    }
}

impl From<LegacySessionMessageKeyV1> for CoreMessageKey {
    fn from(value: LegacySessionMessageKeyV1) -> Self {
        Self {
            index: value.index,
            seed: value.seed.into(),
        }
    }
}

impl From<CoreMessageKey> for LegacySessionMessageKeyV1 {
    fn from(value: CoreMessageKey) -> Self {
        Self {
            index: value.index,
            seed: value.seed.into(),
        }
    }
}

impl From<LegacySessionPendingPreKeyV1> for CorePendingPreKey {
    fn from(value: LegacySessionPendingPreKeyV1) -> Self {
        Self {
            pre_key_id: value.pre_key_id,
            signed_pre_key_id: value.signed_pre_key_id,
            base_key: value.base_key.into(),
        }
    }
}

impl From<CorePendingPreKey> for LegacySessionPendingPreKeyV1 {
    fn from(value: CorePendingPreKey) -> Self {
        Self {
            pre_key_id: value.pre_key_id,
            signed_pre_key_id: value.signed_pre_key_id,
            base_key: value.base_key.into(),
        }
    }
}

impl From<CoreUnrepresentableField> for LegacySessionUnrepresentableFieldV1 {
    fn from(value: CoreUnrepresentableField) -> Self {
        match value {
            CoreUnrepresentableField::SessionVersion => Self::SessionVersion,
            CoreUnrepresentableField::SenderChain => Self::SenderChain,
            CoreUnrepresentableField::PendingKeyExchange => Self::PendingKeyExchange,
            CoreUnrepresentableField::PostQuantumPreKey => Self::PostQuantumPreKey,
            CoreUnrepresentableField::RefreshState => Self::RefreshState,
            CoreUnrepresentableField::DerivedMessageKey => Self::DerivedMessageKey,
            CoreUnrepresentableField::LastRemoteEphemeralKey => Self::LastRemoteEphemeralKey,
        }
    }
}

fn projection_issue(
    error: CoreInteropError,
) -> Result<LegacySessionProjectionIssueV1, CoreInteropError> {
    match error {
        CoreInteropError::NotRepresentable { session, field } => {
            Ok(LegacySessionProjectionIssueV1 {
                session,
                chain: None,
                field: field.into(),
            })
        }
        CoreInteropError::ChainNotRepresentable {
            session,
            chain,
            field,
        } => Ok(LegacySessionProjectionIssueV1 {
            session,
            chain: Some(chain),
            field: field.into(),
        }),
        error => Err(error),
    }
}

#[wasm_bindgen(js_name = importLegacySessionRecordV1)]
pub fn import_legacy_session_record_v1(
    record: LegacySessionRecordV1,
    context: LegacySessionLocalContext,
) -> Result<Uint8Array, JsValue> {
    let identity_key = IdentityKey::decode(&context.identity_key)
        .map_err(|error| JsValue::from_str(&format!("context.identityKey: {error}")))?;
    let record = CoreRecord::try_from(record)
        .map_err(|error| JsValue::from_str(&format!("record: {error}")))?;
    let record = record
        .into_session_record(CoreLocalContext {
            identity_key,
            registration_id: context.registration_id,
        })
        .map_err(|error| JsValue::from_str(&format!("record: {error}")))?;
    let bytes = record.serialize().map_err(|error| {
        JsValue::from_str(&format!(
            "serialize imported legacy session record: {error}"
        ))
    })?;
    Ok(byte_array(&bytes))
}

#[wasm_bindgen(js_name = projectLegacySessionRecordV1)]
pub fn project_legacy_session_record_v1(
    bytes: &[u8],
) -> Result<LegacySessionProjectionV1, JsValue> {
    let record = SessionRecord::deserialize(bytes)
        .map_err(|error| JsValue::from_str(&format!("recordBytes: {error}")))?;
    match record.into_legacy_session_v1_operational() {
        Ok(record) => Ok(LegacySessionProjectionV1::Projected {
            record: record.into(),
        }),
        Err(error) => match projection_issue(error) {
            Ok(issue) => Ok(LegacySessionProjectionV1::Unrepresentable { issue }),
            Err(error) => Err(JsValue::from_str(&format!("recordBytes: {error}"))),
        },
    }
}

/// The JS backend stored a sender-key record as UTF-8 JSON. Callers that keep
/// that shape on disk convert here; the storage adapter itself stays neutral,
/// so a consumer that prefers the native bytes is unaffected.
#[wasm_bindgen(js_name = projectLegacySenderKeyRecordV1)]
pub fn project_legacy_sender_key_record_v1(bytes: &[u8]) -> Result<Uint8Array, JsValue> {
    let record = wacore_libsignal::protocol::SenderKeyRecord::deserialize(bytes)
        .map_err(|error| JsValue::from_str(&format!("recordBytes: {error}")))?;
    let json = crate::storage_adapter::legacy_sender_key::serialize(record)
        .map_err(|error| JsValue::from_str(&format!("legacy sender key: {error}")))?;

    Ok(byte_array(&json))
}
