import initDebug from 'debug';
import * as AtomToken from './AtomToken.js';
import { Header } from './AtomToken.js';
const debug = initDebug('music-metadata:parser:MP4:Atom');
export class Atom {
    static async readAtom(tokenizer, dataHandler, parent, remaining) {
        // Parse atom header
        const offset = tokenizer.position;
        debug(`Reading next token on offset=${offset}...`); //  buf.toString('ascii')
        const header = await tokenizer.readToken(AtomToken.Header);
        const extended = header.length === 1n;
        if (extended) {
            header.length = await tokenizer.readToken(AtomToken.ExtendedSize);
        }
        const atomBean = new Atom(header, extended, parent);
        const payloadLength = atomBean.getPayloadLength(remaining);
        debug(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`); //  buf.toString('ascii')
        await atomBean.readData(tokenizer, dataHandler, payloadLength);
        return atomBean;
    }
    constructor(header, extended, parent) {
        this.header = header;
        this.extended = extended;
        this.parent = parent;
        this.children = [];
        this.atomPath = (this.parent ? `${this.parent.atomPath}.` : '') + this.header.name;
    }
    getHeaderLength() {
        return this.extended ? 16 : 8;
    }
    getPayloadLength(remaining) {
        return (this.header.length === 0n ? remaining : Number(this.header.length)) - this.getHeaderLength();
    }
    async readAtoms(tokenizer, dataHandler, size) {
        while (size > 0) {
            const atomBean = await Atom.readAtom(tokenizer, dataHandler, this, size);
            this.children.push(atomBean);
            size -= atomBean.header.length === 0n ? size : Number(atomBean.header.length);
        }
    }
    async readData(tokenizer, dataHandler, remaining) {
        switch (this.header.name) {
            // "Container" atoms, contains nested atoms
            case 'moov': // The Movie Atom: contains other atoms
            case 'udta': // User defined atom
            case 'mdia': // Media atom
            case 'minf': // Media Information Atom
            case 'stbl': // The Sample Table Atom
            case '<id>':
            case 'ilst':
            case 'tref':
            case 'moof':
                return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining));
            case 'meta': { // Metadata Atom, ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
                // meta has 4 bytes of padding, ignore
                const peekHeader = await tokenizer.peekToken(Header);
                const paddingLength = peekHeader.name === 'hdlr' ? 0 : 4;
                await tokenizer.ignore(paddingLength);
                return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining) - paddingLength);
            }
            default:
                return dataHandler(this, remaining);
        }
    }
}
