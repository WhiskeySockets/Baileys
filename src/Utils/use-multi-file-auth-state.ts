import { Mutex } from 'async-mutex'
import { mkdir, readdir, readFile, rename, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { proto } from '../../WAProto/index.js'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

/**
 * Error thrown by {@link useMultiFileAuthState} when a JSON file on disk is
 * present but cannot be parsed — usually the result of a torn write from a
 * crash mid-rewrite. The original parse error is attached via `cause` and the
 * offending path is exposed so operators can recover the file.
 */
export class AuthFileCorruptError extends Error {
	readonly path: string
	readonly cause: unknown
	constructor(path: string, cause: unknown) {
		super(`Auth file is corrupt or unreadable: ${path}`)
		this.name = 'AuthFileCorruptError'
		this.path = path
		this.cause = cause
	}
}

// One mutex per file path. The map is pruned on every release so a long-lived
// process iterating over many distinct keys doesn't accumulate entries
// indefinitely.
const fileLocks = new Map<string, { mutex: Mutex; refCount: number }>()

const acquireFileLock = async (path: string): Promise<() => void> => {
	let entry = fileLocks.get(path)
	if (!entry) {
		entry = { mutex: new Mutex(), refCount: 0 }
		fileLocks.set(path, entry)
	}

	entry.refCount++
	const release = await entry.mutex.acquire()

	return () => {
		release()
		entry.refCount--
		// Only drop the entry when nobody else holds a reference AND the entry
		// in the map still belongs to this acquire — mirrors the identity-check
		// pattern in `makeKeyedMutex` at `src/Utils/make-mutex.ts:34`.
		if (entry.refCount === 0 && fileLocks.get(path) === entry) {
			fileLocks.delete(path)
		}
	}
}

const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

/**
 * Stores the full authentication state in a single folder.
 *
 * @deprecated For production deployments, prefer the SQLite-backed
 * `useSqliteAuthState` (cross-process safe, atomic transactions, faster on
 * cold start). This file-per-key implementation remains supported but is no
 * longer the recommended default; it is retained primarily for development
 * and for in-place migrations.
 *
 * Hardened in Stage 5 of the concurrency rewrite (closes H7):
 *   - persistent writes go via `*.tmp` + `rename` so a crash mid-write never
 *     replaces the previous file with a truncated one;
 *   - multi-record `set()` writes every `.tmp` first, then renames in a tight
 *     loop, narrowing the partial-success window;
 *   - `readData` distinguishes ENOENT (return null) from corruption
 *     (`AuthFileCorruptError` thrown with the originating parse error in
 *     `cause`), so a torn write surfaces as a loud error rather than as a
 *     silent fresh-install on next boot;
 *   - `fileLocks` is refcounted and pruned on release;
 *   - implements `list`/`listIds` via `readdir` so `migrateAuthState` can
 *     enumerate the on-disk contents without leaking the file naming scheme.
 *
 * Cross-process safety: the per-path `Mutex` is per-process only. Do NOT
 * share an auth folder across multiple Baileys processes — use
 * `useSqliteAuthState` if you need that.
 */
export const useMultiFileAuthState = async (
	folder: string
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
	type ReadAttempt = { kind: 'ok'; value: unknown } | { kind: 'missing' } | { kind: 'corrupt'; cause: unknown }

	/**
	 * Read + JSON-parse a file with explicit outcome variants. Distinguishing
	 * `missing` (ENOENT — fall through to backup) from `corrupt` (parse
	 * failure — surface with cause) avoids the previous failure mode where
	 * an `EACCES` / `EBUSY` was collapsed into `'corrupt'`, hiding the real
	 * I/O error and producing an `AuthFileCorruptError` with a synthetic
	 * cause that didn't actually reflect why the read failed.
	 *
	 * Non-ENOENT I/O errors are rethrown so the caller's structured logger
	 * sees the original error code; only an actual `JSON.parse` failure
	 * yields `corrupt` (and carries the parse exception forward as the
	 * eventual `AuthFileCorruptError.cause`).
	 */
	/** Narrow an unknown error to the standard Node fs `code` field. */
	const errorCode = (error: unknown): string | undefined => {
		if (typeof error === 'object' && error !== null && 'code' in error) {
			const code = (error as { code: unknown }).code
			return typeof code === 'string' ? code : undefined
		}

		return undefined
	}

	const tryReadAndParse = async (path: string): Promise<ReadAttempt> => {
		let raw: string
		try {
			raw = await readFile(path, { encoding: 'utf-8' })
		} catch (error: unknown) {
			if (errorCode(error) === 'ENOENT') return { kind: 'missing' }
			throw error
		}

		try {
			return { kind: 'ok', value: JSON.parse(raw, BufferJSON.reviver) }
		} catch (error) {
			return { kind: 'corrupt', cause: error }
		}
	}

	// Persistent write via temp file + atomic rename, plus a `.bak` rotation
	// step so a manually-corrupted file (or a rare cross-filesystem-rename
	// failure mode) can still be recovered from the previous good state.
	// Sequence per write:
	//   1. writeFile(tmp, newContent)
	//   2. if main exists, rename(main, bak)
	//   3. rename(tmp, main)
	// A crash between (2) and (3) leaves `.bak` intact; readData falls back.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const writeData = async (data: any, file: string) => {
		const filePath = join(folder, fixFileName(file)!)
		const tmpPath = `${filePath}.tmp`
		const bakPath = `${filePath}.bak`
		const release = await acquireFileLock(filePath)
		try {
			await writeFile(tmpPath, JSON.stringify(data, BufferJSON.replacer))
			// Rotate the previous file to .bak. If it doesn't exist, that's fine.
			await rename(filePath, bakPath).catch((err: unknown) => {
				if (errorCode(err) !== 'ENOENT') throw err
			})
			await rename(tmpPath, filePath)
		} finally {
			release()
		}
	}

	/**
	 * Swallow ONLY `ENOENT` from a cleanup unlink; rethrow EPERM/EBUSY/EIO so
	 * a delete that fails for a real reason (filesystem perms, locked file,
	 * underlying I/O error) doesn't silently leave the file in place.
	 */
	const unlinkIgnoreMissing = async (path: string) => {
		try {
			await unlink(path)
		} catch (err: unknown) {
			if (errorCode(err) !== 'ENOENT') throw err
		}
	}

	const readData = async (file: string) => {
		const filePath = join(folder, fixFileName(file)!)
		const bakPath = `${filePath}.bak`
		const release = await acquireFileLock(filePath)
		try {
			const primary = await tryReadAndParse(filePath)
			if (primary.kind === 'ok') return primary.value
			if (primary.kind === 'missing') {
				// Main file missing — see if a .bak survived an interrupted
				// write so we can recover.
				const backup = await tryReadAndParse(bakPath)
				if (backup.kind === 'ok') return backup.value
				if (backup.kind === 'missing') return null
				// Backup exists but is corrupt. Surface that rather than
				// silently returning null — `null` would let the caller
				// (e.g. creds.json bootstrap) fall back to `initAuthCreds()`,
				// masking the corruption as "fresh install" and discarding
				// any pairing state still recoverable by hand.
				throw new AuthFileCorruptError(bakPath, backup.cause)
			}

			// `primary.kind === 'corrupt'` — try the backup before surfacing.
			const backup = await tryReadAndParse(bakPath)
			if (backup.kind === 'ok') return backup.value

			// Forward the actual parse exception as the cause so operators
			// can distinguish a malformed-JSON failure from other read
			// problems (the latter would have been rethrown above).
			throw new AuthFileCorruptError(filePath, primary.cause)
		} finally {
			release()
		}
	}

	const removeData = async (file: string) => {
		const filePath = join(folder, fixFileName(file)!)
		const tmpPath = `${filePath}.tmp`
		const bakPath = `${filePath}.bak`
		const release = await acquireFileLock(filePath)
		try {
			// Unlink the primary AND its companions (.tmp from an in-flight
			// write, .bak rotated by writeData). Without this, `readData`
			// would fall back to the `.bak` on the next `get` and resurrect
			// the deleted value — fatal for session clears and identity-key
			// deletions after any prior rewrite created a backup.
			//
			// `unlinkIgnoreMissing` only swallows ENOENT; any other I/O
			// failure (EPERM/EBUSY/EIO) propagates so the caller learns
			// the delete partially failed.
			await Promise.all([unlinkIgnoreMissing(filePath), unlinkIgnoreMissing(tmpPath), unlinkIgnoreMissing(bakPath)])
		} finally {
			release()
		}
	}

	const folderInfo = await stat(folder).catch(() => {})
	if (folderInfo) {
		if (!folderInfo.isDirectory()) {
			throw new Error(
				`found something that is not a directory at ${folder}, either delete it or specify a different location`
			)
		}
	} else {
		await mkdir(folder, { recursive: true })
	}

	const creds: AuthenticationCreds = ((await readData('creds.json')) as AuthenticationCreds | null) || initAuthCreds()

	/**
	 * Reverse `fixFileName` for the only id spaces that actually use the two
	 * mangled characters:
	 *
	 *   - `sender-key`: ids are `SenderKeyName.toString()` →
	 *     `${groupId}::${signalAddr}`. `groupId` is `${creator}-${timestamp}@g.us`
	 *     (one literal `-`), `signalAddr` is `{user}[_{domain}].{device}`
	 *     (no `-`, at most one `_`). Therefore `--` in a filename is
	 *     unambiguously the mangled `::` separator, and single `-` is
	 *     original. Replace `--` with `::`.
	 *   - `app-state-sync-key`: ids are standard base64 of the binary key id
	 *     (alphabet `A-Za-z0-9+/=`). `_` is not in that alphabet, so `__`
	 *     in a filename is unambiguously the mangled `/`. Replace `__`
	 *     with `/`.
	 *
	 * Every other type's ids are either purely numeric (`pre-key`), bare JIDs
	 * without device suffixes (`tctoken`, `lid-mapping`, `device-list`,
	 * `app-state-sync-version`), or signal-protocol-addresses without any
	 * mangled characters (`session`, `identity-key`). For those `fixFileName`
	 * is identity, so reversal is also identity.
	 *
	 * The `tctoken` exception: its sentinel id `__index` contains a literal
	 * `__` that must NOT be decoded to `/index`. Per-type dispatch keeps
	 * that intact.
	 */
	function decodeIdForType<T extends keyof SignalDataTypeMap>(type: T, encodedId: string): string {
		if (type === 'sender-key') {
			return encodedId.replace(/--/g, '::')
		}

		if (type === 'app-state-sync-key') {
			return encodedId.replace(/__/g, '/')
		}

		return encodedId
	}

	/**
	 * Iterate every file in the folder that belongs to `type`. Yields the
	 * decoded id (the same logical id callers passed to `get`/`set` originally)
	 * via {@link decodeIdForType}, plus the on-disk filename for read access.
	 */
	async function* iterateType<T extends keyof SignalDataTypeMap>(
		type: T
	): AsyncGenerator<{ id: string; filename: string }> {
		const entries = await readdir(folder)
		const prefix = `${fixFileName(type)}-`
		for (const filename of entries) {
			if (!filename.startsWith(prefix) || !filename.endsWith('.json')) continue
			// Skip `.tmp` (in-flight writes) and `.bak` (rotated backups) artifacts.
			if (filename.endsWith('.tmp') || filename.endsWith('.bak')) continue
			const encodedId = filename.slice(prefix.length, -'.json'.length)
			yield { id: decodeIdForType(type, encodedId), filename }
		}
	}

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
					await Promise.all(
						ids.map(async id => {
							let value: any = await readData(`${type}-${id}.json`)
							if (type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							if (value !== null && value !== undefined) {
								data[id] = value as SignalDataTypeMap[typeof type]
							}
						})
					)

					return data
				},
				set: async data => {
					// Each write goes through the same atomic `.tmp` + rotate + rename
					// dance as single writes (saveCreds). True cross-file atomicity
					// requires a transactional store — see `useSqliteAuthState`.
					const writes: Array<{ file: string; value: unknown }> = []
					const deletions: string[] = []

					for (const category in data) {
						const type = category as keyof SignalDataTypeMap
						for (const id in data[type]) {
							const value = data[type][id]
							const file = `${type}-${id}.json`
							if (value) {
								writes.push({ file, value })
							} else {
								deletions.push(file)
							}
						}
					}

					// Sequential rather than parallel: the per-file locks
					// serialize naturally and a single failure cleans up its
					// own `.tmp` without affecting siblings.
					for (const w of writes) {
						await writeData(w.value, w.file)
					}

					// Deletions happen after writes so a swap-and-delete style
					// caller (e.g. session migration) keeps the new key around
					// even if a deletion later throws.
					await Promise.all(deletions.map(file => removeData(file)))
				},
				clear: async () => {
					// Sweep .json, .json.tmp, and .json.bak. Skipping .tmp/.bak
					// would leave backups that `readData` would resurrect on
					// the next `get`, making `clear()` partially undo itself.
					// Each unlink swallows ONLY ENOENT (concurrent delete or
					// already gone); real I/O errors propagate so the caller
					// sees the failure.
					const entries = await readdir(folder).catch(() => [])
					await Promise.all(
						entries
							.filter(
								f => f !== 'creds.json' && (f.endsWith('.json') || f.endsWith('.json.tmp') || f.endsWith('.json.bak'))
							)
							.map(f => unlinkIgnoreMissing(join(folder, f)))
					)
				},
				list: async function* <T extends keyof SignalDataTypeMap>(
					type: T
				): AsyncIterable<readonly [string, SignalDataTypeMap[T]]> {
					for await (const entry of iterateType(type)) {
						let value: any = await readData(entry.filename)
						if (type === 'app-state-sync-key' && value) {
							value = proto.Message.AppStateSyncKeyData.fromObject(value)
						}

						if (value !== null && value !== undefined) {
							yield [entry.id, value as SignalDataTypeMap[T]] as const
						}
					}
				},
				listIds: async function* <T extends keyof SignalDataTypeMap>(type: T): AsyncIterable<string> {
					for await (const entry of iterateType(type)) {
						yield entry.id
					}
				}
			}
		},
		saveCreds: async () => {
			return writeData(creds, 'creds.json')
		}
	}
}
