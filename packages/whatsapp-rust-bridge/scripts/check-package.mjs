#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const wasmFiles = ['dist/wasm/simd.wasm', 'dist/wasm/nosimd.wasm']
const baseRequiredFiles = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'pkg/whatsapp_rust_bridge.d.ts']
const entryFiles = ['dist/index.js', 'dist/index.cjs']
const literalWasmReferences = ['wasm/simd.wasm', 'wasm/nosimd.wasm']
// The generated glue is currently below 100 KiB even with every optional Rust feature.
// Leave ample headroom while making accidental WASM reinlining a deterministic CI failure.
const maxEntryBytes = 512 * 1024
const wasmMagic = Buffer.from([0x00, 0x61, 0x73, 0x6d])
const simdProbe = new Uint8Array([
	0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11
])

const presentWasmFiles = wasmFiles.filter(file => existsSync(join(root, file)))
if (presentWasmFiles.length > 0 && presentWasmFiles.length !== wasmFiles.length) {
	throw new Error('local build contains only one SIMD/non-SIMD WASM asset')
}
const usesExternalWasm = presentWasmFiles.length === wasmFiles.length
const usesLegacyInlineWasm = !usesExternalWasm && hasInlineWasm(join(root, 'dist/index.js'))
if (!usesExternalWasm && !usesLegacyInlineWasm) {
	throw new Error('local build contains neither external WASM assets nor a legacy inline bundle')
}
const requiredFiles = [...baseRequiredFiles, ...(usesExternalWasm ? wasmFiles : [])]

const esmSmoke = `
import assert from "node:assert/strict";
import * as bridge from "whatsapp-rust-bridge";
const digest = Buffer.from(bridge.md5(new TextEncoder().encode("abc"))).toString("hex");
assert.equal(digest, "900150983cd24fb0d6963f7d28e17f72");
const encoded = bridge.encodeNode({ tag: "iq", attrs: { id: "packed-esm" } });
assert.equal(bridge.decodeNode(encoded).attrs.id, "packed-esm");
console.log(JSON.stringify({ exports: Object.keys(bridge).sort(), simd: bridge.__wasmSimdActive }));
`

const cjsSmoke = `
const assert = require("node:assert/strict");
const bridge = require("whatsapp-rust-bridge");
const digest = Buffer.from(bridge.md5(new TextEncoder().encode("abc"))).toString("hex");
assert.equal(digest, "900150983cd24fb0d6963f7d28e17f72");
const encoded = bridge.encodeNode({ tag: "iq", attrs: { id: "packed-cjs" } });
assert.equal(bridge.decodeNode(encoded).attrs.id, "packed-cjs");
console.log(JSON.stringify({ exports: Object.keys(bridge).sort(), simd: bridge.__wasmSimdActive }));
`

const esmImportFailureSmoke = `
import assert from "node:assert/strict";
let caught;
try {
  await import("whatsapp-rust-bridge");
} catch (error) {
  caught = error;
}
assert.ok(caught instanceof Error, "package import should fail when the selected WASM asset is missing");
console.log(JSON.stringify({
  name: caught.name,
  message: caught.message,
  code: caught.code,
  causeCode: caught.cause?.code,
}));
`

const cjsImportFailureSmoke = `
const assert = require("node:assert/strict");
let caught;
try {
  require("whatsapp-rust-bridge");
} catch (error) {
  caught = error;
}
assert.ok(caught instanceof Error, "package require should fail when the selected WASM asset is missing");
console.log(JSON.stringify({
  name: caught.name,
  message: caught.message,
  code: caught.code,
  causeCode: caught.cause?.code,
}));
`

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		encoding: 'utf8',
		timeout: 120_000,
		...options
	})
	if (result.error) {
		throw result.error
	}
	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(' ')} exited with ${result.status}\n` +
				`stdout: ${result.stdout}\nstderr: ${result.stderr}`
		)
	}
	return result
}

function runtimeEnv(forceNoSimd) {
	const env = { ...process.env }
	delete env.WHATSAPP_RUST_BRIDGE_FORCE_NOSIMD
	if (forceNoSimd) {
		env.WHATSAPP_RUST_BRIDGE_FORCE_NOSIMD = '1'
	}
	return env
}

function runConsumer(consumerDir, format, forceNoSimd = false) {
	const source = format === 'esm' ? esmSmoke : cjsSmoke
	const result = run(process.execPath, [`--input-type=${format === 'esm' ? 'module' : 'commonjs'}`, '--eval', source], {
		cwd: consumerDir,
		env: runtimeEnv(forceNoSimd)
	})
	const output = result.stdout.trim().split('\n').at(-1)
	if (!output) {
		throw new Error(`${format} package smoke test produced no output`)
	}
	return JSON.parse(output)
}

function runMissingAssetConsumer(consumerDir, format) {
	const source = format === 'esm' ? esmImportFailureSmoke : cjsImportFailureSmoke
	const result = run(process.execPath, [`--input-type=${format === 'esm' ? 'module' : 'commonjs'}`, '--eval', source], {
		cwd: consumerDir,
		env: runtimeEnv(true)
	})
	const output = result.stdout.trim().split('\n').at(-1)
	if (!output) {
		throw new Error(`${format} missing-asset smoke test produced no output`)
	}
	return JSON.parse(output)
}

function withHiddenFile(path, callback) {
	const hiddenPath = `${path}.hidden`
	renameSync(path, hiddenPath)
	try {
		return callback()
	} finally {
		renameSync(hiddenPath, path)
	}
}

function verifyWasmFile(path) {
	const bytes = readFileSync(path)
	assert.deepEqual(bytes.subarray(0, wasmMagic.length), wasmMagic, `${path} has invalid WASM magic`)
	return bytes
}

function hasInlineWasm(path) {
	return existsSync(path) && readFileSync(path, 'utf8').includes('AGFzbQ')
}

/**
 * Every relative re-export in a packed declaration has to resolve inside the
 * tarball.
 *
 * A missing one does not fail loudly: TypeScript drops the unresolvable
 * re-export and reports the names as simply not exported, so the package
 * installs, runs, and fails to typecheck with an error pointing somewhere
 * else. `dist/flat.d.ts` shipped that way, and the runtime worked because
 * esbuild had inlined the module into the bundle.
 */
function assertDeclarationsResolve(packedFiles) {
	const declarations = [...packedFiles.keys()].filter(path => path.endsWith('.d.ts'))
	for (const declaration of declarations) {
		const source = readFileSync(join(root, declaration), 'utf8')
		for (const [, specifier] of source.matchAll(/(?:from|import)\s*["'](\.[^"']+)["']/g)) {
			const target = join(dirname(declaration), specifier).replace(/\.js$/, '.d.ts')
			if (!packedFiles.has(target)) {
				throw new Error(`${declaration} re-exports ${specifier}, but ${target} is not packed`)
			}
		}
	}
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'whatsapp-rust-bridge-package-'))
try {
	const packDirectory = join(temporaryDirectory, 'pack')
	mkdirSync(packDirectory)
	const packResult = run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packDirectory], {
		cwd: root
	})
	const [pack] = JSON.parse(packResult.stdout)
	if (!pack?.files || !pack.filename) {
		throw new Error('npm pack did not return a package manifest')
	}

	const packedFiles = new Map(pack.files.map(file => [file.path, file.size]))
	const missing = requiredFiles.filter(file => !packedFiles.has(file))
	if (missing.length) {
		throw new Error(`npm package is missing: ${missing.join(', ')}`)
	}

	assertDeclarationsResolve(packedFiles)

	for (const entry of entryFiles) {
		const size = packedFiles.get(entry)
		if (!Number.isSafeInteger(size) || size <= 0 || (usesExternalWasm && size > maxEntryBytes)) {
			throw new Error(`${entry} has an invalid packed size: ${size}`)
		}
		const entrySource = readFileSync(join(root, entry), 'utf8')
		if (usesExternalWasm) {
			if (entrySource.includes('AGFzbQ')) {
				throw new Error(`${entry} contains an inlined base64 WASM payload`)
			}
			for (const reference of literalWasmReferences) {
				if (!entrySource.includes(reference)) {
					throw new Error(`${entry} does not contain literal reference ${reference}`)
				}
			}
		} else if (!entrySource.includes('AGFzbQ')) {
			throw new Error(`${entry} does not contain the legacy inline WASM payload`)
		}
	}

	const simdBytes = usesExternalWasm ? verifyWasmFile(join(root, wasmFiles[0])) : Buffer.alloc(0)
	const nosimdBytes = usesExternalWasm ? verifyWasmFile(join(root, wasmFiles[1])) : Buffer.alloc(0)
	if (usesExternalWasm) {
		assert.equal(WebAssembly.validate(nosimdBytes), true, 'non-SIMD WASM must validate on Node')
	}

	const consumerDirectory = join(temporaryDirectory, 'consumer with spaces')
	mkdirSync(consumerDirectory)
	writeFileSync(
		join(consumerDirectory, 'package.json'),
		JSON.stringify({
			name: 'bridge-package-smoke',
			private: true,
			type: 'module'
		})
	)
	const tarball = join(packDirectory, basename(pack.filename))
	run('npm', ['install', tarball, '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock'], {
		cwd: consumerDirectory
	})

	const installedWasmDirectory = join(consumerDirectory, 'node_modules/whatsapp-rust-bridge/dist/wasm')
	const installedSimd = join(installedWasmDirectory, 'simd.wasm')
	const installedNosimd = join(installedWasmDirectory, 'nosimd.wasm')
	if (usesExternalWasm) {
		assert.equal(existsSync(installedSimd), true)
		assert.equal(existsSync(installedNosimd), true)
	}

	const simdSupported = WebAssembly.validate(simdProbe)
	const defaultResults = usesExternalWasm
		? withHiddenFile(simdSupported ? installedNosimd : installedSimd, () => [
				runConsumer(consumerDirectory, 'esm'),
				runConsumer(consumerDirectory, 'cjs')
			])
		: [runConsumer(consumerDirectory, 'esm'), runConsumer(consumerDirectory, 'cjs')]
	for (const result of defaultResults) {
		assert.equal(result.simd, simdSupported)
	}
	assert.deepEqual(defaultResults[0].exports, defaultResults[1].exports)

	const nosimdResults = usesExternalWasm
		? withHiddenFile(installedSimd, () => [
				runConsumer(consumerDirectory, 'esm', true),
				runConsumer(consumerDirectory, 'cjs', true)
			])
		: [runConsumer(consumerDirectory, 'esm', true), runConsumer(consumerDirectory, 'cjs', true)]
	for (const result of nosimdResults) {
		assert.equal(result.simd, false)
	}
	assert.deepEqual(nosimdResults[0].exports, nosimdResults[1].exports)

	if (usesExternalWasm) {
		const missingAssetResults = withHiddenFile(installedNosimd, () => [
			runMissingAssetConsumer(consumerDirectory, 'esm'),
			runMissingAssetConsumer(consumerDirectory, 'cjs')
		])
		for (const result of missingAssetResults) {
			assert.equal(result.name, 'WasmAssetReadError')
			assert.equal(result.code, 'ENOENT')
			assert.equal(result.causeCode, 'ENOENT')
			assert.match(result.message, /Unable to read whatsapp-rust-bridge WASM asset/)
			assert.match(result.message, /nosimd\.wasm/)
			assert.match(result.message, /dist\/wasm/)
		}
	}

	if (usesExternalWasm && simdSupported) {
		const validSimd = `${installedSimd}.valid`
		renameSync(installedSimd, validSimd)
		try {
			writeFileSync(installedSimd, wasmMagic)
			const fallbackResults = [runConsumer(consumerDirectory, 'esm'), runConsumer(consumerDirectory, 'cjs')]
			for (const result of fallbackResults) {
				assert.equal(result.simd, false)
			}
		} finally {
			rmSync(installedSimd, { force: true })
			renameSync(validSimd, installedSimd)
		}
	}

	const mib = bytes => (bytes / 1024 / 1024).toFixed(2)
	const wasmSummary = usesExternalWasm
		? `WASM ${mib(simdBytes.length + nosimdBytes.length)} MiB.`
		: 'legacy inline WASM.'
	console.log(
		`[whatsapp-rust-bridge] npm package: ${mib(pack.size)} MiB compressed, ` +
			`${mib(pack.unpackedSize)} MiB unpacked; ESM ${mib(
				packedFiles.get('dist/index.js')
			)} MiB, CJS ${mib(packedFiles.get('dist/index.cjs'))} MiB, ` +
			wasmSummary
	)
} finally {
	rmSync(temporaryDirectory, { recursive: true, force: true })
}
