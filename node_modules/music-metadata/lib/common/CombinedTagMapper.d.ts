import type { IGenericTag, TagType } from './GenericTagTypes.js';
import type { IGenericTagMapper } from './GenericTagMapper.js';
import type { ITag } from '../type.js';
import type { INativeMetadataCollector } from './MetadataCollector.js';
export declare class CombinedTagMapper {
    tagMappers: {
        [index: string]: IGenericTagMapper;
    };
    constructor();
    /**
     * Convert native to generic (common) tags
     * @param tagType Originating tag format
     * @param tag     Native tag to map to a generic tag id
     * @param warnings
     * @return Generic tag result (output of this function)
     */
    mapTag(tagType: TagType, tag: ITag, warnings: INativeMetadataCollector): IGenericTag | null;
    private registerTagMapper;
}
