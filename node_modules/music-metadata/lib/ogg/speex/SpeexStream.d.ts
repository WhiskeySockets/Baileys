import type { ITokenizer } from 'strtok3';
import type { IPageHeader } from '../OggToken.js';
import { VorbisStream } from '../vorbis/VorbisStream.js';
import type { IOptions } from '../../type.js';
import type { INativeMetadataCollector } from '../../common/MetadataCollector.js';
/**
 * Speex, RFC 5574
 * Ref:
 * - https://www.speex.org/docs/manual/speex-manual/
 * - https://tools.ietf.org/html/rfc5574
 */
export declare class SpeexStream extends VorbisStream {
    constructor(metadata: INativeMetadataCollector, options: IOptions, _tokenizer: ITokenizer);
    /**
     * Parse first Speex Ogg page
     * @param {IPageHeader} header
     * @param {Uint8Array} pageData
     */
    protected parseFirstPage(_header: IPageHeader, pageData: Uint8Array): void;
}
