import { CommonTagMapper } from '../../common/GenericTagMapper.js';
import type { IRating, ITag } from '../../type.js';
export declare class VorbisTagMapper extends CommonTagMapper {
    static toRating(email: string | undefined | null, rating: string, maxScore: number): IRating;
    constructor();
    protected postMap(tag: ITag): void;
}
