import { type ID3v2MajorVersion, type ITextEncoding } from './ID3v2Token.js';
import type { IWarningCollector } from '../common/MetadataCollector.js';
interface ICustomTag {
    owner_identifier: string;
}
export interface ICustomDataTag extends ICustomTag {
    data: Uint8Array;
}
export interface IIdentifierTag extends ICustomTag {
    identifier: Uint8Array;
}
export interface ITextTag {
    description: string;
    text: string[];
}
export interface IPopularimeter {
    email: string;
    rating: number;
    counter: number;
}
export interface IGeneralEncapsulatedObject {
    type: string;
    filename: string;
    description: string;
    data: Uint8Array;
}
export declare function parseGenre(origVal: string): string[];
export declare class FrameParser {
    private major;
    private warningCollector;
    /**
     * Create id3v2 frame parser
     * @param major - Major version, e.g. (4) for  id3v2.4
     * @param warningCollector - Used to collect decode issue
     */
    constructor(major: ID3v2MajorVersion, warningCollector: IWarningCollector);
    readData(uint8Array: Uint8Array, type: string, includeCovers: boolean): unknown;
    protected static readNullTerminatedString(uint8Array: Uint8Array, encoding: ITextEncoding): {
        text: string;
        len: number;
    };
    protected static fixPictureMimeType(pictureType: string): string;
    /**
     * Converts TMCL (Musician credits list) or TIPL (Involved people list)
     * @param entries
     */
    private static functionList;
    /**
     * id3v2.4 defines that multiple T* values are separated by 0x00
     * id3v2.3 defines that TCOM, TEXT, TOLY, TOPE & TPE1 values are separated by /
     * @param tag - Tag name
     * @param text - Concatenated tag value
     * @returns Split tag value
     */
    private splitValue;
    private static trimArray;
    private static readIdentifierAndData;
    private static getNullTerminatorLength;
}
declare const Id3v2ContentError_base: {
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
export declare class Id3v2ContentError extends Id3v2ContentError_base {
}
export {};
