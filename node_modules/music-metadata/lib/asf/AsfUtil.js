import * as Token from 'token-types';
import * as util from '../common/Util.js';
export function getParserForAttr(i) {
    return attributeParsers[i];
}
export function parseUnicodeAttr(uint8Array) {
    return util.stripNulls(util.decodeString(uint8Array, 'utf-16le'));
}
const attributeParsers = [
    parseUnicodeAttr,
    parseByteArrayAttr,
    parseBoolAttr,
    parseDWordAttr,
    parseQWordAttr,
    parseWordAttr,
    parseByteArrayAttr
];
function parseByteArrayAttr(buf) {
    return new Uint8Array(buf);
}
function parseBoolAttr(buf, offset = 0) {
    return parseWordAttr(buf, offset) === 1;
}
function parseDWordAttr(buf, offset = 0) {
    return Token.UINT32_LE.get(buf, offset);
}
function parseQWordAttr(buf, offset = 0) {
    return Token.UINT64_LE.get(buf, offset);
}
function parseWordAttr(buf, offset = 0) {
    return Token.UINT16_LE.get(buf, offset);
}
