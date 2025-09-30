import * as Token from 'token-types';
import { FourCcToken } from '../common/FourCC.js';
const SampleRates = [6000, 8000, 9600, 11025, 12000, 16000, 22050, 24000, 32000, 44100,
    48000, 64000, 88200, 96000, 192000, -1];
/**
 * WavPack Block Header
 *
 * 32-byte little-endian header at the front of every WavPack block
 *
 * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf (page 2/6: 2.0 "Block Header")
 */
export const BlockHeaderToken = {
    len: 32,
    get: (buf, off) => {
        const flags = Token.UINT32_LE.get(buf, off + 24);
        const res = {
            // should equal 'wvpk'
            BlockID: FourCcToken.get(buf, off),
            //  0x402 to 0x410 are valid for decode
            blockSize: Token.UINT32_LE.get(buf, off + 4),
            //  0x402 (1026) to 0x410 are valid for decode
            version: Token.UINT16_LE.get(buf, off + 8),
            //  40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
            totalSamples: /* replace with bigint? (Token.UINT8.get(buf, off + 11) << 32) + */ Token.UINT32_LE.get(buf, off + 12),
            // 40-bit block_index
            blockIndex: /* replace with bigint? (Token.UINT8.get(buf, off + 10) << 32) + */ Token.UINT32_LE.get(buf, off + 16),
            // 40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
            blockSamples: Token.UINT32_LE.get(buf, off + 20),
            // various flags for id and decoding
            flags: {
                bitsPerSample: (1 + getBitAllignedNumber(flags, 0, 2)) * 8,
                isMono: isBitSet(flags, 2),
                isHybrid: isBitSet(flags, 3),
                isJointStereo: isBitSet(flags, 4),
                crossChannel: isBitSet(flags, 5),
                hybridNoiseShaping: isBitSet(flags, 6),
                floatingPoint: isBitSet(flags, 7),
                samplingRate: SampleRates[getBitAllignedNumber(flags, 23, 4)],
                isDSD: isBitSet(flags, 31)
            },
            // crc for actual decoded data
            crc: new Token.Uint8ArrayType(4).get(buf, off + 28)
        };
        if (res.flags.isDSD) {
            res.totalSamples *= 8;
        }
        return res;
    }
};
/**
 * 3.0 Metadata Sub-Blocks
 * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf (page 4/6: 3.0 "Metadata Sub-Block")
 */
export const MetadataIdToken = {
    len: 1,
    get: (buf, off) => {
        return {
            functionId: getBitAllignedNumber(buf[off], 0, 6), // functionId overlaps with isOptional flag
            isOptional: isBitSet(buf[off], 5),
            isOddSize: isBitSet(buf[off], 6),
            largeBlock: isBitSet(buf[off], 7)
        };
    }
};
function isBitSet(flags, bitOffset) {
    return getBitAllignedNumber(flags, bitOffset, 1) === 1;
}
function getBitAllignedNumber(flags, bitOffset, len) {
    return (flags >>> bitOffset) & (0xffffffff >>> (32 - len));
}
