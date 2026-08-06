#!/usr/bin/env node
// Runs the crate's Rust unit tests, or explains why it did not.
//
// AGENTS.md tells contributors they do not need the Rust toolchain: the
// postinstall pulls a prebuilt bridge. So `pnpm test` must not hard-fail on a
// checkout without wasm-pack. CI calls `test:rust` directly, where the
// toolchain is always present.
//
// The lookup walks PATH itself rather than shelling out: `command -v` is POSIX
// only and would be a parse error in cmd.exe and PowerShell, and spawning
// without a shell on Windows does not apply PATHEXT.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const executableExtensions =
	process.platform === 'win32' ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT').split(';') : ['']

function locate(command) {
	for (const directory of (process.env.PATH ?? '').split(delimiter)) {
		if (!directory) continue

		for (const extension of executableExtensions) {
			const candidate = join(directory, command + extension)
			if (existsSync(candidate)) {
				return candidate
			}
		}
	}

	return undefined
}

const wasmPack = locate('wasm-pack')
if (!wasmPack) {
	console.log(
		'[whatsapp-rust-bridge] wasm-pack not found, skipping the Rust unit tests. ' +
			'Install it and run `pnpm test:rust` if you are working on the crate.'
	)
	process.exit(0)
}

// Node refuses to spawn .cmd/.bat without a shell, and an npm-installed
// wasm-pack on Windows is a .cmd. In that case pass one command string with the
// path quoted (it may sit under "Program Files"); passing an argv array
// alongside shell:true is deprecated because the parts are only concatenated.
const needsShell = /\.(cmd|bat)$/i.test(wasmPack)
const spawned = needsShell
	? spawnSync(`"${wasmPack}" test --node`, { stdio: 'inherit', cwd: root, shell: true })
	: spawnSync(wasmPack, ['test', '--node'], { stdio: 'inherit', cwd: root })

const { status, error } = spawned
if (error) {
	console.error(`[whatsapp-rust-bridge] could not run ${wasmPack}: ${error.message}`)
	process.exit(1)
}

// Propagate the failure: a broken Rust test has to fail the run, not fall
// through as if the toolchain were missing.
process.exit(status ?? 1)
