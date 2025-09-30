import type { ITokenizer } from 'strtok3';
import type * as Ogg from '../OggToken.js';
import type { IOptions } from '../../type.js';
import type { INativeMetadataCollector } from '../../common/MetadataCollector.js';
/**
 * Ref:
 * - https://xiph.org/flac/ogg_mapping.html
 */
export declare class FlacStream implements Ogg.IPageConsumer {
    private metadata;
    private options;
    private tokenizer;
    private flacParser;
    durationOnLastPage: boolean;
    constructor(metadata: INativeMetadataCollector, options: IOptions, tokenizer: ITokenizer);
    /**
     * Vorbis 1 parser
     * @param header Ogg Page Header
     * @param pageData Page data
     */
    parsePage(header: Ogg.IPageHeader, pageData: Uint8Array): Promise<void>;
    calculateDuration(): void;
    /**
     * Parse first Theora Ogg page. the initial identification header packet
     */
    protected parseFirstPage(_header: Ogg.IPageHeader, pageData: Uint8Array): Promise<void>;
    private parseDataBlock;
    flush(): Promise<void>;
}
