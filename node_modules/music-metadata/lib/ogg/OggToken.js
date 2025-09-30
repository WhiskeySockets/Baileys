import * as Token from 'token-types';
import * as util from '../common/Util.js';
import { StringType } from 'token-types';
export const PageHeader = {
    len: 27,
    get: (buf, off) => {
        return {
            capturePattern: new StringType(4, 'latin1').get(buf, off),
            version: Token.UINT8.get(buf, off + 4),
            headerType: {
                continued: util.getBit(buf, off + 5, 0),
                firstPage: util.getBit(buf, off + 5, 1),
                lastPage: util.getBit(buf, off + 5, 2)
            },
            // packet_flag: Token.UINT8.get(buf, off + 5),
            absoluteGranulePosition: Number(Token.UINT64_LE.get(buf, off + 6)),
            streamSerialNumber: Token.UINT32_LE.get(buf, off + 14),
            pageSequenceNo: Token.UINT32_LE.get(buf, off + 18),
            pageChecksum: Token.UINT32_LE.get(buf, off + 22),
            page_segments: Token.UINT8.get(buf, off + 26)
        };
    }
};
export class SegmentTable {
    static sum(buf, off, len) {
        const dv = new DataView(buf.buffer, 0);
        let s = 0;
        for (let i = off; i < off + len; ++i) {
            s += dv.getUint8(i);
        }
        return s;
    }
    constructor(header) {
        this.len = header.page_segments;
    }
    get(buf, off) {
        return {
            totalPageSize: SegmentTable.sum(buf, off, this.len)
        };
    }
}
