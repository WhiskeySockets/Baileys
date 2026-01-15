import type { BinaryNode } from '../WABinary'
import { getBinaryNodeChild } from '../WABinary'

export function isMsmsgEncryption(node: BinaryNode): boolean {
	const encNode = getBinaryNodeChild(node, 'enc')
	return encNode?.attrs.type === 'msmsg'
}

export function shouldSkipMessage(
	fromJid: string,
	shouldIgnoreJid: (jid: string) => boolean | undefined,
	serverJid: string
): boolean {
	return !!shouldIgnoreJid(fromJid) && fromJid !== serverJid
}
