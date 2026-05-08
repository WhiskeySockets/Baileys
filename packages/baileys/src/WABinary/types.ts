import * as constants from './constants'
/**
 * the binary node WA uses internally for communication
 *
 * this is manipulated soley as an object and it does not have any functions.
 * This is done for easy serialization, to prevent running into issues with prototypes &
 * to maintain functional code structure
 * */
export type BinaryNode = {
	tag: string
	attrs: { [key: string]: string }
	content?: BinaryNode[] | string | Uint8Array
}
export type BinaryNodeAttributes = BinaryNode['attrs']
export type BinaryNodeData = BinaryNode['content']

export type BinaryNodeCodingOptions = typeof constants
