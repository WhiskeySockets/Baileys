/**
 * Primary entry point, Node.js specific entry point is MusepackParser.ts
 */
import { type AnyWebByteStream, type IFileInfo, type ITokenizer, type IRandomAccessTokenizer } from 'strtok3';
import type { IAudioMetadata, INativeTagDict, IOptions, IPicture, IPrivateOptions, ITag } from './type.js';
import type { Readable } from 'node:stream';
export type { IFileInfo } from 'strtok3';
export { type IAudioMetadata, type IOptions, type ITag, type INativeTagDict, type ICommonTagsResult, type IFormat, type IPicture, type IRatio, type IChapter, type ILyricsTag, LyricsContentType, TimestampFormat, IMetadataEventTag, IMetadataEvent } from './type.js';
export { CouldNotDetermineFileTypeError, UnsupportedFileTypeError } from './ParseError.js';
export * from './ParseError.js';
/**
 * Parse Web API File
 * Requires Blob to be able to stream using a ReadableStreamBYOBReader, only available since Node.js ≥ 20
 * @param blob - Blob to parse
 * @param options - Parsing options
 * @returns Metadata
 */
export declare function parseBlob(blob: Blob, options?: IOptions): Promise<IAudioMetadata>;
/**
 * Parse audio from Web Stream.Readable
 * @param webStream - WebStream to read the audio track from
 * @param options - Parsing options
 * @param fileInfo - File information object or MIME-type string
 * @returns Metadata
 */
export declare function parseWebStream(webStream: AnyWebByteStream, fileInfo?: IFileInfo | string, options?: IOptions): Promise<IAudioMetadata>;
/**
 * Parse audio from memory
 * @param uint8Array - Uint8Array holding audio data
 * @param fileInfo - File information object or MIME-type string
 * @param options - Parsing options
 * @returns Metadata
 * Ref: https://github.com/Borewit/strtok3/blob/e6938c81ff685074d5eb3064a11c0b03ca934c1d/src/index.ts#L15
 */
export declare function parseBuffer(uint8Array: Uint8Array, fileInfo?: IFileInfo | string, options?: IOptions): Promise<IAudioMetadata>;
/**
 * Parse audio from ITokenizer source
 * @param tokenizer - Audio source implementing the tokenizer interface
 * @param options - Parsing options
 * @returns Metadata
 */
export declare function parseFromTokenizer(tokenizer: ITokenizer, options?: IOptions): Promise<IAudioMetadata>;
/**
 * Create a dictionary ordered by their tag id (key)
 * @param nativeTags list of tags
 * @returns tags indexed by id
 */
export declare function orderTags(nativeTags: ITag[]): INativeTagDict;
/**
 * Convert rating to 1-5 star rating
 * @param rating Normalized rating [0..1] (common.rating[n].rating)
 * @returns Number of stars: 1, 2, 3, 4 or 5 stars
 */
export declare function ratingToStars(rating: number | undefined): number;
/**
 * Select most likely cover image.
 * @param pictures Usually metadata.common.picture
 * @return Cover image, if any, otherwise null
 */
export declare function selectCover(pictures?: IPicture[]): IPicture | null;
export declare function scanAppendingHeaders(tokenizer: IRandomAccessTokenizer, options?: IPrivateOptions): Promise<void>;
/**
 * Implementation only available when loaded as Node.js
 * This method will throw an Error, always.
 */
export declare function parseFile(_filePath: string, _options?: IOptions): Promise<IAudioMetadata>;
/**
 * Implementation only available when loaded as Node.js
 * This method will throw an Error, always.
 */
export declare function parseStream(_stream: Readable, _fileInfo?: IFileInfo | string, _options?: IOptions): Promise<IAudioMetadata>;
/**
 * Return a list of supported mime-types
 */
export declare function getSupportedMimeTypes(): string[];
