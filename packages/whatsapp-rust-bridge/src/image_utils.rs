use image::codecs::jpeg::JpegEncoder;
use image::imageops::FilterType;
use image::{DynamicImage, GenericImageView};
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

const JPEG_QUALITY: u8 = 50;

/// Original image dimensions
#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ImageDimensions {
    pub width: u32,
    pub height: u32,
}

/// Result of extracting an image thumbnail
#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ImageThumbResult {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub buffer: Vec<u8>,
    pub original: ImageDimensions,
}

/// Result of generating a profile picture
#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ProfilePictureResult {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub img: Vec<u8>,
}

#[wasm_bindgen(js_name = extractImageThumb)]
pub fn extract_image_thumb(image_data: &[u8], width: u32) -> Result<ImageThumbResult, JsValue> {
    if width == 0 {
        return Err(JsValue::from_str("width must be greater than zero"));
    }

    let img = load_image(image_data)?;
    let (orig_width, orig_height) = img.dimensions();
    let resized = img.resize(width, width, FilterType::Triangle);
    let jpeg = encode_jpeg(&resized)?;

    Ok(ImageThumbResult {
        buffer: jpeg,
        original: ImageDimensions {
            width: orig_width,
            height: orig_height,
        },
    })
}

#[wasm_bindgen(js_name = generateProfilePicture)]
pub fn generate_profile_picture(
    image_data: &[u8],
    target_width: u32,
) -> Result<ProfilePictureResult, JsValue> {
    if target_width == 0 {
        return Err(JsValue::from_str("target width must be greater than zero"));
    }

    let resized =
        load_image(image_data)?.resize_to_fill(target_width, target_width, FilterType::Triangle);
    let jpeg = encode_jpeg(&resized)?;

    Ok(ProfilePictureResult { img: jpeg })
}

fn load_image(image_data: &[u8]) -> Result<DynamicImage, JsValue> {
    image::load_from_memory(image_data)
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {e}")))
}

fn encode_jpeg(image: &DynamicImage) -> Result<Vec<u8>, JsValue> {
    encode_jpeg_quality(image, JPEG_QUALITY)
}

/// Output format for image processing
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "lowercase")]
pub enum ImageFormat {
    Jpeg,
    Png,
    WebP,
}

/// Options for image processing
#[derive(Debug, Clone, Serialize, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct ProcessImageOptions {
    /// Target width (optional, maintains aspect ratio if only width is set)
    pub width: Option<u32>,
    /// Target height (optional, maintains aspect ratio if only height is set)
    pub height: Option<u32>,
    /// Output format
    pub format: ImageFormat,
    /// Quality for lossy formats (JPEG, WebP). 1-100, default 80
    pub quality: Option<u8>,
}

/// Result of image processing
#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ProcessImageResult {
    #[tsify(type = "Uint8Array")]
    #[serde(with = "serde_bytes")]
    pub buffer: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

/// Get image dimensions without full decoding
#[wasm_bindgen(js_name = getImageDimensions)]
pub fn get_image_dimensions(image_data: &[u8]) -> Result<ImageDimensions, JsValue> {
    let img = load_image(image_data)?;
    let (width, height) = img.dimensions();
    Ok(ImageDimensions { width, height })
}

/// Convert any image to WebP format
#[wasm_bindgen(js_name = convertToWebP)]
pub fn convert_to_webp(image_data: Vec<u8>) -> Result<js_sys::Uint8Array, JsValue> {
    let img = load_image(&image_data)?;
    let webp = encode_format(&img, image::ImageFormat::WebP)?;
    Ok(js_sys::Uint8Array::from(webp.as_slice()))
}

/// Process image with resize and format conversion options
#[wasm_bindgen(js_name = processImage)]
pub fn process_image(
    image_data: Vec<u8>,
    options: ProcessImageOptions,
) -> Result<ProcessImageResult, JsValue> {
    let img = load_image(&image_data)?;

    // Resize if dimensions are specified
    let processed = match (options.width, options.height) {
        (Some(w), Some(h)) => {
            // Both dimensions specified - resize to exact size
            img.resize_exact(w, h, FilterType::Triangle)
        }
        (Some(w), None) => {
            // Only width specified - maintain aspect ratio
            img.resize(w, u32::MAX, FilterType::Triangle)
        }
        (None, Some(h)) => {
            // Only height specified - maintain aspect ratio
            img.resize(u32::MAX, h, FilterType::Triangle)
        }
        (None, None) => {
            // No resize, just format conversion
            img
        }
    };

    let (width, height) = processed.dimensions();
    let quality = options.quality.unwrap_or(80).clamp(1, 100);

    let buffer = match options.format {
        ImageFormat::Jpeg => encode_jpeg_quality(&processed, quality)?,
        ImageFormat::Png => encode_format(&processed, image::ImageFormat::Png)?,
        ImageFormat::WebP => encode_format(&processed, image::ImageFormat::WebP)?,
    };

    Ok(ProcessImageResult {
        buffer,
        width,
        height,
    })
}

fn encode_jpeg_quality(image: &DynamicImage, quality: u8) -> Result<Vec<u8>, JsValue> {
    let mut buffer = Cursor::new(Vec::new());
    let mut encoder = JpegEncoder::new_with_quality(&mut buffer, quality);
    encoder
        .encode_image(image)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode JPEG: {e}")))?;
    Ok(buffer.into_inner())
}

fn encode_format(image: &DynamicImage, format: image::ImageFormat) -> Result<Vec<u8>, JsValue> {
    let mut buffer = Vec::new();
    image
        .write_to(&mut Cursor::new(&mut buffer), format)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {e}")))?;
    Ok(buffer)
}
