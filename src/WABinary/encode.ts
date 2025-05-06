import * as constants from './constants'
import { FullJid, jidDecode } from './jid-utils'
import type { BinaryNode, BinaryNodeCodingOptions } from './types'

export const encodeBinaryNode = (
	node: BinaryNode,
	opts: Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP'> = constants,
	buffer: number[] = [0]
): Buffer => {
	const encoded = encodeBinaryNodeInner(node, opts, buffer)
	return Buffer.from(encoded)
}

const encodeBinaryNodeInner = (
	{ tag, attrs, content }: BinaryNode,
	opts: Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP'>,
	buffer: number[]
): number[] => {
	const { TAGS, TOKEN_MAP } = opts

	const pushByte = (value: number) => buffer.push(value & 0xff)

	const pushInt = (value: number, n: number, littleEndian = false) => {
		for (let i = 0; i < n; i++) {
			const curShift = littleEndian ? i : n - 1 - i
			buffer.push((value >> (curShift * 8)) & 0xff)
		}
	}

	const pushBytes = (bytes: Uint8Array | Buffer | number[]) => {
		for (const b of bytes) {
			buffer.push(b)
		}
	}

	const pushInt16 = (value: number) => {
		pushBytes([(value >> 8) & 0xff, value & 0xff])
	}

	const pushInt20 = (value: number) => pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff])
	const writeByteLength = (length: number) => {
		if (length >= 4294967296) {
			throw new Error('string too large to encode: ' + length)
		}

		if (length >= 1 << 20) {
			pushByte(TAGS.BINARY_32)
			pushInt(length, 4) // 32 bit integer
		} else if (length >= 256) {
			pushByte(TAGS.BINARY_20)
			pushInt20(length)
		} else {
			pushByte(TAGS.BINARY_8)
			pushByte(length)
		}
	}

	const writeStringRaw = (str: string) => {
		const bytes = Buffer.from(str, 'utf-8')
		writeByteLength(bytes.length)
		pushBytes(bytes)
	}

	const writeJid = ({ domainType, device, user, server }: FullJid) => {
		if (typeof device !== 'undefined') {
			pushByte(TAGS.AD_JID)
			pushByte(domainType || 0)
			pushByte(device || 0)
			writeString(user)
		} else {
			pushByte(TAGS.JID_PAIR)
			if (user.length) {
				writeString(user)
			} else {
				pushByte(TAGS.LIST_EMPTY)
			}

			writeString(server)
		}
	}

	const packNibble = (char: string) => {
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

	const packHex = (char: string) => {
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

	const writePackedBytes = (str: string, type: 'nibble' | 'hex') => {
		if (str.length > TAGS.PACKED_MAX) {
			throw new Error('Too many bytes to pack')
		}

		pushByte(type === 'nibble' ? TAGS.NIBBLE_8 : TAGS.HEX_8)

		let roundedLength = Math.ceil(str.length / 2.0)
		if (str.length % 2 !== 0) {
			roundedLength |= 128
		}

		pushByte(roundedLength)
		const packFunction = type === 'nibble' ? packNibble : packHex

		const packBytePair = (v1: string, v2: string) => {
			const result = (packFunction(v1) << 4) | packFunction(v2)
			return result
		}

		const strLengthHalf = Math.floor(str.length / 2)
		for (let i = 0; i < strLengthHalf; i++) {
			pushByte(packBytePair(str[2 * i], str[2 * i + 1]))
		}

		if (str.length % 2 !== 0) {
			pushByte(packBytePair(str[str.length - 1], '\x00'))
		}
	}

	const isNibble = (str?: string) => {
		if (!str || str.length > TAGS.PACKED_MAX) {
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

	const isHex = (str?: string) => {
		if (!str || str.length > TAGS.PACKED_MAX) {
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

	const writeString = (str?: string) => {
		if (str === undefined || str === null) {
			pushByte(TAGS.LIST_EMPTY)
			return
		}

		const tokenIndex = TOKEN_MAP[str]
		if (tokenIndex) {
			if (typeof tokenIndex.dict === 'number') {
				pushByte(TAGS.DICTIONARY_0 + tokenIndex.dict)
			}

			pushByte(tokenIndex.index)
		} else if (isNibble(str)) {
			writePackedBytes(str, 'nibble')
		} else if (isHex(str)) {
			writePackedBytes(str, 'hex')
		} else if (str) {
			const decodedJid = jidDecode(str)
			if (decodedJid) {
				writeJid(decodedJid)
			} else {
				writeStringRaw(str)
			}
		}
	}

	const writeListStart = (listSize: number) => {
		if (listSize === 0) {
			pushByte(TAGS.LIST_EMPTY)
		} else if (listSize < 256) {
			pushBytes([TAGS.LIST_8, listSize])
		} else {
			pushByte(TAGS.LIST_16)
			pushInt16(listSize)
		}
	}

	if (!tag) {
		throw new Error('Invalid node: tag cannot be undefined')
	}

	const validAttributes = Object.keys(attrs || {}).filter(k => typeof attrs[k] !== 'undefined' && attrs[k] !== null)

	writeListStart(2 * validAttributes.length + 1 + (typeof content !== 'undefined' ? 1 : 0))
	writeString(tag)

	for (const key of validAttributes) {
		if (typeof attrs[key] === 'string') {
			writeString(key)
			writeString(attrs[key])
		}
	}

	if (typeof content === 'string') {
		writeString(content)
	} else if (Buffer.isBuffer(content) || content instanceof Uint8Array) {
		writeByteLength(content.length)
		pushBytes(content)
	} else if (Array.isArray(content)) {
		const validContent = content.filter(
			item => item && (item.tag || Buffer.isBuffer(item) || item instanceof Uint8Array || typeof item === 'string')
		)
		writeListStart(validContent.length)
		for (const item of validContent) {
			encodeBinaryNodeInner(item, opts, buffer)
		}
	} else if (typeof content === 'undefined') {
		// do nothing
	} else {
		throw new Error(`invalid children for header "${tag}": ${content} (${typeof content})`)
	}

	return buffer
}
