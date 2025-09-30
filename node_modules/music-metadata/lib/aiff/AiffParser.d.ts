import { BasicParser } from '../common/BasicParser.js';
import * as iff from '../iff/index.js';
/**
 * AIFF - Audio Interchange File Format
 *
 * Ref:
 * - http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/AIFF/AIFF.html
 * - http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/AIFF/Docs/AIFF-1.3.pdf
 */
export declare class AIFFParser extends BasicParser {
    private isCompressed;
    parse(): Promise<void>;
    readData(header: iff.IChunkHeader): Promise<number>;
    readTextChunk(header: iff.IChunkHeader): Promise<number>;
}
