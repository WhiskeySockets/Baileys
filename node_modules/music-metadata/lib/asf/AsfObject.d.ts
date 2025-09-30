import type { IGetToken, ITokenizer } from 'strtok3';
import type { AnyTagValue, IPicture, ITag } from '../type.js';
import GUID from './GUID.js';
declare const AsfContentParseError_base: {
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
export declare class AsfContentParseError extends AsfContentParseError_base {
}
/**
 * Data Type: Specifies the type of information being stored. The following values are recognized.
 */
export declare const DataType: {
    /**
     * Unicode string. The data consists of a sequence of Unicode characters.
     */
    UnicodeString: number;
    /**
     * BYTE array. The type of data is implementation-specific.
     */
    ByteArray: number;
    /**
     * BOOL. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer. Only 0x0000 or 0x0001 are permitted values.
     */
    Bool: number;
    /**
     * DWORD. The data is 4 bytes long and should be interpreted as a 32-bit unsigned integer.
     */
    DWord: number;
    /**
     * QWORD. The data is 8 bytes long and should be interpreted as a 64-bit unsigned integer.
     */
    QWord: number;
    /**
     * WORD. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer.
     */
    Word: number;
};
export type DataType = typeof DataType[keyof typeof DataType];
/**
 * Ref: https://msdn.microsoft.com/en-us/library/windows/desktop/ee663575
 */
export interface IAsfObjectHeader {
    /**
     * A GUID that identifies the object. 128 bits
     */
    objectId: GUID;
    /**
     * The size of the object (64-bits)
     */
    objectSize: number;
}
/**
 * Interface for: 3. ASF top-level Header Object
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3
 */
export interface IAsfTopLevelObjectHeader extends IAsfObjectHeader {
    numberOfHeaderObjects: number;
}
/**
 * Token for: 3. ASF top-level Header Object
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3
 */
export declare const TopLevelHeaderObjectToken: IGetToken<IAsfTopLevelObjectHeader, Uint8Array>;
/**
 * Token for: 3.1 Header Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_1
 */
export declare const HeaderObjectToken: IGetToken<IAsfObjectHeader, Uint8Array>;
export declare abstract class State<T> implements IGetToken<T> {
    len: number;
    constructor(header: IAsfObjectHeader);
    abstract get(buf: Uint8Array, off: number): T;
    protected postProcessTag(tags: ITag[], name: string, valueType: number, data: AnyTagValue): void;
}
export declare class IgnoreObjectState extends State<unknown> {
    get(_buf: Uint8Array, _off: number): null;
}
/**
 * Interface for: 3.2: File Properties Object (mandatory, one only)
 *
 * The File Properties Object defines the global characteristics of the combined digital media streams found within the Data Object.
 */
export interface IFilePropertiesObject {
    /**
     * Specifies the unique identifier for this file.
     * The value of this field shall be regenerated every time the file is modified in any way.
     * The value of this field shall be identical to the value of the File ID field of the Data Object.
     */
    fileId: GUID;
    /**
     * Specifies the size, in bytes, of the entire file.
     * The value of this field is invalid if the Broadcast Flag bit in the Flags field is set to 1.
     */
    fileSize: bigint;
    /**
     * Specifies the date and time of the initial creation of the file. The value is given as the number of 100-nanosecond
     * intervals since January 1, 1601, according to Coordinated Universal Time (Greenwich Mean Time). The value of this
     * field may be invalid if the Broadcast Flag bit in the Flags field is set to 1.
     */
    creationDate: bigint;
    /**
     * Specifies the number of Data Packet entries that exist within the Data Object. The value of this field is invalid
     * if the Broadcast Flag bit in the Flags field is set to 1.
     */
    dataPacketsCount: bigint;
    /**
     * Specifies the time needed to play the file in 100-nanosecond units.
     * This value should include the duration (estimated, if an exact value is unavailable) of the the last media object
     * in the presentation. The value of this field is invalid if the Broadcast Flag bit in the Flags field is set to 1.
     */
    playDuration: bigint;
    /**
     * Specifies the time needed to send the file in 100-nanosecond units.
     * This value should include the duration of the last packet in the content.
     * The value of this field is invalid if the Broadcast Flag bit in the Flags field is set to 1.
     * Players can ignore this value.
     */
    sendDuration: bigint;
    /**
     * Specifies the amount of time to buffer data before starting to play the file, in millisecond units.
     * If this value is nonzero, the Play Duration field and all of the payload Presentation Time fields have been offset
     * by this amount. Therefore, player software must subtract the value in the preroll field from the play duration and
     * presentation times to calculate their actual values. It follows that all payload Presentation Time fields need to
     * be at least this value.
     */
    preroll: bigint;
    /**
     * The flags
     */
    flags: {
        /**
         * Specifies, if set, that a file is in the process of being created (for example, for recording applications),
         * and thus that various values stored in the header objects are invalid. It is highly recommended that
         * post-processing be performed to remove this condition at the earliest opportunity.
         */
        broadcast: boolean;
        /**
         * Specifies, if set, that a file is seekable.
         * Note that for files containing a single audio stream and a Minimum Data Packet Size field equal to the Maximum
         * Data Packet Size field, this flag shall always be set to 1.
         * For files containing a single audio stream and a video stream or mutually exclusive video streams,
         * this flag is only set to 1 if the file contains a matching Simple Index Object for each regular video stream
         * (that is, video streams that are not hidden according to the method described in section 8.2.2).
         */
        seekable: boolean;
    };
    /**
     * Specifies the minimum Data Packet size in bytes. In general, the value of this field is invalid if the Broadcast
     * Flag bit in the Flags field is set to 1.
     * However, for the purposes of this specification, the values for the Minimum Data Packet Size and Maximum Data
     * Packet Size fields shall be set to the same value, and this value should be set to the packet size, even when the
     * Broadcast Flag in the Flags field is set to 1.
     */
    minimumDataPacketSize: number;
    /**
     * Specifies the maximum Data Packet size in bytes.
     * In general, the value of this field is invalid if the Broadcast Flag bit in the Flags field is set to 1.
     * However, for the purposes of this specification, the values of the Minimum Data Packet Size and Maximum Data Packet
     * Size fields shall be set to the same value,
     * and this value should be set to the packet size, even when the Broadcast Flag field is set to 1.
     */
    maximumDataPacketSize: number;
    /**
     * Specifies the maximum instantaneous bit rate in bits per second for the entire file.
     * This shall equal the sum of the bit rates of the individual digital media streams.
     * It shall be noted that the digital media stream includes ASF data packetization overhead as well as digital media
     * data in payloads.
     * Only those streams that have a free-standing Stream Properties Object in the header shall have their bit rates
     * included in the sum;
     * streams whose Stream Properties Object exists as part of an Extended Stream Properties Object in the Header
     * Extension Object shall not have their bit rates included in this sum, except when this value would otherwise be 0.
     */
    maximumBitrate: number;
}
/**
 * Token for: 3.2: File Properties Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_2
 */
export declare class FilePropertiesObject extends State<IFilePropertiesObject> {
    static guid: GUID;
    get(buf: Uint8Array, off: number): IFilePropertiesObject;
}
/**
 * Interface for: 3.3 Stream Properties Object (mandatory, one per stream)
 */
export interface IStreamPropertiesObject {
    /**
     * Stream Type
     */
    streamType: string | undefined;
    /**
     * Error Correction Type
     */
    errorCorrectionType: GUID;
}
/**
 * Token for: 3.3 Stream Properties Object (mandatory, one per stream)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_3
 */
export declare class StreamPropertiesObject extends State<IStreamPropertiesObject> {
    static guid: GUID;
    get(buf: Uint8Array, off: number): IStreamPropertiesObject;
}
export interface IHeaderExtensionObject {
    reserved1: GUID;
    reserved2: number;
    extensionDataSize: number;
}
/**
 * 3.4: Header Extension Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_4
 */
export declare class HeaderExtensionObject implements IGetToken<IHeaderExtensionObject> {
    static guid: GUID;
    len: number;
    constructor();
    get(buf: Uint8Array, off: number): IHeaderExtensionObject;
}
export interface ICodecEntry {
    type: {
        videoCodec: boolean;
        audioCodec: boolean;
    };
    codecName: string;
    description: string;
    information: Uint8Array;
}
/**
 * 3.5: Read the Codec-List-Object, which provides user-friendly information about the codecs and formats used to encode the content found in the ASF file.
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_5
 */
export declare function readCodecEntries(tokenizer: ITokenizer): Promise<ICodecEntry[]>;
/**
 * 3.10 Content Description Object (optional, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_10
 */
export declare class ContentDescriptionObjectState extends State<ITag[]> {
    static guid: GUID;
    private static contentDescTags;
    get(buf: Uint8Array, off: number): ITag[];
}
/**
 * 3.11 Extended Content Description Object (optional, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_11
 */
export declare class ExtendedContentDescriptionObjectState extends State<ITag[]> {
    static guid: GUID;
    get(buf: Uint8Array, off: number): ITag[];
}
export interface IStreamName {
    streamLanguageId: number;
    streamName: string;
}
/**
 * 4.1 Extended Stream Properties Object (optional, 1 per media stream)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/04_objects_in_the_asf_header_extension_object.html#4_1
 */
export interface IExtendedStreamPropertiesObject {
    startTime: bigint;
    endTime: bigint;
    dataBitrate: number;
    bufferSize: number;
    initialBufferFullness: number;
    alternateDataBitrate: number;
    alternateBufferSize: number;
    alternateInitialBufferFullness: number;
    maximumObjectSize: number;
    flags: {
        reliableFlag: boolean;
        seekableFlag: boolean;
        resendLiveCleanpointsFlag: boolean;
    };
    streamNumber: number;
    streamLanguageId: number;
    averageTimePerFrame: number;
    streamNameCount: number;
    payloadExtensionSystems: number;
    streamNames: IStreamName[];
    streamPropertiesObject: number | null;
}
/**
 * 4.1 Extended Stream Properties Object (optional, 1 per media stream)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/04_objects_in_the_asf_header_extension_object.html#4_1
 */
export declare class ExtendedStreamPropertiesObjectState extends State<IExtendedStreamPropertiesObject> {
    static guid: GUID;
    get(buf: Uint8Array, off: number): IExtendedStreamPropertiesObject;
}
/**
 * 4.7  Metadata Object (optional, 0 or 1)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/04_objects_in_the_asf_header_extension_object.html#4_7
 */
export declare class MetadataObjectState extends State<ITag[]> {
    static guid: GUID;
    get(uint8Array: Uint8Array, off: number): ITag[];
}
export declare class MetadataLibraryObjectState extends MetadataObjectState {
    static guid: GUID;
}
export interface IWmPicture extends IPicture {
    type: string;
    format: string;
    description: string;
    size: number;
    data: Uint8Array;
}
/**
 * Ref: https://msdn.microsoft.com/en-us/library/windows/desktop/dd757977(v=vs.85).aspx
 */
export declare class WmPictureToken implements IGetToken<IWmPicture> {
    static fromBuffer(buffer: Uint8Array): IWmPicture;
    len: number;
    constructor(len: number);
    get(buffer: Uint8Array, offset: number): IWmPicture;
}
export {};
