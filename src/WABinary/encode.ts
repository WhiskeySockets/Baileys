import * as constants from './constants'
import { type FullJid, jidDecode } from './jid-utils'
import type { BinaryNode, BinaryNodeCodingOptions } from './types'
import { BufferWriter } from './buffer-utils'

export const encodeBinaryNode = (
	node: BinaryNode,
	opts: Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP'> = constants
): Buffer => {
	const writer = new BufferWriter()
	writer.writeByte(0)
	encodeBinaryNodeInner(node, opts, writer)
	return writer.toBuffer()
}

const encodeBinaryNodeInner = (
	{ tag, attrs, content }: BinaryNode,
	opts: Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP'>,
	writer: BufferWriter
): void => {
	const { TAGS, TOKEN_MAP } = opts

	const writeByteLength = (length: number) => {
		if (length >= 4294967296) {
			throw new Error('string too large to encode: ' + length)
		}

		if (length >= 1 << 20) {
			writer.writeByte(TAGS.BINARY_32)
			writer.writeInt(length, 4)
		} else if (length >= 256) {
			writer.writeByte(TAGS.BINARY_20)
			writer.writeInt20(length)
		} else {
			writer.writeByte(TAGS.BINARY_8)
			writer.writeByte(length)
		}
	}

	const writeStringRaw = (str: string) => {
		const bytes = Buffer.from(str, 'utf-8')
		writeByteLength(bytes.length)
		writer.writeBytes(bytes)
	}

	const writeJid = ({ domainType, device, user, server }: FullJid) => {
		if (typeof device !== 'undefined') {
			writer.writeByte(TAGS.AD_JID)
			writer.writeByte(domainType || 0)
			writer.writeByte(device || 0)
			writeString(user)
		} else {
			writer.writeByte(TAGS.JID_PAIR)
			if (user.length) {
				writeString(user)
			} else {
				writer.writeByte(TAGS.LIST_EMPTY)
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

		writer.writeByte(type === 'nibble' ? TAGS.NIBBLE_8 : TAGS.HEX_8)

		let roundedLength = Math.ceil(str.length / 2.0)
		if (str.length % 2 !== 0) {
			roundedLength |= 128
		}

		writer.writeByte(roundedLength)
		const packFunction = type === 'nibble' ? packNibble : packHex

		const packBytePair = (v1: string, v2: string) => {
			const result = (packFunction(v1) << 4) | packFunction(v2)
			return result
		}

		const strLengthHalf = Math.floor(str.length / 2)
		for (let i = 0; i < strLengthHalf; i++) {
			writer.writeByte(packBytePair(str[2 * i]!, str[2 * i + 1]!))
		}

		if (str.length % 2 !== 0) {
			writer.writeByte(packBytePair(str[str.length - 1]!, '\x00'))
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
			writer.writeByte(TAGS.LIST_EMPTY)
			return
		}

		const tokenIndex = TOKEN_MAP[str]
		if (tokenIndex) {
			if (typeof tokenIndex.dict === 'number') {
				writer.writeByte(TAGS.DICTIONARY_0 + tokenIndex.dict)
			}

			writer.writeByte(tokenIndex.index)
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
			writer.writeByte(TAGS.LIST_EMPTY)
		} else if (listSize < 256) {
			writer.writeByte(TAGS.LIST_8)
			writer.writeByte(listSize)
		} else {
			writer.writeByte(TAGS.LIST_16)
			writer.writeInt16(listSize)
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
		writer.writeBytes(content)
	} else if (Array.isArray(content)) {
		const validContent = content.filter(
			item => item && (item.tag || Buffer.isBuffer(item) || item instanceof Uint8Array || typeof item === 'string')
		)
		writeListStart(validContent.length)
		for (const item of validContent) {
			encodeBinaryNodeInner(item, opts, writer)
		}
	} else if (typeof content === 'undefined') {
		// do nothing
	} else {
		throw new Error(`invalid children for header "${tag}": ${content} (${typeof content})`)
	}
}
