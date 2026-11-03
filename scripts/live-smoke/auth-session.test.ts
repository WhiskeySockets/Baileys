import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { AUTH_SESSION_RETENTION_MS, getRetainedAuthSessionRoot, openRetainedAuthSession } from './auth-session'

const withTemporaryRoot = async (run: (root: string) => Promise<void>) => {
	const root = await mkdtemp(join(tmpdir(), 'baileys-auth-session-test-'))
	try {
		await run(root)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
}

const permissions = async (path: string) => (await stat(path)).mode & 0o777

describe('retained live-smoke authentication session', () => {
	it('reuses recent credentials and restricts directory and file permissions', async () => {
		await withTemporaryRoot(async tempRoot => {
			let now = 1_725_000_000_000
			const options = {
				workspacePath: '/synthetic/worktree',
				tempRoot,
				now: () => now
			}
			const first = await openRetainedAuthSession(options)

			assert.equal(first.reused, false)
			assert.equal(first.expired, false)
			assert.equal(await permissions(first.authDir), 0o700)

			const credentialsPath = join(first.authDir, 'creds.json')
			await writeFile(credentialsPath, '{}', { mode: 0o666 })
			await first.secureAuthFiles()
			await first.markUsed()
			await first.release()

			assert.equal(await permissions(credentialsPath), 0o600)
			now += 60_000

			const second = await openRetainedAuthSession(options)
			assert.equal(second.reused, true)
			assert.equal(second.expired, false)
			assert.equal(await readFile(credentialsPath, 'utf8'), '{}')
			await second.release()
		})
	})

	it('expires credentials after eight idle hours', async () => {
		await withTemporaryRoot(async tempRoot => {
			let now = 1_725_000_000_000
			const options = {
				workspacePath: '/synthetic/expiring-worktree',
				tempRoot,
				now: () => now
			}
			const first = await openRetainedAuthSession(options)
			const credentialsPath = join(first.authDir, 'creds.json')
			await writeFile(credentialsPath, '{}')
			await first.markUsed()
			await first.release()

			now += AUTH_SESSION_RETENTION_MS + 1
			const second = await openRetainedAuthSession(options)
			assert.equal(second.expired, true)
			assert.equal(second.reused, false)
			await assert.rejects(stat(credentialsPath), { code: 'ENOENT' })
			await second.release()
		})
	})

	it('expires credentials when the retained timestamp is in the future', async () => {
		await withTemporaryRoot(async tempRoot => {
			let now = 1_725_000_000_000
			const options = {
				workspacePath: '/synthetic/future-timestamp-worktree',
				tempRoot,
				now: () => now
			}
			const first = await openRetainedAuthSession(options)
			await writeFile(join(first.authDir, 'creds.json'), '{}')
			await first.markUsed()
			await first.release()

			now -= 1
			const second = await openRetainedAuthSession(options)
			assert.equal(second.expired, true)
			await second.release()
		})
	})

	it('blocks concurrent runs that target the same retained pairing', async () => {
		await withTemporaryRoot(async tempRoot => {
			const options = {
				workspacePath: '/synthetic/locked-worktree',
				tempRoot
			}
			const first = await openRetainedAuthSession(options)

			await assert.rejects(openRetainedAuthSession(options), /already using the retained pairing/)
			await first.release()

			const next = await openRetainedAuthSession(options)
			await next.release()
		})
	})

	it('shares the lock when temporary-root aliases refer to the same credentials directory', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/aliased-temp-root'
			const aliasRoot = join(tempRoot, 'alias')
			await symlink(tempRoot, aliasRoot, 'dir')
			const first = await openRetainedAuthSession({ workspacePath, tempRoot })
			try {
				await assert.rejects(
					openRetainedAuthSession({ workspacePath, tempRoot: aliasRoot }),
					/already using the retained pairing/
				)
			} finally {
				await first.release()
			}

			const next = await openRetainedAuthSession({ workspacePath, tempRoot: aliasRoot })
			await next.release()
		})
	})

	it('ignores obsolete PID lock files, including a PID reused by a running process', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/obsolete-lock-worktree'
			const sessionRoot = getRetainedAuthSessionRoot(workspacePath, tempRoot)
			await mkdir(sessionRoot, { mode: 0o700 })
			await writeFile(
				join(sessionRoot, 'active-run.lock'),
				JSON.stringify({ pid: process.pid, token: 'obsolete-lock-token' }),
				{ mode: 0o600 }
			)

			const session = await openRetainedAuthSession({ workspacePath, tempRoot })
			await assert.rejects(openRetainedAuthSession({ workspacePath, tempRoot }), /already using the retained pairing/)
			await session.release()
		})
	})

	it('admits one competing process and releases the lock after that process crashes', async () => {
		await withTemporaryRoot(async tempRoot => {
			const options = { workspacePath: '/synthetic/competing-worktree', tempRoot }
			const moduleUrl = new URL('./auth-session.ts', import.meta.url).href
			const script = `
				import { openRetainedAuthSession } from ${JSON.stringify(moduleUrl)}
				process.stdout.write('ready\\n')
				process.stdin.once('data', async () => {
					try {
						await openRetainedAuthSession(${JSON.stringify(options)})
						process.stdout.write('acquired\\n')
					} catch (error) {
						process.stdout.write('blocked: ' + error.message + '\\n')
					}
				})
				setInterval(() => {}, 1000)
			`
			const contenders = Array.from({ length: 4 }, () =>
				spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script], {
					stdio: ['pipe', 'pipe', 'pipe']
				})
			)
			try {
				await Promise.all(contenders.map(child => once(child.stdout, 'data', { signal: AbortSignal.timeout(10_000) })))
				const results = contenders.map(child => once(child.stdout, 'data', { signal: AbortSignal.timeout(10_000) }))
				for (const child of contenders) child.stdin.write('go')
				const output = (await Promise.all(results)).map(([data]) => String(data))
				assert.equal(output.filter(value => value === 'acquired\n').length, 1)
				assert.equal(output.filter(value => /blocked: Another message-edit smoke run/.test(value)).length, 3)
				await assert.rejects(openRetainedAuthSession(options), /already using the retained pairing/)

				const winner = contenders[output.indexOf('acquired\n')]!
				const exited = once(winner, 'exit')
				winner.kill('SIGKILL')
				await exited
				const recovered = await openRetainedAuthSession(options)
				await recovered.release()
			} finally {
				await Promise.all(
					contenders.map(async child => {
						if (child.exitCode === null && child.signalCode === null) {
							const exited = once(child, 'exit')
							child.kill('SIGKILL')
							await exited
						}
					})
				)
			}
		})
	})

	it('refuses a retained-session root that is a symlink', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/symlinked-worktree'
			const target = join(tempRoot, 'attacker-controlled')
			await mkdir(target)
			await symlink(target, getRetainedAuthSessionRoot(workspacePath, tempRoot))

			await assert.rejects(openRetainedAuthSession({ workspacePath, tempRoot }), /unsafe retained-auth directory/)
		})
	})
})
