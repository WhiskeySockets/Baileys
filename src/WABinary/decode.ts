import { decodeNode } from 'whatsapp-rust-bridge'
import type { BinaryNode } from './types'

export const decodeBinaryNode = (buffer: Uint8Array): BinaryNode => {
	return decodeNode(buffer)
}
