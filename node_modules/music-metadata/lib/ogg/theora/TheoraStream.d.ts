import type { ITokenizer } from 'strtok3';
import type * as Ogg from '../OggToken.js';
import type { IOptions } from '../../type.js';
import type { INativeMetadataCollector } from '../../common/MetadataCollector.js';
/**
 * Ref:
 * - https://theora.org/doc/Theora.pdf
 */
export declare class TheoraStream implements Ogg.IPageConsumer {
    private metadata;
    durationOnLastPage: boolean;
    constructor(metadata: INativeMetadataCollector, _options: IOptions, _tokenizer: ITokenizer);
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
    flush(): Promise<void>;
}
