import { resolve } from "node:path";
import { initializeWasm, type WasmVariant } from "./wasm-runtime.js";

const wasmLocations: Record<WasmVariant, string> = {
	simd: resolve(__dirname, "wasm/simd.wasm"),
	nosimd: resolve(__dirname, "wasm/nosimd.wasm"),
};

function resolveWasm(variant: WasmVariant): string {
	return wasmLocations[variant];
}

export const __wasmSimdActive: boolean = initializeWasm(resolveWasm);
export * from "../pkg/whatsapp_rust_bridge.js";
export * from "./flat.js";
