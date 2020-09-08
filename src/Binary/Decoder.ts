import { WA } from './Constants'

export default class Decoder {
    buffer: Buffer = null
    index = 0

    checkEOS(length: number) {
        if (this.index + length > this.buffer.length) {
            throw new Error('end of stream')
        }
    }
    next() {
        const value = this.buffer[this.index]
        this.index += 1
        return value
    }
    readByte() {
        this.checkEOS(1)
        return this.next()
    }
    readStringFromChars(length: number) {
        this.checkEOS(length)
        const value = this.buffer.slice(this.index, this.index + length)

        this.index += length
        return value.toString ('utf-8')
    }
    readBytes(n: number): Buffer {
        this.checkEOS(n)
        const value = this.buffer.slice(this.index, this.index + n)
        this.index += n
        return value
    }
    readInt(n: number, littleEndian = false) {
        this.checkEOS(n)
        let val = 0
        for (let i = 0; i < n; i++) {
            const shift = littleEndian ? i : n - 1 - i
            val |= this.next() << (shift * 8)
        }
        return val
    }
    readInt20() {
        this.checkEOS(3)
        return ((this.next() & 15) << 16) + (this.next() << 8) + this.next()
    }
    unpackHex(value: number) {
        if (value >= 0 && value < 16) {
            return value < 10 ? '0'.charCodeAt(0) + value : 'A'.charCodeAt(0) + value - 10
        }
        throw new Error('invalid hex: ' + value)
    }
    unpackNibble(value: number) {
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
    unpackByte(tag: number, value: number) {
        if (tag === WA.Tags.NIBBLE_8) {
            return this.unpackNibble(value)
        } else if (tag === WA.Tags.HEX_8) {
            return this.unpackHex(value)
        } else {
            throw new Error('unknown tag: ' + tag)
        }
    }
    readPacked8(tag: number) {
        const startByte = this.readByte()
        let value = ''

        for (let i = 0; i < (startByte & 127); i++) {
            const curByte = this.readByte()
            value += String.fromCharCode(this.unpackByte(tag, (curByte & 0xf0) >> 4))
            value += String.fromCharCode(this.unpackByte(tag, curByte & 0x0f))
        }
        if (startByte >> 7 !== 0) {
            value = value.slice(0, -1)
        }
        return value
    }
    readRangedVarInt(min, max, description = 'unknown') {
        // value =
        throw new Error('WTF; should not be called')
    }
    isListTag(tag: number) {
        return tag === WA.Tags.LIST_EMPTY || tag === WA.Tags.LIST_8 || tag === WA.Tags.LIST_16
    }
    readListSize(tag: number) {
        switch (tag) {
            case WA.Tags.LIST_EMPTY:
                return 0
            case WA.Tags.LIST_8:
                return this.readByte()
            case WA.Tags.LIST_16:
                return this.readInt(2)
            default:
                throw new Error('invalid tag for list size: ' + tag)
        }
    }

    readString(tag: number): string {
        if (tag >= 3 && tag <= 235) {
            const token = this.getToken(tag)
            return token// === 's.whatsapp.net' ? 'c.us' : token
        }

        switch (tag) {
            case WA.Tags.DICTIONARY_0:
            case WA.Tags.DICTIONARY_1:
            case WA.Tags.DICTIONARY_2:
            case WA.Tags.DICTIONARY_3:
                return this.getTokenDouble(tag - WA.Tags.DICTIONARY_0, this.readByte())
            case WA.Tags.LIST_EMPTY:
                return null
            case WA.Tags.BINARY_8:
                return this.readStringFromChars(this.readByte())
            case WA.Tags.BINARY_20:
                return this.readStringFromChars(this.readInt20())
            case WA.Tags.BINARY_32:
                return this.readStringFromChars(this.readInt(4))
            case WA.Tags.JID_PAIR:
                const i = this.readString(this.readByte())
                const j = this.readString(this.readByte())
                if (typeof i === 'string' && j) {
                    return i + '@' + j
                }
                throw new Error('invalid jid pair: ' + i + ', ' + j)
            case WA.Tags.HEX_8:
            case WA.Tags.NIBBLE_8:
                return this.readPacked8(tag)
            default:
                throw new Error('invalid string with tag: ' + tag)
        }
    }
    readAttributes(n: number) {
        if (n !== 0) {
            const attributes: WA.NodeAttributes = {}
            for (let i = 0; i < n; i++) {
                const key = this.readString(this.readByte())
                const b = this.readByte()

                attributes[key] = this.readString(b)
            }
            return attributes
        }
        return null
    }
    readList(tag: number) {
        const arr = [...new Array(this.readListSize(tag))]
        return arr.map(() => this.readNode())
    }
    getToken(index: number) {
        if (index < 3 || index >= WA.SingleByteTokens.length) {
            throw new Error('invalid token index: ' + index)
        }
        return WA.SingleByteTokens[index]
    }
    getTokenDouble(index1, index2): string {
        const n = 256 * index1 + index2
        if (n < 0 || n > WA.DoubleByteTokens.length) {
            throw new Error('invalid double token index: ' + n)
        }
        return WA.DoubleByteTokens[n]
    }
    readNode(): WA.Node {
        const listSize = this.readListSize(this.readByte())
        const descrTag = this.readByte()
        if (descrTag === WA.Tags.STREAM_END) {
            throw new Error('unexpected stream end')
        }

        const descr = this.readString(descrTag)
        if (listSize === 0 || !descr) {
            throw new Error('invalid node')
        }

        const attrs = this.readAttributes((listSize - 1) >> 1)
        let content: WA.NodeData = null

        if (listSize % 2 === 0) {
            const tag = this.readByte()
            if (this.isListTag(tag)) {
                content = this.readList(tag)
            } else {
                let decoded: Buffer | string
                switch (tag) {
                    case WA.Tags.BINARY_8:
                        decoded = this.readBytes(this.readByte())
                        break
                    case WA.Tags.BINARY_20:
                        decoded = this.readBytes(this.readInt20())
                        break
                    case WA.Tags.BINARY_32:
                        decoded = this.readBytes(this.readInt(4))
                        break
                    default:
                        decoded = this.readString(tag)
                        break
                }

                if (descr === 'message' && Buffer.isBuffer(decoded)) {
                    content = WA.Message.decode(decoded)
                } else {
                    content = decoded
                }
            }
        }

        return [descr, attrs, content]
    }

    read(buffer: Buffer) {
        this.buffer = buffer
        this.index = 0
        return this.readNode()
    }
}
