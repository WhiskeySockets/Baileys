import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, stat, symlink, utimes, writeFile } from 'node:fs/promises'
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

	it('recovers a lock left by a process that is no longer running', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/stale-lock-worktree'
			const sessionRoot = getRetainedAuthSessionRoot(workspacePath, tempRoot)
			await mkdir(sessionRoot, { mode: 0o700 })
			await writeFile(
				join(sessionRoot, 'active-run.lock'),
				JSON.stringify({ pid: 2_147_483_647, token: 'stale-lock-token' }),
				{ mode: 0o600 }
			)

			const session = await openRetainedAuthSession({ workspacePath, tempRoot })
			await session.release()
		})
	})

	it('recovers a malformed lock after its initialization grace period', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/malformed-lock-worktree'
			const sessionRoot = getRetainedAuthSessionRoot(workspacePath, tempRoot)
			const lockPath = join(sessionRoot, 'active-run.lock')
			await mkdir(sessionRoot, { mode: 0o700 })
			await writeFile(lockPath, '')
			await utimes(lockPath, new Date(0), new Date(0))

			const session = await openRetainedAuthSession({ workspacePath, tempRoot })
			await session.release()
		})
	})

	it('does not remove a lock entry when reading it fails', async () => {
		await withTemporaryRoot(async tempRoot => {
			const workspacePath = '/synthetic/unreadable-lock-worktree'
			const sessionRoot = getRetainedAuthSessionRoot(workspacePath, tempRoot)
			const lockPath = join(sessionRoot, 'active-run.lock')
			await mkdir(sessionRoot, { mode: 0o700 })
			await mkdir(lockPath)

			await assert.rejects(openRetainedAuthSession({ workspacePath, tempRoot }), { code: 'EISDIR' })
			assert.equal((await stat(lockPath)).isDirectory(), true)
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
