import initDebug from 'debug';
import * as Token from 'token-types';
import { AbstractID3Parser } from '../id3v2/AbstractID3Parser.js';
import { MpcSv8Parser } from './sv8/MpcSv8Parser.js';
import { MpcSv7Parser } from './sv7/MpcSv7Parser.js';
import { MusepackContentError } from './MusepackConentError.js';
const debug = initDebug('music-metadata:parser:musepack');
export class MusepackParser extends AbstractID3Parser {
    async postId3v2Parse() {
        const signature = await this.tokenizer.peekToken(new Token.StringType(3, 'latin1'));
        let mpcParser;
        switch (signature) {
            case 'MP+': {
                debug('Stream-version 7');
                mpcParser = new MpcSv7Parser(this.metadata, this.tokenizer, this.options);
                break;
            }
            case 'MPC': {
                debug('Stream-version 8');
                mpcParser = new MpcSv8Parser(this.metadata, this.tokenizer, this.options);
                break;
            }
            default: {
                throw new MusepackContentError('Invalid signature prefix');
            }
        }
        this.metadata.setAudioOnly();
        return mpcParser.parse();
    }
}
