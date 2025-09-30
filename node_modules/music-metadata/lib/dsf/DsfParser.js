import initDebug from 'debug';
import { AbstractID3Parser } from '../id3v2/AbstractID3Parser.js';
import { ChunkHeader, DsdChunk, FormatChunk } from './DsfChunk.js';
import { ID3v2Parser } from "../id3v2/ID3v2Parser.js";
import { makeUnexpectedFileContentError } from '../ParseError.js';
const debug = initDebug('music-metadata:parser:DSF');
export class DsdContentParseError extends makeUnexpectedFileContentError('DSD') {
}
/**
 * DSF (dsd stream file) File Parser
 * Ref: https://dsd-guide.com/sites/default/files/white-papers/DSFFileFormatSpec_E.pdf
 */
export class DsfParser extends AbstractID3Parser {
    async postId3v2Parse() {
        const p0 = this.tokenizer.position; // mark start position, normally 0
        const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
        if (chunkHeader.id !== 'DSD ')
            throw new DsdContentParseError('Invalid chunk signature');
        this.metadata.setFormat('container', 'DSF');
        this.metadata.setFormat('lossless', true);
        this.metadata.setAudioOnly();
        const dsdChunk = await this.tokenizer.readToken(DsdChunk);
        if (dsdChunk.metadataPointer === BigInt(0)) {
            debug("No ID3v2 tag present");
        }
        else {
            debug(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
            await this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
            // Jump to ID3 header
            await this.tokenizer.ignore(Number(dsdChunk.metadataPointer) - this.tokenizer.position - p0);
            return new ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
        }
    }
    async parseChunks(bytesRemaining) {
        while (bytesRemaining >= ChunkHeader.len) {
            const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
            debug(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
            switch (chunkHeader.id) {
                case 'fmt ': {
                    const formatChunk = await this.tokenizer.readToken(FormatChunk);
                    this.metadata.setFormat('numberOfChannels', formatChunk.channelNum);
                    this.metadata.setFormat('sampleRate', formatChunk.samplingFrequency);
                    this.metadata.setFormat('bitsPerSample', formatChunk.bitsPerSample);
                    this.metadata.setFormat('numberOfSamples', formatChunk.sampleCount);
                    this.metadata.setFormat('duration', Number(formatChunk.sampleCount) / formatChunk.samplingFrequency);
                    const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
                    this.metadata.setFormat('bitrate', bitrate);
                    return; // We got what we want, stop further processing of chunks
                }
                default:
                    this.tokenizer.ignore(Number(chunkHeader.size) - ChunkHeader.len);
                    break;
            }
            bytesRemaining -= chunkHeader.size;
        }
    }
}
