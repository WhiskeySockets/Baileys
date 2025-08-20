import { encodeNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const encodeBinaryNode = async (node: BinaryNode): Promise<Uint8Array> => {
	return encodeNode(node)
}
