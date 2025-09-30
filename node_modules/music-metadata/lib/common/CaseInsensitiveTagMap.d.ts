import type { INativeTagMap, TagType } from './GenericTagTypes.js';
import { CommonTagMapper } from './GenericTagMapper.js';
export declare class CaseInsensitiveTagMap extends CommonTagMapper {
    constructor(tagTypes: TagType[], tagMap: INativeTagMap);
    /**
     * @tag  Native header tag
     * @return common tag name (alias)
     */
    protected getCommonName(tag: string): import("./GenericTagTypes.js").GenericTagId;
}
