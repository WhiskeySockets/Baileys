import { BasicParser } from '../../common/BasicParser.js';
export declare class MpcSv8Parser extends BasicParser {
    private audioLength;
    parse(): Promise<void>;
    private parsePacket;
}
