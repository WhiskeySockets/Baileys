import { encodeNode, init as initWasm } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const encodeBinaryNode = async (node: BinaryNode): Promise<Uint8Array> => {
	await initWasm()

	return encodeNode(node)
}
