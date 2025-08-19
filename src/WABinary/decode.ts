import { init as initWasm } from 'whatsapp-rust-bridge/binary'
import { decodeNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

export const decodeBinaryNode = async (buffer: Uint8Array): Promise<BinaryNode> => {
	await initWasm()

	const decoded = decodeNode(buffer)

	return decoded
}
