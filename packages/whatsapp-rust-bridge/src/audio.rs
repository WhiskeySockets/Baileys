use js_sys::{ArrayBuffer, Reflect, Uint8Array};
use std::io::Cursor;
use symphonia::core::audio::{AudioBuffer, AudioBufferRef, SampleBuffer, Signal};
use symphonia::core::codecs::{CODEC_TYPE_NULL, Decoder, DecoderOptions};
use symphonia::core::errors::Error;
use symphonia::core::formats::{FormatOptions, FormatReader, Track};
use symphonia::core::io::MediaSourceStream;
use symphonia::core::meta::MetadataOptions;
use symphonia::core::probe::Hint;
use symphonia::core::units::TimeBase;
use wasm_bindgen::{JsCast, prelude::*};
use wasm_bindgen_futures::JsFuture;
use web_sys::{ReadableStream, ReadableStreamDefaultReader};

/// WhatsApp uses 64 buckets for visual waveforms.
const WAVEFORM_SAMPLES: usize = 64;

#[wasm_bindgen(js_name = generateAudioWaveform)]
pub fn generate_audio_waveform(audio_data: Vec<u8>) -> Result<Uint8Array, JsValue> {
    if audio_data.is_empty() {
        return Err(JsValue::from_str("Audio buffer is empty"));
    }

    let DecoderContext {
        mut format,
        mut decoder,
        track_id,
        total_frames,
    } = prepare_decoder(audio_data)?;

    // Pre-allocate bins for direct accumulation (sum, count)
    let mut bins = [(0.0f32, 0u32); WAVEFORM_SAMPLES];

    // Calculate decimation parameters
    let estimated_samples = total_frames.unwrap_or(2_000_000);

    // Balanced approach: moderate packet skipping for speed
    let estimated_packets = (estimated_samples / 1152).max(64) as usize;
    let target_packets = 512;
    let packet_skip = (estimated_packets / target_packets).max(1);

    let mut packet_counter = 0usize;
    let mut total_samples_processed = 0u64;

    loop {
        let packet = match format.next_packet() {
            Ok(packet) => packet,
            Err(Error::IoError(ref e))
                if matches!(
                    e.kind(),
                    std::io::ErrorKind::UnexpectedEof | std::io::ErrorKind::NotFound
                ) =>
            {
                break;
            }
            Err(Error::ResetRequired) => {
                decoder.reset();
                continue;
            }
            Err(e) => {
                return Err(JsValue::from_str(&format!("Audio decode error: {e}")));
            }
        };

        if packet.track_id() != track_id {
            continue;
        }

        // Skip packets for speed while maintaining even distribution
        packet_counter += 1;
        if packet_skip > 1 && !packet_counter.is_multiple_of(packet_skip) {
            continue;
        }

        // Use packet timestamp for accurate position tracking
        let packet_start = packet.ts();

        match decoder.decode(&packet) {
            Ok(audio_buf) => {
                accumulate_to_bins(
                    &audio_buf,
                    &mut bins,
                    packet_start,
                    estimated_samples,
                    &mut total_samples_processed,
                );
            }
            Err(Error::IoError(ref e))
                if matches!(
                    e.kind(),
                    std::io::ErrorKind::UnexpectedEof | std::io::ErrorKind::NotFound
                ) =>
            {
                break;
            }
            Err(Error::DecodeError(_)) => {
                continue;
            }
            Err(Error::ResetRequired) => {
                decoder.reset();
                continue;
            }
            Err(e) => {
                return Err(JsValue::from_str(&format!(
                    "Failed to decode audio frame: {e}"
                )));
            }
        }
    }

    if total_samples_processed == 0 {
        return Err(JsValue::from_str("No audio samples decoded"));
    }

    // Convert bins to final waveform
    let waveform = finalize_waveform(&bins);
    Ok(Uint8Array::from(waveform.as_slice()))
}

/// Accumulate audio samples into waveform bins
#[inline]
fn accumulate_to_bins(
    buffer: &AudioBufferRef<'_>,
    bins: &mut [(f32, u32); WAVEFORM_SAMPLES],
    packet_start: u64,
    estimated_total: u64,
    total_processed: &mut u64,
) {
    // Optimized path for S16 (most common for MP3)
    if let AudioBufferRef::S16(buf) = buffer {
        accumulate_s16(
            buf.as_ref(),
            bins,
            packet_start,
            estimated_total,
            total_processed,
        );
        return;
    }

    // Generic path using SampleBuffer for format conversion
    let spec = buffer.spec();
    let frames = buffer.frames();
    let channel_count = spec.channels.count();

    if frames == 0 || channel_count == 0 {
        return;
    }

    // Convert to f32 using SampleBuffer (clone is cheap - just copying references)
    let mut sample_buf = SampleBuffer::<f32>::new(frames as u64, *spec);
    sample_buf.copy_planar_ref(buffer.clone());
    let samples = sample_buf.samples();

    let inv_channels = 1.0f32 / channel_count as f32;
    let bin_count = WAVEFORM_SAMPLES as u64;
    let est_max = estimated_total.max(1);

    for i in 0..frames {
        // Average all channels
        let sample: f32 = (0..channel_count)
            .map(|c| samples[c * frames + i])
            .sum::<f32>()
            * inv_channels;

        let bin_idx = ((packet_start + i as u64) * bin_count / est_max) as usize;
        let bin_idx = bin_idx.min(WAVEFORM_SAMPLES - 1);
        bins[bin_idx].0 += sample.abs();
        bins[bin_idx].1 += 1;
    }
    *total_processed += frames as u64;
}

/// Optimized path for S16 (most common for MP3)
#[inline]
fn accumulate_s16(
    buffer: &AudioBuffer<i16>,
    bins: &mut [(f32, u32); WAVEFORM_SAMPLES],
    packet_start: u64,
    estimated_total: u64,
    total_processed: &mut u64,
) {
    let channel_count = buffer.spec().channels.count();
    let frames = buffer.frames();
    if frames == 0 || channel_count == 0 {
        return;
    }

    const SCALE: f32 = 1.0 / 32768.0;
    let bin_count = WAVEFORM_SAMPLES as u64;
    let est_max = estimated_total.max(1);

    // Helper to update bin at frame index
    let mut update_bin = |i: usize, sample: f32| {
        let bin_idx = ((packet_start + i as u64) * bin_count / est_max) as usize;
        let bin_idx = bin_idx.min(WAVEFORM_SAMPLES - 1);
        bins[bin_idx].0 += sample;
        bins[bin_idx].1 += 1;
    };

    match channel_count {
        1 => {
            for (i, &sample) in buffer.chan(0).iter().enumerate().take(frames) {
                update_bin(i, (sample as f32 * SCALE).abs());
            }
        }
        2 => {
            let (chan0, chan1) = (buffer.chan(0), buffer.chan(1));
            for i in 0..frames {
                let sample = ((chan0[i] as f32 + chan1[i] as f32) * 0.5 * SCALE).abs();
                update_bin(i, sample);
            }
        }
        _ => {
            let inv_channels = 1.0 / channel_count as f32;
            for i in 0..frames {
                let sum: i32 = (0..channel_count).map(|c| buffer.chan(c)[i] as i32).sum();
                let sample = (sum as f32 * inv_channels * SCALE).abs();
                update_bin(i, sample);
            }
        }
    }

    *total_processed += frames as u64;
}

/// Convert accumulated bins to final waveform (0-100 range)
#[inline]
fn finalize_waveform(bins: &[(f32, u32); WAVEFORM_SAMPLES]) -> Vec<u8> {
    // Calculate averages and find max in single pass
    let averages: Vec<f32> = bins
        .iter()
        .map(
            |(sum, count)| {
                if *count > 0 { sum / *count as f32 } else { 0.0 }
            },
        )
        .collect();

    let max_avg = averages.iter().copied().fold(0.0f32, f32::max);

    if max_avg == 0.0 {
        return vec![0; WAVEFORM_SAMPLES];
    }

    // Normalize to 0-100 range
    let scale = 100.0 / max_avg;
    averages
        .iter()
        .map(|avg| (avg * scale).min(100.0) as u8)
        .collect()
}

#[wasm_bindgen(js_name = getAudioDuration, skip_typescript)]
pub async fn get_audio_duration(input: JsValue) -> Result<f64, JsValue> {
    let audio_bytes = normalize_audio_input(input).await?;
    compute_audio_duration(audio_bytes)
}

#[wasm_bindgen(typescript_custom_section)]
const TS_AUDIO_DURATION: &str = r#"
export type AudioDurationInput =
    | Uint8Array
    | ArrayBuffer
    | ReadableStream<Uint8Array | ArrayBuffer | ArrayBufferView>;

export function getAudioDuration(input: AudioDurationInput): Promise<number>;
"#;

fn compute_audio_duration(audio_data: Vec<u8>) -> Result<f64, JsValue> {
    if audio_data.is_empty() {
        return Err(JsValue::from_str("Audio buffer is empty"));
    }

    // Use Symphonia to probe the format - it parses Xing/VBRI headers for MP3
    let cursor = Cursor::new(audio_data);
    let mss = MediaSourceStream::new(Box::new(cursor), Default::default());

    let probed = symphonia::default::get_probe()
        .format(
            &Hint::new(),
            mss,
            &FormatOptions::default(),
            &MetadataOptions::default(),
        )
        .map_err(|e| JsValue::from_str(&format!("Failed to probe audio format: {e}")))?;

    let mut format = probed.format;

    let track = format
        .tracks()
        .iter()
        .find(|t| t.codec_params.codec != CODEC_TYPE_NULL)
        .cloned()
        .ok_or_else(|| JsValue::from_str("No supported audio track found"))?;

    // Fast path: Use n_frames from track metadata
    // Works for: MP3 (Xing/VBRI headers or CBR estimate), WAV, FLAC, OGG, AAC, etc.
    if let Some(duration) = duration_from_track_metadata(&track) {
        return Ok(duration);
    }

    // Slow path: iterate packets (rare - only for formats without any duration metadata)
    let track_id = track.id;
    let mut stats = DurationAccumulator::default();

    loop {
        let packet = match format.next_packet() {
            Ok(packet) => packet,
            Err(Error::IoError(ref e))
                if matches!(
                    e.kind(),
                    std::io::ErrorKind::UnexpectedEof | std::io::ErrorKind::NotFound
                ) =>
            {
                break;
            }
            Err(Error::ResetRequired) => continue,
            Err(e) => {
                return Err(JsValue::from_str(&format!("Audio decode error: {e}")));
            }
        };

        if packet.track_id() != track_id {
            continue;
        }

        stats.update(packet.ts(), packet.dur());
    }

    let ticks = stats
        .elapsed_ticks()
        .ok_or_else(|| JsValue::from_str("No audio samples decoded"))?;

    convert_ticks_to_seconds(
        ticks,
        track.codec_params.time_base,
        track.codec_params.sample_rate,
    )
    .ok_or_else(|| JsValue::from_str("Missing timing information for audio track"))
}

fn duration_from_track_metadata(track: &Track) -> Option<f64> {
    let codec_params = &track.codec_params;
    let frames = codec_params.n_frames?;

    convert_ticks_to_seconds(frames, codec_params.time_base, codec_params.sample_rate)
}

#[inline]
fn convert_ticks_to_seconds(
    ticks: u64,
    time_base: Option<TimeBase>,
    sample_rate: Option<u32>,
) -> Option<f64> {
    if ticks == 0 {
        return None;
    }

    if let Some(tb) = time_base {
        let time = tb.calc_time(ticks);
        return Some(time.seconds as f64 + time.frac);
    }

    sample_rate.map(|rate| ticks as f64 / rate as f64)
}

#[derive(Default)]
struct DurationAccumulator {
    first_ts: Option<u64>,
    max_end_ts: u64,
}

impl DurationAccumulator {
    #[inline]
    fn update(&mut self, ts: u64, dur: u64) {
        if self.first_ts.is_none() {
            self.first_ts = Some(ts);
        }

        let end = ts.saturating_add(dur);
        if end > self.max_end_ts {
            self.max_end_ts = end;
        }
    }

    #[inline]
    fn elapsed_ticks(&self) -> Option<u64> {
        let start = self.first_ts?;
        Some(self.max_end_ts.saturating_sub(start))
    }
}

async fn normalize_audio_input(input: JsValue) -> Result<Vec<u8>, JsValue> {
    // Handle Uint8Array and ArrayBuffer (both can be wrapped with Uint8Array)
    if input.is_instance_of::<Uint8Array>() || input.is_instance_of::<ArrayBuffer>() {
        return Ok(copy_uint8_array(&Uint8Array::new(&input)));
    }

    if input.is_instance_of::<ReadableStream>() {
        return read_stream(input.unchecked_ref::<ReadableStream>()).await;
    }

    Err(JsValue::from_str(
        "Unsupported input type. Expected Uint8Array, ArrayBuffer, or ReadableStream",
    ))
}

#[inline]
fn copy_uint8_array(array: &Uint8Array) -> Vec<u8> {
    let len = array.length() as usize;
    let mut buffer = vec![0; len];
    array.copy_to(&mut buffer);
    buffer
}

async fn read_stream(stream: &ReadableStream) -> Result<Vec<u8>, JsValue> {
    let reader = stream.get_reader();
    let reader = reader.unchecked_into::<ReadableStreamDefaultReader>();
    read_from_reader(reader).await
}

async fn read_from_reader(reader: ReadableStreamDefaultReader) -> Result<Vec<u8>, JsValue> {
    // Pre-allocate with reasonable initial capacity
    let mut chunks: Vec<u8> = Vec::with_capacity(64 * 1024);

    loop {
        let promise = reader.read();
        let result = JsFuture::from(promise).await?;

        let done = Reflect::get(&result, &JsValue::from_str("done"))?
            .as_bool()
            .unwrap_or(false);
        if done {
            break;
        }

        let value = Reflect::get(&result, &JsValue::from_str("value"))?;
        if !value.is_undefined() && !value.is_null() {
            let chunk = Uint8Array::new(&value);
            let chunk_len = chunk.length() as usize;
            let prev_len = chunks.len();
            chunks.reserve(chunk_len);
            chunks.resize(prev_len + chunk_len, 0);
            chunk.copy_to(&mut chunks[prev_len..]);
        }
    }

    reader.release_lock();
    Ok(chunks)
}

struct DecoderContext {
    format: Box<dyn FormatReader>,
    decoder: Box<dyn Decoder>,
    track_id: u32,
    total_frames: Option<u64>,
}

fn prepare_decoder(audio_data: Vec<u8>) -> Result<DecoderContext, JsValue> {
    // Feed the raw bytes into Symphonia via an in-memory cursor.
    let cursor = Cursor::new(audio_data);
    let mss = MediaSourceStream::new(Box::new(cursor), Default::default());

    let hint = Hint::new();
    let format_opts = FormatOptions::default();
    let metadata_opts = MetadataOptions::default();
    let decoder_opts = DecoderOptions::default();

    let probed = symphonia::default::get_probe()
        .format(&hint, mss, &format_opts, &metadata_opts)
        .map_err(|e| JsValue::from_str(&format!("Failed to probe audio format: {e}")))?;

    let format = probed.format;

    let track = format
        .tracks()
        .iter()
        .find(|t| t.codec_params.codec != CODEC_TYPE_NULL)
        .ok_or_else(|| JsValue::from_str("No supported audio track found"))?;

    let codec_params = track.codec_params.clone();
    let track_id = track.id;
    let total_frames = track.codec_params.n_frames;

    let decoder = symphonia::default::get_codecs()
        .make(&codec_params, &decoder_opts)
        .map_err(|e| JsValue::from_str(&format!("Failed to create decoder: {e}")))?;

    Ok(DecoderContext {
        format,
        decoder,
        track_id,
        total_frames,
    })
}
