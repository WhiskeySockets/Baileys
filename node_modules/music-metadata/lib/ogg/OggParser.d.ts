import { BasicParser } from '../common/BasicParser.js';
declare const OggContentError_base: {
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
export declare class OggContentError extends OggContentError_base {
}
/**
 * Parser for Ogg logical bitstream framing
 */
export declare class OggParser extends BasicParser {
    private streams;
    /**
     * Parse page
     * @returns {Promise<void>}
     */
    parse(): Promise<void>;
}
export {};
