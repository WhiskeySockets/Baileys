import { Boom } from '@hapi/boom';
import { type AxiosRequestConfig } from 'axios';
import { Readable, Transform } from 'stream';
import { URL } from 'url';
import { proto } from '../../WAProto/index.js';
import { type MediaType } from '../Defaults/index.js';
import type { DownloadableMessage, MediaConnInfo, MediaDecryptionKeyInfo, SocketConfig, WAMediaUpload, WAMediaUploadFunction, WAMessageContent } from '../Types/index.js';
import { type BinaryNode } from '../WABinary/index.js';
import type { ILogger } from './logger.js';
export declare const hkdfInfoKey: (type: MediaType) => string;
export declare const getRawMediaUploadData: (media: WAMediaUpload, mediaType: MediaType, logger?: ILogger) => Promise<{
    filePath: string;
    fileSha256: Buffer<ArrayBufferLike>;
    fileLength: number;
}>;
/** generates all the keys required to encrypt/decrypt & sign a media message */
export declare function getMediaKeys(buffer: Uint8Array | string | null | undefined, mediaType: MediaType): Promise<MediaDecryptionKeyInfo>;
export declare const extractImageThumb: (bufferOrFilePath: Readable | Buffer | string, width?: number) => Promise<{
    buffer: any;
    original: {
        width: any;
        height: any;
    };
}>;
export declare const encodeBase64EncodedStringForUpload: (b64: string) => string;
export declare const generateProfilePicture: (mediaUpload: WAMediaUpload, dimensions?: {
    width: number;
    height: number;
}) => Promise<{
    img: Buffer<ArrayBufferLike>;
}>;
/** gets the SHA256 of the given media message */
export declare const mediaMessageSHA256B64: (message: WAMessageContent) => string | null | undefined;
export declare function getAudioDuration(buffer: Buffer | string | Readable): Promise<number | undefined>;
/**
  referenced from and modifying https://github.com/wppconnect-team/wa-js/blob/main/src/chat/functions/prepareAudioWaveform.ts
 */
export declare function getAudioWaveform(buffer: Buffer | string | Readable, logger?: ILogger): Promise<Uint8Array<ArrayBuffer> | undefined>;
export declare const toReadable: (buffer: Buffer) => Readable;
export declare const toBuffer: (stream: Readable) => Promise<Buffer<ArrayBuffer>>;
export declare const getStream: (item: WAMediaUpload, opts?: AxiosRequestConfig) => Promise<{
    readonly stream: Readable;
    readonly type: "buffer";
} | {
    readonly stream: Readable;
    readonly type: "readable";
} | {
    readonly stream: Readable;
    readonly type: "remote";
} | {
    readonly stream: import("fs").ReadStream;
    readonly type: "file";
}>;
/** generates a thumbnail for a given media, if required */
export declare function generateThumbnail(file: string, mediaType: 'video' | 'image', options: {
    logger?: ILogger;
}): Promise<{
    thumbnail: string | undefined;
    originalImageDimensions: {
        width: number;
        height: number;
    } | undefined;
}>;
export declare const getHttpStream: (url: string | URL, options?: AxiosRequestConfig & {
    isStream?: true;
}) => Promise<Readable>;
type EncryptedStreamOptions = {
    saveOriginalFileIfRequired?: boolean;
    logger?: ILogger;
    opts?: AxiosRequestConfig;
};
export declare const encryptedStream: (media: WAMediaUpload, mediaType: MediaType, { logger, saveOriginalFileIfRequired, opts }?: EncryptedStreamOptions) => Promise<{
    mediaKey: Buffer<ArrayBufferLike>;
    originalFilePath: string | undefined;
    encFilePath: string;
    mac: Buffer<ArrayBuffer>;
    fileEncSha256: Buffer<ArrayBufferLike>;
    fileSha256: Buffer<ArrayBufferLike>;
    fileLength: number;
}>;
export type MediaDownloadOptions = {
    startByte?: number;
    endByte?: number;
    options?: AxiosRequestConfig<{}>;
};
export declare const getUrlFromDirectPath: (directPath: string) => string;
export declare const downloadContentFromMessage: ({ mediaKey, directPath, url }: DownloadableMessage, type: MediaType, opts?: MediaDownloadOptions) => Promise<Transform>;
/**
 * Decrypts and downloads an AES256-CBC encrypted file given the keys.
 * Assumes the SHA256 of the plaintext is appended to the end of the ciphertext
 * */
export declare const downloadEncryptedContent: (downloadUrl: string, { cipherKey, iv }: MediaDecryptionKeyInfo, { startByte, endByte, options }?: MediaDownloadOptions) => Promise<Transform>;
export declare function extensionForMediaMessage(message: WAMessageContent): string;
export declare const getWAUploadToServer: ({ customUploadHosts, fetchAgent, logger, options }: SocketConfig, refreshMediaConn: (force: boolean) => Promise<MediaConnInfo>) => WAMediaUploadFunction;
/**
 * Generate a binary node that will request the phone to re-upload the media & return the newly uploaded URL
 */
export declare const encryptMediaRetryRequest: (key: proto.IMessageKey, mediaKey: Buffer | Uint8Array, meId: string) => Promise<BinaryNode>;
export declare const decodeMediaRetryNode: (node: BinaryNode) => {
    key: import("../Types/index.js").WAMessageKey;
    media?: {
        ciphertext: Uint8Array;
        iv: Uint8Array;
    };
    error?: Boom;
};
export declare const decryptMediaRetryData: ({ ciphertext, iv }: {
    ciphertext: Uint8Array;
    iv: Uint8Array;
}, mediaKey: Uint8Array, msgId: string) => Promise<proto.MediaRetryNotification>;
export declare const getStatusCodeForMediaRetry: (code: number) => 200 | 412 | 404 | 418;
export {};
//# sourceMappingURL=messages-media.d.ts.map