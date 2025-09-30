import type { ITokenizer } from 'strtok3';
export interface IPacketHeader {
    key: string;
    payloadLength: number;
}
/**
 * Stream Header Packet
 * Ref: http://trac.musepack.net/musepack/wiki/SV8Specification#StreamHeaderPacket
 */
interface IStreamHeader1 {
    crc: number;
    streamVersion: number;
}
/**
 * Stream Header Packet
 * Ref: http://trac.musepack.net/musepack/wiki/SV8Specification#StreamHeaderPacket
 */
interface IStreamHeader3 {
    sampleFrequency: number;
    maxUsedBands: number;
    channelCount: number;
    msUsed: boolean;
    audioBlockFrames: number;
}
/**
 * Stream Header Packet
 * Ref: http://trac.musepack.net/musepack/wiki/SV8Specification#StreamHeaderPacket
 */
interface IStreamHeader extends IStreamHeader1, IStreamHeader3 {
    sampleCount: number;
    beginningOfSilence: number;
}
export declare class StreamReader {
    private _tokenizer;
    get tokenizer(): ITokenizer;
    set tokenizer(value: ITokenizer);
    constructor(_tokenizer: ITokenizer);
    readPacketHeader(): Promise<IPacketHeader>;
    readStreamHeader(size: number): Promise<IStreamHeader>;
    private readVariableSizeField;
}
export {};
