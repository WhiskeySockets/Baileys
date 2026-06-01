#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkgWasm = resolve(root, "pkg/whatsapp_rust_bridge_bg.wasm");
const outDir = resolve(root, "assets/wasm");

const wasmOptFlags = [
  "-O4",
  "--gufa-optimizing",
  "--inlining-optimizing",
  "--ignore-implicit-traps",
  "--traps-never-happen",
  "--coalesce-locals-learning",
  "--converge",
  "--enable-bulk-memory",
  "--enable-nontrapping-float-to-int",
  "--enable-sign-ext",
  "--enable-mutable-globals",
  "--enable-multivalue",
  "--fast-math",
  "--zero-filled-memory",
  "--dce",
  "--vacuum",
  "--directize",
  "--optimize-stack-ir",
  "--strip-debug",
];

function run(cmd, args, env = {}) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function build(variant) {
  const isSimd = variant === "simd";
  const rustflags = isSimd
    ? "-C target-feature=+simd128"
    : "-C target-feature=-simd128";

  console.log(`\n=== Building ${variant} ===`);
  run(
    "wasm-pack",
    ["build", "--target", "web", "--out-dir", "pkg", "--no-pack", "--no-opt"],
    { RUSTFLAGS: rustflags },
  );

  const outFile = resolve(outDir, `${variant}.wasm`);
  const optFlags = [
    ...wasmOptFlags,
    isSimd ? "--enable-simd" : "--disable-simd",
    pkgWasm,
    "-o",
    outFile,
  ];
  run("wasm-opt", optFlags);

  const size = statSync(outFile).size;
  console.log(`  → ${outFile} (${(size / 1024).toFixed(1)} KB)`);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

build("simd");
build("nosimd");

// Make pkg/whatsapp_rust_bridge_bg.wasm point to the SIMD variant for the
// wasm-bindgen JS wrapper's default URL resolution (rebuild simd last so
// pkg ends in a clean state for `wasm-pack publish`-style consumers).
copyFileSync(resolve(outDir, "simd.wasm"), pkgWasm);

console.log("\nDual wasm build complete.");
