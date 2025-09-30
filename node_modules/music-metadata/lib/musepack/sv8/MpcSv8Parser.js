import initDebug from 'debug';
import { BasicParser } from '../../common/BasicParser.js';
import { tryParseApeHeader } from '../../apev2/APEv2Parser.js';
import { FourCcToken } from '../../common/FourCC.js';
import * as SV8 from './StreamVersion8.js';
import { MusepackContentError } from '../MusepackConentError.js';
const debug = initDebug('music-metadata:parser:musepack');
export class MpcSv8Parser extends BasicParser {
    constructor() {
        super(...arguments);
        this.audioLength = 0;
    }
    async parse() {
        const signature = await this.tokenizer.readToken(FourCcToken);
        if (signature !== 'MPCK')
            throw new MusepackContentError('Invalid Magic number');
        this.metadata.setFormat('container', 'Musepack, SV8');
        return this.parsePacket();
    }
    async parsePacket() {
        const sv8reader = new SV8.StreamReader(this.tokenizer);
        do {
            const header = await sv8reader.readPacketHeader();
            debug(`packet-header key=${header.key}, payloadLength=${header.payloadLength}`);
            switch (header.key) {
                case 'SH': { // Stream Header
                    const sh = await sv8reader.readStreamHeader(header.payloadLength);
                    this.metadata.setFormat('numberOfSamples', sh.sampleCount);
                    this.metadata.setFormat('sampleRate', sh.sampleFrequency);
                    this.metadata.setFormat('duration', sh.sampleCount / sh.sampleFrequency);
                    this.metadata.setFormat('numberOfChannels', sh.channelCount);
                    break;
                }
                case 'AP': // Audio Packet
                    this.audioLength += header.payloadLength;
                    await this.tokenizer.ignore(header.payloadLength);
                    break;
                case 'RG': // Replaygain
                case 'EI': // Encoder Info
                case 'SO': // Seek Table Offset
                case 'ST': // Seek Table
                case 'CT': // Chapter-Tag
                    await this.tokenizer.ignore(header.payloadLength);
                    break;
                case 'SE': // Stream End
                    if (this.metadata.format.duration) {
                        this.metadata.setFormat('bitrate', this.audioLength * 8 / this.metadata.format.duration);
                    }
                    return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
                default:
                    throw new MusepackContentError(`Unexpected header: ${header.key}`);
            }
            // biome-ignore lint/correctness/noConstantCondition: break is handled in the switch statement
        } while (true);
    }
}
