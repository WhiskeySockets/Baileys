use img_parts::webp::WebP;
use img_parts::{Bytes, ImageEXIF};
use js_sys::Uint8Array;
use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

/// EXIF header for WhatsApp sticker metadata.
/// This is a minimal TIFF/EXIF structure that WhatsApp uses to store sticker metadata.
///
/// Structure breakdown:
/// - 0x49, 0x49: Little-endian byte order marker ("II")
/// - 0x2A, 0x00: TIFF magic number (42)
/// - 0x08, 0x00, 0x00, 0x00: Offset to first IFD (8 bytes)
/// - 0x01, 0x00: Number of IFD entries (1)
/// - 0x41, 0x57: Tag ID (custom "AW" tag for WhatsApp - 0x5741)
/// - 0x07, 0x00: Type (7 = UNDEFINED/bytes)
/// - 0x00, 0x00, 0x00, 0x00: Count/length (placeholder, updated with actual length)
/// - 0x16, 0x00, 0x00, 0x00: Offset to data (22 bytes = 0x16)
const EXIF_HEADER: [u8; 22] = [
    0x49, 0x49, 0x2A, 0x00, // Little-endian TIFF
    0x08, 0x00, 0x00, 0x00, // Offset to IFD
    0x01, 0x00, // Number of entries
    0x41, 0x57, // Tag ID (WhatsApp custom)
    0x07, 0x00, // Type (UNDEFINED)
    0x00, 0x00, 0x00, 0x00, // Count (to be filled)
    0x16, 0x00, 0x00, 0x00, // Offset to data
];

/// Sticker metadata for WhatsApp stickers.
///
/// This struct is used for both input (when adding metadata) and output (when extracting).
/// TypeScript types are automatically generated from this Rust struct.
#[derive(Debug, Clone, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct StickerMetadata {
    /// Unique pack identifier (auto-generated UUID if not provided)
    #[tsify(optional)]
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub pack_id: String,

    /// Name of the sticker pack (max 128 characters)
    pub pack_name: String,

    /// Publisher/author name (max 128 characters)
    pub publisher: String,

    /// Associated emoji categories
    #[tsify(optional)]
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub emojis: Vec<String>,

    /// Optional Android app store link
    #[tsify(optional)]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub android_app_store_link: Option<String>,

    /// Optional iOS app store link
    #[tsify(optional)]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ios_app_store_link: Option<String>,
}

#[derive(Serialize)]
struct ExifStickerMetadataRef<'a> {
    #[serde(rename = "sticker-pack-id")]
    pack_id: &'a str,
    #[serde(rename = "sticker-pack-name")]
    pack_name: &'a str,
    #[serde(rename = "sticker-pack-publisher")]
    publisher: &'a str,
    #[serde(skip_serializing_if = "<[String]>::is_empty")]
    emojis: &'a [String],
    #[serde(
        skip_serializing_if = "Option::is_none",
        rename = "android-app-store-link"
    )]
    android_app_store_link: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "ios-app-store-link")]
    ios_app_store_link: Option<&'a str>,
}

#[derive(Deserialize)]
struct ExifStickerMetadataOwned {
    #[serde(default, rename = "sticker-pack-id")]
    pack_id: Option<String>,
    #[serde(default, rename = "sticker-pack-name")]
    pack_name: Option<String>,
    #[serde(default, rename = "sticker-pack-publisher")]
    publisher: Option<String>,
    #[serde(default)]
    emojis: Vec<String>,
    #[serde(default, rename = "android-app-store-link")]
    android_app_store_link: Option<String>,
    #[serde(default, rename = "ios-app-store-link")]
    ios_app_store_link: Option<String>,
    #[serde(default, rename = "is-first-party-sticker")]
    _is_first_party: Option<u8>,
    #[serde(default, rename = "is-from-sticker-maker")]
    _is_from_sticker_maker: Option<u8>,
    #[serde(default, rename = "is-avatar-sticker")]
    _is_avatar: Option<u8>,
    #[serde(default, rename = "is-ai-sticker")]
    _is_ai_sticker: Option<u8>,
    #[serde(default, rename = "sticker-maker-source-type")]
    _sticker_maker_source_type: Option<u8>,
    #[serde(default, rename = "accessibility-text")]
    _accessibility_label: Option<String>,
}

impl From<ExifStickerMetadataOwned> for StickerMetadata {
    fn from(m: ExifStickerMetadataOwned) -> Self {
        Self {
            pack_id: m.pack_id.unwrap_or_default(),
            // Use empty string as default for required fields when reading
            // This matches WhatsApp's behavior where these can be null
            pack_name: m.pack_name.unwrap_or_default(),
            publisher: m.publisher.unwrap_or_default(),
            emojis: m.emojis,
            android_app_store_link: m.android_app_store_link,
            ios_app_store_link: m.ios_app_store_link,
        }
    }
}

impl StickerMetadata {
    /// Ensure pack_id is set, generating a UUID if empty
    #[inline]
    fn ensure_pack_id(&mut self) {
        if self.pack_id.is_empty() {
            self.pack_id = uuid::Uuid::new_v4().to_string();
        }
    }

    /// Build the EXIF data buffer for this metadata.
    /// Uses references to avoid cloning and pre-allocated capacity to avoid reallocations.
    #[inline]
    fn build_exif(&self) -> Result<Vec<u8>, serde_json::Error> {
        let exif_meta = ExifStickerMetadataRef {
            pack_id: &self.pack_id,
            pack_name: &self.pack_name,
            publisher: &self.publisher,
            emojis: &self.emojis,
            android_app_store_link: self.android_app_store_link.as_deref(),
            ios_app_store_link: self.ios_app_store_link.as_deref(),
        };
        let json = serde_json::to_vec(&exif_meta)?;
        let json_len = json.len() as u32;

        let mut exif = Vec::with_capacity(EXIF_HEADER.len() + json.len());
        exif.extend_from_slice(&EXIF_HEADER);
        exif.extend_from_slice(&json);

        // Write the JSON length at offset 14 (little-endian u32)
        exif[14..18].copy_from_slice(&json_len.to_le_bytes());

        Ok(exif)
    }
}

/// Check if EXIF data starts with WhatsApp sticker header (TIFF LE + "AW" tag).
#[inline]
fn is_whatsapp_sticker_exif(exif_bytes: &[u8]) -> bool {
    matches!(
        (exif_bytes.get(0..4), exif_bytes.get(10..12)),
        (Some(&[0x49, 0x49, 0x2A, 0x00]), Some(&[0x41, 0x57]))
    )
}

/// Add sticker metadata to a WebP image.
///
/// Embeds WhatsApp-compatible sticker metadata (pack name, author, emojis, etc.)
/// into a WebP image using the EXIF chunk format.
///
/// Works with both static and animated WebP images.
#[wasm_bindgen(js_name = addStickerMetadata)]
pub fn add_sticker_metadata(
    webp_data: &[u8],
    mut metadata: StickerMetadata,
) -> Result<Uint8Array, JsValue> {
    metadata.ensure_pack_id();

    // Parse WebP - img_parts requires owned Bytes
    let mut webp = WebP::from_bytes(Bytes::copy_from_slice(webp_data))
        .map_err(|e| JsValue::from_str(&format!("Invalid WebP: {e}")))?;

    // Build and set EXIF data
    let exif_data = metadata
        .build_exif()
        .map_err(|e| JsValue::from_str(&format!("Failed to serialize metadata: {e}")))?;
    webp.set_exif(Some(Bytes::from(exif_data)));

    // Encode directly to Uint8Array
    let output = webp.encoder().bytes();
    Ok(Uint8Array::from(output.as_ref()))
}

/// Extract sticker metadata from a WebP image.
///
/// Returns the metadata object if present, or undefined if no sticker metadata is found.
/// Returns undefined (not an error) for WebP images with regular camera EXIF data.
#[wasm_bindgen(js_name = getStickerMetadata)]
pub fn get_sticker_metadata(webp_data: &[u8]) -> Result<Option<StickerMetadata>, JsValue> {
    let webp = WebP::from_bytes(Bytes::copy_from_slice(webp_data))
        .map_err(|e| JsValue::from_str(&format!("Invalid WebP: {e}")))?;

    let Some(exif_bytes) = webp.exif() else {
        return Ok(None);
    };

    // Verify this is WhatsApp sticker EXIF, not regular camera EXIF
    if !is_whatsapp_sticker_exif(&exif_bytes) {
        return Ok(None);
    }

    // The EXIF data should have our header followed by JSON
    if exif_bytes.len() <= EXIF_HEADER.len() {
        return Ok(None);
    }

    // Extract JSON from after the header
    let json_bytes = &exif_bytes[EXIF_HEADER.len()..];

    // Try to parse as sticker metadata, return None if it fails
    // (could be malformed or different format)
    let Ok(exif_meta) = serde_json::from_slice::<ExifStickerMetadataOwned>(json_bytes) else {
        return Ok(None);
    };

    Ok(Some(StickerMetadata::from(exif_meta)))
}
