import type * as generic from './GenericTagTypes.js';
import type { ITag } from '../type.js';
import type { INativeMetadataCollector, IWarningCollector } from './MetadataCollector.js';
export interface IGenericTagMapper {
    /**
     * Which tagType is able to map to the generic mapping format
     */
    tagTypes: generic.TagType[];
    /**
     * Basic tag map
     */
    tagMap: generic.INativeTagMap;
    /**
     * Map native tag to generic tag
     * @param tag       Native tag
     * @param warnings  Register warnings
     * @return Generic tag, if native tag could be mapped
     */
    mapGenericTag(tag: ITag, warnings: INativeMetadataCollector): generic.IGenericTag | null;
}
export declare class CommonTagMapper implements IGenericTagMapper {
    static maxRatingScore: number;
    static toIntOrNull(str: string): number | null;
    static normalizeTrack(origVal: number | string): {
        no: number | null;
        of: number | null;
    };
    tagTypes: generic.TagType[];
    tagMap: generic.INativeTagMap;
    constructor(tagTypes: generic.TagType[], tagMap: generic.INativeTagMap);
    /**
     * Process and set common tags
     * write common tags to
     * @param tag Native tag
     * @param warnings Register warnings
     * @return common name
     */
    mapGenericTag(tag: ITag, warnings: IWarningCollector): generic.IGenericTag | null;
    /**
     * Convert native tag key to common tag key
     * @param tag Native header tag
     * @return common tag name (alias)
     */
    protected getCommonName(tag: string): generic.GenericTagId;
    /**
     * Handle post mapping exceptions / correction
     * @param tag Tag e.g. {"©alb", "Buena Vista Social Club")
     * @param warnings Used to register warnings
     */
    protected postMap(_tag: ITag, _warnings: IWarningCollector): void;
}
