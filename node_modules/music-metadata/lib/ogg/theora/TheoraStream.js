import initDebug from 'debug';
import { IdentificationHeader } from './Theora.js';
const debug = initDebug('music-metadata:parser:ogg:theora');
/**
 * Ref:
 * - https://theora.org/doc/Theora.pdf
 */
export class TheoraStream {
    constructor(metadata, _options, _tokenizer) {
        this.durationOnLastPage = false;
        this.metadata = metadata;
    }
    /**
     * Vorbis 1 parser
     * @param header Ogg Page Header
     * @param pageData Page data
     */
    async parsePage(header, pageData) {
        if (header.headerType.firstPage) {
            await this.parseFirstPage(header, pageData);
        }
    }
    calculateDuration() {
        debug('duration calculation not implemented');
    }
    /**
     * Parse first Theora Ogg page. the initial identification header packet
     */
    async parseFirstPage(_header, pageData) {
        debug('First Ogg/Theora page');
        this.metadata.setFormat('codec', 'Theora');
        const idHeader = IdentificationHeader.get(pageData, 0);
        this.metadata.setFormat('bitrate', idHeader.nombr);
        this.metadata.setFormat('hasVideo', true);
    }
    flush() {
        return Promise.resolve();
    }
}
