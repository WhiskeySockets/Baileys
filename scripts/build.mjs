#!/usr/bin/env node
/**
 * Build orchestrator for the baileys package.
 *
 * Runs the three build phases in order, tolerating non-fatal errors from
 * `tsc` so the chain doesn't break on harmless TS2742 (and similar
 * declaration-only) warnings.
 *
 * Why a Node script instead of an npm-script chain:
 *
 *   `package.json` scripts run under different shells across platforms:
 *   `sh -c` on macOS/Linux and `cmd.exe` on Windows. The `;` separator
 *   means "next command, regardless of exit code" in `sh` but is NOT
 *   recognised by `cmd.exe` (it gets passed through as a literal argument
 *   and breaks `tsc`'s flag parser with TS5023). The previous
 *   `tsc && tsc-esm-fix` chain conversely was too strict — any `tsc`
 *   warning that triggered exit code 1 (notably TS2742 inferred-type
 *   references to nested `node_modules/...` declarations during d.ts
 *   emission) prevented `tsc-esm-fix` from rewriting relative imports
 *   with `.js` extensions, producing a broken ESM package that fails on
 *   consumer install with `ERR_MODULE_NOT_FOUND`.
 *
 *   A Node orchestrator gives us:
 *     1. cross-platform behaviour (no shell-dependent separators);
 *     2. explicit control over which phases are fatal vs warning-only;
 *     3. a single place to evolve the build pipeline as new phases get
 *        added (e.g. wasm bundling, codegen).
 *
 * Phases:
 *   1. `tsc -P tsconfig.build.json`
 *        - emits `.js` + `.d.ts` from TypeScript sources
 *        - non-zero exit is tolerated ONLY if the sentinel output files
 *          listed in TSC_OUTPUT_SENTINELS were emitted and are non-empty.
 *          That means tsc got far enough to produce a viable package and
 *          the non-zero exit was triggered by declaration-only warnings
 *          (TS2742 most commonly). Truly broken builds (syntax errors,
 *          OOM mid-emission, missing tsconfig) leave the sentinels
 *          unwritten and abort the pipeline before downstream phases can
 *          rubber-stamp a stale `lib/`.
 *        - the `lint` script (`tsc && eslint`) remains the strict gate
 *          for real type errors and runs separately in CI.
 *
 *   2. `tsc-esm-fix --tsconfig=tsconfig.build.json --ext=.js`
 *        - rewrites relative imports in `lib/*.js` to include the `.js`
 *          extension (required by Node's ESM resolver when
 *          `"type": "module"` is set)
 *        - MUST succeed — without this the published package is broken
 *
 *   3. `node scripts/copy-assets.mjs`
 *        - mirrors non-`.ts` assets (JSON, etc.) from `src/` to `lib/`
 *        - MUST succeed — without this `baileys-version.json` is missing
 *          from the published package and runtime imports throw
 *          `ERR_MODULE_NOT_FOUND`
 */

import { spawn } from 'node:child_process'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = join(__dirname, '..')

/**
 * Files we MUST see emitted under `lib/` for the build to be considered
 * functional even if `tsc` reported non-zero exit. If any of these is
 * missing or empty after `tsc` returns, we treat the build as a true
 * failure (e.g. syntax error, broken tsconfig, OOM) and abort, rather
 * than rubber-stamping a stale `lib/` from a previous run.
 *
 * Picked to be representative of the package's public surface: if these
 * exist and are non-empty, `tsc` got far enough to produce a useful
 * package. The TS2742 declaration warnings that this orchestrator is
 * specifically designed to tolerate do NOT prevent `.js` emission, so
 * they leave these files intact.
 */
const TSC_OUTPUT_SENTINELS = [
	'lib/index.js',
	'lib/Socket/index.js',
	'lib/Utils/index.js',
	'lib/Defaults/index.js'
]

async function emittedNonEmpty(relPath) {
	try {
		const s = await stat(join(REPO_ROOT, relPath))
		return s.isFile() && s.size > 0
	} catch {
		return false
	}
}

/** Spawn a command, inherit stdio, resolve with the exit code. */
function run(cmd, args) {
	return new Promise(resolve => {
		const child = spawn(cmd, args, {
			stdio: 'inherit',
			shell: true, // allow `tsc` (npm bin) to resolve via PATHEXT on Windows
			cwd: REPO_ROOT
		})
		child.on('exit', code => resolve(code ?? 1))
		child.on('error', err => {
			console.error(`[build] failed to spawn ${cmd}:`, err)
			resolve(1)
		})
	})
}

async function main() {
	// Phase 1 — tsc (tolerant, with emit-sentinel gate)
	//
	// Codex P1 fix: previously a non-zero `tsc` exit was unconditionally
	// downgraded to a warning. That would mask REAL failures (syntax
	// errors, broken tsconfig, OOM mid-emission) and let `tsc-esm-fix` +
	// `copy-assets` rubber-stamp a stale `lib/` from a previous run,
	// publishing artifacts that don't match `src/`.
	//
	// New behaviour: when `tsc` exits non-zero, we verify the sentinel
	// files in TSC_OUTPUT_SENTINELS were actually emitted and non-empty.
	// If yes, tsc got far enough to produce a viable package — the
	// non-zero exit was triggered by declaration-only warnings (e.g.
	// TS2742 inferred-type errors), which this orchestrator is designed
	// to tolerate. If any sentinel is missing or empty, the build is a
	// true failure and we abort BEFORE the next phases can corrupt
	// `lib/` further.
	console.log('[build] phase 1/3: tsc -P tsconfig.build.json')
	const tscCode = await run('tsc', ['-P', 'tsconfig.build.json'])
	if (tscCode !== 0) {
		const sentinelChecks = await Promise.all(
			TSC_OUTPUT_SENTINELS.map(async path => ({ path, ok: await emittedNonEmpty(path) }))
		)
		const missing = sentinelChecks.filter(s => !s.ok)
		if (missing.length > 0) {
			console.error(
				`[build] tsc exited with code ${tscCode} AND the following ` +
					`required outputs are missing or empty — aborting (this is a ` +
					`real build failure, not a tolerable warning):`
			)
			for (const m of missing) console.error(`         ✗ ${m.path}`)
			process.exit(tscCode)
		}

		console.warn(
			`[build] tsc exited with code ${tscCode} but ALL ${TSC_OUTPUT_SENTINELS.length} ` +
				`output sentinels are present and non-empty — treating as warnings-only ` +
				`(the lint script remains the strict type-check gate). Typical cause: ` +
				`TS2742 inferred-type-not-portable warnings from nested node_modules ` +
				`when this package is consumed as a github dep.`
		)
	}

	// Phase 2 — tsc-esm-fix (fatal)
	console.log('[build] phase 2/3: tsc-esm-fix (rewrite imports to add .js)')
	const fixCode = await run('tsc-esm-fix', ['--tsconfig=tsconfig.build.json', '--ext=.js'])
	if (fixCode !== 0) {
		console.error(
			`[build] tsc-esm-fix exited with code ${fixCode} — aborting. ` +
				`Without .js extensions on relative imports, the emitted ESM ` +
				`package cannot be resolved by Node's loader.`
		)
		process.exit(fixCode)
	}

	// Phase 3 — copy non-ts assets (fatal)
	console.log('[build] phase 3/3: copy-assets (mirror src/*.json → lib/)')
	const assetsCode = await run('node', ['scripts/copy-assets.mjs'])
	if (assetsCode !== 0) {
		console.error(`[build] copy-assets exited with code ${assetsCode} — aborting`)
		process.exit(assetsCode)
	}

	console.log('[build] all phases completed successfully')
}

main().catch(err => {
	console.error('[build] orchestrator crashed:', err)
	process.exit(1)
})
