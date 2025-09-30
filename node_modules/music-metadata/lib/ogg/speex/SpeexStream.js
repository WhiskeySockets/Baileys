import initDebug from 'debug';
import { VorbisStream } from '../vorbis/VorbisStream.js';
import * as Speex from './Speex.js';
const debug = initDebug('music-metadata:parser:ogg:speex');
/**
 * Speex, RFC 5574
 * Ref:
 * - https://www.speex.org/docs/manual/speex-manual/
 * - https://tools.ietf.org/html/rfc5574
 */
export class SpeexStream extends VorbisStream {
    constructor(metadata, options, _tokenizer) {
        super(metadata, options);
    }
    /**
     * Parse first Speex Ogg page
     * @param {IPageHeader} header
     * @param {Uint8Array} pageData
     */
    parseFirstPage(_header, pageData) {
        debug('First Ogg/Speex page');
        const speexHeader = Speex.Header.get(pageData, 0);
        this.metadata.setFormat('codec', `Speex ${speexHeader.version}`);
        this.metadata.setFormat('numberOfChannels', speexHeader.nb_channels);
        this.metadata.setFormat('sampleRate', speexHeader.rate);
        if (speexHeader.bitrate !== -1) {
            this.metadata.setFormat('bitrate', speexHeader.bitrate);
        }
        this.metadata.setAudioOnly();
    }
}
