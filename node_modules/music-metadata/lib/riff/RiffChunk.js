import * as Token from 'token-types';
/**
 * Common RIFF chunk header
 */
export const Header = {
    len: 8,
    get: (buf, off) => {
        return {
            // Group-ID
            chunkID: new Token.StringType(4, 'latin1').get(buf, off),
            // Size
            chunkSize: Token.UINT32_LE.get(buf, off + 4)
        };
    }
};
/**
 * Token to parse RIFF-INFO tag value
 */
export class ListInfoTagValue {
    constructor(tagHeader) {
        this.tagHeader = tagHeader;
        this.len = tagHeader.chunkSize;
        this.len += this.len & 1; // if it is an odd length, round up to even
    }
    get(buf, off) {
        return new Token.StringType(this.tagHeader.chunkSize, 'ascii').get(buf, off);
    }
}
