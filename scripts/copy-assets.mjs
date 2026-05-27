#!/usr/bin/env node
/**
 * Copy static (non-TypeScript) assets from `src/` to the build output `lib/`
 * preserving the directory structure.
 *
 * Why this exists:
 *
 *   `tsc` only compiles `.ts` → `.js` / `.d.ts`. It does NOT copy non-source
 *   files (JSON, WASM, etc.) that the compiled code imports at runtime. In
 *   particular, `src/Defaults/baileys-version.json` is imported by
 *   `src/Defaults/index.ts` as:
 *
 *       import baileysVersion from './baileys-version.json' with { type: 'json' }
 *
 *   After `tsc`, `lib/Defaults/index.js` still has the import for
 *   `./baileys-version.json` (relative), but the JSON itself was never
 *   copied. Result on consumer side: `ERR_MODULE_NOT_FOUND` at boot.
 *
 *   This script walks `src/`, finds every non-`.ts` file (so .json, .wasm,
 *   .node, etc. all get copied), and mirrors each into `lib/` with the
 *   same relative path. Idempotent — overwrites existing files in `lib/`.
 *
 * Usage:
 *   node scripts/copy-assets.mjs
 *
 * Invoked by:
 *   `npm run build:assets`, chained at the end of `npm run build`.
 */

import { readdir, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const SRC_DIR = join(REPO_ROOT, 'src')
const LIB_DIR = join(REPO_ROOT, 'lib')

/**
 * Extensions that should NOT be copied — these are TypeScript / map / test
 * sources that `tsc` already handles (or shouldn't ship in `lib/` anyway).
 * Anything else under `src/` is treated as an asset and mirrored.
 */
const SKIP_EXTENSIONS = new Set(['.ts', '.tsx', '.map'])

/**
 * Files / directories to skip entirely (regardless of extension).
 * Tests live in `src/__tests__` and `src/Tests` and must not end up in
 * the published package.
 */
const SKIP_PATHS = new Set(['__tests__', 'Tests'])

let copied = 0
let skipped = 0

/**
 * Recursively walks `srcDir`, copying any non-source asset into the
 * corresponding location under `destDir`. Creates intermediate directories
 * as needed.
 */
async function walk(srcDir, destDir) {
	const entries = await readdir(srcDir, { withFileTypes: true })
	for (const entry of entries) {
		if (SKIP_PATHS.has(entry.name)) continue

		const srcPath = join(srcDir, entry.name)
		const destPath = join(destDir, entry.name)

		if (entry.isDirectory()) {
			await walk(srcPath, destPath)
			continue
		}

		if (!entry.isFile()) continue

		const dotIndex = entry.name.lastIndexOf('.')
		const ext = dotIndex >= 0 ? entry.name.slice(dotIndex) : ''
		if (SKIP_EXTENSIONS.has(ext)) {
			skipped++
			continue
		}

		// Ensure destination directory exists before copying.
		await mkdir(destDir, { recursive: true })
		await copyFile(srcPath, destPath)
		copied++
		console.log(`  + ${relative(REPO_ROOT, destPath)}`)
	}
}

async function main() {
	if (!existsSync(SRC_DIR)) {
		console.error(`[copy-assets] src/ not found at ${SRC_DIR}`)
		process.exit(1)
	}

	// We don't require lib/ to exist yet — walk() creates subdirs lazily.
	// But for a sane error message, surface the situation if it's missing
	// AND empty (likely means tsc didn't run).
	if (!existsSync(LIB_DIR)) {
		console.warn(`[copy-assets] lib/ does not exist yet — will be created as assets are copied`)
		console.warn(`[copy-assets] (if tsc was supposed to run first, build may be incomplete)`)
	}

	console.log('[copy-assets] mirroring non-TS assets from src/ → lib/')
	await walk(SRC_DIR, LIB_DIR)
	console.log(`[copy-assets] done — ${copied} copied, ${skipped} skipped`)
}

main().catch(err => {
	console.error('[copy-assets] failed:', err)
	process.exit(1)
})
