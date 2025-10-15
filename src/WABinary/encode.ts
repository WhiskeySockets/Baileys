import { encodeNodeTo } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

const encodingBuffer = new Uint8Array(16384)

export const encodeBinaryNode = (node: BinaryNode): Uint8Array => {
	const bytesWritten = encodeNodeTo(node, encodingBuffer)

	return encodingBuffer.subarray(0, bytesWritten)
}
