import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { BinaryNode } from './types'

// some extra useful utilities

export const getBinaryNodeChildren = ({ content }: BinaryNode, childTag: string) => {
	if(Array.isArray(content)) {
		return content.filter(item => item.tag === childTag)
	}

	return []
}

export const getAllBinaryNodeChildren = ({ content }: BinaryNode) => {
	if(Array.isArray(content)) {
		return content
	}

	return []
}

export const getBinaryNodeChild = ({ content }: BinaryNode, childTag: string) => {
	if(Array.isArray(content)) {
		return content.find(item => item.tag === childTag)
	}
}

export const getBinaryNodeChildBuffer = (node: BinaryNode, childTag: string) => {
	const child = getBinaryNodeChild(node, childTag)?.content
	if(Buffer.isBuffer(child) || child instanceof Uint8Array) {
		return child
	}
}

export const getBinaryNodeChildUInt = (node: BinaryNode, childTag: string, length: number) => {
	const buff = getBinaryNodeChildBuffer(node, childTag)
	if(buff) {
		return bufferToUInt(buff, length)
	}
}

export const assertNodeErrorFree = (node: BinaryNode) => {
	const errNode = getBinaryNodeChild(node, 'error')
	if(errNode) {
		throw new Boom(errNode.attrs.text || 'Unknown error', { data: +errNode.attrs.code })
	}
}

export const reduceBinaryNodeToDictionary = (node: BinaryNode, tag: string) => {
	const nodes = getBinaryNodeChildren(node, tag)
	const dict = nodes.reduce(
		(dict, { attrs }) => {
			dict[attrs.name || attrs.config_code] = attrs.value || attrs.config_value
			return dict
		}, { } as { [_: string]: string }
	)
	return dict
}

export const getBinaryNodeMessages = ({ content }: BinaryNode) => {
	const msgs: proto.WebMessageInfo[] = []
	if(Array.isArray(content)) {
		for(const item of content) {
			if(item.tag === 'message') {
				msgs.push(proto.WebMessageInfo.decode(item.content as Buffer))
			}
		}
	}

	return msgs
}

function bufferToUInt(e: Uint8Array | Buffer, t: number) {
	let a = 0
	for(let i = 0; i < t; i++) {
		a = 256 * a + e[i]
	}

	return a
}