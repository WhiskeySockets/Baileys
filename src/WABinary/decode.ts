import { decodeNode, type INode, type WasmNode } from 'whatsapp-rust-bridge/binary'
import type { BinaryNode } from './types'

function convertWasmNodeToINode(handle: WasmNode): INode {
	const node: INode = {
		tag: handle.tag,
		attrs: handle.getAttributes(),
		content: handle.content ?? handle.children
	}
	return node
}

export const decodeBinaryNode = (buffer: Uint8Array): BinaryNode => {
	const handle = decodeNode(buffer)

	const decoded = convertWasmNodeToINode(handle)

	return decoded
}
