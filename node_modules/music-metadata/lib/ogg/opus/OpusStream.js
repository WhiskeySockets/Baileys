import * as Token from 'token-types';
import { VorbisStream } from '../vorbis/VorbisStream.js';
import * as Opus from './Opus.js';
import { OpusContentError } from './Opus.js';
/**
 * Opus parser
 * Internet Engineering Task Force (IETF) - RFC 6716
 * Used by OggStream
 */
export class OpusStream extends VorbisStream {
    constructor(metadata, options, tokenizer) {
        super(metadata, options);
        this.idHeader = null;
        this.lastPos = -1;
        this.tokenizer = tokenizer;
        this.durationOnLastPage = true;
    }
    /**
     * Parse first Opus Ogg page
     * @param {IPageHeader} header
     * @param {Uint8Array} pageData
     */
    parseFirstPage(_header, pageData) {
        this.metadata.setFormat('codec', 'Opus');
        // Parse Opus ID Header
        this.idHeader = new Opus.IdHeader(pageData.length).get(pageData, 0);
        if (this.idHeader.magicSignature !== "OpusHead")
            throw new OpusContentError("Illegal ogg/Opus magic-signature");
        this.metadata.setFormat('sampleRate', this.idHeader.inputSampleRate);
        this.metadata.setFormat('numberOfChannels', this.idHeader.channelCount);
        this.metadata.setAudioOnly();
    }
    async parseFullPage(pageData) {
        const magicSignature = new Token.StringType(8, 'ascii').get(pageData, 0);
        switch (magicSignature) {
            case 'OpusTags':
                await this.parseUserCommentList(pageData, 8);
                this.lastPos = this.tokenizer.position - pageData.length;
                break;
            default:
                break;
        }
    }
    calculateDuration() {
        if (this.lastPageHeader && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
            // Calculate duration
            const pos_48bit = this.lastPageHeader.absoluteGranulePosition - this.idHeader.preSkip;
            this.metadata.setFormat('numberOfSamples', pos_48bit);
            this.metadata.setFormat('duration', pos_48bit / 48000);
            if (this.lastPos !== -1 && this.tokenizer.fileInfo.size && this.metadata.format.duration) {
                const dataSize = this.tokenizer.fileInfo.size - this.lastPos;
                this.metadata.setFormat('bitrate', 8 * dataSize / this.metadata.format.duration);
            }
        }
    }
}
