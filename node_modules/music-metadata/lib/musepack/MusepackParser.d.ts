import { AbstractID3Parser } from '../id3v2/AbstractID3Parser.js';
export declare class MusepackParser extends AbstractID3Parser {
    postId3v2Parse(): Promise<void>;
}
