import { Float32_BE, Float64_BE, StringType, UINT8 } from 'token-types';
import initDebug from 'debug';
import { EndOfStreamError } from 'strtok3';
import { DataType } from './types.js';
import * as Token from 'token-types';
import { makeUnexpectedFileContentError } from '../ParseError.js';
const debug = initDebug('music-metadata:parser:ebml');
export class EbmlContentError extends makeUnexpectedFileContentError('EBML') {
}
export const ParseAction = {
    ReadNext: 0, // Continue reading the next elements
    IgnoreElement: 2, // Ignore (do not read) this element
    SkipSiblings: 3, // Skip all remaining elements at the same level
    TerminateParsing: 4, // Terminate the parsing process
    SkipElement: 5 // Consider the element has read, assume position is at the next element
};
/**
 * Extensible Binary Meta Language (EBML) iterator
 * https://en.wikipedia.org/wiki/Extensible_Binary_Meta_Language
 * http://matroska.sourceforge.net/technical/specs/rfc/index.html
 *
 * WEBM VP8 AUDIO FILE
 */
export class EbmlIterator {
    /**
     * @param {ITokenizer} tokenizer Input
     * @param tokenizer
     */
    constructor(tokenizer) {
        this.padding = 0;
        this.parserMap = new Map();
        this.ebmlMaxIDLength = 4;
        this.ebmlMaxSizeLength = 8;
        this.tokenizer = tokenizer;
        this.parserMap.set(DataType.uint, e => this.readUint(e));
        this.parserMap.set(DataType.string, e => this.readString(e));
        this.parserMap.set(DataType.binary, e => this.readBuffer(e));
        this.parserMap.set(DataType.uid, async (e) => this.readBuffer(e));
        this.parserMap.set(DataType.bool, e => this.readFlag(e));
        this.parserMap.set(DataType.float, e => this.readFloat(e));
    }
    async iterate(dtdElement, posDone, listener) {
        return this.parseContainer(linkParents(dtdElement), posDone, listener);
    }
    async parseContainer(dtdElement, posDone, listener) {
        const tree = {};
        while (this.tokenizer.position < posDone) {
            let element;
            const elementPosition = this.tokenizer.position;
            try {
                element = await this.readElement();
            }
            catch (error) {
                if (error instanceof EndOfStreamError) {
                    break;
                }
                throw error;
            }
            const child = dtdElement.container[element.id];
            if (child) {
                const action = listener.startNext(child);
                switch (action) {
                    case ParseAction.ReadNext:
                        {
                            if (element.id === 0x1F43B675) {
                                // Hack to ignore remaining segment, when cluster element received
                                // await this.tokenizer.ignore(posDone - this.tokenizer.position);
                                // break;
                            }
                            debug(`Read element: name=${getElementPath(child)}{id=0x${element.id.toString(16)}, container=${!!child.container}} at position=${elementPosition}`);
                            if (child.container) {
                                const res = await this.parseContainer(child, element.len >= 0 ? this.tokenizer.position + element.len : -1, listener);
                                if (child.multiple) {
                                    if (!tree[child.name]) {
                                        tree[child.name] = [];
                                    }
                                    tree[child.name].push(res);
                                }
                                else {
                                    tree[child.name] = res;
                                }
                                await listener.elementValue(child, res, elementPosition);
                            }
                            else {
                                const parser = this.parserMap.get(child.value);
                                if (typeof parser === 'function') {
                                    const value = await parser(element);
                                    tree[child.name] = value;
                                    await listener.elementValue(child, value, elementPosition);
                                }
                            }
                        }
                        break;
                    case ParseAction.SkipElement:
                        debug(`Go to next element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                        break;
                    case ParseAction.IgnoreElement:
                        debug(`Ignore element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                        await this.tokenizer.ignore(element.len);
                        break;
                    case ParseAction.SkipSiblings:
                        debug(`Ignore remaining container, at: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                        await this.tokenizer.ignore(posDone - this.tokenizer.position);
                        break;
                    case ParseAction.TerminateParsing:
                        debug(`Terminate parsing at element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                        return tree;
                }
            }
            else {
                switch (element.id) {
                    case 0xec: // void
                        this.padding += element.len;
                        await this.tokenizer.ignore(element.len);
                        break;
                    default:
                        debug(`parseEbml: parent=${getElementPath(dtdElement)}, unknown child: id=${element.id.toString(16)} at position=${elementPosition}`);
                        this.padding += element.len;
                        await this.tokenizer.ignore(element.len);
                }
            }
        }
        return tree;
    }
    async readVintData(maxLength) {
        const msb = await this.tokenizer.peekNumber(UINT8);
        let mask = 0x80;
        let oc = 1;
        // Calculate VINT_WIDTH
        while ((msb & mask) === 0) {
            if (oc > maxLength) {
                throw new EbmlContentError('VINT value exceeding maximum size');
            }
            ++oc;
            mask >>= 1;
        }
        const id = new Uint8Array(oc);
        await this.tokenizer.readBuffer(id);
        return id;
    }
    async readElement() {
        const id = await this.readVintData(this.ebmlMaxIDLength);
        const lenField = await this.readVintData(this.ebmlMaxSizeLength);
        lenField[0] ^= 0x80 >> (lenField.length - 1);
        return {
            id: readUIntBE(id, id.length),
            len: readUIntBE(lenField, lenField.length)
        };
    }
    async readFloat(e) {
        switch (e.len) {
            case 0:
                return 0.0;
            case 4:
                return this.tokenizer.readNumber(Float32_BE);
            case 8:
                return this.tokenizer.readNumber(Float64_BE);
            case 10:
                return this.tokenizer.readNumber(Float64_BE);
            default:
                throw new EbmlContentError(`Invalid IEEE-754 float length: ${e.len}`);
        }
    }
    async readFlag(e) {
        return (await this.readUint(e)) === 1;
    }
    async readUint(e) {
        const buf = await this.readBuffer(e);
        return readUIntBE(buf, e.len);
    }
    async readString(e) {
        const rawString = await this.tokenizer.readToken(new StringType(e.len, 'utf-8'));
        return rawString.replace(/\x00.*$/g, '');
    }
    async readBuffer(e) {
        const buf = new Uint8Array(e.len);
        await this.tokenizer.readBuffer(buf);
        return buf;
    }
}
function readUIntBE(buf, len) {
    return Number(readUIntBeAsBigInt(buf, len));
}
/**
 * Reeds an unsigned integer from a big endian buffer of length `len`
 * @param buf Buffer to decode from
 * @param len Number of bytes
 * @private
 */
function readUIntBeAsBigInt(buf, len) {
    const normalizedNumber = new Uint8Array(8);
    const cleanNumber = buf.subarray(0, len);
    try {
        normalizedNumber.set(cleanNumber, 8 - len);
        return Token.UINT64_BE.get(normalizedNumber, 0);
    }
    catch (_error) {
        return BigInt(-1);
    }
}
function linkParents(element) {
    if (element.container) {
        Object.keys(element.container)
            .map(id => {
            const child = element.container[id];
            child.id = Number.parseInt(id);
            return child;
        }).forEach(child => {
            child.parent = element;
            linkParents(child);
        });
    }
    return element;
}
export function getElementPath(element) {
    let path = '';
    if (element.parent && element.parent.name !== 'dtd') {
        path += `${getElementPath(element.parent)}/`;
    }
    return path + element.name;
}
