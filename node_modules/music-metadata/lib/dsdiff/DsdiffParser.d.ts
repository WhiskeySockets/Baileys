import { BasicParser } from '../common/BasicParser.js';
declare const DsdiffContentParseError_base: {
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
export declare class DsdiffContentParseError extends DsdiffContentParseError_base {
}
/**
 * DSDIFF - Direct Stream Digital Interchange File Format (Phillips)
 *
 * Ref:
 * - http://www.sonicstudio.com/pdf/dsd/DSDIFF_1.5_Spec.pdf
 */
export declare class DsdiffParser extends BasicParser {
    parse(): Promise<void>;
    private readFmt8Chunks;
    private readData;
    private handleSoundPropertyChunks;
    private handleChannelChunks;
}
export {};
