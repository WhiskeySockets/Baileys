import type { IGetToken } from 'strtok3';
export interface IReplayGain {
    type: NameCode;
    origin: ReplayGainOriginator;
    adjustment: number;
}
/**
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format#name-code
 */
declare const NameCode: {
    /**
     * not set
     */
    not_set: number;
    /**
     * Radio Gain Adjustment
     */
    radio: number;
    /**
     * Audiophile Gain Adjustment
     */
    audiophile: number;
};
type NameCode = typeof NameCode[keyof typeof NameCode];
/**
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format#originator-code
 */
declare const ReplayGainOriginator: {
    /**
     * Replay Gain unspecified
     */
    unspecified: number;
    /**
     * Replay Gain pre-set by artist/producer/mastering engineer
     */
    engineer: number;
    /**
     * Replay Gain set by user
     */
    user: number;
    /**
     * Replay Gain determined automatically, as described on this site
     */
    automatic: number;
    /**
     * Set by simple RMS average
     */
    rms_average: number;
};
type ReplayGainOriginator = typeof ReplayGainOriginator[keyof typeof ReplayGainOriginator];
/**
 * Replay Gain Data Format
 *
 * https://github.com/Borewit/music-metadata/wiki/Replay-Gain-Data-Format
 */
export declare const ReplayGain: IGetToken<IReplayGain | undefined>;
export {};
