import { bench, do_not_optimize, boxplot, summary, run } from "mitata";
import { createHash, hkdfSync, randomBytes } from "crypto";
import {
  md5 as wasmMd5,
  hkdf as wasmHkdf,
} from "../dist/index.js";

// Compare the Rust/WASM bridge against Node's native crypto. Importing the md5/hkdf
// re-exported by Baileys is pointless: current Baileys re-exports them straight from
// this very bridge, so both sides would be the identical WASM implementation.

// Test data
const plaintext = Buffer.from("Benchmark test data for crypto operations ".repeat(10));
const key = randomBytes(32);
const salt = randomBytes(32);

boxplot(() => {
  summary(() => {
    bench("MD5 Rust/WASM", () => {
      const result = wasmMd5(plaintext);
      do_not_optimize(result);
    });

    bench("MD5 Node", () => {
      const result = createHash("md5").update(plaintext).digest();
      do_not_optimize(result);
    });
  });

  summary(() => {
    bench("HKDF Rust/WASM", () => {
      const result = wasmHkdf(key, 64, { salt, info: "test" });
      do_not_optimize(result);
    });

    bench("HKDF Node", () => {
      const result = hkdfSync("sha256", key, salt, Buffer.from("test"), 64);
      do_not_optimize(result);
    });
  });
});

await run();
