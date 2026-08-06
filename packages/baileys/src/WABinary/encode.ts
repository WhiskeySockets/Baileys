import { encodeNodeFlat, tokenTable } from 'whatsapp-rust-bridge'
import type { BinaryNode } from './types'

// Known tags go across as a table index instead of their bytes, the same trade
// the decoder makes in reverse.
const TOKEN_BASE = 1 << 24
const TOKEN_INDEX = new Map<string, number>()
{
	const tokens = tokenTable() as (string | undefined)[]
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i] !== undefined) TOKEN_INDEX.set(tokens[i]!, TOKEN_BASE + i)
	}
}

// Held across calls for the same reason the decoder holds its reader state:
// the four collections and the closures capturing them were a fifth of the
// cost of encoding a small stanza. `flatten` runs to completion synchronously.
const layout: number[] = []
const strings: Buffer[] = []
const offsets: number[] = [0]
const seen = new Map<string, number>()
const blobs: Buffer[] = []
let stringLen = 0
let blobLen = 0

const intern = (value: string): number => {
	const token = TOKEN_INDEX.get(value)
	if (token !== undefined) return token

	const hit = seen.get(value)
	if (hit !== undefined) return hit

	const index = offsets.length - 1
	const bytes = Buffer.from(value, 'utf8')
	strings.push(bytes)
	stringLen += bytes.length
	offsets.push(stringLen)
	seen.set(value, index)
	return index
}

const push = (node: BinaryNode) => {
	layout.push(intern(node.tag))

	// An attribute set to null or undefined is omitted, not written as the
	// text "undefined". Optional attributes reach here unset from call sites
	// like a phone-only USync user and a media retry with no participant, and a
	// literal would go out on the wire.
	//
	// The count is backfilled rather than derived from a filtered array: that
	// array is one allocation per node, and it cost 15% of a device fanout.
	const countAt = layout.length
	layout.push(0)
	let kept = 0
	for (const key of Object.keys(node.attrs)) {
		const value = node.attrs[key]
		if (value === undefined || value === null) continue

		layout.push(intern(key), intern(String(value)))
		kept++
	}

	layout[countAt] = kept

	const content = node.content
	if (content === undefined || content === null) {
		layout.push(0)
	} else if (typeof content === 'string') {
		layout.push(2, intern(content))
	} else if (Array.isArray(content)) {
		layout.push(3, content.length)
		for (const child of content) push(child)
	} else {
		const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content)
		layout.push(1, blobLen, bytes.length)
		blobs.push(bytes)
		blobLen += bytes.length
	}
}

/**
 * Serialises the tree into one buffer for the bridge to read.
 *
 * Letting Rust pull the node apart through `Reflect` was 56% of the encode
 * profile: a crossing per tag, key and value. This crosses once.
 */
const flatten = (root: BinaryNode): Buffer => {
	layout.length = 0
	strings.length = 0
	offsets.length = 1
	blobs.length = 0
	seen.clear()
	stringLen = 0
	blobLen = 0

	push(root)

	// Sections stay 4-aligned so the bridge can read the u32 runs in place.
	const pad = (4 - (stringLen % 4)) % 4
	const out = Buffer.allocUnsafe(16 + stringLen + pad + offsets.length * 4 + layout.length * 4 + blobLen)
	out.writeUInt32LE(stringLen, 0)
	out.writeUInt32LE(offsets.length, 4)
	out.writeUInt32LE(layout.length, 8)
	out.writeUInt32LE(blobLen, 12)

	let at = 16
	for (const bytes of strings) {
		bytes.copy(out, at)
		at += bytes.length
	}

	out.fill(0, at, at + pad)
	at += pad
	for (const offset of offsets) {
		out.writeUInt32LE(offset, at)
		at += 4
	}

	for (const value of layout) {
		out.writeUInt32LE(value >>> 0, at)
		at += 4
	}

	for (const bytes of blobs) {
		bytes.copy(out, at)
		at += bytes.length
	}

	return out
}

export const encodeBinaryNode = (node: BinaryNode): Buffer => encodeNodeFlat(flatten(node))
