import { promisify } from 'util'
import { decodeNodeFlat, tokenTable } from 'whatsapp-rust-bridge'
import { inflate } from 'zlib'
import type { BinaryNode } from './types'

const inflatePromise = promisify(inflate)

export const decompressingIfRequired = async (buffer: Buffer) =>
	2 & buffer.readUInt8() ? await inflatePromise(buffer.subarray(1)) : buffer.subarray(1)

// Read once: a decode refers to a known tag by index instead of shipping and
// decoding its bytes again, which is what the TypeScript decoder did with its
// own token table.
const TOKENS = tokenTable() as (string | undefined)[]
const TOKEN_BASE = 1 << 24

// Reader state lives here rather than in a closure the decode captures: V8
// allocates a context object per call for that, and on a small stanza the
// allocation is a fifth of the decode. Everything below runs synchronously
// within one `decodeBinaryNode` call.
let pool: string[] = []
let words: Uint32Array<ArrayBufferLike> = new Uint32Array(0)
let blobs: Buffer<ArrayBufferLike> = Buffer.alloc(0)
let cursor = 0

const read = (): BinaryNode => {
	let index = words[cursor++]!
	const tag = index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!

	const attrCount = words[cursor++]!
	const attrs: { [key: string]: string } = {}
	for (let i = 0; i < attrCount; i++) {
		index = words[cursor++]!
		const key = index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!
		index = words[cursor++]!
		attrs[key] = index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!
	}

	const kind = words[cursor++]
	let content: BinaryNode['content']
	if (kind === 1) {
		const offset = words[cursor++]!
		content = blobs.subarray(offset, offset + words[cursor++]!)
	} else if (kind === 2) {
		index = words[cursor++]!
		content = index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!
	} else if (kind === 3) {
		const count = words[cursor++]!
		const children = new Array<BinaryNode>(count)
		for (let i = 0; i < count; i++) children[i] = read()
		content = children
	}

	return { tag, attrs, content }
}

/**
 * Assembles the tree from the sections the bridge exposes, rather than from a
 * handle whose every field crosses the boundary.
 *
 * Those sections point straight into WASM memory and only live until the next
 * bridge call. Strings are materialised here and the layout is read here, so
 * the one thing that escapes is byte content, and that gets its own copy.
 *
 * Inflation is inlined rather than awaited through `decompressingIfRequired`:
 * an uncompressed frame is the common case and it does not need the second
 * async hop, which on a small stanza costs more than the decode.
 */
export const decodeBinaryNode = async (buff: Buffer): Promise<BinaryNode> => {
	const body = 2 & buff.readUInt8() ? await inflatePromise(buff.subarray(1)) : buff.subarray(1)
	const flat = decodeNodeFlat(body)
	const { bytes, stringsAt, offsetsAt, offsetCount, blobsAt, blobBytes } = flat
	words = flat.words

	const count = offsetCount - 1
	pool = new Array<string>(count)
	for (let i = 0; i < count; i++) {
		pool[i] = bytes.toString('utf8', stringsAt + words[offsetsAt + i]!, stringsAt + words[offsetsAt + i + 1]!)
	}

	// One copy for the whole section, so the leaves stay views into it.
	blobs = blobBytes ? Buffer.from(bytes.subarray(blobsAt, blobsAt + blobBytes)) : bytes
	cursor = flat.layoutAt
	return read()
}
