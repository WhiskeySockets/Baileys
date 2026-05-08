import { readFileSync } from "fs";

export const simdWasmBase64 = () => {
  return readFileSync("./assets/wasm/simd.wasm").toBase64();
};

export const nosimdWasmBase64 = () => {
  return readFileSync("./assets/wasm/nosimd.wasm").toBase64();
};
