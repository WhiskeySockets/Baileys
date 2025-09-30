// ASF Objects
import * as Token from 'token-types';
import * as util from '../common/Util.js';
import GUID from './GUID.js';
import { getParserForAttr, parseUnicodeAttr } from './AsfUtil.js';
import { AttachedPictureType } from '../id3v2/ID3v2Token.js';
import { makeUnexpectedFileContentError } from '../ParseError.js';
export class AsfContentParseError extends makeUnexpectedFileContentError('ASF') {
}
/**
 * Data Type: Specifies the type of information being stored. The following values are recognized.
 */
export const DataType = {
    /**
     * Unicode string. The data consists of a sequence of Unicode characters.
     */
    UnicodeString: 0,
    /**
     * BYTE array. The type of data is implementation-specific.
     */
    ByteArray: 1,
    /**
     * BOOL. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer. Only 0x0000 or 0x0001 are permitted values.
     */
    Bool: 2,
    /**
     * DWORD. The data is 4 bytes long and should be interpreted as a 32-bit unsigned integer.
     */
    DWord: 3,
    /**
     * QWORD. The data is 8 bytes long and should be interpreted as a 64-bit unsigned integer.
     */
    QWord: 4,
    /**
     * WORD. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer.
     */
    Word: 5
};
/**
 * Token for: 3. ASF top-level Header Object
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3
 */
export const TopLevelHeaderObjectToken = {
    len: 30,
    get: (buf, off) => {
        return {
            objectId: GUID.fromBin(buf, off),
            objectSize: Number(Token.UINT64_LE.get(buf, off + 16)),
            numberOfHeaderObjects: Token.UINT32_LE.get(buf, off + 24)
            // Reserved: 2 bytes
        };
    }
};
/**
 * Token for: 3.1 Header Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_1
 */
export const HeaderObjectToken = {
    len: 24,
    get: (buf, off) => {
        return {
            objectId: GUID.fromBin(buf, off),
            objectSize: Number(Token.UINT64_LE.get(buf, off + 16))
        };
    }
};
export class State {
    constructor(header) {
        this.len = Number(header.objectSize) - HeaderObjectToken.len;
    }
    postProcessTag(tags, name, valueType, data) {
        if (name === 'WM/Picture') {
            tags.push({ id: name, value: WmPictureToken.fromBuffer(data) });
        }
        else {
            const parseAttr = getParserForAttr(valueType);
            if (!parseAttr) {
                throw new AsfContentParseError(`unexpected value headerType: ${valueType}`);
            }
            tags.push({ id: name, value: parseAttr(data) });
        }
    }
}
// ToDo: use ignore type
export class IgnoreObjectState extends State {
    get(_buf, _off) {
        return null;
    }
}
/**
 * Token for: 3.2: File Properties Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_2
 */
export class FilePropertiesObject extends State {
    get(buf, off) {
        return {
            fileId: GUID.fromBin(buf, off),
            fileSize: Token.UINT64_LE.get(buf, off + 16),
            creationDate: Token.UINT64_LE.get(buf, off + 24),
            dataPacketsCount: Token.UINT64_LE.get(buf, off + 32),
            playDuration: Token.UINT64_LE.get(buf, off + 40),
            sendDuration: Token.UINT64_LE.get(buf, off + 48),
            preroll: Token.UINT64_LE.get(buf, off + 56),
            flags: {
                broadcast: util.getBit(buf, off + 64, 24),
                seekable: util.getBit(buf, off + 64, 25)
            },
            // flagsNumeric: Token.UINT32_LE.get(buf, off + 64),
            minimumDataPacketSize: Token.UINT32_LE.get(buf, off + 68),
            maximumDataPacketSize: Token.UINT32_LE.get(buf, off + 72),
            maximumBitrate: Token.UINT32_LE.get(buf, off + 76)
        };
    }
}
FilePropertiesObject.guid = GUID.FilePropertiesObject;
/**
 * Token for: 3.3 Stream Properties Object (mandatory, one per stream)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_3
 */
export class StreamPropertiesObject extends State {
    get(buf, off) {
        return {
            streamType: GUID.decodeMediaType(GUID.fromBin(buf, off)),
            errorCorrectionType: GUID.fromBin(buf, off + 8)
            // ToDo
        };
    }
}
StreamPropertiesObject.guid = GUID.StreamPropertiesObject;
/**
 * 3.4: Header Extension Object (mandatory, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_4
 */
export class HeaderExtensionObject {
    constructor() {
        this.len = 22;
    }
    get(buf, off) {
        const view = new DataView(buf.buffer, off);
        return {
            reserved1: GUID.fromBin(buf, off),
            reserved2: view.getUint16(16, true),
            extensionDataSize: view.getUint16(18, true)
        };
    }
}
HeaderExtensionObject.guid = GUID.HeaderExtensionObject;
/**
 * 3.5: The Codec List Object provides user-friendly information about the codecs and formats used to encode the content found in the ASF file.
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_5
 */
const CodecListObjectHeader = {
    len: 20,
    get: (buf, off) => {
        const view = new DataView(buf.buffer, off);
        return {
            entryCount: view.getUint16(16, true)
        };
    }
};
async function readString(tokenizer) {
    const length = await tokenizer.readNumber(Token.UINT16_LE);
    return (await tokenizer.readToken(new Token.StringType(length * 2, 'utf-16le'))).replace('\0', '');
}
/**
 * 3.5: Read the Codec-List-Object, which provides user-friendly information about the codecs and formats used to encode the content found in the ASF file.
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_5
 */
export async function readCodecEntries(tokenizer) {
    const codecHeader = await tokenizer.readToken(CodecListObjectHeader);
    const entries = [];
    for (let i = 0; i < codecHeader.entryCount; ++i) {
        entries.push(await readCodecEntry(tokenizer));
    }
    return entries;
}
async function readInformation(tokenizer) {
    const length = await tokenizer.readNumber(Token.UINT16_LE);
    const buf = new Uint8Array(length);
    await tokenizer.readBuffer(buf);
    return buf;
}
/**
 * Read Codec-Entries
 * @param tokenizer
 */
async function readCodecEntry(tokenizer) {
    const type = await tokenizer.readNumber(Token.UINT16_LE);
    return {
        type: {
            videoCodec: (type & 0x0001) === 0x0001,
            audioCodec: (type & 0x0002) === 0x0002
        },
        codecName: await readString(tokenizer),
        description: await readString(tokenizer),
        information: await readInformation(tokenizer)
    };
}
/**
 * 3.10 Content Description Object (optional, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_10
 */
export class ContentDescriptionObjectState extends State {
    get(buf, off) {
        const tags = [];
        const view = new DataView(buf.buffer, off);
        let pos = 10;
        for (let i = 0; i < ContentDescriptionObjectState.contentDescTags.length; ++i) {
            const length = view.getUint16(i * 2, true);
            if (length > 0) {
                const tagName = ContentDescriptionObjectState.contentDescTags[i];
                const end = pos + length;
                tags.push({ id: tagName, value: parseUnicodeAttr(buf.subarray(off + pos, off + end)) });
                pos = end;
            }
        }
        return tags;
    }
}
ContentDescriptionObjectState.guid = GUID.ContentDescriptionObject;
ContentDescriptionObjectState.contentDescTags = ['Title', 'Author', 'Copyright', 'Description', 'Rating'];
/**
 * 3.11 Extended Content Description Object (optional, one only)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/03_asf_top_level_header_object.html#3_11
 */
export class ExtendedContentDescriptionObjectState extends State {
    get(buf, off) {
        const tags = [];
        const view = new DataView(buf.buffer, off);
        const attrCount = view.getUint16(0, true);
        let pos = 2;
        for (let i = 0; i < attrCount; i += 1) {
            const nameLen = view.getUint16(pos, true);
            pos += 2;
            const name = parseUnicodeAttr(buf.subarray(off + pos, off + pos + nameLen));
            pos += nameLen;
            const valueType = view.getUint16(pos, true);
            pos += 2;
            const valueLen = view.getUint16(pos, true);
            pos += 2;
            const value = buf.subarray(off + pos, off + pos + valueLen);
            pos += valueLen;
            this.postProcessTag(tags, name, valueType, value);
        }
        return tags;
    }
}
ExtendedContentDescriptionObjectState.guid = GUID.ExtendedContentDescriptionObject;
/**
 * 4.1 Extended Stream Properties Object (optional, 1 per media stream)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/04_objects_in_the_asf_header_extension_object.html#4_1
 */
export class ExtendedStreamPropertiesObjectState extends State {
    get(buf, off) {
        const view = new DataView(buf.buffer, off);
        return {
            startTime: Token.UINT64_LE.get(buf, off),
            endTime: Token.UINT64_LE.get(buf, off + 8),
            dataBitrate: view.getInt32(12, true),
            bufferSize: view.getInt32(16, true),
            initialBufferFullness: view.getInt32(20, true),
            alternateDataBitrate: view.getInt32(24, true),
            alternateBufferSize: view.getInt32(28, true),
            alternateInitialBufferFullness: view.getInt32(32, true),
            maximumObjectSize: view.getInt32(36, true),
            flags: {
                reliableFlag: util.getBit(buf, off + 40, 0),
                seekableFlag: util.getBit(buf, off + 40, 1),
                resendLiveCleanpointsFlag: util.getBit(buf, off + 40, 2)
            },
            // flagsNumeric: Token.UINT32_LE.get(buf, off + 64),
            streamNumber: view.getInt16(42, true),
            streamLanguageId: view.getInt16(44, true),
            averageTimePerFrame: view.getInt32(52, true),
            streamNameCount: view.getInt32(54, true),
            payloadExtensionSystems: view.getInt32(56, true),
            streamNames: [], // ToDo
            streamPropertiesObject: null
        };
    }
}
ExtendedStreamPropertiesObjectState.guid = GUID.ExtendedStreamPropertiesObject;
/**
 * 4.7  Metadata Object (optional, 0 or 1)
 * Ref: http://drang.s4.xrea.com/program/tips/id3tag/wmp/04_objects_in_the_asf_header_extension_object.html#4_7
 */
export class MetadataObjectState extends State {
    get(uint8Array, off) {
        const tags = [];
        const view = new DataView(uint8Array.buffer, off);
        const descriptionRecordsCount = view.getUint16(0, true);
        let pos = 2;
        for (let i = 0; i < descriptionRecordsCount; i += 1) {
            pos += 4;
            const nameLen = view.getUint16(pos, true);
            pos += 2;
            const dataType = view.getUint16(pos, true);
            pos += 2;
            const dataLen = view.getUint32(pos, true);
            pos += 4;
            const name = parseUnicodeAttr(uint8Array.subarray(off + pos, off + pos + nameLen));
            pos += nameLen;
            const data = uint8Array.subarray(off + pos, off + pos + dataLen);
            pos += dataLen;
            this.postProcessTag(tags, name, dataType, data);
        }
        return tags;
    }
}
MetadataObjectState.guid = GUID.MetadataObject;
// 4.8	Metadata Library Object (optional, 0 or 1)
export class MetadataLibraryObjectState extends MetadataObjectState {
}
MetadataLibraryObjectState.guid = GUID.MetadataLibraryObject;
/**
 * Ref: https://msdn.microsoft.com/en-us/library/windows/desktop/dd757977(v=vs.85).aspx
 */
export class WmPictureToken {
    static fromBuffer(buffer) {
        const pic = new WmPictureToken(buffer.length);
        return pic.get(buffer, 0);
    }
    constructor(len) {
        this.len = len;
    }
    get(buffer, offset) {
        const view = new DataView(buffer.buffer, offset);
        const typeId = view.getUint8(0);
        const size = view.getInt32(1, true);
        let index = 5;
        while (view.getUint16(index) !== 0) {
            index += 2;
        }
        const format = new Token.StringType(index - 5, 'utf-16le').get(buffer, 5);
        while (view.getUint16(index) !== 0) {
            index += 2;
        }
        const description = new Token.StringType(index - 5, 'utf-16le').get(buffer, 5);
        return {
            type: AttachedPictureType[typeId],
            format,
            description,
            size,
            data: buffer.slice(index + 4)
        };
    }
}
