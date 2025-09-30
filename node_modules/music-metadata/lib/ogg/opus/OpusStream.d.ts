import type { ITokenizer } from 'strtok3';
import type { IPageHeader } from '../OggToken.js';
import { VorbisStream } from '../vorbis/VorbisStream.js';
import type { IOptions } from '../../type.js';
import type { INativeMetadataCollector } from '../../common/MetadataCollector.js';
/**
 * Opus parser
 * Internet Engineering Task Force (IETF) - RFC 6716
 * Used by OggStream
 */
export declare class OpusStream extends VorbisStream {
    private idHeader;
    private lastPos;
    private tokenizer;
    constructor(metadata: INativeMetadataCollector, options: IOptions, tokenizer: ITokenizer);
    /**
     * Parse first Opus Ogg page
     * @param {IPageHeader} header
     * @param {Uint8Array} pageData
     */
    protected parseFirstPage(_header: IPageHeader, pageData: Uint8Array): void;
    protected parseFullPage(pageData: Uint8Array): Promise<void>;
    calculateDuration(): void;
}
