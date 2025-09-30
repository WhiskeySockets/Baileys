import * as Token from 'token-types';
import initDebug from 'debug';
import * as strtok3 from 'strtok3';
import { ID3v2Parser } from '../id3v2/ID3v2Parser.js';
import { FourCcToken } from '../common/FourCC.js';
import { BasicParser } from '../common/BasicParser.js';
import * as AiffToken from './AiffToken.js';
import { AiffContentError, compressionTypes } from './AiffToken.js';
import * as iff from '../iff/index.js';
const debug = initDebug('music-metadata:parser:aiff');
/**
 * AIFF - Audio Interchange File Format
 *
 * Ref:
 * - http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/AIFF/AIFF.html
 * - http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/AIFF/Docs/AIFF-1.3.pdf
 */
export class AIFFParser extends BasicParser {
    constructor() {
        super(...arguments);
        this.isCompressed = null;
    }
    async parse() {
        const header = await this.tokenizer.readToken(iff.Header);
        if (header.chunkID !== 'FORM')
            throw new AiffContentError('Invalid Chunk-ID, expected \'FORM\''); // Not AIFF format
        const type = await this.tokenizer.readToken(FourCcToken);
        switch (type) {
            case 'AIFF':
                this.metadata.setFormat('container', type);
                this.isCompressed = false;
                break;
            case 'AIFC':
                this.metadata.setFormat('container', 'AIFF-C');
                this.isCompressed = true;
                break;
            default:
                throw new AiffContentError(`Unsupported AIFF type: ${type}`);
        }
        this.metadata.setFormat('lossless', !this.isCompressed);
        this.metadata.setAudioOnly();
        try {
            while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= iff.Header.len) {
                debug(`Reading AIFF chunk at offset=${this.tokenizer.position}`);
                const chunkHeader = await this.tokenizer.readToken(iff.Header);
                const nextChunk = 2 * Math.round(chunkHeader.chunkSize / 2);
                const bytesRead = await this.readData(chunkHeader);
                await this.tokenizer.ignore(nextChunk - bytesRead);
            }
        }
        catch (err) {
            if (err instanceof strtok3.EndOfStreamError) {
                debug("End-of-stream");
            }
            else {
                throw err;
            }
        }
    }
    async readData(header) {
        switch (header.chunkID) {
            case 'COMM': { // The Common Chunk
                if (this.isCompressed === null) {
                    throw new AiffContentError('Failed to parse AIFF.COMM chunk when compression type is unknown');
                }
                const common = await this.tokenizer.readToken(new AiffToken.Common(header, this.isCompressed));
                this.metadata.setFormat('bitsPerSample', common.sampleSize);
                this.metadata.setFormat('sampleRate', common.sampleRate);
                this.metadata.setFormat('numberOfChannels', common.numChannels);
                this.metadata.setFormat('numberOfSamples', common.numSampleFrames);
                this.metadata.setFormat('duration', common.numSampleFrames / common.sampleRate);
                if (common.compressionName || common.compressionType) {
                    this.metadata.setFormat('codec', common.compressionName ?? compressionTypes[common.compressionType]);
                }
                return header.chunkSize;
            }
            case 'ID3 ': { // ID3-meta-data
                const id3_data = await this.tokenizer.readToken(new Token.Uint8ArrayType(header.chunkSize));
                const rst = strtok3.fromBuffer(id3_data);
                await new ID3v2Parser().parse(this.metadata, rst, this.options);
                return header.chunkSize;
            }
            case 'SSND': // Sound Data Chunk
                if (this.metadata.format.duration) {
                    this.metadata.setFormat('bitrate', 8 * header.chunkSize / this.metadata.format.duration);
                }
                return 0;
            case 'NAME': // Sample name chunk
            case 'AUTH': // Author chunk
            case '(c) ': // Copyright chunk
            case 'ANNO': // Annotation chunk
                return this.readTextChunk(header);
            default:
                debug(`Ignore chunk id=${header.chunkID}, size=${header.chunkSize}`);
                return 0;
        }
    }
    async readTextChunk(header) {
        const value = await this.tokenizer.readToken(new Token.StringType(header.chunkSize, 'ascii'));
        const values = value.split('\0').map(v => v.trim()).filter(v => v?.length);
        await Promise.all(values.map(v => this.metadata.addTag('AIFF', header.chunkID, v)));
        return header.chunkSize;
    }
}
