import * as common from '../common/Util.js';
/**
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format#name-code
 */
const NameCode = {
    /**
     * not set
     */
    not_set: 0,
    /**
     * Radio Gain Adjustment
     */
    radio: 1,
    /**
     * Audiophile Gain Adjustment
     */
    audiophile: 2
};
/**
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format#originator-code
 */
const ReplayGainOriginator = {
    /**
     * Replay Gain unspecified
     */
    unspecified: 0,
    /**
     * Replay Gain pre-set by artist/producer/mastering engineer
     */
    engineer: 1,
    /**
     * Replay Gain set by user
     */
    user: 2,
    /**
     * Replay Gain determined automatically, as described on this site
     */
    automatic: 3,
    /**
     * Set by simple RMS average
     */
    rms_average: 4
};
/**
 * Replay Gain Data Format
 *
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format
 */
export const ReplayGain = {
    len: 2,
    get: (buf, off) => {
        const gain_type = common.getBitAllignedNumber(buf, off, 0, 3);
        const sign = common.getBitAllignedNumber(buf, off, 6, 1);
        const gain_adj = common.getBitAllignedNumber(buf, off, 7, 9) / 10.0;
        if (gain_type > 0) {
            return {
                type: common.getBitAllignedNumber(buf, off, 0, 3),
                origin: common.getBitAllignedNumber(buf, off, 3, 3),
                adjustment: (sign ? -gain_adj : gain_adj)
            };
        }
        return undefined;
    }
};
