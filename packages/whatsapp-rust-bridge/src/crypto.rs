use hkdf::Hkdf;
use js_sys::Uint8Array;
use md5::Md5;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = md5)]
pub fn md5_hash(buffer: &[u8]) -> Uint8Array {
    let mut hasher = Md5::new();
    hasher.update(buffer);
    let result = hasher.finalize();
    let arr = Uint8Array::new_with_length(16);
    arr.copy_from(&result);
    arr
}

#[derive(Debug, Clone, Serialize, Deserialize, Tsify, Default)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase", default)]
pub struct HkdfInfo {
    #[tsify(type = "Uint8Array | undefined")]
    #[serde(with = "serde_bytes")]
    pub salt: Option<Vec<u8>>,
    pub info: Option<String>,
}

#[wasm_bindgen(js_name = hkdf)]
pub fn hkdf(buffer: &[u8], expanded_length: usize, info: HkdfInfo) -> Result<Uint8Array, JsValue> {
    let salt_bytes = info.salt.as_deref();
    let info_bytes = info.info.as_deref().map(|s| s.as_bytes()).unwrap_or(&[]);

    let hk = Hkdf::<Sha256>::new(salt_bytes, buffer);
    let mut okm = vec![0u8; expanded_length];

    hk.expand(info_bytes, &mut okm)
        .map_err(|_| JsValue::from_str("HKDF expansion failed"))?;

    let arr = Uint8Array::new_with_length(okm.len() as u32);
    arr.copy_from(&okm);
    Ok(arr)
}
