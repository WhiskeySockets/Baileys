import * as Token from 'token-types';
import type { IGetToken, ITokenizer } from 'strtok3';
import { type IExtendedLameHeader } from './ExtendedLameHeader.js';
export interface IXingHeaderFlags {
    frames: boolean;
    bytes: boolean;
    toc: boolean;
    vbrScale: boolean;
}
/**
 * Info Tag: Xing, LAME
 */
export declare const InfoTagHeaderTag: Token.StringType;
/**
 * LAME TAG value
 * Did not find any official documentation for this
 * Value e.g.: "3.98.4"
 */
export declare const LameEncoderVersion: Token.StringType;
export interface IXingInfoTag {
    /**
     * total bit stream frames from Vbr header data
     */
    numFrames: number | null;
    /**
     * Actual stream size = file size - header(s) size [bytes]
     */
    streamSize: number | null;
    toc?: Uint8Array;
    /**
     * the number of header data bytes (from original file)
     */
    vbrScale: number | null;
    lame?: {
        version: string;
        extended?: IExtendedLameHeader;
    };
}
/**
 * Info Tag
 * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
 */
export declare const XingHeaderFlags: IGetToken<IXingHeaderFlags>;
export declare function readXingHeader(tokenizer: ITokenizer): Promise<IXingInfoTag>;
