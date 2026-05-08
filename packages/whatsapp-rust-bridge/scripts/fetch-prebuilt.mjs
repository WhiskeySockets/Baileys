#!/usr/bin/env node
// Postinstall hook for whatsapp-rust-bridge.
//
// Goal: a fresh clone of the Baileys monorepo should "just work" with
// `pnpm install`, even on machines without the Rust/wasm toolchain.
//
// We download the prebuilt artifacts from the registry (the same tarball
// `npm install whatsapp-rust-bridge` would pull) and copy dist/ + pkg/
// into the workspace package. If the bridge has been built locally
// already, we leave it alone.
//
// Skip the download if:
//   - dist/index.js already exists, or
//   - WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT=1.

import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
	copyFileSync,
	createReadStream,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync
} from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const root = resolve(dirname(__filename), '..')

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const { name, version } = pkg

const distDir = join(root, 'dist')
const pkgDir = join(root, 'pkg')
const distEntry = join(distDir, 'index.js')
const checksumFile = join(root, 'dist.sha256')

if (process.env.WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT === '1') {
	console.log('[whatsapp-rust-bridge] WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT=1, skipping prebuilt fetch.')
	process.exit(0)
}

if (existsSync(distEntry)) {
	console.log('[whatsapp-rust-bridge] dist/index.js already present, skipping prebuilt fetch.')
	process.exit(0)
}

console.log(`[whatsapp-rust-bridge] Fetching prebuilt ${name}@${version} from npm...`)

let tmpDir
try {
	tmpDir = await mkdtemp(join(tmpdir(), 'whatsapp-rust-bridge-'))

	const packResult = spawnSync(
		'npm',
		['pack', `${name}@${version}`, '--silent', '--pack-destination', tmpDir],
		{ stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' }
	)
	if (packResult.status !== 0) {
		throw new Error(`npm pack exited with status ${packResult.status}`)
	}

	const tarballName = packResult.stdout.trim().split('\n').pop()
	if (!tarballName) {
		throw new Error('npm pack did not print a tarball name')
	}
	const tarballPath = join(tmpDir, tarballName)

	if (existsSync(checksumFile)) {
		const expected = readFileSync(checksumFile, 'utf8').trim().split(/\s+/)[0]
		const actual = await sha256File(tarballPath)
		if (expected !== actual) {
			throw new Error(
				`prebuilt tarball SHA-256 mismatch:\n  expected ${expected}\n  got      ${actual}\n` +
					'If this is intentional, regenerate dist.sha256 ' +
					'(or set WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT=1).'
			)
		}
	} else {
		console.warn(
			'[whatsapp-rust-bridge] No dist.sha256 to verify against; skipping integrity check.'
		)
	}

	mkdirSync(distDir, { recursive: true })
	mkdirSync(pkgDir, { recursive: true })

	const tarResult = spawnSync('tar', ['-xzf', tarballPath, '-C', tmpDir], {
		stdio: 'inherit'
	})
	if (tarResult.status !== 0) {
		throw new Error(`tar -xzf exited with status ${tarResult.status}`)
	}

	const pkgRoot = join(tmpDir, 'package')
	for (const file of ['dist/index.js', 'dist/index.d.ts', 'pkg/whatsapp_rust_bridge.d.ts']) {
		const src = join(pkgRoot, file)
		if (!existsSync(src)) continue
		const dst = join(root, file)
		mkdirSync(dirname(dst), { recursive: true })
		copyFileSync(src, dst)
	}

	if (!existsSync(distEntry)) {
		throw new Error(`tarball did not contain dist/index.js`)
	}

	console.log('[whatsapp-rust-bridge] prebuilt artifacts installed.')
} catch (err) {
	console.error('[whatsapp-rust-bridge] failed to fetch prebuilt artifacts:')
	console.error(`  ${err.message}`)
	console.error(
		'\nIf you are working on the Rust crate, build locally with:\n' +
			'  pnpm --filter whatsapp-rust-bridge build\n' +
			'and re-run install with WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT=1 to suppress this hook.\n'
	)
	process.exit(1)
} finally {
	if (tmpDir) {
		try {
			rmSync(tmpDir, { recursive: true, force: true })
		} catch {
			// best-effort cleanup
		}
	}
}

async function sha256File(path) {
	const hash = createHash('sha256')
	for await (const chunk of createReadStream(path)) {
		hash.update(chunk)
	}
	return hash.digest('hex')
}
