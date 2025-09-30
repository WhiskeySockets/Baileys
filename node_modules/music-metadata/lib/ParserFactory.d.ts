import { type MediaType } from 'media-typer';
import { type INativeMetadataCollector } from './common/MetadataCollector.js';
import { type IAudioMetadata, type IOptions, type ParserType } from './type.js';
import type { ITokenizer } from 'strtok3';
export interface IParserLoader {
    /**
     * Returns a list of supported file extensions
     */
    extensions: string[];
    mimeTypes: string[];
    parserType: ParserType;
    /**
     * Lazy load the parser implementation class.
     */
    load(): Promise<new (metadata: INativeMetadataCollector, tokenizer: ITokenizer, options: IOptions) => ITokenParser>;
}
export interface ITokenParser {
    /**
     * Parse audio track.
     * Called after init(...).
     * @returns Promise
     */
    parse(): Promise<void>;
}
interface IContentType extends MediaType {
    parameters: {
        [id: string]: string;
    };
}
export declare function parseHttpContentType(contentType: string): IContentType;
export declare class ParserFactory {
    parsers: IParserLoader[];
    constructor();
    registerParser(parser: IParserLoader): void;
    parse(tokenizer: ITokenizer, parserLoader: IParserLoader | undefined, opts?: IOptions): Promise<IAudioMetadata>;
    /**
     * @param filePath - Path, filename or extension to audio file
     * @return Parser submodule name
     */
    findLoaderForExtension(filePath: string | undefined): IParserLoader | undefined;
    findLoaderForContentType(httpContentType: string): IParserLoader | undefined;
    getSupportedMimeTypes(): string[];
}
export {};
