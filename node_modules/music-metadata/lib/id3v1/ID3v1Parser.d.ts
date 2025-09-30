import type { IRandomAccessTokenizer, ITokenizer } from 'strtok3';
import { BasicParser } from '../common/BasicParser.js';
import type { IPrivateOptions } from '../type.js';
import type { INativeMetadataCollector } from '../common/MetadataCollector.js';
/**
 * ID3v1 Genre mappings
 * Ref: https://de.wikipedia.org/wiki/Liste_der_ID3v1-Genres
 */
export declare const Genres: string[];
export declare class ID3v1Parser extends BasicParser {
    private apeHeader;
    constructor(metadata: INativeMetadataCollector, tokenizer: ITokenizer, options: IPrivateOptions);
    private static getGenre;
    parse(): Promise<void>;
    private addTag;
}
export declare function hasID3v1Header(tokenizer: IRandomAccessTokenizer): Promise<boolean>;
