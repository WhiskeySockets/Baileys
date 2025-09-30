import { type IVorbisPicture } from '../ogg/vorbis/Vorbis.js';
import { AbstractID3Parser } from '../id3v2/AbstractID3Parser.js';
import type { IBlockStreamInfo } from './FlacToken.js';
export declare class FlacParser extends AbstractID3Parser {
    private vorbisParser;
    private padding;
    postId3v2Parse(): Promise<void>;
    private parseDataBlock;
    /**
     * Parse STREAMINFO
     */
    private readBlockStreamInfo;
    /**
     * Parse STREAMINFO
     */
    processsStreamInfo(streamInfo: IBlockStreamInfo): void;
    /**
     * Read VORBIS_COMMENT from tokenizer
     * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
     */
    private readComment;
    /**
     * Parse VORBIS_COMMENT
     * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
     */
    parseComment(data: Uint8Array): Promise<void>;
    private parsePicture;
    addPictureTag(picture: IVorbisPicture): Promise<void>;
    private addTag;
}
