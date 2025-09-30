import { CommonTagMapper } from '../common/GenericTagMapper.js';
import type { IRating, ITag } from '../type.js';
export declare class AsfTagMapper extends CommonTagMapper {
    static toRating(rating: string): IRating;
    constructor();
    protected postMap(tag: ITag): void;
}
