export type SupportedEncoding = "utf-8" | "utf8" | "utf-16le" | "ascii" | "latin1" | "iso-8859-1" | "windows-1252";
/**
 * Decode text from binary data
 * @param bytes Binary data
 * @param encoding Encoding
 */
export declare function textDecode(bytes: Uint8Array, encoding?: SupportedEncoding): string;
export declare function textEncode(input?: string, encoding?: SupportedEncoding): Uint8Array;
