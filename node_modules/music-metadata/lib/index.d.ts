/**
 * Node.js specific entry point.
 */
import type { Readable } from 'node:stream';
import { type IFileInfo } from 'strtok3';
import type { IAudioMetadata, IOptions } from './type.js';
export * from './core.js';
/**
 * Parse audio from Node Stream.Readable
 * @param stream - Stream to read the audio track from
 * @param fileInfo - File information object or MIME-type, e.g.: 'audio/mpeg'
 * @param options - Parsing options
 * @returns Metadata
 */
export declare function parseStream(stream: Readable, fileInfo?: IFileInfo | string, options?: IOptions): Promise<IAudioMetadata>;
/**
 * Parse audio from Node file
 * @param filePath - Media file to read meta-data from
 * @param options - Parsing options
 * @returns Metadata
 */
export declare function parseFile(filePath: string, options?: IOptions): Promise<IAudioMetadata>;
