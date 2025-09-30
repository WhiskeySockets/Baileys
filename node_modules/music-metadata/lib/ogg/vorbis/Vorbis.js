import * as Token from 'token-types';
import { AttachedPictureType } from '../../id3v2/ID3v2Token.js';
/**
 * Parse the METADATA_BLOCK_PICTURE
 * Ref: https://wiki.xiph.org/VorbisComment#METADATA_BLOCK_PICTURE
 * Ref: https://xiph.org/flac/format.html#metadata_block_picture
 * // ToDo: move to ID3 / APIC?
 */
export class VorbisPictureToken {
    static fromBase64(base64str) {
        return VorbisPictureToken.fromBuffer(Uint8Array.from(atob(base64str), c => c.charCodeAt(0)));
    }
    static fromBuffer(buffer) {
        const pic = new VorbisPictureToken(buffer.length);
        return pic.get(buffer, 0);
    }
    constructor(len) {
        this.len = len;
    }
    get(buffer, offset) {
        const type = AttachedPictureType[Token.UINT32_BE.get(buffer, offset)];
        offset += 4;
        const mimeLen = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const format = new Token.StringType(mimeLen, 'utf-8').get(buffer, offset);
        offset += mimeLen;
        const descLen = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const description = new Token.StringType(descLen, 'utf-8').get(buffer, offset);
        offset += descLen;
        const width = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const height = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const colour_depth = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const indexed_color = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const picDataLen = Token.UINT32_BE.get(buffer, offset);
        offset += 4;
        const data = buffer.slice(offset, offset + picDataLen);
        return {
            type,
            format,
            description,
            width,
            height,
            colour_depth,
            indexed_color,
            data
        };
    }
}
/**
 * Comment header decoder
 * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-620004.2.1
 */
export const CommonHeader = {
    len: 7,
    get: (buf, off) => {
        return {
            packetType: Token.UINT8.get(buf, off),
            vorbis: new Token.StringType(6, 'ascii').get(buf, off + 1)
        };
    }
};
/**
 * Identification header decoder
 * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-630004.2.2
 */
export const IdentificationHeader = {
    len: 23,
    get: (uint8Array, off) => {
        return {
            version: Token.UINT32_LE.get(uint8Array, off + 0),
            channelMode: Token.UINT8.get(uint8Array, off + 4),
            sampleRate: Token.UINT32_LE.get(uint8Array, off + 5),
            bitrateMax: Token.UINT32_LE.get(uint8Array, off + 9),
            bitrateNominal: Token.UINT32_LE.get(uint8Array, off + 13),
            bitrateMin: Token.UINT32_LE.get(uint8Array, off + 17)
        };
    }
};
