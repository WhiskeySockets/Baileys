import type { IGetToken } from 'strtok3';
import type { IChunkHeader64 } from '../iff/index.js';
export type { IChunkHeader64 } from '../iff/index.js';
/**
 * DSDIFF chunk header
 * The data-size encoding is deviating from EA-IFF 85
 * Ref: http://www.sonicstudio.com/pdf/dsd/DSDIFF_1.5_Spec.pdf
 */
export declare const ChunkHeader64: IGetToken<IChunkHeader64>;
