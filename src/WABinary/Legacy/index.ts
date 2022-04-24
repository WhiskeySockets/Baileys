
import { decodeDecompressedBinaryNode } from '../decode'
import { encodeBinaryNode } from '../encode'
import type { BinaryNode } from '../types'
import * as constants from './constants'

export const encodeBinaryNodeLegacy = (node: BinaryNode) => {
	return encodeBinaryNode(node, constants, [])
}

export const decodeBinaryNodeLegacy = (data: Buffer, indexRef: { index: number }) => {
	return decodeDecompressedBinaryNode(data, constants, indexRef)
}
