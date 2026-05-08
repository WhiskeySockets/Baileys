use js_sys::Uint8Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use wacore_appstate::{
    ExpandedAppStateKeys as RustExpandedAppStateKeys, LTHash, WAPATCH_INTEGRITY,
    expand_app_state_keys,
};

#[inline]
fn bytes_to_uint8array(bytes: &[u8]) -> Uint8Array {
    let arr = Uint8Array::new_with_length(bytes.len() as u32);
    arr.copy_from(bytes);
    arr
}

#[wasm_bindgen]
pub struct LTHashAntiTampering {
    inner: &'static LTHash,
}

#[wasm_bindgen]
impl LTHashAntiTampering {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: &WAPATCH_INTEGRITY,
        }
    }

    #[wasm_bindgen(js_name = subtractThenAdd)]
    pub fn subtract_then_add(
        &self,
        base: &[u8],
        subtract: Vec<Uint8Array>,
        add: Vec<Uint8Array>,
    ) -> Result<Uint8Array, JsValue> {
        if base.len() != 128 {
            return Err(JsValue::from_str(&format!(
                "Base hash must be 128 bytes, got {}",
                base.len()
            )));
        }

        // Pre-allocate with known capacity to avoid reallocations
        let mut subtract_vecs: Vec<Vec<u8>> = Vec::with_capacity(subtract.len());
        for arr in &subtract {
            let len = arr.length() as usize;
            let mut vec = vec![0u8; len];
            arr.copy_to(&mut vec);
            subtract_vecs.push(vec);
        }

        let mut add_vecs: Vec<Vec<u8>> = Vec::with_capacity(add.len());
        for arr in &add {
            let len = arr.length() as usize;
            let mut vec = vec![0u8; len];
            arr.copy_to(&mut vec);
            add_vecs.push(vec);
        }

        let result = self
            .inner
            .subtract_then_add(base, &subtract_vecs, &add_vecs);

        Ok(bytes_to_uint8array(&result))
    }
}

impl Default for LTHashAntiTampering {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct ExpandedAppStateKeys {
    inner: RustExpandedAppStateKeys,
}

#[wasm_bindgen]
impl ExpandedAppStateKeys {
    #[wasm_bindgen(getter, js_name = indexKey)]
    pub fn index_key(&self) -> Uint8Array {
        bytes_to_uint8array(&self.inner.index)
    }

    #[wasm_bindgen(getter, js_name = valueEncryptionKey)]
    pub fn value_encryption_key(&self) -> Uint8Array {
        bytes_to_uint8array(&self.inner.value_encryption)
    }

    #[wasm_bindgen(getter, js_name = valueMacKey)]
    pub fn value_mac_key(&self) -> Uint8Array {
        bytes_to_uint8array(&self.inner.value_mac)
    }

    #[wasm_bindgen(getter, js_name = snapshotMacKey)]
    pub fn snapshot_mac_key(&self) -> Uint8Array {
        bytes_to_uint8array(&self.inner.snapshot_mac)
    }

    #[wasm_bindgen(getter, js_name = patchMacKey)]
    pub fn patch_mac_key(&self) -> Uint8Array {
        bytes_to_uint8array(&self.inner.patch_mac)
    }
}

#[wasm_bindgen(js_name = expandAppStateKeys)]
pub fn expand_app_state_keys_wasm(key_data: &[u8]) -> ExpandedAppStateKeys {
    let inner = expand_app_state_keys(key_data);
    ExpandedAppStateKeys { inner }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct LTHashState {
    version: u64,
    #[serde(with = "serde_bytes")]
    hash: Vec<u8>,
    #[serde(skip)]
    index_value_map: std::collections::HashMap<String, Vec<u8>>,
}

#[wasm_bindgen]
impl LTHashState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            version: 0,
            hash: vec![0u8; 128],
            index_value_map: std::collections::HashMap::new(),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn version(&self) -> u64 {
        self.version
    }

    #[wasm_bindgen(setter)]
    pub fn set_version(&mut self, version: u64) {
        self.version = version;
    }

    #[wasm_bindgen(getter)]
    pub fn hash(&self) -> Uint8Array {
        bytes_to_uint8array(&self.hash)
    }

    #[wasm_bindgen(setter)]
    pub fn set_hash(&mut self, hash: Vec<u8>) {
        if hash.len() != 128 {
            wasm_bindgen::throw_str(&format!("Hash must be 128 bytes, got {}", hash.len()));
        }
        self.hash = hash;
    }

    #[wasm_bindgen(js_name = getValueMac)]
    pub fn get_value_mac(&self, index_mac_base64: &str) -> Option<Uint8Array> {
        self.index_value_map
            .get(index_mac_base64)
            .map(|v| bytes_to_uint8array(v))
    }

    #[wasm_bindgen(js_name = setValueMac)]
    pub fn set_value_mac(&mut self, index_mac_base64: &str, value_mac: Vec<u8>) {
        self.index_value_map
            .insert(index_mac_base64.to_string(), value_mac);
    }

    #[wasm_bindgen(js_name = deleteValueMac)]
    pub fn delete_value_mac(&mut self, index_mac_base64: &str) -> bool {
        self.index_value_map.remove(index_mac_base64).is_some()
    }

    #[wasm_bindgen(js_name = hasValueMac)]
    pub fn has_value_mac(&self, index_mac_base64: &str) -> bool {
        self.index_value_map.contains_key(index_mac_base64)
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_state(&self) -> LTHashState {
        self.clone()
    }
}

impl Default for LTHashState {
    fn default() -> Self {
        Self::new()
    }
}

fn validate_key_length(key: &[u8], expected: usize, name: &str) -> Result<(), JsValue> {
    if key.len() != expected {
        return Err(JsValue::from_str(&format!(
            "{} must be {} bytes, got {}",
            name,
            expected,
            key.len()
        )));
    }
    Ok(())
}

fn create_mac(
    algo: &str,
    key: &[u8],
) -> Result<wacore_libsignal::crypto::CryptographicMac, JsValue> {
    wacore_libsignal::crypto::CryptographicMac::new(algo, key)
        .map_err(|e| JsValue::from_str(&format!("Failed to create MAC: {}", e)))
}

#[wasm_bindgen(js_name = generateContentMac)]
pub fn generate_content_mac(
    operation: u8,
    data: &[u8],
    key_id: &[u8],
    key: &[u8],
) -> Result<Uint8Array, JsValue> {
    validate_key_length(key, 32, "Value MAC key")?;

    let op_byte = [operation];
    let key_data_length = ((key_id.len() + 1) as u64).to_be_bytes();

    let mut mac = create_mac("HmacSha512", key)?;
    mac.update(&op_byte);
    mac.update(key_id);
    mac.update(data);
    mac.update(&key_data_length);
    let mac_full = mac.finalize();

    Ok(bytes_to_uint8array(&mac_full[..32]))
}

#[wasm_bindgen(js_name = generateSnapshotMac)]
pub fn generate_snapshot_mac(
    lt_hash: &[u8],
    version: u64,
    name: &str,
    key: &[u8],
) -> Result<Uint8Array, JsValue> {
    validate_key_length(lt_hash, 128, "LT-Hash")?;
    validate_key_length(key, 32, "Snapshot MAC key")?;

    let mut mac = create_mac("HmacSha256", key)?;
    mac.update(lt_hash);
    mac.update(&version.to_be_bytes());
    mac.update(name.as_bytes());

    Ok(bytes_to_uint8array(&mac.finalize()))
}

#[wasm_bindgen(js_name = generatePatchMac)]
pub fn generate_patch_mac(
    snapshot_mac: &[u8],
    value_macs: Vec<Uint8Array>,
    version: u64,
    name: &str,
    key: &[u8],
) -> Result<Uint8Array, JsValue> {
    validate_key_length(key, 32, "Patch MAC key")?;

    let mut mac = create_mac("HmacSha256", key)?;
    mac.update(snapshot_mac);

    // Use stack buffer for value MACs (typically 32 bytes) to avoid heap allocations
    let mut value_mac_buf = [0u8; 64];
    for value_mac in &value_macs {
        let len = value_mac.length() as usize;
        if len <= 64 {
            value_mac.copy_to(&mut value_mac_buf[..len]);
            mac.update(&value_mac_buf[..len]);
        } else {
            let mut vec = vec![0u8; len];
            value_mac.copy_to(&mut vec);
            mac.update(&vec);
        }
    }

    mac.update(&version.to_be_bytes());
    mac.update(name.as_bytes());

    Ok(bytes_to_uint8array(&mac.finalize()))
}

#[wasm_bindgen(js_name = generateIndexMac)]
pub fn generate_index_mac(index_bytes: &[u8], key: &[u8]) -> Result<Uint8Array, JsValue> {
    validate_key_length(key, 32, "Index key")?;

    let mut mac = create_mac("HmacSha256", key)?;
    mac.update(index_bytes);

    Ok(bytes_to_uint8array(&mac.finalize()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lt_hash_new() {
        let lt_hash = LTHashAntiTampering::new();
        assert_eq!(lt_hash.inner.hkdf_size, 128);
    }

    #[test]
    fn test_expand_app_state_keys() {
        let key = [7u8; 32];
        let expanded = expand_app_state_keys_wasm(&key);

        assert_eq!(expanded.index_key().length(), 32);
        assert_eq!(expanded.value_encryption_key().length(), 32);
        assert_eq!(expanded.value_mac_key().length(), 32);
        assert_eq!(expanded.snapshot_mac_key().length(), 32);
        assert_eq!(expanded.patch_mac_key().length(), 32);
    }

    #[test]
    fn test_lt_hash_state_new() {
        let state = LTHashState::new();
        assert_eq!(state.version(), 0);
        assert_eq!(state.hash.len(), 128);
    }
}
