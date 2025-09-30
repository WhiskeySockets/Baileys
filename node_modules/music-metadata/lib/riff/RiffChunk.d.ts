import type { IGetToken } from 'strtok3';
import type { IChunkHeader } from '../iff/index.js';
export type { IChunkHeader } from '../iff/index.js';
/**
 * Common RIFF chunk header
 */
export declare const Header: IGetToken<IChunkHeader>;
/**
 * Token to parse RIFF-INFO tag value
 */
export declare class ListInfoTagValue implements IGetToken<string> {
    len: number;
    private tagHeader;
    constructor(tagHeader: IChunkHeader);
    get(buf: Uint8Array, off: number): string;
}
