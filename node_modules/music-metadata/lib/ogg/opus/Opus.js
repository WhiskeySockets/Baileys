import * as Token from 'token-types';
import { makeUnexpectedFileContentError } from '../../ParseError.js';
export class OpusContentError extends makeUnexpectedFileContentError('Opus') {
}
/**
 * Opus ID Header parser
 * Ref: https://wiki.xiph.org/OggOpus#ID_Header
 */
export class IdHeader {
    constructor(len) {
        if (len < 19) {
            throw new OpusContentError('ID-header-page 0 should be at least 19 bytes long');
        }
        this.len = len;
    }
    get(buf, off) {
        return {
            magicSignature: new Token.StringType(8, 'ascii').get(buf, off + 0),
            version: Token.UINT8.get(buf, off + 8),
            channelCount: Token.UINT8.get(buf, off + 9),
            preSkip: Token.UINT16_LE.get(buf, off + 10),
            inputSampleRate: Token.UINT32_LE.get(buf, off + 12),
            outputGain: Token.UINT16_LE.get(buf, off + 16),
            channelMapping: Token.UINT8.get(buf, off + 18)
        };
    }
}
