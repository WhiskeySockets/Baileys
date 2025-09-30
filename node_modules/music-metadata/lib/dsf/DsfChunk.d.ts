import type { IGetToken } from 'strtok3';
/**
 * Common interface for the common chunk DSD header
 */
export interface IChunkHeader {
    /**
     * Chunk ID
     */
    id: string;
    /**
     * Chunk size
     */
    size: bigint;
}
/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export declare const ChunkHeader: IGetToken<IChunkHeader>;
/**
 * Interface to DSD payload chunk
 */
export interface IDsdChunk {
    /**
     * Total file size
     */
    fileSize: bigint;
    /**
     * If Metadata doesn’t exist, set 0. If the file has ID3v2 tag, then set the pointer to it.
     * ID3v2 tag should be located in the end of the file.
     */
    metadataPointer: bigint;
}
/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export declare const DsdChunk: IGetToken<IDsdChunk>;
export declare const ChannelType: {
    mono: number;
    stereo: number;
    channels: number;
    quad: number;
    '4 channels': number;
    '5 channels': number;
    '5.1 channels': number;
};
export type ChannelType = typeof ChannelType[keyof typeof ChannelType];
/**
 * Interface to format chunk payload chunk
 */
export interface IFormatChunk {
    /**
     * Version of this file format
     */
    formatVersion: number;
    /**
     * Format ID
     */
    formatID: number;
    /**
     * Channel Type
     */
    channelType: ChannelType;
    /**
     * Channel num
     */
    channelNum: number;
    /**
     * Sampling frequency
     */
    samplingFrequency: number;
    /**
     * Bits per sample
     */
    bitsPerSample: number;
    /**
     * Sample count
     */
    sampleCount: bigint;
    /**
     * Block size per channel
     */
    blockSizePerChannel: number;
}
/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export declare const FormatChunk: IGetToken<IFormatChunk>;
