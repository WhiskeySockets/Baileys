import { TrackTypeValueToKeyMap, } from '../type.js';
import initDebug from 'debug';
import { isSingleton, isUnique } from './GenericTagTypes.js';
import { CombinedTagMapper } from './CombinedTagMapper.js';
import { CommonTagMapper } from './GenericTagMapper.js';
import { toRatio } from './Util.js';
import { fileTypeFromBuffer } from 'file-type';
import { parseLrc } from '../lrc/LyricsParser.js';
const debug = initDebug('music-metadata:collector');
const TagPriority = ['matroska', 'APEv2', 'vorbis', 'ID3v2.4', 'ID3v2.3', 'ID3v2.2', 'exif', 'asf', 'iTunes', 'AIFF', 'ID3v1'];
/**
 * Provided to the parser to uodate the metadata result.
 * Responsible for triggering async updates
 */
export class MetadataCollector {
    constructor(opts) {
        this.format = {
            tagTypes: [],
            trackInfo: []
        };
        this.native = {};
        this.common = {
            track: { no: null, of: null },
            disk: { no: null, of: null },
            movementIndex: { no: null, of: null }
        };
        this.quality = {
            warnings: []
        };
        /**
         * Keeps track of origin priority for each mapped id
         */
        this.commonOrigin = {};
        /**
         * Maps a tag type to a priority
         */
        this.originPriority = {};
        this.tagMapper = new CombinedTagMapper();
        this.opts = opts;
        let priority = 1;
        for (const tagType of TagPriority) {
            this.originPriority[tagType] = priority++;
        }
        this.originPriority.artificial = 500; // Filled using alternative tags
        this.originPriority.id3v1 = 600; // Consider as the worst because of the field length limit
    }
    /**
     * @returns {boolean} true if one or more tags have been found
     */
    hasAny() {
        return Object.keys(this.native).length > 0;
    }
    addStreamInfo(streamInfo) {
        debug(`streamInfo: type=${streamInfo.type ? TrackTypeValueToKeyMap[streamInfo.type] : '?'}, codec=${streamInfo.codecName}`);
        this.format.trackInfo.push(streamInfo);
    }
    setFormat(key, value) {
        debug(`format: ${key} = ${value}`);
        this.format[key] = value; // as any to override readonly
        if (this.opts?.observer) {
            this.opts.observer({ metadata: this, tag: { type: 'format', id: key, value } });
        }
    }
    setAudioOnly() {
        this.setFormat('hasAudio', true);
        this.setFormat('hasVideo', false);
    }
    async addTag(tagType, tagId, value) {
        debug(`tag ${tagType}.${tagId} = ${value}`);
        if (!this.native[tagType]) {
            this.format.tagTypes.push(tagType);
            this.native[tagType] = [];
        }
        this.native[tagType].push({ id: tagId, value });
        await this.toCommon(tagType, tagId, value);
    }
    addWarning(warning) {
        this.quality.warnings.push({ message: warning });
    }
    async postMap(tagType, tag) {
        // Common tag (alias) found
        // check if we need to do something special with common tag
        // if the event has been aliased then we need to clean it before
        // it is emitted to the user. e.g. genre (20) -> Electronic
        switch (tag.id) {
            case 'artist':
                if (this.commonOrigin.artist === this.originPriority[tagType]) {
                    // Assume the artist field is used as artists
                    return this.postMap('artificial', { id: 'artists', value: tag.value });
                }
                if (!this.common.artists) {
                    // Fill artists using artist source
                    this.setGenericTag('artificial', { id: 'artists', value: tag.value });
                }
                break;
            case 'artists':
                if (!this.common.artist || this.commonOrigin.artist === this.originPriority.artificial) {
                    if (!this.common.artists || this.common.artists.indexOf(tag.value) === -1) {
                        // Fill artist using artists source
                        const artists = (this.common.artists || []).concat([tag.value]);
                        const value = joinArtists(artists);
                        const artistTag = { id: 'artist', value };
                        this.setGenericTag('artificial', artistTag);
                    }
                }
                break;
            case 'picture':
                return this.postFixPicture(tag.value).then(picture => {
                    if (picture !== null) {
                        tag.value = picture;
                        this.setGenericTag(tagType, tag);
                    }
                });
            case 'totaltracks':
                this.common.track.of = CommonTagMapper.toIntOrNull(tag.value);
                return;
            case 'totaldiscs':
                this.common.disk.of = CommonTagMapper.toIntOrNull(tag.value);
                return;
            case 'movementTotal':
                this.common.movementIndex.of = CommonTagMapper.toIntOrNull(tag.value);
                return;
            case 'track':
            case 'disk':
            case 'movementIndex': {
                const of = this.common[tag.id].of; // store of value, maybe maybe overwritten
                this.common[tag.id] = CommonTagMapper.normalizeTrack(tag.value);
                this.common[tag.id].of = of != null ? of : this.common[tag.id].of;
                return;
            }
            case 'bpm':
            case 'year':
            case 'originalyear':
                tag.value = Number.parseInt(tag.value, 10);
                break;
            case 'date': {
                // ToDo: be more strict on 'YYYY...'
                const year = Number.parseInt(tag.value.substr(0, 4), 10);
                if (!Number.isNaN(year)) {
                    this.common.year = year;
                }
                break;
            }
            case 'discogs_label_id':
            case 'discogs_release_id':
            case 'discogs_master_release_id':
            case 'discogs_artist_id':
            case 'discogs_votes':
                tag.value = typeof tag.value === 'string' ? Number.parseInt(tag.value, 10) : tag.value;
                break;
            case 'replaygain_track_gain':
            case 'replaygain_track_peak':
            case 'replaygain_album_gain':
            case 'replaygain_album_peak':
                tag.value = toRatio(tag.value);
                break;
            case 'replaygain_track_minmax':
                tag.value = tag.value.split(',').map(v => Number.parseInt(v, 10));
                break;
            case 'replaygain_undo': {
                const minMix = tag.value.split(',').map(v => Number.parseInt(v, 10));
                tag.value = {
                    leftChannel: minMix[0],
                    rightChannel: minMix[1]
                };
                break;
            }
            case 'gapless': // iTunes gap-less flag
            case 'compilation':
            case 'podcast':
            case 'showMovement':
                tag.value = tag.value === '1' || tag.value === 1; // boolean
                break;
            case 'isrc': { // Only keep unique values
                const commonTag = this.common[tag.id];
                if (commonTag && commonTag.indexOf(tag.value) !== -1)
                    return;
                break;
            }
            case 'comment':
                if (typeof tag.value === 'string') {
                    tag.value = { text: tag.value };
                }
                if (tag.value.descriptor === 'iTunPGAP') {
                    this.setGenericTag(tagType, { id: 'gapless', value: tag.value.text === '1' });
                }
                break;
            case 'lyrics':
                if (typeof tag.value === 'string') {
                    tag.value = parseLrc(tag.value);
                }
                break;
            default:
            // nothing to do
        }
        if (tag.value !== null) {
            this.setGenericTag(tagType, tag);
        }
    }
    /**
     * Convert native tags to common tags
     * @returns {IAudioMetadata} Native + common tags
     */
    toCommonMetadata() {
        return {
            format: this.format,
            native: this.native,
            quality: this.quality,
            common: this.common
        };
    }
    /**
     * Fix some common issues with picture object
     * @param picture Picture
     */
    async postFixPicture(picture) {
        if (picture.data && picture.data.length > 0) {
            if (!picture.format) {
                const fileType = await fileTypeFromBuffer(Uint8Array.from(picture.data)); // ToDO: remove Buffer
                if (fileType) {
                    picture.format = fileType.mime;
                }
                else {
                    return null;
                }
            }
            picture.format = picture.format.toLocaleLowerCase();
            switch (picture.format) {
                case 'image/jpg':
                    picture.format = 'image/jpeg'; // ToDo: register warning
            }
            return picture;
        }
        this.addWarning("Empty picture tag found");
        return null;
    }
    /**
     * Convert native tag to common tags
     */
    async toCommon(tagType, tagId, value) {
        const tag = { id: tagId, value };
        const genericTag = this.tagMapper.mapTag(tagType, tag, this);
        if (genericTag) {
            await this.postMap(tagType, genericTag);
        }
    }
    /**
     * Set generic tag
     */
    setGenericTag(tagType, tag) {
        debug(`common.${tag.id} = ${tag.value}`);
        const prio0 = this.commonOrigin[tag.id] || 1000;
        const prio1 = this.originPriority[tagType];
        if (isSingleton(tag.id)) {
            if (prio1 <= prio0) {
                this.common[tag.id] = tag.value;
                this.commonOrigin[tag.id] = prio1;
            }
            else {
                return debug(`Ignore native tag (singleton): ${tagType}.${tag.id} = ${tag.value}`);
            }
        }
        else {
            if (prio1 === prio0) {
                if (!isUnique(tag.id) || this.common[tag.id].indexOf(tag.value) === -1) {
                    this.common[tag.id].push(tag.value);
                }
                else {
                    debug(`Ignore duplicate value: ${tagType}.${tag.id} = ${tag.value}`);
                }
                // no effect? this.commonOrigin[tag.id] = prio1;
            }
            else if (prio1 < prio0) {
                this.common[tag.id] = [tag.value];
                this.commonOrigin[tag.id] = prio1;
            }
            else {
                return debug(`Ignore native tag (list): ${tagType}.${tag.id} = ${tag.value}`);
            }
        }
        if (this.opts?.observer) {
            this.opts.observer({ metadata: this, tag: { type: 'common', id: tag.id, value: tag.value } });
        }
        // ToDo: trigger metadata event
    }
}
export function joinArtists(artists) {
    if (artists.length > 2) {
        return `${artists.slice(0, artists.length - 1).join(', ')} & ${artists[artists.length - 1]}`;
    }
    return artists.join(' & ');
}
