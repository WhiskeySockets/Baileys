import * as Token from 'token-types';
import { textDecode } from '@borewit/text-codec';
export class VorbisDecoder {
    constructor(data, offset) {
        this.data = data;
        this.offset = offset;
    }
    readInt32() {
        const value = Token.UINT32_LE.get(this.data, this.offset);
        this.offset += 4;
        return value;
    }
    readStringUtf8() {
        const len = this.readInt32();
        const value = textDecode(this.data.subarray(this.offset, this.offset + len), 'utf-8');
        this.offset += len;
        return value;
    }
    parseUserComment() {
        const offset0 = this.offset;
        const v = this.readStringUtf8();
        const idx = v.indexOf('=');
        return {
            key: v.substring(0, idx).toUpperCase(),
            value: v.substring(idx + 1),
            len: this.offset - offset0
        };
    }
}
