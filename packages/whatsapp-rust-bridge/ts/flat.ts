import {
	__decodeNodeFlat,
	__encodeNodeFlat,
	__flatResultPtr,
} from "../pkg/whatsapp_rust_bridge.js";
import { wasmMemory } from "./wasm-runtime.js";

/**
 * A decoded stanza, left where the decoder wrote it.
 *
 * The four sections are handed over as offsets into linear memory rather than
 * as their own views, because taking four views per call costs more than the
 * rest of the decode does on a small stanza. Everything here, the object
 * included, is reused by the next call: read it straight through and copy
 * whatever outlives that.
 */
export interface FlatNode {
	/** Linear memory. Section offsets below index into this. */
	bytes: Buffer;
	/** The same memory as words, for the two sections that hold them. */
	words: Uint32Array;
	/** Byte offset of the string data. */
	stringsAt: number;
	/** Word index of the string offsets. String `i` runs `[i]` to `[i + 1]`. */
	offsetsAt: number;
	offsetCount: number;
	/** Word index of the tag, attribute and content entries in tree order. */
	layoutAt: number;
	/** Byte offset of the content bytes, addressed from the layout. */
	blobsAt: number;
	blobBytes: number;
}

let descriptor = 0;

const flat: FlatNode = {
	bytes: Buffer.alloc(0),
	words: new Uint32Array(0),
	stringsAt: 0,
	offsetsAt: 0,
	offsetCount: 0,
	layoutAt: 0,
	blobsAt: 0,
	blobBytes: 0,
};

// A heap that grew detaches every view over it, which shows up as a length of
// zero rather than as an error. The same check covers the first call: nothing
// here can run before the module is initialized.
function refresh() {
	if (flat.words.length === 0) {
		const buffer = wasmMemory().buffer;
		flat.words = new Uint32Array(buffer);
		flat.bytes = Buffer.from(buffer);
		descriptor = __flatResultPtr() >> 2;
	}
}

/**
 * Decodes a frame already inflated and stripped of its prefix byte.
 *
 * Inflating in the bridge would do it synchronously on the main thread, and a
 * compressed group stanza is large enough for that stall to miss deadlines.
 */
export function decodeNodeFlat(data: Uint8Array): FlatNode {
	__decodeNodeFlat(data);
	refresh();

	const words = flat.words;
	const at = descriptor;
	flat.stringsAt = words[at]!;
	flat.offsetsAt = words[at + 2]! >> 2;
	flat.offsetCount = words[at + 3]! >> 2;
	flat.layoutAt = words[at + 4]! >> 2;
	flat.blobsAt = words[at + 6]!;
	flat.blobBytes = words[at + 7]!;
	return flat;
}

/** Writes the frame for a tree the caller flattened. The result is owned. */
export function encodeNodeFlat(data: Uint8Array): Buffer {
	__encodeNodeFlat(data);
	refresh();

	const start = flat.words[descriptor]!;
	const out = Buffer.allocUnsafe(flat.words[descriptor + 1]!);
	flat.bytes.copy(out, 0, start, start + out.length);
	return out;
}
