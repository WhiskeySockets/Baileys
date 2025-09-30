import type { ITokenizer } from 'strtok3';
export declare class BitReader {
    pos: number;
    private dword;
    private tokenizer;
    constructor(tokenizer: ITokenizer);
    /**
     *
     * @param bits 1..30 bits
     */
    read(bits: number): Promise<number>;
    ignore(bits: number): Promise<number>;
}
