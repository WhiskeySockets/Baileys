import { decodeNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const decodeBinaryNode = (buffer: Uint8Array): BinaryNode => {
	const decoded = decodeNode(buffer)

	return decoded
}
