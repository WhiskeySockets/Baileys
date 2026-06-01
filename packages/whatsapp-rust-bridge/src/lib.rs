pub mod appstate;
#[cfg(feature = "audio")]
pub mod audio;
pub mod binary;
pub mod crypto;
pub mod curve;
pub mod group_cipher;
pub mod group_types;
#[cfg(feature = "image")]
pub mod image_utils;
pub mod key_helper;
pub mod logger;
pub mod noise_session;
pub mod protocol_address;
pub mod sender_key_name;
pub mod session_builder;
pub mod session_cipher;
pub mod session_record;
#[cfg(feature = "sticker")]
pub mod sticker_metadata;
pub mod storage_adapter;

// Re-export WhatsApp protocol constants for JS usage
use js_sys::Uint8Array;
use serde::Serialize;
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

/// Returns the WhatsApp connection header (WA_CONN_HEADER).
/// This is the 4-byte header sent at the start of a WebSocket connection.
#[wasm_bindgen(js_name = getWAConnHeader)]
pub fn get_wa_conn_header() -> Uint8Array {
    let result = Uint8Array::new_with_length(4);
    result.copy_from(&wacore_binary::consts::WA_CONN_HEADER);
    result
}

/// Enabled features in this build.
/// Use this to check feature availability at runtime before calling feature-gated functions.
#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct EnabledFeatures {
    /// Audio processing support (waveform generation, duration detection)
    pub audio: bool,
    /// Image processing support (thumbnails, profile pictures, format conversion)
    pub image: bool,
    /// Sticker metadata support (WebP EXIF for WhatsApp stickers)
    pub sticker: bool,
}

/// Returns which optional features are enabled in this build.
/// Use this to conditionally call feature-gated functions.
#[wasm_bindgen(js_name = getEnabledFeatures)]
pub fn get_enabled_features() -> EnabledFeatures {
    EnabledFeatures {
        audio: cfg!(feature = "audio"),
        image: cfg!(feature = "image"),
        sticker: cfg!(feature = "sticker"),
    }
}
