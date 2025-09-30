import { CommonTagMapper } from '../common/GenericTagMapper.js';
/**
 * ID3v1 tag mappings
 */
const tagMap = {
    NAME: 'title',
    AUTH: 'artist',
    '(c) ': 'copyright',
    ANNO: 'comment'
};
export class AiffTagMapper extends CommonTagMapper {
    constructor() {
        super(['AIFF'], tagMap);
    }
}
