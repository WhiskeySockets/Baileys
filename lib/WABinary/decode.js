"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBinaryNode = exports.decodeDecompressedBinaryNode = exports.decompressingIfRequired = void 0;
const util_1 = require("util");
const zlib_1 = require("zlib");
const constants = __importStar(require("./constants"));
const jid_utils_1 = require("./jid-utils");
const inflatePromise = (0, util_1.promisify)(zlib_1.inflate);
const decompressingIfRequired = async (buffer) => {
    if (2 & buffer.readUInt8()) {
        buffer = await inflatePromise(buffer.slice(1));
    }
    else { // nodes with no compression have a 0x00 prefix, we remove that
        buffer = buffer.slice(1);
    }
    return buffer;
};
exports.decompressingIfRequired = decompressingIfRequired;
const decodeDecompressedBinaryNode = (buffer, opts, indexRef = { index: 0 }) => {
    const { DOUBLE_BYTE_TOKENS, SINGLE_BYTE_TOKENS, TAGS } = opts;
    const checkEOS = (length) => {
        if (indexRef.index + length > buffer.length) {
            throw new Error('end of stream');
        }
    };
    const next = () => {
        const value = buffer[indexRef.index];
        indexRef.index += 1;
        return value;
    };
    const readByte = () => {
        checkEOS(1);
        return next();
    };
    const readBytes = (n) => {
        checkEOS(n);
        const value = buffer.slice(indexRef.index, indexRef.index + n);
        indexRef.index += n;
        return value;
    };
    const readStringFromChars = (length) => {
        return readBytes(length).toString('utf-8');
    };
    const readInt = (n, littleEndian = false) => {
        checkEOS(n);
        let val = 0;
        for (let i = 0; i < n; i++) {
            const shift = littleEndian ? i : n - 1 - i;
            val |= next() << (shift * 8);
        }
        return val;
    };
    const readInt20 = () => {
        checkEOS(3);
        return ((next() & 15) << 16) + (next() << 8) + next();
    };
    const unpackHex = (value) => {
        if (value >= 0 && value < 16) {
            return value < 10 ? '0'.charCodeAt(0) + value : 'A'.charCodeAt(0) + value - 10;
        }
        throw new Error('invalid hex: ' + value);
    };
    const unpackNibble = (value) => {
        if (value >= 0 && value <= 9) {
            return '0'.charCodeAt(0) + value;
        }
        switch (value) {
            case 10:
                return '-'.charCodeAt(0);
            case 11:
                return '.'.charCodeAt(0);
            case 15:
                return '\0'.charCodeAt(0);
            default:
                throw new Error('invalid nibble: ' + value);
        }
    };
    const unpackByte = (tag, value) => {
        if (tag === TAGS.NIBBLE_8) {
            return unpackNibble(value);
        }
        else if (tag === TAGS.HEX_8) {
            return unpackHex(value);
        }
        else {
            throw new Error('unknown tag: ' + tag);
        }
    };
    const readPacked8 = (tag) => {
        const startByte = readByte();
        let value = '';
        for (let i = 0; i < (startByte & 127); i++) {
            const curByte = readByte();
            value += String.fromCharCode(unpackByte(tag, (curByte & 0xf0) >> 4));
            value += String.fromCharCode(unpackByte(tag, curByte & 0x0f));
        }
        if (startByte >> 7 !== 0) {
            value = value.slice(0, -1);
        }
        return value;
    };
    const isListTag = (tag) => {
        return tag === TAGS.LIST_EMPTY || tag === TAGS.LIST_8 || tag === TAGS.LIST_16;
    };
    const readListSize = (tag) => {
        switch (tag) {
            case TAGS.LIST_EMPTY:
                return 0;
            case TAGS.LIST_8:
                return readByte();
            case TAGS.LIST_16:
                return readInt(2);
            default:
                throw new Error('invalid tag for list size: ' + tag);
        }
    };
    const readJidPair = () => {
        const i = readString(readByte());
        const j = readString(readByte());
        if (j) {
            return (i || '') + '@' + j;
        }
        throw new Error('invalid jid pair: ' + i + ', ' + j);
    };
    const readAdJid = () => {
        const agent = readByte();
        const device = readByte();
        const user = readString(readByte());
        return (0, jid_utils_1.jidEncode)(user, agent === 0 ? 's.whatsapp.net' : 'lid', device);
    };
    const readString = (tag) => {
        if (tag >= 1 && tag < SINGLE_BYTE_TOKENS.length) {
            return SINGLE_BYTE_TOKENS[tag] || '';
        }
        switch (tag) {
            case TAGS.DICTIONARY_0:
            case TAGS.DICTIONARY_1:
            case TAGS.DICTIONARY_2:
            case TAGS.DICTIONARY_3:
                return getTokenDouble(tag - TAGS.DICTIONARY_0, readByte());
            case TAGS.LIST_EMPTY:
                return '';
            case TAGS.BINARY_8:
                return readStringFromChars(readByte());
            case TAGS.BINARY_20:
                return readStringFromChars(readInt20());
            case TAGS.BINARY_32:
                return readStringFromChars(readInt(4));
            case TAGS.JID_PAIR:
                return readJidPair();
            case TAGS.AD_JID:
                return readAdJid();
            case TAGS.HEX_8:
            case TAGS.NIBBLE_8:
                return readPacked8(tag);
            default:
                throw new Error('invalid string with tag: ' + tag);
        }
    };
    const readList = (tag) => {
        const items = [];
        const size = readListSize(tag);
        for (let i = 0; i < size; i++) {
            items.push((0, exports.decodeDecompressedBinaryNode)(buffer, opts, indexRef));
        }
        return items;
    };
    const getTokenDouble = (index1, index2) => {
        const dict = DOUBLE_BYTE_TOKENS[index1];
        if (!dict) {
            throw new Error(`Invalid double token dict (${index1})`);
        }
        const value = dict[index2];
        if (typeof value === 'undefined') {
            throw new Error(`Invalid double token (${index2})`);
        }
        return value;
    };
    const listSize = readListSize(readByte());
    const header = readString(readByte());
    if (!listSize || !header.length) {
        throw new Error('invalid node');
    }
    const attrs = {};
    let data;
    if (listSize === 0 || !header) {
        throw new Error('invalid node');
    }
    // read the attributes in
    const attributesLength = (listSize - 1) >> 1;
    for (let i = 0; i < attributesLength; i++) {
        const key = readString(readByte());
        const value = readString(readByte());
        attrs[key] = value;
    }
    if (listSize % 2 === 0) {
        const tag = readByte();
        if (isListTag(tag)) {
            data = readList(tag);
        }
        else {
            let decoded;
            switch (tag) {
                case TAGS.BINARY_8:
                    decoded = readBytes(readByte());
                    break;
                case TAGS.BINARY_20:
                    decoded = readBytes(readInt20());
                    break;
                case TAGS.BINARY_32:
                    decoded = readBytes(readInt(4));
                    break;
                default:
                    decoded = readString(tag);
                    break;
            }
            data = decoded;
        }
    }
    return {
        tag: header,
        attrs,
        content: data
    };
};
exports.decodeDecompressedBinaryNode = decodeDecompressedBinaryNode;
const decodeBinaryNode = async (buff) => {
    const decompBuff = await (0, exports.decompressingIfRequired)(buff);
    return (0, exports.decodeDecompressedBinaryNode)(decompBuff, constants);
};
exports.decodeBinaryNode = decodeBinaryNode;
