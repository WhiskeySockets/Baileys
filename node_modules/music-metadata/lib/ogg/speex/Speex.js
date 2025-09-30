import * as Token from 'token-types';
import * as util from '../../common/Util.js';
/**
 * Speex Header Packet
 * Ref: https://www.speex.org/docs/manual/speex-manual/node8.html#SECTION00830000000000000000
 */
export const Header = {
    len: 80,
    get: (buf, off) => {
        return {
            speex: new Token.StringType(8, 'ascii').get(buf, off + 0),
            version: util.trimRightNull(new Token.StringType(20, 'ascii').get(buf, off + 8)),
            version_id: Token.INT32_LE.get(buf, off + 28),
            header_size: Token.INT32_LE.get(buf, off + 32),
            rate: Token.INT32_LE.get(buf, off + 36),
            mode: Token.INT32_LE.get(buf, off + 40),
            mode_bitstream_version: Token.INT32_LE.get(buf, off + 44),
            nb_channels: Token.INT32_LE.get(buf, off + 48),
            bitrate: Token.INT32_LE.get(buf, off + 52),
            frame_size: Token.INT32_LE.get(buf, off + 56),
            vbr: Token.INT32_LE.get(buf, off + 60),
            frames_per_packet: Token.INT32_LE.get(buf, off + 64),
            extra_headers: Token.INT32_LE.get(buf, off + 68),
            reserved1: Token.INT32_LE.get(buf, off + 72),
            reserved2: Token.INT32_LE.get(buf, off + 76)
        };
    }
};
