import type { IGetToken } from 'strtok3';
import type { IChunkHeader } from '../iff/index.js';
declare const WaveContentError_base: {
    new (message: string): {
        readonly fileType: string;
        toString(): string;
        name: "UnexpectedFileContentError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class WaveContentError extends WaveContentError_base {
}
/**
 * Ref: https://msdn.microsoft.com/en-us/library/windows/desktop/dd317599(v=vs.85).aspx
 */
export declare const WaveFormat: {
    PCM: number;
    ADPCM: number;
    IEEE_FLOAT: number;
    MPEG_ADTS_AAC: number;
    MPEG_LOAS: number;
    RAW_AAC1: number;
    DOLBY_AC3_SPDIF: number;
    DVM: number;
    RAW_SPORT: number;
    ESST_AC3: number;
    DRM: number;
    DTS2: number;
    MPEG: number;
};
export type WaveFormat = typeof WaveFormat[keyof typeof WaveFormat];
export declare const WaveFormatNameMap: {
    [WaveFormat.PCM]: string;
    [WaveFormat.ADPCM]: string;
    [WaveFormat.IEEE_FLOAT]: string;
    [WaveFormat.MPEG_ADTS_AAC]: string;
    [WaveFormat.MPEG_LOAS]: string;
    [WaveFormat.RAW_AAC1]: string;
    [WaveFormat.DOLBY_AC3_SPDIF]: string;
    [WaveFormat.DVM]: string;
    [WaveFormat.RAW_SPORT]: string;
    [WaveFormat.ESST_AC3]: string;
    [WaveFormat.DRM]: string;
    [WaveFormat.DTS2]: string;
    [WaveFormat.MPEG]: string;
};
/**
 * "fmt"  sub-chunk describes the sound data's format
 * Ref: http://soundfile.sapp.org/doc/WaveFormat
 */
export interface IWaveFormat {
    /**
     * PCM = 1 (i.e. Linear quantization). Values other than 1 indicate some form of compression.
     */
    wFormatTag: WaveFormat;
    /**
     * Mono = 1, Stereo = 2, etc.
     */
    nChannels: number;
    /**
     * 8000, 44100, etc.
     */
    nSamplesPerSec: number;
    nAvgBytesPerSec: number;
    nBlockAlign: number;
    wBitsPerSample: number;
}
/**
 * format chunk; chunk-id is "fmt "
 * http://soundfile.sapp.org/doc/WaveFormat/
 */
export declare class Format implements IGetToken<IWaveFormat> {
    len: number;
    constructor(header: IChunkHeader);
    get(buf: Uint8Array, off: number): IWaveFormat;
}
export interface IFactChunk {
    dwSampleLength: number;
}
/**
 * Fact chunk; chunk-id is "fact"
 * http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
 * http://www.recordingblogs.com/wiki/fact-chunk-of-a-wave-file
 */
export declare class FactChunk implements IGetToken<IFactChunk> {
    len: number;
    constructor(header: IChunkHeader);
    get(buf: Uint8Array, off: number): IFactChunk;
}
export {};
