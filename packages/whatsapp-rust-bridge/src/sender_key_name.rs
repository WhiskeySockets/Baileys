use crate::protocol_address::ProtocolAddress;
use std::fmt;
use wacore_libsignal::store::sender_key_name::SenderKeyName as CoreSenderKeyName;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = SenderKeyName)]
pub struct SenderKeyName(pub(crate) CoreSenderKeyName);

impl fmt::Display for SenderKeyName {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}::{}", self.0.group_id(), self.0.sender_id())
    }
}

#[wasm_bindgen(js_class = SenderKeyName)]
impl SenderKeyName {
    #[wasm_bindgen(constructor)]
    pub fn new(group_id: String, sender: &ProtocolAddress) -> Self {
        let sender_id = format!("{}::{}", sender.0.name(), sender.0.device_id());
        Self(CoreSenderKeyName::new(group_id, sender_id))
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string_js(&self) -> String {
        self.to_string()
    }
}
