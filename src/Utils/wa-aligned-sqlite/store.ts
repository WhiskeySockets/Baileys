/**
 * `WaAlignedSqliteStore` — multi-handle SQLite store that mirrors the
 * WhatsApp Android persistence layout: one physical `.db` file per concern
 * (axolotl, msgstore, wa, sync) plus the InfiniteAPI-specific `creds.db`.
 *
 * Why multiple files instead of one consolidated DB?
 *
 *   - Lock isolation: a heavy write burst in `msgstore.jid_map` does not
 *     block point reads on `axolotl.signal_sessions` (which are on the
 *     send hot path).
 *   - Corruption blast radius: a single WAL checkpoint corruption only
 *     compromises one concern. Auth creds (in `creds.db`) survive a hostile
 *     write on `msgstore.db`.
 *   - Maintenance: tools like `sqlite3 axolotl.db .schema` work without
 *     needing to know table prefixes.
 *   - Mirrors WhatsApp's own production layout — the very pattern Meta uses
 *     at billions-of-users scale.
 *
 * Trade-off: cross-file transactions are not ACID. We don't need them —
 * the only logical atomicity boundary in baileys is "save N signal data
 * types in one call", and those all live inside `axolotl.db`.
 */
import type BetterSqlite3Module from 'better-sqlite3'

import type { ILogger } from '../logger'
import { SCHEMAS, WA_DB_FILES, type WaDbFile } from './schemas'

type Database = BetterSqlite3Module.Database
type DatabaseConstructor = typeof import('better-sqlite3')

const DEFAULT_PRAGMAS: ReadonlyArray<string> = [
	'journal_mode = WAL',
	'synchronous = NORMAL',
	'busy_timeout = 5000'
]

async function loadBetterSqlite3(): Promise<DatabaseConstructor> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const mod = (await import('better-sqlite3')) as any
		return mod.default ?? mod
	} catch (err) {
		const e = new Error(
			'`better-sqlite3` is required for `WaAlignedSqliteStore`. Install it: `npm install better-sqlite3`.'
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(e as any).cause = err
		throw e
	}
}

export type WaAlignedSqliteStoreOptions = {
	/**
	 * Directory where the per-concern `.db` files are written. Will be created
	 * if missing. Each session typically gets its own directory.
	 */
	sessionDir: string
	/**
	 * Extra `PRAGMA` statements applied to every opened handle after the
	 * defaults. Useful for ops tuning (e.g. `'cache_size = -8000'`).
	 */
	extraPragmas?: ReadonlyArray<string>
	/**
	 * Optional logger for init / migration visibility.
	 */
	logger?: ILogger
}

/**
 * Holds the open handles for all WA-aligned DB files in a single session.
 * The handles are lazily opened on first access via {@link open} and closed
 * together via {@link close}.
 */
export class WaAlignedSqliteStore {
	private readonly handles = new Map<WaDbFile, Database>()
	private opened = false

	constructor(private readonly opts: WaAlignedSqliteStoreOptions) {}

	async open(): Promise<void> {
		if (this.opened) return

		const fs = await import('node:fs')
		const path = await import('node:path')

		fs.mkdirSync(this.opts.sessionDir, { recursive: true })

		const Database = await loadBetterSqlite3()
		const extra = this.opts.extraPragmas ?? []

		for (const file of WA_DB_FILES) {
			const fullPath = path.join(this.opts.sessionDir, file)
			const db = new Database(fullPath)
			for (const pragma of DEFAULT_PRAGMAS) db.pragma(pragma)
			for (const pragma of extra) db.pragma(pragma)
			db.exec(SCHEMAS[file])
			this.handles.set(file, db)
			this.opts.logger?.info?.({ file, path: fullPath }, 'wa-aligned-sqlite: opened')
		}

		this.opened = true
	}

	/**
	 * Returns the opened handle for the given DB file. Throws if the store has
	 * not been opened yet — callers should always {@link open} first.
	 */
	handle(file: WaDbFile): Database {
		const db = this.handles.get(file)
		if (!db) throw new Error(`WaAlignedSqliteStore: handle for "${file}" not opened (call .open() first)`)
		return db
	}

	/**
	 * Closes every opened handle. Safe to call multiple times; subsequent calls
	 * are no-ops. After close, the same `sessionDir` can be re-opened via a
	 * fresh store instance.
	 */
	close(): void {
		if (!this.opened) return
		for (const [file, db] of this.handles) {
			try {
				db.close()
			} catch (err) {
				this.opts.logger?.warn?.({ file, err }, 'wa-aligned-sqlite: close failed')
			}
		}

		this.handles.clear()
		this.opened = false
	}
}
