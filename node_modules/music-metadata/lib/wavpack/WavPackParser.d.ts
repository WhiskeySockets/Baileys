import { BasicParser } from '../common/BasicParser.js';
declare const WavPackContentError_base: {
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
export declare class WavPackContentError extends WavPackContentError_base {
}
/**
 * WavPack Parser
 */
export declare class WavPackParser extends BasicParser {
    private audioDataSize;
    parse(): Promise<void>;
    parseWavPackBlocks(): Promise<void>;
    /**
     * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf, 3.0 Metadata Sub-blocks
     * @param header Header
     * @param remainingLength Remaining length
     */
    private parseMetadataSubBlock;
}
export {};
