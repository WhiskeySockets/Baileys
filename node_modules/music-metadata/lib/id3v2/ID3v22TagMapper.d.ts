import type { INativeTagMap } from '../common/GenericTagTypes.js';
import { CaseInsensitiveTagMap } from '../common/CaseInsensitiveTagMap.js';
/**
 * ID3v2.2 tag mappings
 */
export declare const id3v22TagMap: INativeTagMap;
export declare class ID3v22TagMapper extends CaseInsensitiveTagMap {
    constructor();
}
