import type * as iff from '../iff/index.js';
import type { IGetToken } from 'strtok3';
export declare const compressionTypes: {
    NONE: string;
    sowt: string;
    fl32: string;
    fl64: string;
    alaw: string;
    ulaw: string;
    ULAW: string;
    ALAW: string;
    FL32: string;
};
export type CompressionTypeCode = keyof typeof compressionTypes;
declare const AiffContentError_base: {
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
export declare class AiffContentError extends AiffContentError_base {
}
/**
 * The Common Chunk.
 * Describes fundamental parameters of the waveform data such as sample rate, bit resolution, and how many channels of
 * digital audio are stored in the FORM AIFF.
 */
export interface ICommon {
    numChannels: number;
    numSampleFrames: number;
    sampleSize: number;
    sampleRate: number;
    compressionType?: CompressionTypeCode;
    compressionName?: string;
}
export declare class Common implements IGetToken<ICommon> {
    len: number;
    private isAifc;
    constructor(header: iff.IChunkHeader, isAifc: boolean);
    get(buf: Uint8Array, off: number): ICommon;
}
export {};
