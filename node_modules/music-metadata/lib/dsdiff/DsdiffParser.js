import * as Token from 'token-types';
import initDebug from 'debug';
import * as strtok3 from 'strtok3';
import { FourCcToken } from '../common/FourCC.js';
import { BasicParser } from '../common/BasicParser.js';
import { ID3v2Parser } from '../id3v2/ID3v2Parser.js';
import { ChunkHeader64 } from './DsdiffToken.js';
import { makeUnexpectedFileContentError } from '../ParseError.js';
const debug = initDebug('music-metadata:parser:aiff');
export class DsdiffContentParseError extends makeUnexpectedFileContentError('DSDIFF') {
}
/**
 * DSDIFF - Direct Stream Digital Interchange File Format (Phillips)
 *
 * Ref:
 * - http://www.sonicstudio.com/pdf/dsd/DSDIFF_1.5_Spec.pdf
 */
export class DsdiffParser extends BasicParser {
    async parse() {
        const header = await this.tokenizer.readToken(ChunkHeader64);
        if (header.chunkID !== 'FRM8')
            throw new DsdiffContentParseError('Unexpected chunk-ID');
        this.metadata.setAudioOnly();
        const type = (await this.tokenizer.readToken(FourCcToken)).trim();
        switch (type) {
            case 'DSD':
                this.metadata.setFormat('container', `DSDIFF/${type}`);
                this.metadata.setFormat('lossless', true);
                return this.readFmt8Chunks(header.chunkSize - BigInt(FourCcToken.len));
            default:
                throw new DsdiffContentParseError(`Unsupported DSDIFF type: ${type}`);
        }
    }
    async readFmt8Chunks(remainingSize) {
        while (remainingSize >= ChunkHeader64.len) {
            const chunkHeader = await this.tokenizer.readToken(ChunkHeader64);
            //  If the data is an odd number of bytes in length, a pad byte must be added at the end
            debug(`Chunk id=${chunkHeader.chunkID}`);
            await this.readData(chunkHeader);
            remainingSize -= (BigInt(ChunkHeader64.len) + chunkHeader.chunkSize);
        }
    }
    async readData(header) {
        debug(`Reading data of chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
        const p0 = this.tokenizer.position;
        switch (header.chunkID.trim()) {
            case 'FVER': { // 3.1 FORMAT VERSION CHUNK
                const version = await this.tokenizer.readToken(Token.UINT32_LE);
                debug(`DSDIFF version=${version}`);
                break;
            }
            case 'PROP': { // 3.2 PROPERTY CHUNK
                const propType = await this.tokenizer.readToken(FourCcToken);
                if (propType !== 'SND ')
                    throw new DsdiffContentParseError('Unexpected PROP-chunk ID');
                await this.handleSoundPropertyChunks(header.chunkSize - BigInt(FourCcToken.len));
                break;
            }
            case 'ID3': { // Unofficial ID3 tag support
                const id3_data = await this.tokenizer.readToken(new Token.Uint8ArrayType(Number(header.chunkSize)));
                const rst = strtok3.fromBuffer(id3_data);
                await new ID3v2Parser().parse(this.metadata, rst, this.options);
                break;
            }
            case 'DSD':
                if (this.metadata.format.numberOfChannels) {
                    this.metadata.setFormat('numberOfSamples', Number(header.chunkSize * BigInt(8) / BigInt(this.metadata.format.numberOfChannels)));
                }
                if (this.metadata.format.numberOfSamples && this.metadata.format.sampleRate) {
                    this.metadata.setFormat('duration', this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
                }
                break;
            default:
                debug(`Ignore chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
                break;
        }
        const remaining = header.chunkSize - BigInt(this.tokenizer.position - p0);
        if (remaining > 0) {
            debug(`After Parsing chunk, remaining ${remaining} bytes`);
            await this.tokenizer.ignore(Number(remaining));
        }
    }
    async handleSoundPropertyChunks(remainingSize) {
        debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        while (remainingSize > 0) {
            const sndPropHeader = await this.tokenizer.readToken(ChunkHeader64);
            debug(`Sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
            const p0 = this.tokenizer.position;
            switch (sndPropHeader.chunkID.trim()) {
                case 'FS': { // 3.2.1 Sample Rate Chunk
                    const sampleRate = await this.tokenizer.readToken(Token.UINT32_BE);
                    this.metadata.setFormat('sampleRate', sampleRate);
                    break;
                }
                case 'CHNL': { // 3.2.2 Channels Chunk
                    const numChannels = await this.tokenizer.readToken(Token.UINT16_BE);
                    this.metadata.setFormat('numberOfChannels', numChannels);
                    await this.handleChannelChunks(sndPropHeader.chunkSize - BigInt(Token.UINT16_BE.len));
                    break;
                }
                case 'CMPR': { // 3.2.3 Compression Type Chunk
                    const compressionIdCode = (await this.tokenizer.readToken(FourCcToken)).trim();
                    const count = await this.tokenizer.readToken(Token.UINT8);
                    const compressionName = await this.tokenizer.readToken(new Token.StringType(count, 'ascii'));
                    if (compressionIdCode === 'DSD') {
                        this.metadata.setFormat('lossless', true);
                        this.metadata.setFormat('bitsPerSample', 1);
                    }
                    this.metadata.setFormat('codec', `${compressionIdCode} (${compressionName})`);
                    break;
                }
                case 'ABSS': { // 3.2.4 Absolute Start Time Chunk
                    const hours = await this.tokenizer.readToken(Token.UINT16_BE);
                    const minutes = await this.tokenizer.readToken(Token.UINT8);
                    const seconds = await this.tokenizer.readToken(Token.UINT8);
                    const samples = await this.tokenizer.readToken(Token.UINT32_BE);
                    debug(`ABSS ${hours}:${minutes}:${seconds}.${samples}`);
                    break;
                }
                case 'LSCO': { // 3.2.5 Loudspeaker Configuration Chunk
                    const lsConfig = await this.tokenizer.readToken(Token.UINT16_BE);
                    debug(`LSCO lsConfig=${lsConfig}`);
                    break;
                }
                default:
                    debug(`Unknown sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
                    await this.tokenizer.ignore(Number(sndPropHeader.chunkSize));
            }
            const remaining = sndPropHeader.chunkSize - BigInt(this.tokenizer.position - p0);
            if (remaining > 0) {
                debug(`After Parsing sound-property-chunk ${sndPropHeader.chunkSize}, remaining ${remaining} bytes`);
                await this.tokenizer.ignore(Number(remaining));
            }
            remainingSize -= BigInt(ChunkHeader64.len) + sndPropHeader.chunkSize;
            debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        }
        if (this.metadata.format.lossless && this.metadata.format.sampleRate && this.metadata.format.numberOfChannels && this.metadata.format.bitsPerSample) {
            const bitrate = this.metadata.format.sampleRate * this.metadata.format.numberOfChannels * this.metadata.format.bitsPerSample;
            this.metadata.setFormat('bitrate', bitrate);
        }
    }
    async handleChannelChunks(remainingSize) {
        debug(`Parsing channel-chunks, remainingSize=${remainingSize}`);
        const channels = [];
        while (remainingSize >= FourCcToken.len) {
            const channelId = await this.tokenizer.readToken(FourCcToken);
            debug(`Channel[ID=${channelId}]`);
            channels.push(channelId);
            remainingSize -= BigInt(FourCcToken.len);
        }
        debug(`Channels: ${channels.join(', ')}`);
        return channels;
    }
}
