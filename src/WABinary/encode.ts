import { encodeNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const encodeBinaryNode = (node: BinaryNode): Uint8Array => {
	return encodeNode(node)
}
