import { type ILyricsTag } from '../type.js';
/**
 * Parse LRC (Lyrics) formatted text
 * Ref: https://en.wikipedia.org/wiki/LRC_(file_format)
 * @param lrcString
 */
export declare function parseLrc(lrcString: string): ILyricsTag;
