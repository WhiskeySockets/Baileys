import * as Token from 'token-types';
import * as util from '../common/Util.js';
import { ExtendedLameHeader } from './ExtendedLameHeader.js';
/**
 * Info Tag: Xing, LAME
 */
export const InfoTagHeaderTag = new Token.StringType(4, 'ascii');
/**
 * LAME TAG value
 * Did not find any official documentation for this
 * Value e.g.: "3.98.4"
 */
export const LameEncoderVersion = new Token.StringType(6, 'ascii');
/**
 * Info Tag
 * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
 */
export const XingHeaderFlags = {
    len: 4,
    get: (buf, off) => {
        return {
            frames: util.isBitSet(buf, off, 31),
            bytes: util.isBitSet(buf, off, 30),
            toc: util.isBitSet(buf, off, 29),
            vbrScale: util.isBitSet(buf, off, 28)
        };
    }
};
// /**
//  * XING Header Tag
//  * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
//  */
export async function readXingHeader(tokenizer) {
    const flags = await tokenizer.readToken(XingHeaderFlags);
    const xingInfoTag = { numFrames: null, streamSize: null, vbrScale: null };
    if (flags.frames) {
        xingInfoTag.numFrames = await tokenizer.readToken(Token.UINT32_BE);
    }
    if (flags.bytes) {
        xingInfoTag.streamSize = await tokenizer.readToken(Token.UINT32_BE);
    }
    if (flags.toc) {
        xingInfoTag.toc = new Uint8Array(100);
        await tokenizer.readBuffer(xingInfoTag.toc);
    }
    if (flags.vbrScale) {
        xingInfoTag.vbrScale = await tokenizer.readToken(Token.UINT32_BE);
    }
    const lameTag = await tokenizer.peekToken(new Token.StringType(4, 'ascii'));
    if (lameTag === 'LAME') {
        await tokenizer.ignore(4);
        xingInfoTag.lame = {
            version: await tokenizer.readToken(new Token.StringType(5, 'ascii'))
        };
        const match = xingInfoTag.lame.version.match(/\d+.\d+/g);
        if (match !== null) {
            const majorMinorVersion = match[0]; // e.g. 3.97
            const version = majorMinorVersion.split('.').map(n => Number.parseInt(n, 10));
            if (version[0] >= 3 && version[1] >= 90) {
                xingInfoTag.lame.extended = await tokenizer.readToken(ExtendedLameHeader);
            }
        }
    }
    return xingInfoTag;
}
