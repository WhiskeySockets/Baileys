import { proto } from "../../WAMessage/WAMessage";
import { BinaryNode, SingleByteTokens, Tags } from "./types";

const encode = ({ header, attributes, data }: BinaryNode, buffer: number[] = []) => {
	
	const pushByte = (value: number) => buffer.push(value & 0xff)

    const pushInt = (value: number, n: number, littleEndian=false) => {
        for (let i = 0; i < n; i++) {
            const curShift = littleEndian ? i : n - 1 - i
            buffer.push((value >> (curShift * 8)) & 0xff)
        }
    }
    const pushBytes = (bytes: Uint8Array | Buffer | number[]) => (
		bytes.forEach (b => buffer.push(b))
	)
    const pushInt20 = (value: number) => (
		pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff])
	)
    const pushString = (str: string) => {
        const bytes = Buffer.from (str, 'utf-8')
        pushBytes(bytes)
    }
    const writeByteLength = (length: number) => {
        if (length >= 4294967296) throw new Error('string too large to encode: ' + length)
        
        if (length >= 1 << 20) {
            pushByte(Tags.BINARY_32)
            pushInt(length, 4) // 32 bit integer
        } else if (length >= 256) {
            pushByte(Tags.BINARY_20)
            pushInt20(length)
        } else {
            pushByte(Tags.BINARY_8)
            pushByte(length)
        }
    }
    const writeStringRaw = (string: string) => {
        writeByteLength(string.length)
        pushString(string)
    }
    const writeToken = (token: number) => {
        if (token < 245) {
            pushByte(token)
        } else if (token <= 500) {
            throw new Error('invalid token')
        }
    }
    const writeString = (token: string, i?: boolean) => {
        if (token === 'c.us') token = 's.whatsapp.net'
        
        const tokenIndex = SingleByteTokens.indexOf(token)
        if (!i && token === 's.whatsapp.net') {
            writeToken(tokenIndex)
        } else if (tokenIndex >= 0) {
            if (tokenIndex < Tags.SINGLE_BYTE_MAX) {
                writeToken(tokenIndex)
            } else {
                const overflow = tokenIndex - Tags.SINGLE_BYTE_MAX
                const dictionaryIndex = overflow >> 8
                if (dictionaryIndex < 0 || dictionaryIndex > 3) {
                    throw new Error('double byte dict token out of range: ' + token + ', ' + tokenIndex)
                }
                writeToken(Tags.DICTIONARY_0 + dictionaryIndex)
                writeToken(overflow % 256)
            }
        } else if (token) {
            const jidSepIndex = token.indexOf('@')
            if (jidSepIndex <= 0) {
                writeStringRaw(token)
            } else {
                writeJid(token.slice(0, jidSepIndex), token.slice(jidSepIndex + 1, token.length))
            }
        }
    }
    const writeJid = (left: string, right: string) => {
        pushByte(Tags.JID_PAIR)
        left && left.length > 0 ? writeString(left) : writeToken(Tags.LIST_EMPTY)
        writeString(right)
    }
    const writeListStart = (listSize: number) => {
        if (listSize === 0) {
            pushByte(Tags.LIST_EMPTY)
        } else if (listSize < 256) {
            pushBytes([Tags.LIST_8, listSize])
        } else {
            pushBytes([Tags.LIST_16, listSize])
        }
    }
	const validAttributes = Object.keys(attributes).filter(k => (
		typeof attributes[k] !== 'undefined' && attributes[k] !== null
	))

	writeListStart(2*validAttributes.length + 1 + (typeof data !== 'undefined' && data !== null ? 1 : 0))
	writeString(header)

	validAttributes.forEach((key) => {
		writeString(key)
		writeString(attributes[key])
	})

	if(data instanceof proto.WebMessageInfo && !Buffer.isBuffer(data)) {
		data = Buffer.from(proto.WebMessageInfo.encode(data).finish())
	}

	if (typeof data === 'string') {
		writeString(data, true)
	} else if (Buffer.isBuffer(data)) {
		writeByteLength(data.length)
		pushBytes(data)
	} else if (Array.isArray(data)) {
		writeListStart(data.length)
		for(const item of data) {
			if(item) encode(item, buffer)
		}
	} else if(typeof data === 'undefined' || data === null) {
        
    } else {
		throw new Error(`invalid children for header "${header}": ${data} (${typeof data})`)
	}

	return Buffer.from(buffer)
}
export default encode