import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { type BinaryNode } from './types'

// some extra useful utilities

export const getBinaryNodeChildren = (node: BinaryNode | undefined, childTag: string) => {
	if (Array.isArray(node?.content)) {
		return node.content.filter(item => item.tag === childTag)
	}

	return []
}

export const getAllBinaryNodeChildren = ({ content }: BinaryNode) => {
	if (Array.isArray(content)) {
		return content
	}

	return []
}

export const getBinaryNodeChild = (node: BinaryNode | undefined, childTag: string) => {
	if (Array.isArray(node?.content)) {
		return node?.content.find(item => item.tag === childTag)
	}
}

export const getBinaryNodeChildBuffer = (node: BinaryNode | undefined, childTag: string): Buffer | undefined => {
	const child = getBinaryNodeChild(node, childTag)?.content
	if (Buffer.isBuffer(child) || child instanceof Uint8Array) {
		return Buffer.from(child)
	}
}

export const getBinaryNodeChildString = (node: BinaryNode | undefined, childTag: string) => {
	const child = getBinaryNodeChild(node, childTag)?.content
	if (Buffer.isBuffer(child) || child instanceof Uint8Array) {
		return Buffer.from(child).toString('utf-8')
	} else if (typeof child === 'string') {
		return child
	}
}

export const getBinaryNodeChildUInt = (node: BinaryNode, childTag: string, length: number) => {
	const buff = getBinaryNodeChildBuffer(node, childTag)
	if (buff) {
		return bufferToUInt(buff, length)
	}
}

export const assertNodeErrorFree = (node: BinaryNode) => {
	const errNode = getBinaryNodeChild(node, 'error')
	if (errNode) {
		throw new Boom(errNode.attrs.text || 'Unknown error', { data: +errNode.attrs.code! })
	}
}

export const reduceBinaryNodeToDictionary = (node: BinaryNode, tag: string) => {
	const nodes = getBinaryNodeChildren(node, tag)
	const dict = nodes.reduce(
		(dict, { attrs }) => {
			if (typeof attrs.name === 'string') {
				dict[attrs.name] = attrs.value! || attrs.config_value!
			} else {
				dict[attrs.config_code!] = attrs.value! || attrs.config_value!
			}

			return dict
		},
		{} as { [_: string]: string }
	)
	return dict
}

export const getBinaryNodeMessages = ({ content }: BinaryNode) => {
	const msgs: proto.WebMessageInfo[] = []
	if (Array.isArray(content)) {
		for (const item of content) {
			if (item.tag === 'message') {
				msgs.push(proto.WebMessageInfo.decode(item.content as Uint8Array).toJSON() as proto.WebMessageInfo)
			}
		}
	}

	return msgs
}

function bufferToUInt(e: Uint8Array | Buffer, t: number) {
	let a = 0
	for (let i = 0; i < t; i++) {
		a = 256 * a + e[i]!
	}

	return a
}

export function binaryNodeToString(node: BinaryNode | BinaryNode['content']): string {
	if (!node) {
		return node!
	}

	if (typeof node !== 'object') {
		return ' ' + String(node)
	}

	if (node instanceof Uint8Array || Buffer.isBuffer(node)) {
		return ' ' + Buffer.from(node).toString('hex')
	}

	if (Array.isArray(node)) {
		return node.map(x => binaryNodeToString(x)).join(' ')
	}

	const children = node.content ? `${binaryNodeToString(node.content)}` : ''

	let tag = `<${node.tag}`
	for (const [k, v] of Object.entries(node.attrs || {})) {
		if (typeof v !== 'undefined' && v !== null) {
			tag += ` ${k}='${v}'`
		}
	}

	if (children) {
		return `${tag}>${children}</${node.tag}>`
	} else {
		return `${tag}/>`
	}
}
