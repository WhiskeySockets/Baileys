//! Signal operations as pure functions: snapshot in, changeset out.
//!
//! The caller locks the peer address, loads everything the operation can need,
//! calls one of these, and writes the returned changes back. Nothing here calls
//! into JS, so an operation cannot re-enter the caller's transaction, cannot
//! acquire locks in a conflicting order, and cannot touch a record the caller
//! did not hand it.
//!
//! Effects the core reports (a consumed pre-key, a replaced identity) travel in
//! the changeset instead of being applied behind the caller's back, which is
//! what lets the whole operation land as one durable write.

use rand::rngs::StdRng;
use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

use wacore_libsignal::protocol::{
    GenericSignedPreKey as _, IdentityKey, IdentityKeyPair, KeyPair, PreKeyBundle, PreKeyId,
    PreKeyRecord, PreKeySignalMessage, PrivateKey, PublicKey as CorePublicKey, SenderKeyRecord,
    SessionRecord, SignalMessage, SignedPreKeyId, SignedPreKeyRecord, Timestamp, UsePQRatchet,
    message_decrypt_prekey, message_decrypt_signal, message_encrypt, process_prekey_bundle,
};

use crate::protocol_address::ProtocolAddress;
use crate::snapshot_store::{SnapshotChanges, SnapshotStore};

fn err(context: &str, detail: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&format!("{context}: {detail}"))
}

/// Accept either the bare 32-byte curve key or the 0x05-prefixed form.
fn with_prefix(bytes: Vec<u8>) -> Vec<u8> {
    if bytes.len() == 32 {
        let mut out = Vec::with_capacity(33);
        out.push(0x05);
        out.extend_from_slice(&bytes);
        return out;
    }

    bytes
}

#[derive(Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotKeyPair {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub public: Vec<u8>,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub private: Vec<u8>,
}

#[derive(Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotPreKey {
    pub id: u32,
    pub key_pair: SnapshotKeyPair,
}

#[derive(Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotSignedPreKey {
    pub id: u32,
    pub key_pair: SnapshotKeyPair,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub signature: Vec<u8>,
}

/// Everything an operation may read. Anything absent does not exist as far as
/// the operation is concerned.
#[derive(Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct SignalSnapshot {
    pub identity: SnapshotKeyPair,
    pub registration_id: u32,
    #[tsify(optional, type = "Uint8Array")]
    #[serde(default)]
    pub session: Option<serde_bytes::ByteBuf>,
    #[tsify(optional, type = "Uint8Array")]
    #[serde(default)]
    pub peer_identity: Option<serde_bytes::ByteBuf>,
    #[serde(default)]
    pub pre_keys: Vec<SnapshotPreKey>,
    #[serde(default)]
    pub signed_pre_keys: Vec<SnapshotSignedPreKey>,
    #[tsify(optional, type = "Uint8Array")]
    #[serde(default)]
    pub sender_key: Option<serde_bytes::ByteBuf>,
}

/// What to write back. Every field is optional on purpose: absent means the
/// operation did not touch that record, so the caller must not rewrite it.
#[derive(Serialize, Tsify, Default)]
#[serde(rename_all = "camelCase")]
pub struct SignalChanges {
    #[tsify(optional, type = "Uint8Array")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session: Option<serde_bytes::ByteBuf>,
    /// The peer's identity changed, so the session built on the old one is void:
    /// delete the session row and do not write `session`.
    pub session_cleared: bool,
    #[tsify(optional, type = "Uint8Array")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub identity: Option<serde_bytes::ByteBuf>,
    /// A one-time pre-key this operation consumed. Delete it together with the
    /// session write, never before — see the core's `consumed_prekey_id` note.
    #[tsify(optional)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub removed_pre_key_id: Option<u32>,
    #[tsify(optional, type = "Uint8Array")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sender_key: Option<serde_bytes::ByteBuf>,
}

impl From<SnapshotChanges> for SignalChanges {
    fn from(c: SnapshotChanges) -> Self {
        Self {
            session: c.session.map(serde_bytes::ByteBuf::from),
            session_cleared: c.session_cleared,
            identity: c.identity.map(serde_bytes::ByteBuf::from),
            removed_pre_key_id: c.removed_pre_key,
            sender_key: c.sender_key.map(serde_bytes::ByteBuf::from),
        }
    }
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct DecryptOutput {
    #[tsify(type = "Uint8Array")]
    pub plaintext: serde_bytes::ByteBuf,
    pub changes: SignalChanges,
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct EncryptOutput {
    #[tsify(type = "Uint8Array")]
    pub ciphertext: serde_bytes::ByteBuf,
    /// libsignal message type: 3 = prekey message, 2 = whisper message.
    pub message_type: u8,
    pub changes: SignalChanges,
}

fn build_store(snapshot: SignalSnapshot) -> Result<SnapshotStore, JsValue> {
    let identity_public = with_prefix(snapshot.identity.public);
    let identity_key = IdentityKey::try_from(identity_public.as_slice())
        .map_err(|e| err("snapshot.identity.public", e))?;
    let identity_private = PrivateKey::deserialize(&snapshot.identity.private)
        .map_err(|e| err("snapshot.identity.private", e))?;

    let store = SnapshotStore::new(
        IdentityKeyPair::new(identity_key, identity_private),
        snapshot.registration_id,
    );

    if let Some(bytes) = snapshot.session {
        let record =
            SessionRecord::deserialize(bytes.as_ref()).map_err(|e| err("snapshot.session", e))?;
        store.with_session(record);
    }

    if let Some(bytes) = snapshot.peer_identity {
        store.with_peer_identity_bytes(with_prefix(bytes.into_vec()));
    }

    for pre_key in snapshot.pre_keys {
        let pair = KeyPair::from_public_and_private(
            &with_prefix(pre_key.key_pair.public),
            &pre_key.key_pair.private,
        )
        .map_err(|e| err("snapshot.preKeys", e))?;
        store.with_pre_key(
            pre_key.id,
            PreKeyRecord::new(PreKeyId::from(pre_key.id), &pair),
        );
    }

    for signed in snapshot.signed_pre_keys {
        let pair = KeyPair::from_public_and_private(
            &with_prefix(signed.key_pair.public),
            &signed.key_pair.private,
        )
        .map_err(|e| err("snapshot.signedPreKeys", e))?;
        store.with_signed_pre_key(
            signed.id,
            SignedPreKeyRecord::new(
                SignedPreKeyId::from(signed.id),
                Timestamp::from_epoch_millis(0),
                &pair,
                &signed.signature,
            ),
        );
    }

    if let Some(bytes) = snapshot.sender_key {
        let record = SenderKeyRecord::deserialize(bytes.as_ref())
            .map_err(|e| err("snapshot.senderKey", e))?;
        store
            .with_sender_key(record)
            .map_err(|e| err("snapshot.senderKey", e))?;
    }

    Ok(store)
}

#[wasm_bindgen(js_name = decryptWhisperWithSnapshot)]
pub async fn decrypt_whisper_with_snapshot(
    snapshot: SignalSnapshot,
    address: &ProtocolAddress,
    ciphertext: &[u8],
) -> Result<DecryptOutput, JsValue> {
    let store = build_store(snapshot)?;
    let message = SignalMessage::try_from(ciphertext)
        .map_err(|e| err("decryptWhisper: invalid message", e))?;

    let mut sessions = store.clone();
    let mut identities = store.clone();

    let result = message_decrypt_signal(
        &message,
        &address.0,
        &mut sessions,
        &mut identities,
        &mut rand::make_rng::<StdRng>(),
    )
    .await
    .map_err(|e| err("decryptWhisper failed", format!("{e:?}")))?;

    Ok(DecryptOutput {
        plaintext: serde_bytes::ByteBuf::from(result.plaintext),
        changes: store.take_changes().into(),
    })
}

#[wasm_bindgen(js_name = decryptPreKeyWithSnapshot)]
pub async fn decrypt_prekey_with_snapshot(
    snapshot: SignalSnapshot,
    address: &ProtocolAddress,
    ciphertext: &[u8],
) -> Result<DecryptOutput, JsValue> {
    let store = build_store(snapshot)?;
    let message = PreKeySignalMessage::try_from(ciphertext)
        .map_err(|e| err("decryptPreKey: invalid message", e))?;

    let mut sessions = store.clone();
    let mut identities = store.clone();
    let mut pre_keys = store.clone();
    let signed_pre_keys = store.clone();

    let result = message_decrypt_prekey(
        &message,
        &address.0,
        &mut sessions,
        &mut identities,
        &mut pre_keys,
        &signed_pre_keys,
        &mut rand::make_rng::<StdRng>(),
        UsePQRatchet::No,
    )
    .await
    .map_err(|e| err("decryptPreKey failed", format!("{e:?}")))?;

    // The core reports the consumed pre-key instead of deleting it, so the
    // caller can drop it in the same write that makes the session durable. Only
    // overwrite when it names one: the store records the same effect if the
    // core ever removes the key itself, and that must not be dropped here.
    let mut changes: SignalChanges = store.take_changes().into();
    if let Some(id) = result.consumed_prekey_id {
        changes.removed_pre_key_id = Some(u32::from(id));
    }

    Ok(DecryptOutput {
        plaintext: serde_bytes::ByteBuf::from(result.plaintext),
        changes,
    })
}

#[wasm_bindgen(js_name = encryptWithSnapshot)]
pub async fn encrypt_with_snapshot(
    snapshot: SignalSnapshot,
    address: &ProtocolAddress,
    plaintext: &[u8],
) -> Result<EncryptOutput, JsValue> {
    let store = build_store(snapshot)?;

    let mut sessions = store.clone();
    let mut identities = store.clone();

    let message = message_encrypt(plaintext, &address.0, &mut sessions, &mut identities)
        .await
        .map_err(|e| err("encrypt failed", format!("{e:?}")))?;

    let message_type = message.message_type() as u8;
    let ciphertext = message.serialize().to_vec();

    Ok(EncryptOutput {
        ciphertext: serde_bytes::ByteBuf::from(ciphertext),
        message_type,
        changes: store.take_changes().into(),
    })
}

/// A peer's published bundle, as the server hands it over.
#[derive(Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotBundlePreKey {
    pub key_id: u32,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub public_key: Vec<u8>,
}

#[derive(Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotBundleSignedPreKey {
    pub key_id: u32,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub public_key: Vec<u8>,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub signature: Vec<u8>,
}

#[derive(Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotBundle {
    pub registration_id: u32,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub identity_key: Vec<u8>,
    #[tsify(optional)]
    #[serde(default)]
    pub pre_key: Option<SnapshotBundlePreKey>,
    pub signed_pre_key: SnapshotBundleSignedPreKey,
}

#[derive(Serialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct BundleOutput {
    pub changes: SignalChanges,
}

/// Builds an outgoing session from a peer bundle. Same contract as the rest of
/// this module: nothing is written, everything comes back in `changes`.
#[wasm_bindgen(js_name = processBundleWithSnapshot)]
pub async fn process_bundle_with_snapshot(
    snapshot: SignalSnapshot,
    address: &ProtocolAddress,
    bundle: SnapshotBundle,
) -> Result<BundleOutput, JsValue> {
    let store = build_store(snapshot)?;

    let pre_key = bundle
        .pre_key
        .map(|pk| {
            CorePublicKey::deserialize(&pk.public_key)
                .map(|key| (pk.key_id.into(), key))
                .map_err(|e| err("bundle.preKey", e))
        })
        .transpose()?;

    let signed_public = CorePublicKey::deserialize(&bundle.signed_pre_key.public_key)
        .map_err(|e| err("bundle.signedPreKey", e))?;
    let identity_key =
        IdentityKey::decode(&bundle.identity_key).map_err(|e| err("bundle.identityKey", e))?;

    let core_bundle = PreKeyBundle::new(
        bundle.registration_id,
        address.0.device_id(),
        pre_key,
        bundle.signed_pre_key.key_id.into(),
        signed_public,
        bundle.signed_pre_key.signature,
        identity_key,
    )
    .map_err(|e| err("bundle", e))?;

    let mut sessions = store.clone();
    let mut identities = store.clone();

    process_prekey_bundle(
        &address.0,
        &mut sessions,
        &mut identities,
        &core_bundle,
        &mut rand::make_rng::<StdRng>(),
        UsePQRatchet::No,
    )
    .await
    .map_err(|e| err("processBundle failed", format!("{e:?}")))?;

    Ok(BundleOutput {
        changes: store.take_changes().into(),
    })
}
