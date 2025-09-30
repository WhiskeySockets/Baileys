import * as Token from 'token-types';
/**
 * 6.2 Identification Header
 * Ref: https://theora.org/doc/Theora.pdf: 6.2 Identification Header Decode
 */
export const IdentificationHeader = {
    len: 42,
    get: (buf, off) => {
        return {
            id: new Token.StringType(7, 'ascii').get(buf, off),
            vmaj: Token.UINT8.get(buf, off + 7),
            vmin: Token.UINT8.get(buf, off + 8),
            vrev: Token.UINT8.get(buf, off + 9),
            vmbw: Token.UINT16_BE.get(buf, off + 10),
            vmbh: Token.UINT16_BE.get(buf, off + 17),
            nombr: Token.UINT24_BE.get(buf, off + 37),
            nqual: Token.UINT8.get(buf, off + 40)
        };
    }
};
