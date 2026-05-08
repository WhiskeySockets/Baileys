use js_sys::Uint8Array;
use rand::{TryRngCore, rngs::OsRng};
use wasm_bindgen::prelude::*;

use crate::group_types::SenderKeyDistributionMessage;
use crate::protocol_address::ProtocolAddress;
use crate::sender_key_name::SenderKeyName;
use crate::storage_adapter::{JsStorageAdapter, SignalStorage};
use wacore_libsignal::protocol::{
    create_sender_key_distribution_message, group_decrypt, group_encrypt,
    process_sender_key_distribution_message,
};

fn map_err(e: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&e.to_string())
}

#[wasm_bindgen(js_name = GroupCipher)]
pub struct GroupCipher {
    storage_adapter: JsStorageAdapter,
    sender_key_name: SenderKeyName,
}

#[wasm_bindgen(js_class = GroupCipher)]
impl GroupCipher {
    #[wasm_bindgen(constructor)]
    pub fn new(storage: SignalStorage, group_id: String, sender: &ProtocolAddress) -> Self {
        Self {
            storage_adapter: JsStorageAdapter::new(storage),
            sender_key_name: SenderKeyName::new(group_id, sender),
        }
    }

    pub async fn encrypt(&mut self, plaintext: &[u8]) -> Result<Uint8Array, JsValue> {
        let sender_key_message = group_encrypt(
            &mut self.storage_adapter,
            &self.sender_key_name.0,
            plaintext,
            &mut OsRng.unwrap_err(),
        )
        .await
        .map_err(map_err)?;

        Ok(Uint8Array::from(sender_key_message.serialized()))
    }

    pub async fn decrypt(&mut self, ciphertext: &[u8]) -> Result<Uint8Array, JsValue> {
        let plaintext = group_decrypt(
            ciphertext,
            &mut self.storage_adapter,
            &self.sender_key_name.0,
        )
        .await
        .map_err(map_err)?;

        Ok(Uint8Array::from(plaintext.as_slice()))
    }
}

#[wasm_bindgen(js_name = GroupSessionBuilder)]
pub struct GroupSessionBuilder {
    storage_adapter: JsStorageAdapter,
}

#[wasm_bindgen(js_class = GroupSessionBuilder)]
impl GroupSessionBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(storage: SignalStorage) -> Self {
        Self {
            storage_adapter: JsStorageAdapter::new(storage),
        }
    }

    #[wasm_bindgen(js_name = process)]
    pub async fn process(
        &mut self,
        sender_key_name: &SenderKeyName,
        skdm: &SenderKeyDistributionMessage,
    ) -> Result<(), JsValue> {
        process_sender_key_distribution_message(
            &sender_key_name.0,
            &skdm.0,
            &mut self.storage_adapter,
        )
        .await
        .map_err(map_err)
    }

    pub async fn create(
        &mut self,
        sender_key_name: &SenderKeyName,
    ) -> Result<SenderKeyDistributionMessage, JsValue> {
        let core_skdm = create_sender_key_distribution_message(
            &sender_key_name.0,
            &mut self.storage_adapter,
            &mut OsRng.unwrap_err(),
        )
        .await
        .map_err(map_err)?;

        Ok(SenderKeyDistributionMessage(core_skdm))
    }
}
