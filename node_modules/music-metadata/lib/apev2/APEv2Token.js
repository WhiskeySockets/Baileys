import * as Token from 'token-types';
import { FourCcToken } from '../common/FourCC.js';
export const DataType = {
    text_utf8: 0,
    binary: 1,
    external_info: 2,
    reserved: 3
};
/**
 * APE_DESCRIPTOR: defines the sizes (and offsets) of all the pieces, as well as the MD5 checksum
 */
export const DescriptorParser = {
    len: 52,
    get: (buf, off) => {
        return {
            // should equal 'MAC '
            ID: FourCcToken.get(buf, off),
            // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
            version: Token.UINT32_LE.get(buf, off + 4) / 1000,
            // the number of descriptor bytes (allows later expansion of this header)
            descriptorBytes: Token.UINT32_LE.get(buf, off + 8),
            // the number of header APE_HEADER bytes
            headerBytes: Token.UINT32_LE.get(buf, off + 12),
            // the number of header APE_HEADER bytes
            seekTableBytes: Token.UINT32_LE.get(buf, off + 16),
            // the number of header data bytes (from original file)
            headerDataBytes: Token.UINT32_LE.get(buf, off + 20),
            // the number of bytes of APE frame data
            apeFrameDataBytes: Token.UINT32_LE.get(buf, off + 24),
            // the high order number of APE frame data bytes
            apeFrameDataBytesHigh: Token.UINT32_LE.get(buf, off + 28),
            // the terminating data of the file (not including tag data)
            terminatingDataBytes: Token.UINT32_LE.get(buf, off + 32),
            // the MD5 hash of the file (see notes for usage... it's a little tricky)
            fileMD5: new Token.Uint8ArrayType(16).get(buf, off + 36)
        };
    }
};
/**
 * APE_HEADER: describes all of the necessary information about the APE file
 */
export const Header = {
    len: 24,
    get: (buf, off) => {
        return {
            // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
            compressionLevel: Token.UINT16_LE.get(buf, off),
            // any format flags (for future use)
            formatFlags: Token.UINT16_LE.get(buf, off + 2),
            // the number of audio blocks in one frame
            blocksPerFrame: Token.UINT32_LE.get(buf, off + 4),
            // the number of audio blocks in the final frame
            finalFrameBlocks: Token.UINT32_LE.get(buf, off + 8),
            // the total number of frames
            totalFrames: Token.UINT32_LE.get(buf, off + 12),
            // the bits per sample (typically 16)
            bitsPerSample: Token.UINT16_LE.get(buf, off + 16),
            // the number of channels (1 or 2)
            channel: Token.UINT16_LE.get(buf, off + 18),
            // the sample rate (typically 44100)
            sampleRate: Token.UINT32_LE.get(buf, off + 20)
        };
    }
};
/**
 * APE Tag Header/Footer Version 2.0
 * TAG: describes all the properties of the file [optional]
 */
export const TagFooter = {
    len: 32,
    get: (buf, off) => {
        return {
            // should equal 'APETAGEX'
            ID: new Token.StringType(8, 'ascii').get(buf, off),
            // equals CURRENT_APE_TAG_VERSION
            version: Token.UINT32_LE.get(buf, off + 8),
            // the complete size of the tag, including this footer (excludes header)
            size: Token.UINT32_LE.get(buf, off + 12),
            // the number of fields in the tag
            fields: Token.UINT32_LE.get(buf, off + 16),
            // reserved for later use (must be zero),
            flags: parseTagFlags(Token.UINT32_LE.get(buf, off + 20))
        };
    }
};
/**
 * APE Tag v2.0 Item Header
 */
export const TagItemHeader = {
    len: 8,
    get: (buf, off) => {
        return {
            // Length of assigned value in bytes
            size: Token.UINT32_LE.get(buf, off),
            // reserved for later use (must be zero),
            flags: parseTagFlags(Token.UINT32_LE.get(buf, off + 4))
        };
    }
};
export function parseTagFlags(flags) {
    return {
        containsHeader: isBitSet(flags, 31),
        containsFooter: isBitSet(flags, 30),
        isHeader: isBitSet(flags, 29),
        readOnly: isBitSet(flags, 0),
        dataType: (flags & 6) >> 1
    };
}
/**
 * @param num {number}
 * @param bit 0 is least significant bit (LSB)
 * @return {boolean} true if bit is 1; otherwise false
 */
export function isBitSet(num, bit) {
    return (num & 1 << bit) !== 0;
}
