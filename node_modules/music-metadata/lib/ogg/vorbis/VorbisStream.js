import * as Token from 'token-types';
import debugInit from 'debug';
import { VorbisDecoder } from './VorbisDecoder.js';
import { CommonHeader, IdentificationHeader, VorbisPictureToken } from './Vorbis.js';
import { makeUnexpectedFileContentError } from '../../ParseError.js';
const debug = debugInit('music-metadata:parser:ogg:vorbis1');
export class VorbisContentError extends makeUnexpectedFileContentError('Vorbis') {
}
/**
 * Vorbis 1 Parser.
 * Used by OggStream
 */
export class VorbisStream {
    constructor(metadata, options) {
        this.pageSegments = [];
        this.durationOnLastPage = true;
        this.metadata = metadata;
        this.options = options;
    }
    /**
     * Vorbis 1 parser
     * @param header Ogg Page Header
     * @param pageData Page data
     */
    async parsePage(header, pageData) {
        this.lastPageHeader = header;
        if (header.headerType.firstPage) {
            this.parseFirstPage(header, pageData);
        }
        else {
            if (header.headerType.continued) {
                if (this.pageSegments.length === 0) {
                    throw new VorbisContentError('Cannot continue on previous page');
                }
                this.pageSegments.push(pageData);
            }
            if (header.headerType.lastPage || !header.headerType.continued) {
                // Flush page segments
                if (this.pageSegments.length > 0) {
                    const fullPage = VorbisStream.mergeUint8Arrays(this.pageSegments);
                    await this.parseFullPage(fullPage);
                }
                // Reset page segments
                this.pageSegments = header.headerType.lastPage ? [] : [pageData];
            }
        }
    }
    static mergeUint8Arrays(arrays) {
        const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
        const merged = new Uint8Array(totalSize);
        arrays.forEach((array, i, _arrays) => {
            const offset = _arrays.slice(0, i).reduce((acc, e) => acc + e.length, 0);
            merged.set(array, offset);
        });
        return merged;
    }
    async flush() {
        await this.parseFullPage(VorbisStream.mergeUint8Arrays(this.pageSegments));
    }
    async parseUserComment(pageData, offset) {
        const decoder = new VorbisDecoder(pageData, offset);
        const tag = decoder.parseUserComment();
        await this.addTag(tag.key, tag.value);
        return tag.len;
    }
    async addTag(id, value) {
        if (id === 'METADATA_BLOCK_PICTURE' && (typeof value === 'string')) {
            if (this.options.skipCovers) {
                debug("Ignore picture");
                return;
            }
            value = VorbisPictureToken.fromBase64(value);
            debug(`Push picture: id=${id}, format=${value.format}`);
        }
        else {
            debug(`Push tag: id=${id}, value=${value}`);
        }
        await this.metadata.addTag('vorbis', id, value);
    }
    calculateDuration() {
        if (this.lastPageHeader && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
            // Calculate duration
            this.metadata.setFormat('numberOfSamples', this.lastPageHeader.absoluteGranulePosition);
            this.metadata.setFormat('duration', this.lastPageHeader.absoluteGranulePosition / this.metadata.format.sampleRate);
        }
    }
    /**
     * Parse first Ogg/Vorbis page
     * @param _header
     * @param pageData
     */
    parseFirstPage(_header, pageData) {
        this.metadata.setFormat('codec', 'Vorbis I');
        this.metadata.setFormat('hasAudio', true);
        debug('Parse first page');
        // Parse  Vorbis common header
        const commonHeader = CommonHeader.get(pageData, 0);
        if (commonHeader.vorbis !== 'vorbis')
            throw new VorbisContentError('Metadata does not look like Vorbis');
        if (commonHeader.packetType === 1) {
            const idHeader = IdentificationHeader.get(pageData, CommonHeader.len);
            this.metadata.setFormat('sampleRate', idHeader.sampleRate);
            this.metadata.setFormat('bitrate', idHeader.bitrateNominal);
            this.metadata.setFormat('numberOfChannels', idHeader.channelMode);
            debug('sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s', idHeader.sampleRate, idHeader.bitrateNominal, idHeader.channelMode);
        }
        else
            throw new VorbisContentError('First Ogg page should be type 1: the identification header');
    }
    async parseFullPage(pageData) {
        // New page
        const commonHeader = CommonHeader.get(pageData, 0);
        debug('Parse full page: type=%s, byteLength=%s', commonHeader.packetType, pageData.byteLength);
        switch (commonHeader.packetType) {
            case 3: //  type 3: comment header
                return this.parseUserCommentList(pageData, CommonHeader.len);
            case 1: // type 1: the identification header
            case 5: // type 5: setup header type
                break; // ignore
        }
    }
    /**
     * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-840005.2
     */
    async parseUserCommentList(pageData, offset) {
        const strLen = Token.UINT32_LE.get(pageData, offset);
        offset += 4;
        // const vendorString = new Token.StringType(strLen, 'utf-8').get(pageData, offset);
        offset += strLen;
        let userCommentListLength = Token.UINT32_LE.get(pageData, offset);
        offset += 4;
        while (userCommentListLength-- > 0) {
            offset += (await this.parseUserComment(pageData, offset));
        }
    }
}
