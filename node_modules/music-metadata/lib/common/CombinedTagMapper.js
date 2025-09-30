import { ID3v1TagMapper } from '../id3v1/ID3v1TagMap.js';
import { ID3v24TagMapper } from '../id3v2/ID3v24TagMapper.js';
import { AsfTagMapper } from '../asf/AsfTagMapper.js';
import { ID3v22TagMapper } from '../id3v2/ID3v22TagMapper.js';
import { APEv2TagMapper } from '../apev2/APEv2TagMapper.js';
import { MP4TagMapper } from '../mp4/MP4TagMapper.js';
import { VorbisTagMapper } from '../ogg/vorbis/VorbisTagMapper.js';
import { RiffInfoTagMapper } from '../riff/RiffInfoTagMap.js';
import { MatroskaTagMapper } from '../matroska/MatroskaTagMapper.js';
import { AiffTagMapper } from '../aiff/AiffTagMap.js';
import { InternalParserError } from '../ParseError.js';
export class CombinedTagMapper {
    constructor() {
        this.tagMappers = {};
        [
            new ID3v1TagMapper(),
            new ID3v22TagMapper(),
            new ID3v24TagMapper(),
            new MP4TagMapper(),
            new MP4TagMapper(),
            new VorbisTagMapper(),
            new APEv2TagMapper(),
            new AsfTagMapper(),
            new RiffInfoTagMapper(),
            new MatroskaTagMapper(),
            new AiffTagMapper()
        ].forEach(mapper => {
            this.registerTagMapper(mapper);
        });
    }
    /**
     * Convert native to generic (common) tags
     * @param tagType Originating tag format
     * @param tag     Native tag to map to a generic tag id
     * @param warnings
     * @return Generic tag result (output of this function)
     */
    mapTag(tagType, tag, warnings) {
        const tagMapper = this.tagMappers[tagType];
        if (tagMapper) {
            return this.tagMappers[tagType].mapGenericTag(tag, warnings);
        }
        throw new InternalParserError(`No generic tag mapper defined for tag-format: ${tagType}`);
    }
    registerTagMapper(genericTagMapper) {
        for (const tagType of genericTagMapper.tagTypes) {
            this.tagMappers[tagType] = genericTagMapper;
        }
    }
}
