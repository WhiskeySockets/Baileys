import { createHash, randomBytes } from 'node:crypto'
import { chmod, lstat, mkdir, open, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const AUTH_SESSION_RETENTION_MS = 8 * 60 * 60 * 1000

const AUTH_DIRECTORY_NAME = 'auth'
const LAST_USED_FILE_NAME = 'last-used'
const LOCK_FILE_NAME = 'active-run.lock'
const SESSION_DIRECTORY_MODE = 0o700
const SESSION_FILE_MODE = 0o600
const LOCK_INITIALIZATION_GRACE_MS = 30_000

type Clock = () => number

type OpenRetainedAuthSessionOptions = {
	workspacePath?: string
	tempRoot?: string
	retentionMs?: number
	now?: Clock
}

type LockRecord = {
	pid: number
	token: string
}

export interface RetainedAuthSession {
	authDir: string
	expired: boolean
	reused: boolean
	markUsed: () => Promise<void>
	reset: () => Promise<void>
	secureAuthFiles: () => Promise<void>
	release: () => Promise<void>
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error && 'code' in error

const pathExists = async (path: string): Promise<boolean> => {
	try {
		await lstat(path)
		return true
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return false
		}

		throw error
	}
}

const ensureSecureDirectory = async (path: string): Promise<void> => {
	try {
		await mkdir(path, { mode: SESSION_DIRECTORY_MODE })
	} catch (error) {
		if (!(isNodeError(error) && error.code === 'EEXIST')) {
			throw error
		}
	}

	const info = await lstat(path)
	if (info.isSymbolicLink() || !info.isDirectory()) {
		throw new Error('Refusing to use an unsafe retained-auth directory')
	}

	await chmod(path, SESSION_DIRECTORY_MODE)
}

const secureTree = async (path: string): Promise<void> => {
	const info = await lstat(path)
	if (info.isSymbolicLink()) {
		throw new Error('Refusing to follow a symlink in retained authentication state')
	}

	if (info.isDirectory()) {
		await chmod(path, SESSION_DIRECTORY_MODE)
		const entries = await readdir(path)
		for (const entry of entries) {
			try {
				await secureTree(join(path, entry))
			} catch (error) {
				// Multi-file auth keys can be removed while another credentials update is being persisted.
				if (!isNodeError(error) || error.code !== 'ENOENT') {
					throw error
				}
			}
		}
		return
	}

	if (!info.isFile()) {
		throw new Error('Refusing to retain an unsupported authentication-state entry')
	}

	await chmod(path, SESSION_FILE_MODE)
}

const processIsRunning = (pid: number): boolean => {
	try {
		process.kill(pid, 0)
		return true
	} catch (error) {
		return !(isNodeError(error) && error.code === 'ESRCH')
	}
}

const readLock = async (lockPath: string): Promise<LockRecord | undefined> => {
	let raw: string
	try {
		raw = await readFile(lockPath, 'utf8')
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return
		}

		throw error
	}

	try {
		const value = JSON.parse(raw) as Partial<LockRecord>
		const pid = value.pid
		return typeof pid === 'number' &&
			Number.isSafeInteger(pid) &&
			pid > 0 &&
			typeof value.token === 'string' &&
			value.token.length > 0
			? { pid, token: value.token }
			: undefined
	} catch {
		return
	}
}

const acquireLock = async (lockPath: string): Promise<{ token: string; release: () => Promise<void> }> => {
	const token = randomBytes(16).toString('hex')

	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const handle = await open(lockPath, 'wx', SESSION_FILE_MODE)
			try {
				await handle.writeFile(JSON.stringify({ pid: process.pid, token }))
			} finally {
				await handle.close()
			}

			return {
				token,
				release: async () => {
					const current = await readLock(lockPath)
					if (current?.token === token) {
						await unlink(lockPath).catch(error => {
							if (!(isNodeError(error) && error.code === 'ENOENT')) {
								throw error
							}
						})
					}
				}
			}
		} catch (error) {
			if (!(isNodeError(error) && error.code === 'EEXIST')) {
				throw error
			}

			const current = await readLock(lockPath)
			if (!current) {
				const lockInfo = await lstat(lockPath).catch(lockError => {
					if (isNodeError(lockError) && lockError.code === 'ENOENT') {
						return
					}

					throw lockError
				})
				if (!lockInfo) {
					continue
				}

				if (Date.now() - lockInfo.mtimeMs <= LOCK_INITIALIZATION_GRACE_MS) {
					throw new Error('Another message-edit smoke run is already using the retained pairing')
				}
			} else if (processIsRunning(current.pid)) {
				throw new Error('Another message-edit smoke run is already using the retained pairing')
			}

			await unlink(lockPath).catch(unlinkError => {
				if (!(isNodeError(unlinkError) && unlinkError.code === 'ENOENT')) {
					throw unlinkError
				}
			})
		}
	}

	throw new Error('Could not acquire the retained pairing lock')
}

const readLastUsed = async (path: string): Promise<number | undefined> => {
	try {
		const info = await lstat(path)
		if (info.isSymbolicLink() || !info.isFile()) {
			throw new Error('Refusing to read an unsafe retained-auth timestamp')
		}

		const value = Number(await readFile(path, 'utf8'))
		return Number.isFinite(value) && value > 0 ? value : undefined
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return
		}

		throw error
	}
}

export const getRetainedAuthSessionRoot = (workspacePath = process.cwd(), tempRoot = tmpdir()): string => {
	const workspaceHash = createHash('sha256').update(workspacePath).digest('hex').slice(0, 16)
	return join(tempRoot, `baileys-live-edit-${workspaceHash}`)
}

export const openRetainedAuthSession = async ({
	workspacePath = process.cwd(),
	tempRoot = tmpdir(),
	retentionMs = AUTH_SESSION_RETENTION_MS,
	now = Date.now
}: OpenRetainedAuthSessionOptions = {}): Promise<RetainedAuthSession> => {
	if (!Number.isFinite(retentionMs) || retentionMs <= 0) {
		throw new Error('Retained pairing lifetime must be a positive number')
	}

	const sessionRoot = getRetainedAuthSessionRoot(workspacePath, tempRoot)
	await ensureSecureDirectory(sessionRoot)
	const lock = await acquireLock(join(sessionRoot, LOCK_FILE_NAME))

	try {
		const authDir = join(sessionRoot, AUTH_DIRECTORY_NAME)
		const lastUsedPath = join(sessionRoot, LAST_USED_FILE_NAME)
		await ensureSecureDirectory(authDir)
		await secureTree(authDir)

		const credentialsPath = join(authDir, 'creds.json')
		const hasCredentials = await pathExists(credentialsPath)
		const lastUsed = await readLastUsed(lastUsedPath)
		const currentTime = now()
		const expired = hasCredentials && (!lastUsed || lastUsed > currentTime || currentTime - lastUsed > retentionMs)

		const reset = async () => {
			await secureTree(authDir)
			await rm(authDir, { recursive: true })
			await ensureSecureDirectory(authDir)
			await unlink(lastUsedPath).catch(error => {
				if (!(isNodeError(error) && error.code === 'ENOENT')) {
					throw error
				}
			})
		}

		if (expired) {
			await reset()
		}

		return {
			authDir,
			expired,
			reused: hasCredentials && !expired,
			markUsed: async () => {
				await writeFile(lastUsedPath, String(now()), { mode: SESSION_FILE_MODE })
				await chmod(lastUsedPath, SESSION_FILE_MODE)
			},
			reset,
			secureAuthFiles: () => secureTree(authDir),
			release: lock.release
		}
	} catch (error) {
		await lock.release()
		throw error
	}
}
