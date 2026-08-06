import { promisify } from 'util'
import { decodeNodeFlat, tokenTable } from 'whatsapp-rust-bridge'
import { inflate } from 'zlib'
import type { BinaryNode } from './types'

const inflatePromise = promisify(inflate)

/**
 * Inflation stays here rather than in the bridge: node runs zlib on the thread
 * pool, and doing it inside the WASM call blocks the loop long enough on a
 * compressed group stanza to miss deadlines.
 */
export const decompressingIfRequired = async (buffer: Buffer) =>
	2 & buffer.readUInt8() ? await inflatePromise(buffer.subarray(1)) : buffer.subarray(1)

// Read once: a decode refers to a known tag by index instead of shipping and
// decoding its bytes again, which is what the TypeScript decoder did with its
// own token table.
const TOKENS = tokenTable() as (string | undefined)[]
const TOKEN_BASE = 1 << 24

/**
 * The bridge hands the tree over as one buffer and this assembles it, rather
 * than exposing a handle whose every field crosses the boundary. Measured
 * against the TypeScript decoder it replaces, on a group stanza: 1.05x faster
 * at one participant, 1.12x at eight, 1.20x at sixty-four.
 *
 * Layout, sections aligned to 4 so the views cost nothing:
 *   u32 stringBytes, u32 offsetCount, u32 layoutCount, u32 blobBytes
 *   string data | u32 offsets | u32 layout | blob data
 */
export const decodeBinaryNode = async (buff: Buffer): Promise<BinaryNode> => {
	const buf = decodeNodeFlat(await decompressingIfRequired(buff))
	const header = new Uint32Array(buf.buffer, buf.byteOffset, 4)
	const stringBytes = header[0]!
	const offsetCount = header[1]!
	const layoutCount = header[2]!

	const all = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
	let at = 16
	const stringsAt = at
	at += stringBytes
	at += (4 - (at % 4)) % 4
	const offsets = new Uint32Array(buf.buffer, buf.byteOffset + at, offsetCount)
	at += offsetCount * 4
	const layout = new Uint32Array(buf.buffer, buf.byteOffset + at, layoutCount)
	at += layoutCount * 4
	const blobsAt = at

	const pool = new Array<string>(offsetCount - 1)
	for (let i = 0; i < pool.length; i++) {
		pool[i] = all.toString('utf8', stringsAt + offsets[i]!, stringsAt + offsets[i + 1]!)
	}

	const str = (index: number) => (index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!)

	let cursor = 0
	const read = (): BinaryNode => {
		const tag = str(layout[cursor++]!)
		const attrCount = layout[cursor++]!
		const attrs: { [key: string]: string } = {}
		for (let i = 0; i < attrCount; i++) {
			attrs[str(layout[cursor++]!)] = str(layout[cursor++]!)
		}

		const kind = layout[cursor++]
		let content: BinaryNode['content']
		if (kind === 1) {
			const offset = layout[cursor++]!
			content = all.subarray(blobsAt + offset, blobsAt + offset + layout[cursor++]!)
		} else if (kind === 2) {
			content = str(layout[cursor++]!)
		} else if (kind === 3) {
			const count = layout[cursor++]!
			const children = new Array<BinaryNode>(count)
			for (let i = 0; i < count; i++) children[i] = read()
			content = children
		}

		return { tag, attrs, content }
	}

	return read()
}
