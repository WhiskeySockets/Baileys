import { promisify } from 'util'
import { inflate } from 'zlib'
import * as constants from './constants'
import { jidEncode, type JidServer, WAJIDDomains } from './jid-utils'
import type { BinaryNode, BinaryNodeCodingOptions } from './types'

const inflatePromise = promisify(inflate)
const TEXT_DECODER = new TextDecoder()

export const decompressingIfRequired = async (buffer: Buffer) => {
	if (2 & buffer.readUInt8()) {
		buffer = await inflatePromise(buffer.slice(1))
	} else {
		// nodes with no compression have a 0x00 prefix, we remove that
		buffer = buffer.slice(1)
	}

	return buffer
}

export const decodeBinaryNode = async (buff: Buffer): Promise<BinaryNode> => {
	const decompBuff = await decompressingIfRequired(buff)
	const decoder = new BinaryDecoder(decompBuff, constants)
	return decoder.decode()
}

export const decodeDecompressedBinaryNode = (
	buffer: Buffer,
	opts: Pick<BinaryNodeCodingOptions, 'DOUBLE_BYTE_TOKENS' | 'SINGLE_BYTE_TOKENS' | 'TAGS'>,
	indexRef: { index: number } = { index: 0 }
): BinaryNode => {
	const decoder = new BinaryDecoder(buffer, opts, indexRef.index)
	const node = decoder.decode()
	indexRef.index = decoder.index
	return node
}

class BinaryDecoder {
	index: number
	private readonly view: DataView
	private readonly DOUBLE_BYTE_TOKENS: BinaryNodeCodingOptions['DOUBLE_BYTE_TOKENS']
	private readonly SINGLE_BYTE_TOKENS: BinaryNodeCodingOptions['SINGLE_BYTE_TOKENS']
	private readonly TAGS: BinaryNodeCodingOptions['TAGS']

	constructor(
		buffer: Buffer,
		opts: Pick<BinaryNodeCodingOptions, 'DOUBLE_BYTE_TOKENS' | 'SINGLE_BYTE_TOKENS' | 'TAGS'>,
		index = 0
	) {
		this.index = index
		this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
		this.DOUBLE_BYTE_TOKENS = opts.DOUBLE_BYTE_TOKENS
		this.SINGLE_BYTE_TOKENS = opts.SINGLE_BYTE_TOKENS
		this.TAGS = opts.TAGS
	}

	decode(): BinaryNode {
		const listSize = this.readListSize(this.readByte())
		const header = this.readString(this.readByte())
		if (!listSize || !header.length) {
			throw new Error('invalid node')
		}

		const attrs: BinaryNode['attrs'] = {}
		let data: BinaryNode['content']

		// read the attributes in
		const attributesLength = (listSize - 1) >> 1
		for (let i = 0; i < attributesLength; i++) {
			const key = this.readString(this.readByte())
			const value = this.readString(this.readByte())

			attrs[key] = value
		}

		if (listSize % 2 === 0) {
			const tag = this.readByte()
			if (this.isListTag(tag)) {
				data = this.readList(tag)
			} else {
				let decoded: Uint8Array | string
				switch (tag) {
					case this.TAGS.BINARY_8:
						decoded = this.readBytes(this.readByte())
						break
					case this.TAGS.BINARY_20:
						decoded = this.readBytes(this.readInt20())
						break
					case this.TAGS.BINARY_32:
						decoded = this.readBytes(this.readInt(4))
						break
					default:
						decoded = this.readString(tag)
						break
				}

				data = decoded
			}
		}

		return {
			tag: header,
			attrs,
			content: data
		}
	}

	private checkEOS(length: number) {
		if (this.index + length > this.view.byteLength) {
			throw new Error('end of stream')
		}
	}

	private readByte(): number {
		this.checkEOS(1)
		return this.view.getUint8(this.index++)
	}

	private readBytes(n: number): Uint8Array {
		this.checkEOS(n)
		const value = new Uint8Array(this.view.buffer, this.view.byteOffset + this.index, n)
		this.index += n
		return value
	}

	private readStringFromChars(length: number): string {
		return TEXT_DECODER.decode(this.readBytes(length))
	}

	private readInt(n: number, littleEndian = false): number {
		this.checkEOS(n)
		let val = 0
		for (let i = 0; i < n; i++) {
			const shift = littleEndian ? i : n - 1 - i
			val |= this.view.getUint8(this.index++) << (shift * 8)
		}

		return val
	}

	private readInt20(): number {
		this.checkEOS(3)
		return (
			((this.view.getUint8(this.index++) & 15) << 16) +
			(this.view.getUint8(this.index++) << 8) +
			this.view.getUint8(this.index++)
		)
	}

	private unpackHex(value: number): number {
		if (value >= 0 && value < 16) {
			return value < 10 ? '0'.charCodeAt(0) + value : 'A'.charCodeAt(0) + value - 10
		}

		throw new Error('invalid hex: ' + value)
	}

	private unpackNibble(value: number): number {
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

	private unpackByte(tag: number, value: number): number {
		if (tag === this.TAGS.NIBBLE_8) {
			return this.unpackNibble(value)
		} else if (tag === this.TAGS.HEX_8) {
			return this.unpackHex(value)
		} else {
			throw new Error('unknown tag: ' + tag)
		}
	}

	private readPacked8(tag: number): string {
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

	private isListTag(tag: number): boolean {
		return tag === this.TAGS.LIST_EMPTY || tag === this.TAGS.LIST_8 || tag === this.TAGS.LIST_16
	}

	private readListSize(tag: number): number {
		switch (tag) {
			case this.TAGS.LIST_EMPTY:
				return 0
			case this.TAGS.LIST_8:
				return this.readByte()
			case this.TAGS.LIST_16:
				return this.readInt(2)
			default:
				throw new Error('invalid tag for list size: ' + tag)
		}
	}

	private readJidPair(): string {
		const i = this.readString(this.readByte())
		const j = this.readString(this.readByte())
		if (j) {
			return (i || '') + '@' + j
		}

		throw new Error('invalid jid pair: ' + i + ', ' + j)
	}

	private readAdJid(): string {
		const domainType = this.readByte()
		const device = this.readByte()
		const user = this.readString(this.readByte())

		let server: JidServer = 's.whatsapp.net'
		if (domainType === WAJIDDomains.LID) {
			server = 'lid'
		} else if (domainType === WAJIDDomains.HOSTED) {
			server = 'hosted'
		} else if (domainType === WAJIDDomains.HOSTED_LID) {
			server = 'hosted.lid'
		}

		return jidEncode(user, server, device)
	}

	private readFbJid(): string {
		const user = this.readString(this.readByte())
		const device = this.readInt(2)
		const server = this.readString(this.readByte())
		return `${user}:${device}@${server}`
	}

	private readInteropJid(): string {
		const user = this.readString(this.readByte())
		const device = this.readInt(2)
		const integrator = this.readInt(2)

		let server = 'interop'
		const beforeServer = this.index
		try {
			server = this.readString(this.readByte())
		} catch (err) {
			this.index = beforeServer
		}

		return `${integrator}-${user}:${device}@${server}`
	}

	private readString(tag: number): string {
		if (tag >= 1 && tag < this.SINGLE_BYTE_TOKENS.length) {
			return this.SINGLE_BYTE_TOKENS[tag] || ''
		}

		switch (tag) {
			case this.TAGS.DICTIONARY_0:
			case this.TAGS.DICTIONARY_1:
			case this.TAGS.DICTIONARY_2:
			case this.TAGS.DICTIONARY_3:
				return this.getTokenDouble(tag - this.TAGS.DICTIONARY_0, this.readByte())
			case this.TAGS.LIST_EMPTY:
				return ''
			case this.TAGS.BINARY_8:
				return this.readStringFromChars(this.readByte())
			case this.TAGS.BINARY_20:
				return this.readStringFromChars(this.readInt20())
			case this.TAGS.BINARY_32:
				return this.readStringFromChars(this.readInt(4))
			case this.TAGS.JID_PAIR:
				return this.readJidPair()
			case this.TAGS.FB_JID:
				return this.readFbJid()
			case this.TAGS.INTEROP_JID:
				return this.readInteropJid()
			case this.TAGS.AD_JID:
				return this.readAdJid()
			case this.TAGS.HEX_8:
			case this.TAGS.NIBBLE_8:
				return this.readPacked8(tag)
			default:
				throw new Error('invalid string with tag: ' + tag)
		}
	}

	private readList(tag: number): BinaryNode[] {
		const items: BinaryNode[] = []
		const size = this.readListSize(tag)
		for (let i = 0; i < size; i++) {
			items.push(this.decode())
		}

		return items
	}

	private getTokenDouble(index1: number, index2: number): string {
		const dict = this.DOUBLE_BYTE_TOKENS[index1]
		if (!dict) {
			throw new Error(`Invalid double token dict (${index1})`)
		}

		const value = dict[index2]
		if (typeof value === 'undefined') {
			throw new Error(`Invalid double token (${index2})`)
		}

		return value
	}
}
