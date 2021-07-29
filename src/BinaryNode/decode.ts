import { proto } from '../../WAMessage'
import { BinaryNode, DoubleByteTokens, SingleByteTokens, Tags } from './types'

function decode<T extends BinaryNode>(buffer: Buffer, makeNode: () => T, indexRef: { index: number }) {
    
    const checkEOS = (length: number) => {
        if (indexRef.index + length > buffer.length) {
            throw new Error('end of stream')
        }
    }
    const next = () => {
        const value = buffer[indexRef.index]
        indexRef.index += 1
        return value
    }
    const readByte = () => {
        checkEOS(1)
        return next()
    }
    const readStringFromChars = (length: number) => {
        checkEOS(length)
        const value = buffer.slice(indexRef.index, indexRef.index + length)

        indexRef.index += length
        return value.toString('utf-8')
    }
    const readBytes = (n: number) => {
        checkEOS(n)
        const value = buffer.slice(indexRef.index, indexRef.index + n)
        indexRef.index += n
        return value
    }
    const readInt = (n: number, littleEndian = false) => {
        checkEOS(n)
        let val = 0
        for (let i = 0; i < n; i++) {
            const shift = littleEndian ? i : n - 1 - i
            val |= next() << (shift * 8)
        }
        return val
    }
    const readInt20 = () => {
        checkEOS(3)
        return ((next() & 15) << 16) + (next() << 8) + next()
    }
    const unpackHex = (value: number) => {
        if (value >= 0 && value < 16) {
            return value < 10 ? '0'.charCodeAt(0) + value : 'A'.charCodeAt(0) + value - 10
        }
        throw new Error('invalid hex: ' + value)
    }
    const unpackNibble = (value: number) => {
        if (value >= 0 && value <= 9) {
            return '0'.charCodeAt(0) + value
        }
        switch (value) {
            case 10:
                return '-'.charCodeAt(0)
            case 11:
                return '.'.charCodeAt(0)
            case 15:
                return '\0'.charCodeAt(0)
            default:
                throw new Error('invalid nibble: ' + value)
        }
    }
    const unpackByte = (tag: number, value: number) => {
        if (tag === Tags.NIBBLE_8) {
            return unpackNibble(value)
        } else if (tag === Tags.HEX_8) {
            return unpackHex(value)
        } else {
            throw new Error('unknown tag: ' + tag)
        }
    }
    const readPacked8 = (tag: number) => {
        const startByte = readByte()
        let value = ''

        for (let i = 0; i < (startByte & 127); i++) {
            const curByte = readByte()
            value += String.fromCharCode(unpackByte(tag, (curByte & 0xf0) >> 4))
            value += String.fromCharCode(unpackByte(tag, curByte & 0x0f))
        }
        if (startByte >> 7 !== 0) {
            value = value.slice(0, -1)
        }
        return value
    }
    const isListTag = (tag: number) => {
        return tag === Tags.LIST_EMPTY || tag === Tags.LIST_8 || tag === Tags.LIST_16
    }
    const readListSize = (tag: number) => {
        switch (tag) {
            case Tags.LIST_EMPTY:
                return 0
            case Tags.LIST_8:
                return readByte()
            case Tags.LIST_16:
                return readInt(2)
            default:
                throw new Error('invalid tag for list size: ' + tag)
        }
    }
    const getToken = (index: number) => {
        if (index < 3 || index >= SingleByteTokens.length) {
            throw new Error('invalid token index: ' + index)
        }
        return SingleByteTokens[index]
    }
    const readString = (tag: number) => {
        if (tag >= 3 && tag <= 235) {
            const token = getToken(tag)
            return token// === 's.whatsapp.net' ? 'c.us' : token
        }

        switch (tag) {
            case Tags.DICTIONARY_0:
            case Tags.DICTIONARY_1:
            case Tags.DICTIONARY_2:
            case Tags.DICTIONARY_3:
                return getTokenDouble(tag - Tags.DICTIONARY_0, readByte())
            case Tags.LIST_EMPTY:
                return null
            case Tags.BINARY_8:
                return readStringFromChars(readByte())
            case Tags.BINARY_20:
                return readStringFromChars(readInt20())
            case Tags.BINARY_32:
                return readStringFromChars(readInt(4))
            case Tags.JID_PAIR:
                const i = readString(readByte())
                const j = readString(readByte())
                if (typeof i === 'string' && j) {
                    return i + '@' + j
                }
                throw new Error('invalid jid pair: ' + i + ', ' + j)
            case Tags.HEX_8:
            case Tags.NIBBLE_8:
                return readPacked8(tag)
            default:
                throw new Error('invalid string with tag: ' + tag)
        }
    }
    const readList = (tag: number) => (
        [...new Array(readListSize(tag))].map(() => decode(buffer, makeNode, indexRef))
    )
    const getTokenDouble = (index1: number, index2: number) => {
        const n = 256 * index1 + index2
        if (n < 0 || n > DoubleByteTokens.length) {
            throw new Error('invalid double token index: ' + n)
        }
        return DoubleByteTokens[n]
    }
    const node = makeNode()
    const listSize = readListSize(readByte())
    const descrTag = readByte()
    if (descrTag === Tags.STREAM_END) {
        throw new Error('unexpected stream end')
    }
    node.header = readString(descrTag)
    if (listSize === 0 || !node.header) {
        throw new Error('invalid node')
    }
    // read the attributes in
    const attributesLength = (listSize - 1) >> 1
    for (let i = 0; i < attributesLength; i++) {
        const key = readString(readByte())
        const b = readByte()

        node.attributes[key] = readString(b)
    }

    if (listSize % 2 === 0) {
        const tag = readByte()
        if (isListTag(tag)) {
            node.data = readList(tag)
        } else {
            let decoded: Buffer | string
            switch (tag) {
                case Tags.BINARY_8:
                    decoded = readBytes(readByte())
                    break
                case Tags.BINARY_20:
                    decoded = readBytes(readInt20())
                    break
                case Tags.BINARY_32:
                    decoded = readBytes(readInt(4))
                    break
                default:
                    decoded = readString(tag)
                    break
            }

            if (node.header === 'message' && Buffer.isBuffer(decoded)) {
                node.data = proto.WebMessageInfo.decode(decoded)
            } else {
                node.data = decoded
            }
        }
    }
    return node
}
export default decode