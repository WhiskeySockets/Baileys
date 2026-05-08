use curve25519_dalek::{Scalar, constants::ED25519_BASEPOINT_TABLE};
use js_sys::Uint8Array;
use rand::{TryRngCore, rngs::OsRng};
use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wacore_libsignal::{
    core::curve::{
        KeyPair as CoreKeyPair, PrivateKey as CorePrivateKey, PublicKey as CorePublicKey,
    },
    protocol::CurveError,
};
use wasm_bindgen::prelude::*;

/// A cryptographic key pair containing public and private keys
#[derive(Debug, Clone, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct KeyPair {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub pub_key: Vec<u8>,
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub priv_key: Vec<u8>,
}

#[wasm_bindgen(js_name = generateKeyPair)]
pub fn generate_key_pair() -> KeyPair {
    let pair = CoreKeyPair::generate(&mut OsRng.unwrap_err());

    KeyPair {
        pub_key: pair.public_key.serialize().to_vec(),
        priv_key: pair.private_key.serialize().to_vec(),
    }
}

fn map_err(err: CurveError) -> JsValue {
    match &err {
        CurveError::BadKeyLength(_, 0) => JsValue::from_str("Invalid private key type"),
        CurveError::BadKeyLength(_, len) if *len != 32 => {
            JsValue::from_str("Incorrect private key length")
        }
        _ => JsValue::from_str(&err.to_string()),
    }
}

#[inline(always)]
fn parse_private_key(bytes: &[u8]) -> Result<CorePrivateKey, JsValue> {
    CorePrivateKey::deserialize(bytes).map_err(map_err)
}

#[inline(always)]
fn parse_public_key(bytes: &[u8]) -> Result<CorePublicKey, JsValue> {
    match bytes.len() {
        33 if bytes[0] == 0x05 => CorePublicKey::deserialize(bytes).map_err(map_err),
        32 => {
            let mut key_with_prefix = [0u8; 33];
            key_with_prefix[0] = 0x05;
            key_with_prefix[1..].copy_from_slice(bytes);
            CorePublicKey::deserialize(&key_with_prefix).map_err(map_err)
        }
        len => Err(JsValue::from_str(&format!(
            "Invalid public key length: {}",
            len
        ))),
    }
}

#[wasm_bindgen(js_name = calculateAgreement)]
pub fn calculate_agreement(
    public_key_bytes: &[u8],
    private_key_bytes: &[u8],
) -> Result<Uint8Array, JsValue> {
    let pub_len = public_key_bytes.len();
    if pub_len != 32 && pub_len != 33 {
        return Err(JsValue::from_str("Invalid public key"));
    }
    if private_key_bytes.len() != 32 {
        return Err(JsValue::from_str("Incorrect private key length"));
    }

    let priv_key = parse_private_key(private_key_bytes)?;
    let pub_key = parse_public_key(public_key_bytes)?;
    let secret = priv_key.calculate_agreement(&pub_key).map_err(map_err)?;

    let result = Uint8Array::new_with_length(secret.len() as u32);
    result.copy_from(secret.as_ref());
    Ok(result)
}

#[wasm_bindgen(js_name = calculateSignature)]
pub fn calculate_signature(
    private_key_bytes: &[u8],
    message: &[u8],
) -> Result<Uint8Array, JsValue> {
    let len = private_key_bytes.len();
    if len == 0 {
        return Err(JsValue::from_str("Invalid private key type"));
    }
    if len != 32 {
        return Err(JsValue::from_str("Incorrect private key length"));
    }

    let priv_key = parse_private_key(private_key_bytes)?;
    let signature = priv_key
        .calculate_signature(message, &mut OsRng.unwrap_err())
        .map_err(map_err)?;

    let result = Uint8Array::new_with_length(signature.len() as u32);
    result.copy_from(signature.as_ref());
    Ok(result)
}

#[wasm_bindgen(js_name = verifySignature)]
pub fn verify_signature(
    public_key_bytes: &[u8],
    message: &[u8],
    signature: &[u8],
) -> Result<bool, JsValue> {
    if signature.len() != 64 {
        return Err(JsValue::from_str("Invalid signature"));
    }
    let pub_len = public_key_bytes.len();
    if pub_len != 32 && pub_len != 33 {
        return Err(JsValue::from_str("Invalid public key"));
    }

    let pub_key = parse_public_key(public_key_bytes)?;

    let signature_array: &[u8; 64] = signature
        .try_into()
        .map_err(|_| JsValue::from_str("Signature must be 64 bytes long"))?;

    Ok(pub_key.verify_signature_for_multipart_message(&[message], signature_array))
}

fn derive_signing_public_key(private_key_bytes: &[u8; 32]) -> [u8; 32] {
    let mut clamped_bytes = *private_key_bytes;
    clamped_bytes[0] &= 248;
    clamped_bytes[31] &= 127;
    clamped_bytes[31] |= 64;

    let scalar = Scalar::from_bytes_mod_order(clamped_bytes);
    let public_point = &scalar * ED25519_BASEPOINT_TABLE;
    public_point.compress().to_bytes()
}

#[wasm_bindgen(js_name = getPublicFromPrivateKey)]
pub fn get_public_from_private_key(private_key_bytes: &[u8]) -> Result<Uint8Array, JsValue> {
    let private_key_array: [u8; 32] = private_key_bytes
        .try_into()
        .map_err(|_| JsValue::from_str("Private key must be 32 bytes long"))?;

    let pub_key_bytes = derive_signing_public_key(&private_key_array);

    let mut pub_key_with_prefix = [0u8; 33];
    pub_key_with_prefix[0] = 0x05;
    pub_key_with_prefix[1..].copy_from_slice(&pub_key_bytes);

    let result = Uint8Array::new_with_length(33);
    result.copy_from(&pub_key_with_prefix);
    Ok(result)
}
