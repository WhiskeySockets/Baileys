import { BinaryInfo } from './BinaryInfo'
import {
	FLAG_BYTE,
	FLAG_EVENT,
	FLAG_EXTENDED,
	FLAG_FIELD,
	FLAG_GLOBAL,
	Value,
	WEB_EVENTS,
	WEB_GLOBALS
} from './constants'

const getHeaderBitLength = (key: number) => (key < 256 ? 2 : 3)

export const encodeWAM = (binaryInfo: BinaryInfo) => {
	binaryInfo.buffer = []

	encodeWAMHeader(binaryInfo)
	encodeEvents(binaryInfo)

	console.log(binaryInfo.buffer)
	const totalSize = binaryInfo.buffer.map(a => a.length).reduce((a, b) => a + b)
	const buffer = Buffer.alloc(totalSize)
	let offset = 0
	for (const buffer_ of binaryInfo.buffer) {
		buffer_.copy(buffer, offset)
		offset += buffer_.length
	}

	return buffer
}

function encodeWAMHeader(binaryInfo: BinaryInfo) {
	const headerBuffer = Buffer.alloc(8) // starting buffer
	headerBuffer.write('WAM', 0, 'utf8')
	headerBuffer.writeUInt8(binaryInfo.protocolVersion, 3)
	headerBuffer.writeUInt8(1, 4) //random flag
	headerBuffer.writeUInt16BE(binaryInfo.sequence, 5)
	headerBuffer.writeUInt8(0, 7) // regular channel

	binaryInfo.buffer.push(headerBuffer)
}

function encodeGlobalAttributes(binaryInfo: BinaryInfo, globals: { [key: string]: Value }) {
	for (const [key, _value] of Object.entries(globals)) {
		const id = WEB_GLOBALS.find(a => a?.name === key)!.id
		let value = _value
		if (typeof value === 'boolean') {
			value = value ? 1 : 0
		}

		binaryInfo.buffer.push(serializeData(id, value, FLAG_GLOBAL))
	}
}

function encodeEvents(binaryInfo: BinaryInfo) {
	for (const [name, { props, globals }] of binaryInfo.events.map(a => Object.entries(a)[0])) {
		encodeGlobalAttributes(binaryInfo, globals)
		const event = WEB_EVENTS.find(a => a.name === name)!

		const props_ = Object.entries(props)

		let extended = false

		for (const [, value] of props_) {
			extended ||= value !== null
		}

		const eventFlag = extended ? FLAG_EVENT : FLAG_EVENT | FLAG_EXTENDED
		binaryInfo.buffer.push(serializeData(event.id, -event.weight, eventFlag))

		for (let i = 0; i < props_.length; i++) {
			const [key, _value] = props_[i]
			const id = event.props[key][0]
			extended = i < props_.length - 1
			let value = _value
			if (typeof value === 'boolean') {
				value = value ? 1 : 0
			}

			const fieldFlag = extended ? FLAG_EVENT : FLAG_FIELD | FLAG_EXTENDED
			binaryInfo.buffer.push(serializeData(id, value, fieldFlag))
		}
	}
}

function serializeData(key: number, value: Value, flag: number): Buffer {
	const bufferLength = getHeaderBitLength(key)
	let buffer: Buffer
	let offset = 0
	if (value === null) {
		if (flag === FLAG_GLOBAL) {
			buffer = Buffer.alloc(bufferLength)
			offset = serializeHeader(buffer, offset, key, flag)
			return buffer
		}
	} else if (typeof value === 'number' && Number.isInteger(value)) {
		// is number
		if (value === 0 || value === 1) {
			buffer = Buffer.alloc(bufferLength)
			offset = serializeHeader(buffer, offset, key, flag | ((value + 1) << 4))
			return buffer
		} else if (-128 <= value && value < 128) {
			buffer = Buffer.alloc(bufferLength + 1)
			offset = serializeHeader(buffer, offset, key, flag | (3 << 4))
			buffer.writeInt8(value, offset)
			return buffer
		} else if (-32768 <= value && value < 32768) {
			buffer = Buffer.alloc(bufferLength + 2)
			offset = serializeHeader(buffer, offset, key, flag | (4 << 4))
			buffer.writeInt16LE(value, offset)
			return buffer
		} else if (-2147483648 <= value && value < 2147483648) {
			buffer = Buffer.alloc(bufferLength + 4)
			offset = serializeHeader(buffer, offset, key, flag | (5 << 4))
			buffer.writeInt32LE(value, offset)
			return buffer
		} else {
			buffer = Buffer.alloc(bufferLength + 8)
			offset = serializeHeader(buffer, offset, key, flag | (7 << 4))
			buffer.writeDoubleLE(value, offset)
			return buffer
		}
	} else if (typeof value === 'number') {
		// is float
		buffer = Buffer.alloc(bufferLength + 8)
		offset = serializeHeader(buffer, offset, key, flag | (7 << 4))
		buffer.writeDoubleLE(value, offset)
		return buffer
	} else if (typeof value === 'string') {
		// is string
		const utf8Bytes = Buffer.byteLength(value, 'utf8')
		if (utf8Bytes < 256) {
			buffer = Buffer.alloc(bufferLength + 1 + utf8Bytes)
			offset = serializeHeader(buffer, offset, key, flag | (8 << 4))
			buffer.writeUint8(utf8Bytes, offset++)
		} else if (utf8Bytes < 65536) {
			buffer = Buffer.alloc(bufferLength + 2 + utf8Bytes)
			offset = serializeHeader(buffer, offset, key, flag | (9 << 4))
			buffer.writeUInt16LE(utf8Bytes, offset)
			offset += 2
		} else {
			buffer = Buffer.alloc(bufferLength + 4 + utf8Bytes)
			offset = serializeHeader(buffer, offset, key, flag | (10 << 4))
			buffer.writeUInt32LE(utf8Bytes, offset)
			offset += 4
		}

		buffer.write(value, offset, 'utf8')
		return buffer
	}

	throw 'missing'
}

function serializeHeader(buffer: Buffer, offset: number, key: number, flag: number) {
	if (key < 256) {
		buffer.writeUInt8(flag, offset)
		offset += 1
		buffer.writeUInt8(key, offset)
		offset += 1
	} else {
		buffer.writeUInt8(flag | FLAG_BYTE, offset)
		offset += 1
		buffer.writeUInt16LE(key, offset)
		offset += 2
	}

	return offset
}
