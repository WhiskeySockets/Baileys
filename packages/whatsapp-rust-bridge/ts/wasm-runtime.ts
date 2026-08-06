import { readFileSync } from "node:fs";
import { initSync } from "../pkg/whatsapp_rust_bridge.js";

export type WasmVariant = "simd" | "nosimd";
type WasmLocation = string | URL;

// Minimal WASM module that uses i8x16.splat + i8x16.popcnt. WebAssembly.validate
// returns false on engines without SIMD (e.g. V8 on x86 without SSE4.1).
const SIMD_PROBE = new Uint8Array([
	0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8,
	0, 65, 0, 253, 15, 253, 98, 11,
]);

class WasmAssetReadError extends Error {
	readonly code: string | undefined;

	constructor(location: WasmLocation, cause: unknown) {
		super(
			`Unable to read whatsapp-rust-bridge WASM asset at ${location}. ` +
				"Keep dist/wasm beside the package entry points when copying or bundling the package.",
			{ cause },
		);
		this.name = "WasmAssetReadError";
		this.code = getErrorCode(cause);
	}
}

function getErrorCode(error: unknown): string | undefined {
	if (
		error instanceof Error &&
		"code" in error &&
		typeof error.code === "string"
	) {
		return error.code;
	}
}

function readWasm(location: WasmLocation) {
	try {
		return readFileSync(location);
	} catch (error) {
		throw new WasmAssetReadError(location, error);
	}
}

function compileWasm(location: WasmLocation): WebAssembly.Module {
	return new WebAssembly.Module(readWasm(location));
}

let memory: WebAssembly.Memory | undefined;

/** Linear memory of the instantiated module, for the flat codec views. */
export function wasmMemory(): WebAssembly.Memory {
	if (!memory) throw new Error("whatsapp-rust-bridge WASM is not initialized");
	return memory;
}

export function initializeWasm(
	resolveWasm: (variant: WasmVariant) => WasmLocation,
): boolean {
	const forceNoSimd = process.env.WHATSAPP_RUST_BRIDGE_FORCE_NOSIMD === "1";
	const simdSupported = !forceNoSimd && WebAssembly.validate(SIMD_PROBE);

	if (simdSupported) {
		try {
			const module = compileWasm(resolveWasm("simd"));
			memory = initSync({ module }).memory;
			return true;
		} catch (error) {
			// A SIMD compile failure can still happen if the probe and the actual
			// module exercise different engine capabilities. I/O and link failures
			// indicate broken package contents and must remain visible.
			if (!(error instanceof WebAssembly.CompileError)) {
				throw error;
			}
		}
	}

	const module = compileWasm(resolveWasm("nosimd"));
	memory = initSync({ module }).memory;
	return false;
}
