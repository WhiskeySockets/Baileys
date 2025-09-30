import { CaseInsensitiveTagMap } from '../common/CaseInsensitiveTagMap.js';
import type { ITag } from "../type.js";
import type { INativeMetadataCollector } from "../common/MetadataCollector.js";
export declare const tagType = "iTunes";
export declare class MP4TagMapper extends CaseInsensitiveTagMap {
    constructor();
    protected postMap(tag: ITag, _warnings: INativeMetadataCollector): void;
}
