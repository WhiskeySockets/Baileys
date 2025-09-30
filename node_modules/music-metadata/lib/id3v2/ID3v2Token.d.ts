import type { IGetToken } from 'strtok3';
import * as util from '../common/Util.js';
/**
 * The picture type according to the ID3v2 APIC frame
 * Ref: http://id3.org/id3v2.3.0#Attached_picture
 */
export declare const AttachedPictureType: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
    17: string;
    18: string;
    19: string;
    20: string;
};
export type ID3v2MajorVersion = 2 | 3 | 4;
export interface IExtendedHeader {
    size: number;
    extendedFlags: number;
    sizeOfPadding: number;
    crcDataPresent: boolean;
}
/**
 * https://id3.org/id3v2.3.0#Synchronised_lyrics.2Ftext
 */
export declare const LyricsContentType: {
    other: number;
    lyrics: number;
    text: number;
    movement_part: number;
    events: number;
    chord: number;
    trivia_pop: number;
};
export type LyricsContentType = typeof LyricsContentType[keyof typeof LyricsContentType];
export declare const TimestampFormat: {
    notSynchronized0: number;
    mpegFrameNumber: number;
    milliseconds: number;
};
export type TimestampFormat = typeof TimestampFormat[keyof typeof TimestampFormat];
/**
 * 28 bits (representing up to 256MB) integer, the msb is 0 to avoid 'false syncsignals'.
 * 4 * %0xxxxxxx
 */
export declare const UINT32SYNCSAFE: {
    get: (buf: Uint8Array, off: number) => number;
    len: number;
};
/**
 * ID3v2 tag header
 */
export interface IID3v2header {
    fileIdentifier: string;
    version: {
        major: ID3v2MajorVersion;
        revision: number;
    };
    flags: {
        unsynchronisation: boolean;
        isExtendedHeader: boolean;
        expIndicator: boolean;
        footer: boolean;
    };
    size: number;
}
/**
 * ID3v2 header
 * Ref: http://id3.org/id3v2.3.0#ID3v2_header
 * ToDo
 */
export declare const ID3v2Header: IGetToken<IID3v2header>;
export declare const ExtendedHeader: IGetToken<IExtendedHeader>;
export interface ITextEncoding {
    encoding: util.StringEncoding;
    bom?: boolean;
}
export declare const TextEncodingToken: IGetToken<ITextEncoding>;
/**
 * `USLT` frame fields
 */
export interface ITextHeader {
    encoding: ITextEncoding;
    language: string;
}
/**
 * Used to read first portion of `SYLT` frame
 */
export declare const TextHeader: IGetToken<ITextHeader>;
/**
 * SYLT` frame fields
 */
export interface ISyncTextHeader extends ITextHeader {
    contentType: LyricsContentType;
    timeStampFormat: TimestampFormat;
}
/**
 * Used to read first portion of `SYLT` frame
 */
export declare const SyncTextHeader: IGetToken<ISyncTextHeader>;
