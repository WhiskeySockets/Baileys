import initDebug from 'debug';
import { BasicParser } from '../../common/BasicParser.js';
import { tryParseApeHeader } from '../../apev2/APEv2Parser.js';
import { BitReader } from './BitReader.js';
import * as SV7 from './StreamVersion7.js';
import { MusepackContentError } from '../MusepackConentError.js';
const debug = initDebug('music-metadata:parser:musepack');
export class MpcSv7Parser extends BasicParser {
    constructor() {
        super(...arguments);
        this.bitreader = null;
        this.audioLength = 0;
        this.duration = null;
    }
    async parse() {
        const header = await this.tokenizer.readToken(SV7.Header);
        if (header.signature !== 'MP+')
            throw new MusepackContentError('Unexpected magic number');
        debug(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
        this.metadata.setFormat('container', 'Musepack, SV7');
        this.metadata.setFormat('sampleRate', header.sampleFrequency);
        const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
        this.metadata.setFormat('numberOfSamples', numberOfSamples);
        this.duration = numberOfSamples / header.sampleFrequency;
        this.metadata.setFormat('duration', this.duration);
        this.bitreader = new BitReader(this.tokenizer);
        this.metadata.setFormat('numberOfChannels', header.midSideStereo || header.intensityStereo ? 2 : 1);
        const version = await this.bitreader.read(8);
        this.metadata.setFormat('codec', (version / 100).toFixed(2));
        await this.skipAudioData(header.frameCount);
        debug(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
        return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
    }
    async skipAudioData(frameCount) {
        while (frameCount-- > 0) {
            const frameLength = await this.bitreader.read(20);
            this.audioLength += 20 + frameLength;
            await this.bitreader.ignore(frameLength);
        }
        // last frame
        const lastFrameLength = await this.bitreader.read(11);
        this.audioLength += lastFrameLength;
        if (this.duration !== null) {
            this.metadata.setFormat('bitrate', this.audioLength / this.duration);
        }
    }
}
