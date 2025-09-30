import type { ITokenizer } from 'strtok3';
import type { ITokenParser } from '../ParserFactory.js';
import type { IOptions } from '../type.js';
import type { INativeMetadataCollector } from './MetadataCollector.js';
export declare abstract class BasicParser implements ITokenParser {
    protected readonly metadata: INativeMetadataCollector;
    protected readonly tokenizer: ITokenizer;
    protected readonly options: IOptions;
    /**
     * Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
     * @param {INativeMetadataCollector} metadata Output
     * @param {ITokenizer} tokenizer Input
     * @param {IOptions} options Parsing options
     */
    constructor(metadata: INativeMetadataCollector, tokenizer: ITokenizer, options: IOptions);
    abstract parse(): Promise<void>;
}
