import initDebug from 'debug';
import { BasicParser } from '../common/BasicParser.js';
import { matroskaDtd } from './MatroskaDtd.js';
import { TargetType, TrackType } from './types.js';
import { EbmlIterator, ParseAction } from '../ebml/EbmlIterator.js';
const debug = initDebug('music-metadata:parser:matroska');
/**
 * Extensible Binary Meta Language (EBML) parser
 * https://en.wikipedia.org/wiki/Extensible_Binary_Meta_Language
 * http://matroska.sourceforge.net/technical/specs/rfc/index.html
 *
 * WEBM VP8 AUDIO FILE
 */
export class MatroskaParser extends BasicParser {
    constructor() {
        super(...arguments);
        this.seekHeadOffset = 0;
        /**
         * Use index to skip multiple segment/cluster elements at once.
         * Significant performance impact
         */
        this.flagUseIndexToSkipClusters = this.options.mkvUseIndex ?? false;
    }
    async parse() {
        const containerSize = this.tokenizer.fileInfo.size ?? Number.MAX_SAFE_INTEGER;
        const matroskaIterator = new EbmlIterator(this.tokenizer);
        debug('Initializing DTD end MatroskaIterator');
        await matroskaIterator.iterate(matroskaDtd, containerSize, {
            startNext: (element) => {
                switch (element.id) {
                    // case 0x1f43b675: // cluster
                    case 0x1c53bb6b: // Cueing Data
                        debug(`Skip element: name=${element.name}, id=0x${element.id.toString(16)}`);
                        return ParseAction.IgnoreElement;
                    case 0x1f43b675: // cluster
                        if (this.flagUseIndexToSkipClusters && this.seekHead) {
                            const index = this.seekHead.seek.find(index => index.position + this.seekHeadOffset > this.tokenizer.position);
                            if (index) {
                                // Go to next index position
                                const ignoreSize = index.position + this.seekHeadOffset - this.tokenizer.position;
                                debug(`Use index to go to next position, ignoring ${ignoreSize} bytes`);
                                this.tokenizer.ignore(ignoreSize);
                                return ParseAction.SkipElement;
                            }
                        }
                        return ParseAction.IgnoreElement;
                    default:
                        return ParseAction.ReadNext;
                }
            },
            elementValue: async (element, value, offset) => {
                debug(`Received: name=${element.name}, value=${value}`);
                switch (element.id) {
                    case 0x4282: // docType
                        this.metadata.setFormat('container', `EBML/${value}`);
                        break;
                    case 0x114d9b74:
                        this.seekHead = value;
                        this.seekHeadOffset = offset;
                        break;
                    case 0x1549a966:
                        { // Info (Segment Information)
                            const info = value;
                            const timecodeScale = info.timecodeScale ? info.timecodeScale : 1000000;
                            if (typeof info.duration === 'number') {
                                const duration = info.duration * timecodeScale / 1000000000;
                                await this.addTag('segment:title', info.title);
                                this.metadata.setFormat('duration', Number(duration));
                            }
                        }
                        break;
                    case 0x1654ae6b:
                        { // tracks
                            const audioTracks = value;
                            if (audioTracks?.entries) {
                                audioTracks.entries.forEach(entry => {
                                    const stream = {
                                        codecName: entry.codecID.replace('A_', '').replace('V_', ''),
                                        codecSettings: entry.codecSettings,
                                        flagDefault: entry.flagDefault,
                                        flagLacing: entry.flagLacing,
                                        flagEnabled: entry.flagEnabled,
                                        language: entry.language,
                                        name: entry.name,
                                        type: entry.trackType,
                                        audio: entry.audio,
                                        video: entry.video
                                    };
                                    this.metadata.addStreamInfo(stream);
                                });
                                const audioTrack = audioTracks.entries
                                    .filter(entry => entry.trackType === TrackType.audio)
                                    .reduce((acc, cur) => {
                                    if (!acc)
                                        return cur;
                                    if (cur.flagDefault && !acc.flagDefault)
                                        return cur;
                                    if (cur.trackNumber < acc.trackNumber)
                                        return cur;
                                    return acc;
                                }, null);
                                if (audioTrack) {
                                    this.metadata.setFormat('codec', audioTrack.codecID.replace('A_', ''));
                                    this.metadata.setFormat('sampleRate', audioTrack.audio.samplingFrequency);
                                    this.metadata.setFormat('numberOfChannels', audioTrack.audio.channels);
                                }
                            }
                        }
                        break;
                    case 0x1254c367:
                        { // tags
                            const tags = value;
                            await Promise.all(tags.tag.map(async (tag) => {
                                const target = tag.target;
                                const targetType = target?.targetTypeValue ? TargetType[target.targetTypeValue] : (target?.targetType ? target.targetType : 'track');
                                await Promise.all(tag.simpleTags.map(async (simpleTag) => {
                                    const value = simpleTag.string ? simpleTag.string : simpleTag.binary;
                                    await this.addTag(`${targetType}:${simpleTag.name}`, value);
                                }));
                            }));
                        }
                        break;
                    case 0x1941a469:
                        { // attachments
                            const attachments = value;
                            await Promise.all(attachments.attachedFiles
                                .filter(file => file.mimeType.startsWith('image/'))
                                .map(file => this.addTag('picture', {
                                data: file.data,
                                format: file.mimeType,
                                description: file.description,
                                name: file.name
                            })));
                        }
                        break;
                }
            }
        });
    }
    async addTag(tagId, value) {
        await this.metadata.addTag('matroska', tagId, value);
    }
}
