import { bench, do_not_optimize, boxplot, summary, run } from "mitata";
import { randomBytes } from "crypto";
import {
  md5 as wasmMd5,
  hkdf as wasmHkdf,
} from "../dist/index.js";
import {
  md5 as baileysMd5,
  hkdf as baileysHkdf,
} from "baileys/lib/Utils/crypto.js";

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

    bench("MD5 Baileys (Node)", () => {
      const result = baileysMd5(plaintext);
      do_not_optimize(result);
    });
  });

  summary(() => {
    bench("HKDF Rust/WASM", () => {
      const result = wasmHkdf(key, 64, { salt, info: "test" });
      do_not_optimize(result);
    });

    bench("HKDF Baileys (Node)", async () => {
      const result = await baileysHkdf(key, 64, { salt, info: "test" });
      do_not_optimize(result);
    });
  });
});

await run();
