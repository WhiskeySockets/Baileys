import type { BinaryNode } from 'whatsapp-rust-bridge'
/**
 * the binary node WA uses internally for communication
 *
 * @deprecated use `BinaryNode` from `whatsapp-rust-bridge` instead
 */
export type { BinaryNode }

export type BinaryNodeAttributes = BinaryNode['attrs']
export type BinaryNodeData = BinaryNode['content']

/**
 * this is only here for compatibility reasons, it is not used
 * @deprecated use BinaryNode from `whatsapp-rust-bridge` instead
 */
export type BinaryNodeCodingOptions = {
	SINGLE_BYTE_TOKENS: string[]
	DOUBLE_BYTE_TOKENS: string[][]
	TAGS: {[key: string]: number}
}
