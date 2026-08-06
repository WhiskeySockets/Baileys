import { initializeWasm, type WasmVariant } from "./wasm-runtime.js";

const wasmLocations: Record<WasmVariant, URL> = {
	simd: new URL("./wasm/simd.wasm", import.meta.url),
	nosimd: new URL("./wasm/nosimd.wasm", import.meta.url),
};

function resolveWasm(variant: WasmVariant): URL {
	return wasmLocations[variant];
}

export const __wasmSimdActive: boolean = initializeWasm(resolveWasm);
export * from "../pkg/whatsapp_rust_bridge.js";
export * from "./flat.js";
