#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { delimiter, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const pkgWasm = resolve(root, 'pkg/whatsapp_rust_bridge_bg.wasm')
const pkgGlue = resolve(root, 'pkg/whatsapp_rust_bridge.js')
const pkgGlueTypes = resolve(root, 'pkg/whatsapp_rust_bridge.d.ts')
const outDir = resolve(root, 'assets/wasm')
const distWasmDir = resolve(root, 'dist/wasm')
const cargoFeatures = process.env.WHATSAPP_RUST_BRIDGE_CARGO_FEATURES?.trim()

const wasmOptFlags = [
	'-O4',
	'--gufa-optimizing',
	'--inlining-optimizing',
	'--ignore-implicit-traps',
	'--traps-never-happen',
	'--coalesce-locals-learning',
	'--converge',
	'--enable-bulk-memory',
	'--enable-nontrapping-float-to-int',
	'--enable-sign-ext',
	'--enable-mutable-globals',
	'--enable-multivalue',
	'--fast-math',
	'--zero-filled-memory',
	'--dce',
	'--vacuum',
	'--directize',
	'--optimize-stack-ir',
	'--strip-debug'
]

function run(cmd, args, env = {}) {
	console.log(`\n$ ${cmd} ${args.join(' ')}`)
	const r = spawnSync(cmd, args, {
		cwd: root,
		stdio: 'inherit',
		env: { ...process.env, ...env }
	})
	if (r.status !== 0) {
		process.exit(r.status ?? 1)
	}
}

// A profiling build keeps the name section so a CPU profile resolves symbols;
// wasm-opt would strip it, and its rewrites make the remaining frames hard to
// map back to source. Never used for a release artifact.
const profiling = process.env.WHATSAPP_RUST_BRIDGE_PROFILE === '1'

// wasm-pack downloads the wasm-bindgen matching the crate's schema; a globally
// installed one usually does not match and refuses the module.
function wasmBindgen() {
	const wanted = readFileSync(resolve(root, 'Cargo.lock'), 'utf8').match(
		/name = "wasm-bindgen"\nversion = "([^"]+)"/
	)?.[1]

	const matches = candidate => {
		if (!existsSync(candidate)) return false

		const version = spawnSync(candidate, ['--version'], { encoding: 'utf8' }).stdout?.trim()
		return Boolean(wanted) && Boolean(version?.endsWith(wanted))
	}

	const cacheRoot = resolve(process.env.HOME ?? '', '.cache/.wasm-pack')
	if (wanted && existsSync(cacheRoot)) {
		for (const entry of readdirSync(cacheRoot)) {
			const candidate = resolve(cacheRoot, entry, 'wasm-bindgen')
			if (matches(candidate)) return candidate
		}
	}

	// Then PATH, which is the other remedy the error below names. Only an exact
	// version match is accepted, so this cannot silently reintroduce the schema
	// mismatch that made the cache the first choice.
	const extensions = process.platform === 'win32' ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT').split(';') : ['']
	for (const directory of (process.env.PATH ?? '').split(delimiter)) {
		if (!directory) continue

		for (const extension of extensions) {
			const candidate = resolve(directory, `wasm-bindgen${extension}`)
			if (matches(candidate)) return candidate
		}
	}

	// Falling through to a global wasm-bindgen is worse than stopping: it is
	// almost never the version the crate was linked against, and the failure it
	// produces talks about schema numbers rather than what to do about it.
	throw new Error(
		`no wasm-bindgen ${wanted ?? '(version unknown)'} in ${cacheRoot} or on PATH. ` +
			'Run `pnpm build` once so wasm-pack downloads the matching CLI, or ' +
			`install it with \`cargo install wasm-bindgen-cli --version ${wanted ?? 'X.Y.Z'}\` ` +
			'and put it on PATH.'
	)
}

function build(variant) {
	const isSimd = variant === 'simd'
	const rustflags = isSimd ? '-C target-feature=+simd128' : '-C target-feature=-simd128'

	console.log(`\n=== Building ${variant} ===`)
	if (profiling) {
		// wasm-pack's --profiling still builds the release profile, which strips.
		// Drive cargo and wasm-bindgen directly so the custom profile applies and
		// the name section survives.
		const cargoArgs = ['build', '--profile', 'profiling', '--target', 'wasm32-unknown-unknown']
		if (cargoFeatures) {
			cargoArgs.push('--features', cargoFeatures)
		}

		run('cargo', cargoArgs, { RUSTFLAGS: rustflags })
		run(wasmBindgen(), [
			'--target',
			'web',
			'--out-dir',
			'pkg',
			'--keep-debug',
			'target/wasm32-unknown-unknown/profiling/whatsapp_rust_bridge.wasm'
		])
	} else {
		const wasmPackArgs = ['build', '--target', 'web', '--out-dir', 'pkg', '--no-pack', '--no-opt']
		if (cargoFeatures) {
			wasmPackArgs.push('--features', cargoFeatures)
		}

		run('wasm-pack', wasmPackArgs, { RUSTFLAGS: rustflags })
	}

	const outFile = resolve(outDir, `${variant}.wasm`)
	if (profiling) {
		copyFileSync(pkgWasm, outFile)
	} else {
		const optFlags = [...wasmOptFlags, isSimd ? '--enable-simd' : '--disable-simd', pkgWasm, '-o', outFile]
		run('wasm-opt', optFlags)
	}

	const size = statSync(outFile).size
	console.log(`  → ${outFile} (${(size / 1024).toFixed(1)} KB)`)

	return {
		javascript: readFileSync(pkgGlue, 'utf8'),
		types: readFileSync(pkgGlueTypes, 'utf8')
	}
}

function wasmBindgenTrampolines(wasmPath) {
	const module = new WebAssembly.Module(readFileSync(wasmPath))
	return WebAssembly.Module.exports(module)
		.map(({ name }) => name)
		.filter(name => name.startsWith('__wasm_bindgen_func_elem_'))
}

function glueTrampolines(javascript) {
	return [...new Set(javascript.match(/__wasm_bindgen_func_elem_\d+/g) ?? [])]
}

function normalizeGlueTrampolines(source, trampolines) {
	let normalized = source
	for (let i = 0; i < trampolines.length; i++) {
		normalized = normalized.replaceAll(trampolines[i], `__wasm_bindgen_func_elem_PLACEHOLDER_${i}`)
	}
	return normalized
}

function assertGlueCompatibility(simdGlue, nosimdGlue, simdNames, nosimdNames) {
	for (const artifact of ['javascript', 'types']) {
		const normalizedSimd = normalizeGlueTrampolines(simdGlue[artifact], simdNames)
		const normalizedNosimd = normalizeGlueTrampolines(nosimdGlue[artifact], nosimdNames)
		if (normalizedSimd !== normalizedNosimd) {
			throw new Error(`SIMD/non-SIMD wasm-bindgen ${artifact} glue differs beyond trampoline names`)
		}
	}
}

function alignSimdExportsWithGlue(simdGlue, nosimdGlue) {
	const simdPath = resolve(outDir, 'simd.wasm')
	const nosimdPath = resolve(outDir, 'nosimd.wasm')
	const simdExports = wasmBindgenTrampolines(simdPath)
	const glueExports = wasmBindgenTrampolines(nosimdPath)
	const simdGlueExports = glueTrampolines(simdGlue.javascript)
	const nosimdGlueExports = glueTrampolines(nosimdGlue.javascript)

	if (
		simdExports.length !== glueExports.length ||
		simdGlueExports.length !== simdExports.length ||
		nosimdGlueExports.length !== glueExports.length
	) {
		throw new Error('SIMD/non-SIMD wasm-bindgen trampoline counts differ between WASM and generated glue')
	}
	if (
		simdExports.some(name => !simdGlueExports.includes(name)) ||
		glueExports.some(name => !nosimdGlueExports.includes(name))
	) {
		throw new Error('Generated glue does not reference every WASM trampoline')
	}

	// Sharing one generated glue file is safe only when both variants are
	// structurally identical after their generated trampoline names are normalized.
	assertGlueCompatibility(simdGlue, nosimdGlue, simdGlueExports, nosimdGlueExports)

	const sourceWasm = readFileSync(simdPath)
	const renames = []
	for (let i = 0; i < simdGlueExports.length; i++) {
		const sourceName = simdGlueExports[i]
		const targetName = nosimdGlueExports[i]
		if (sourceName === targetName) continue
		if (sourceName.length !== targetName.length) {
			throw new Error(
				`Cannot align wasm-bindgen trampoline names with different lengths: ${sourceName} -> ${targetName}`
			)
		}

		const source = Buffer.from(sourceName)
		const offset = sourceWasm.indexOf(source)
		if (offset < 0 || sourceWasm.indexOf(source, offset + 1) >= 0) {
			throw new Error(`Expected exactly one export named ${sourceName}`)
		}
		renames.push({ offset, targetName })
	}

	const alignedWasm = Buffer.from(sourceWasm)
	for (const { offset, targetName } of renames) {
		Buffer.from(targetName).copy(alignedWasm, offset)
	}

	writeFileSync(simdPath, alignedWasm)
	const alignedExports = wasmBindgenTrampolines(simdPath)
	if (alignedExports.some((name, i) => name !== glueExports[i])) {
		throw new Error('Failed to align SIMD wasm-bindgen exports with generated glue')
	}
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const simdGlue = build('simd')
const nosimdGlue = build('nosimd')

// wasm-bindgen can number async trampoline exports differently when target
// features change. The JS glue comes from the final non-SIMD build, so align
// the equivalent SIMD export names before both binaries share that glue.
alignSimdExportsWithGlue(simdGlue, nosimdGlue)

// Keep wasm-bindgen's generated pkg/ output internally consistent. The
// published Node entry points resolve the two explicit dist/wasm assets.
copyFileSync(resolve(outDir, 'simd.wasm'), pkgWasm)

mkdirSync(distWasmDir, { recursive: true })
for (const variant of ['simd', 'nosimd']) {
	copyFileSync(resolve(outDir, `${variant}.wasm`), resolve(distWasmDir, `${variant}.wasm`))
}

console.log('\nDual wasm build complete.')
