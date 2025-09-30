import * as Token from 'token-types';
import { FourCcToken } from '../common/FourCC.js';
/**
 * DSDIFF chunk header
 * The data-size encoding is deviating from EA-IFF 85
 * Ref: http://www.sonicstudio.com/pdf/dsd/DSDIFF_1.5_Spec.pdf
 */
export const ChunkHeader64 = {
    len: 12,
    get: (buf, off) => {
        return {
            // Group-ID
            chunkID: FourCcToken.get(buf, off),
            // Size
            chunkSize: Token.INT64_BE.get(buf, off + 4)
        };
    }
};
