import type { IGetToken } from 'strtok3';
/**
 * FLAC supports up to 128 kinds of metadata blocks; currently the following are defined:
 * ref: https://xiph.org/flac/format.html#metadata_block
 */
export declare const BlockType: {
    STREAMINFO: number;
    PADDING: number;
    APPLICATION: number;
    SEEKTABLE: number;
    VORBIS_COMMENT: number;
    CUESHEET: number;
    PICTURE: number;
};
export type BlockType = typeof BlockType[keyof typeof BlockType];
/**
 * METADATA_BLOCK_DATA
 * Ref: https://xiph.org/flac/format.html#metadata_block_streaminfo
 */
export interface IBlockHeader {
    lastBlock: boolean;
    type: BlockType;
    length: number;
}
export declare const BlockHeader: IGetToken<IBlockHeader>;
/**
 * METADATA_BLOCK_DATA
 * Ref: https://xiph.org/flac/format.html#metadata_block_streaminfo
 */
export interface IBlockStreamInfo {
    minimumBlockSize: number;
    maximumBlockSize: number;
    minimumFrameSize: number;
    maximumFrameSize: number;
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    totalSamples: number;
    fileMD5: Uint8Array;
}
/**
 * METADATA_BLOCK_DATA
 * Ref: https://xiph.org/flac/format.html#metadata_block_streaminfo
 */
export declare const BlockStreamInfo: IGetToken<IBlockStreamInfo>;
