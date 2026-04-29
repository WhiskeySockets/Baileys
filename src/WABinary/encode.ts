import * as constants from './constants'
import { type FullJid, jidDecode } from './jid-utils'
import type { BinaryNode, BinaryNodeCodingOptions } from './types'

type EncoderOpts = Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP_REFACTOR'>

class ByteEncoder {
	readonly TAGS: EncoderOpts['TAGS']
	readonly TOKEN_MAP_REFACTOR: EncoderOpts['TOKEN_MAP_REFACTOR']

	constructor(
		public readonly buffer: number[],
		opts: EncoderOpts
	) {
		this.TAGS = opts.TAGS
		this.TOKEN_MAP_REFACTOR = opts.TOKEN_MAP_REFACTOR
	}

	pushByte(value: number) {
		this.buffer.push(value & 0xff)
	}

	pushInt(value: number, n: number, littleEndian = false) {
		for (let i = 0; i < n; i++) {
			const curShift = littleEndian ? i : n - 1 - i
			this.buffer.push((value >> (curShift * 8)) & 0xff)
		}
	}

	pushBytes(bytes: Uint8Array | Buffer | number[]) {
		for (const byte of bytes) {
			this.buffer.push(byte)
		}
	}

	pushInt16(value: number) {
		this.pushBytes([(value >> 8) & 0xff, value & 0xff])
	}

	pushInt20(value: number) {
		this.pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff])
	}

	writeByteLength(length: number) {
		const { TAGS } = this
		if (length >= 4294967296) {
			throw new Error('string too large to encode: ' + length)
		}

		if (length >= 1 << 20) {
			this.pushByte(TAGS.BINARY_32)
			this.pushInt(length, 4) // 32 bit integer
		} else if (length >= 256) {
			this.pushByte(TAGS.BINARY_20)
			this.pushInt20(length)
		} else {
			this.pushByte(TAGS.BINARY_8)
			this.pushByte(length)
		}
	}

	writeStringRaw(str: string) {
		const bytes = Buffer.from(str, 'utf-8')
		this.writeByteLength(bytes.length)
		this.pushBytes(bytes)
	}

	writeJid({ domainType, device, user, server }: FullJid) {
		const { TAGS } = this
		if (typeof device !== 'undefined') {
			this.pushByte(TAGS.AD_JID)
			this.pushByte(domainType || 0)
			this.pushByte(device || 0)
			this.writeString(user)
		} else {
			this.pushByte(TAGS.JID_PAIR)
			if (user.length) {
				this.writeString(user)
			} else {
				this.pushByte(TAGS.LIST_EMPTY)
			}

			this.writeString(server)
		}
	}

	writePackedBytes(str: string, type: 'nibble' | 'hex') {
		const { TAGS } = this
		if (str.length > TAGS.PACKED_MAX) {
			throw new Error('Too many bytes to pack')
		}

		this.pushByte(type === 'nibble' ? TAGS.NIBBLE_8 : TAGS.HEX_8)

		let roundedLength = Math.ceil(str.length / 2.0)
		if (str.length % 2 !== 0) {
			roundedLength |= 128
		}

		this.pushByte(roundedLength)
		const packFunction = type === 'nibble' ? packNibble : packHex

		const strLengthHalf = Math.floor(str.length / 2)
		for (let i = 0; i < strLengthHalf; i++) {
			this.pushByte((packFunction(str[2 * i] as string) << 4) | packFunction(str[2 * i + 1] as string))
		}

		if (str.length % 2 !== 0) {
			this.pushByte((packFunction(str[str.length - 1] as string) << 4) | packFunction('\x00' as string))
		}
	}

	writeString(str?: string) {
		const { TAGS, TOKEN_MAP_REFACTOR } = this
		if (str === undefined || str === null) {
			this.pushByte(TAGS.LIST_EMPTY)
			return
		}

		if (str === '') {
			this.writeStringRaw(str)
			return
		}

		const tokenIndex = TOKEN_MAP_REFACTOR.get(str)
		if (tokenIndex) {
			if (typeof tokenIndex.dict === 'number') {
				this.pushByte(TAGS.DICTIONARY_0 + tokenIndex.dict)
			}

			this.pushByte(tokenIndex.index)
		} else if (isNibble(str, TAGS.PACKED_MAX)) {
			this.writePackedBytes(str, 'nibble')
		} else if (isHex(str, TAGS.PACKED_MAX)) {
			this.writePackedBytes(str, 'hex')
		} else if (str) {
			const decodedJid = jidDecode(str)
			if (decodedJid) {
				this.writeJid(decodedJid)
			} else {
				this.writeStringRaw(str)
			}
		}
	}

	writeListStart(listSize: number) {
		const { TAGS } = this
		if (listSize === 0) {
			this.pushByte(TAGS.LIST_EMPTY)
		} else if (listSize < 256) {
			this.pushBytes([TAGS.LIST_8, listSize])
		} else {
			this.pushByte(TAGS.LIST_16)
			this.pushInt16(listSize)
		}
	}
}

const packNibble = (char: string): number => {
	switch (char) {
		case '-':
			return 10
		case '.':
			return 11
		case '\0':
			return 15
		default:
			if (char >= '0' && char <= '9') {
				return char.charCodeAt(0) - '0'.charCodeAt(0)
			}

			throw new Error(`invalid byte for nibble "${char}"`)
	}
}

const packHex = (char: string): number => {
	if (char >= '0' && char <= '9') {
		return char.charCodeAt(0) - '0'.charCodeAt(0)
	}

	if (char >= 'A' && char <= 'F') {
		return 10 + char.charCodeAt(0) - 'A'.charCodeAt(0)
	}

	if (char >= 'a' && char <= 'f') {
		return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
	}

	if (char === '\0') {
		return 15
	}

	throw new Error(`Invalid hex char "${char}"`)
}

const isNibble = (str: string, packedMax: number): boolean => {
	if (str.length > packedMax) {
		return false
	}

	for (const char of str) {
		const isInNibbleRange = char >= '0' && char <= '9'
		if (!isInNibbleRange && char !== '-' && char !== '.') {
			return false
		}
	}

	return true
}

const isHex = (str: string, packedMax: number): boolean => {
	if (str.length > packedMax) {
		return false
	}

	for (const char of str) {
		const isInNibbleRange = char >= '0' && char <= '9'
		if (!isInNibbleRange && !(char >= 'A' && char <= 'F')) {
			return false
		}
	}

	return true
}

const encodeBinaryNodeInner = ({ tag, attrs, content }: BinaryNode, encoder: ByteEncoder): void => {
	if (!tag) {
		throw new Error('Invalid node: tag cannot be undefined')
	}

	let attrCount = 0
	if (attrs) {
		for (const k in attrs) {
			const v = attrs[k]
			if (v !== undefined && v !== null) {
				attrCount++
			}
		}
	}

	encoder.writeListStart(2 * attrCount + 1 + (typeof content !== 'undefined' ? 1 : 0))
	encoder.writeString(tag)

	if (attrs) {
		for (const key in attrs) {
			if (typeof attrs[key] === 'string') {
				encoder.writeString(key)
				encoder.writeString(attrs[key])
			}
		}
	}

	if (typeof content === 'string') {
		encoder.writeString(content)
	} else if (Buffer.isBuffer(content) || content instanceof Uint8Array) {
		encoder.writeByteLength(content.length)
		encoder.pushBytes(content)
	} else if (Array.isArray(content)) {
		let validCount = 0
		for (const item of content) {
			if (item && (item.tag || Buffer.isBuffer(item) || item instanceof Uint8Array || typeof item === 'string')) {
				validCount++
			}
		}

		encoder.writeListStart(validCount)
		for (const item of content) {
			if (item && (item.tag || Buffer.isBuffer(item) || item instanceof Uint8Array || typeof item === 'string')) {
				encodeBinaryNodeInner(item, encoder)
			}
		}
	} else if (typeof content === 'undefined') {
		// do nothing
	} else {
		throw new Error(`invalid children for header "${tag}": ${content} (${typeof content})`)
	}
}

export const encodeBinaryNode = (node: BinaryNode, opts: EncoderOpts = constants, buffer: number[] = [0]): Buffer => {
	const encoder = new ByteEncoder(buffer, opts)
	encodeBinaryNodeInner(node, encoder)
	return Buffer.from(buffer)
}
