import type { DataType } from './AsfObject.js';
export type AttributeParser = (buf: Uint8Array) => boolean | string | number | bigint | Uint8Array;
export declare function getParserForAttr(i: DataType): AttributeParser;
export declare function parseUnicodeAttr(uint8Array: Uint8Array): string;
