import { AbstractID3Parser } from '../id3v2/AbstractID3Parser.js';
declare const DsdContentParseError_base: {
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
export declare class DsdContentParseError extends DsdContentParseError_base {
}
/**
 * DSF (dsd stream file) File Parser
 * Ref: https://dsd-guide.com/sites/default/files/white-papers/DSFFileFormatSpec_E.pdf
 */
export declare class DsfParser extends AbstractID3Parser {
    postId3v2Parse(): Promise<void>;
    private parseChunks;
}
export {};
