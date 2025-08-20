import { decodeNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const decodeBinaryNode = async (buffer: Uint8Array): Promise<BinaryNode> => {
	const decoded = decodeNode(buffer)

	return decoded
}
