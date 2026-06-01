use js_sys::{JsString, Number};
use std::fmt;
use wacore_libsignal::core::{DeviceId, ProtocolAddress as CoreProtocolAddress};
use wasm_bindgen::prelude::*;

const INVALID_ENCODING: &str = "Invalid address encoding";

#[wasm_bindgen(js_name = ProtocolAddress)]
pub struct ProtocolAddress(pub(crate) CoreProtocolAddress);

impl fmt::Display for ProtocolAddress {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[wasm_bindgen(js_class = ProtocolAddress)]
impl ProtocolAddress {
    #[wasm_bindgen(constructor)]
    pub fn new(id: JsString, device_id: Number) -> Result<ProtocolAddress, JsValue> {
        let id_str = id
            .as_string()
            .ok_or_else(|| JsValue::from_str("id required for addr"))?;

        let device_id_num = device_id
            .as_f64()
            .map(|num| num as u32)
            .ok_or_else(|| JsValue::from_str("number required for deviceId"))?;

        if id_str.contains('.') {
            return Err(JsValue::from_str("encoded addr detected"));
        }

        Ok(ProtocolAddress(CoreProtocolAddress::new(
            id_str,
            DeviceId::from(device_id_num),
        )))
    }

    #[wasm_bindgen(js_name = from)]
    pub fn from_string(encoded: JsString) -> Result<ProtocolAddress, JsValue> {
        let encoded_str = encoded
            .as_string()
            .ok_or_else(|| JsValue::from_str(INVALID_ENCODING))?;

        let mut parts = encoded_str.split('.');
        let id_str = parts
            .next()
            .ok_or_else(|| JsValue::from_str(INVALID_ENCODING))?;
        let device_str = parts
            .next()
            .ok_or_else(|| JsValue::from_str(INVALID_ENCODING))?;

        let device_id_num = device_str
            .parse::<u32>()
            .map_err(|_| JsValue::from_str(INVALID_ENCODING))?;

        Ok(ProtocolAddress(CoreProtocolAddress::new(
            id_str.to_string(),
            DeviceId::from(device_id_num),
        )))
    }

    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.0.name().to_string()
    }

    #[wasm_bindgen(getter, js_name = deviceId)]
    pub fn device_id(&self) -> u32 {
        self.0.device_id().into()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn js_to_string(&self) -> String {
        self.0.to_string()
    }

    pub fn is(&self, other: &ProtocolAddress) -> bool {
        self.0 == other.0
    }
}
