import * as Token from 'token-types';
import { makeUnexpectedFileContentError } from '../ParseError.js';
export class WaveContentError extends makeUnexpectedFileContentError('Wave') {
}
/**
 * Ref: https://msdn.microsoft.com/en-us/library/windows/desktop/dd317599(v=vs.85).aspx
 */
export const WaveFormat = {
    PCM: 0x0001,
    // MPEG-4 and AAC Audio Types
    ADPCM: 0x0002,
    IEEE_FLOAT: 0x0003,
    MPEG_ADTS_AAC: 0x1600,
    MPEG_LOAS: 0x1602,
    RAW_AAC1: 0x00FF,
    // Dolby Audio Types
    DOLBY_AC3_SPDIF: 0x0092,
    DVM: 0x2000,
    RAW_SPORT: 0x0240,
    ESST_AC3: 0x0241,
    DRM: 0x0009,
    DTS2: 0x2001,
    MPEG: 0x0050
};
export const WaveFormatNameMap = {
    [WaveFormat.PCM]: 'PCM',
    [WaveFormat.ADPCM]: 'ADPCM',
    [WaveFormat.IEEE_FLOAT]: 'IEEE_FLOAT',
    [WaveFormat.MPEG_ADTS_AAC]: 'MPEG_ADTS_AAC',
    [WaveFormat.MPEG_LOAS]: 'MPEG_LOAS',
    [WaveFormat.RAW_AAC1]: 'RAW_AAC1',
    [WaveFormat.DOLBY_AC3_SPDIF]: 'DOLBY_AC3_SPDIF',
    [WaveFormat.DVM]: 'DVM',
    [WaveFormat.RAW_SPORT]: 'RAW_SPORT',
    [WaveFormat.ESST_AC3]: 'ESST_AC3',
    [WaveFormat.DRM]: 'DRM',
    [WaveFormat.DTS2]: 'DTS2',
    [WaveFormat.MPEG]: 'MPEG'
};
/**
 * format chunk; chunk-id is "fmt "
 * http://soundfile.sapp.org/doc/WaveFormat/
 */
export class Format {
    constructor(header) {
        if (header.chunkSize < 16)
            throw new WaveContentError('Invalid chunk size');
        this.len = header.chunkSize;
    }
    get(buf, off) {
        return {
            wFormatTag: Token.UINT16_LE.get(buf, off),
            nChannels: Token.UINT16_LE.get(buf, off + 2),
            nSamplesPerSec: Token.UINT32_LE.get(buf, off + 4),
            nAvgBytesPerSec: Token.UINT32_LE.get(buf, off + 8),
            nBlockAlign: Token.UINT16_LE.get(buf, off + 12),
            wBitsPerSample: Token.UINT16_LE.get(buf, off + 14)
        };
    }
}
/**
 * Fact chunk; chunk-id is "fact"
 * http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
 * http://www.recordingblogs.com/wiki/fact-chunk-of-a-wave-file
 */
export class FactChunk {
    constructor(header) {
        if (header.chunkSize < 4) {
            throw new WaveContentError('Invalid fact chunk size.');
        }
        this.len = header.chunkSize;
    }
    get(buf, off) {
        return {
            dwSampleLength: Token.UINT32_LE.get(buf, off)
        };
    }
}
