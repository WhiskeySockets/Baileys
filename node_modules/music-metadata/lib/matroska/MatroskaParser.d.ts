import { BasicParser } from '../common/BasicParser.js';
/**
 * Extensible Binary Meta Language (EBML) parser
 * https://en.wikipedia.org/wiki/Extensible_Binary_Meta_Language
 * http://matroska.sourceforge.net/technical/specs/rfc/index.html
 *
 * WEBM VP8 AUDIO FILE
 */
export declare class MatroskaParser extends BasicParser {
    private seekHead;
    private seekHeadOffset;
    /**
     * Use index to skip multiple segment/cluster elements at once.
     * Significant performance impact
     */
    private flagUseIndexToSkipClusters;
    parse(): Promise<void>;
    private addTag;
}
