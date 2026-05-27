// Type-only import so we don't pull better-sqlite3 into the bundle
// unconditionally. The runtime `import('better-sqlite3')` below remains lazy.
//
// Codex P1 fix (round-3): both this `import type` and the `typeof import(...)`
// below resolve to internal aliases ONLY. Nothing from `better-sqlite3`
// appears in the public `SqliteAuthStateOptions` surface — see the
// `database?: unknown` field below. The .d.ts emitted for downstream
// consumers therefore does NOT require `better-sqlite3` types to resolve,
// preserving the optional-peer-dep contract for non-SQLite users (no
// `TS2307` under `skipLibCheck: false`).
import type BetterSqlite3Module from 'better-sqlite3'
import { proto } from '../../WAProto/index.js'
import type { AuthenticationCreds, AuthenticationState, SignalDataSet, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'
import type { ILogger } from './logger'

/**
 * A live `better-sqlite3` database handle. INTERNAL alias — used for type
 * safety inside this module; NOT exposed via any exported type. Consumers
 * who want to inject a pre-opened handle pass `unknown` through the public
 * `SqliteAuthStateOptions.database` field and we cast at the boundary.
 */
type Database = BetterSqlite3Module.Database
/**
 * The constructor exposed by `better-sqlite3`'s `export =` default. INTERNAL.
 *
 * With `verbatimModuleSyntax: true`, `typeof BetterSqlite3Module` is illegal
 * because `BetterSqlite3Module` is imported with `import type` and lives in
 * the type namespace only. Use a `typeof import(...)` type query directly.
 */
type DatabaseConstructor = typeof import('better-sqlite3')

/**
 * Lazy load `better-sqlite3` so the dependency is only required when this
 * adapter is actually used. The package is declared as an optional peer
 * dependency; users who stick with `useMultiFileAuthState` (or supply their
 * own store) don't need to install it.
 */
async function loadBetterSqlite3(): Promise<DatabaseConstructor> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const mod = (await import('better-sqlite3')) as any
		return mod.default ?? mod
	} catch (err) {
		const helpful = new Error(
			'`better-sqlite3` is required for `useSqliteAuthState`. Install it as a peer dependency: `npm install better-sqlite3` (or `yarn add better-sqlite3`).'
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(helpful as any).cause = err
		throw helpful
	}
}

const CREDS_ROW_KEY = '__creds__'

const CREATE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS creds (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS signal_keys (
  type TEXT NOT NULL,
  id TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (type, id)
);
CREATE INDEX IF NOT EXISTS signal_keys_type_idx ON signal_keys(type);
`

/**
 * PRAGMA defaults aligned with WhatsApp's own mobile pattern:
 *   - `journal_mode = WAL`   — concurrent reads alongside a single writer
 *   - `synchronous = NORMAL` — fsync at checkpoint boundaries only (sufficient
 *     for auth state; data loss window is <= 1 WAL checkpoint)
 *   - `busy_timeout = 5000`  — InfiniteAPI addition: lets the engine wait up to
 *     5 s on a contended write before returning SQLITE_BUSY. Combined with the
 *     `set()` retry wrapper below this absorbs short cross-process contention
 *     bursts (e.g. concurrent migrations or sidecar processes touching the same
 *     db) without escalating to the caller.
 */
const DEFAULT_PRAGMAS: ReadonlyArray<string> = [
	'journal_mode = WAL',
	'synchronous = NORMAL',
	'busy_timeout = 5000'
]

/**
 * Total attempts (NOT additional retries) for SQLITE_BUSY on the per-call
 * BEGIN IMMEDIATE write. A value of `5` means up to 5 calls into
 * `applySetTx.immediate(...)` before propagating the error.
 *
 * Copilot fix: previous name was `MAX_BUSY_RETRIES` paired with
 * `attempt <= MAX_BUSY_RETRIES`, which gave 6 total attempts when the
 * caller intuition was 5. Renamed to `MAX_BUSY_ATTEMPTS` + `attempt < ...`
 * so the loop bound matches the constant's meaning and the
 * `attempts: attempt + 1` log field reads consistently.
 */
const MAX_BUSY_ATTEMPTS = 5
/** Backoff floor between retry attempts (jittered 0.5× – 1.5×). */
const BUSY_RETRY_BASE_MS = 25

/**
 * Public configuration shape for {@link useSqliteAuthState}.
 *
 * Codex P1 fix (round-3): `database` is typed `unknown` rather than the
 * internal `Database` alias so this exported type does NOT carry a hard
 * dependency on `better-sqlite3`'s declarations. Consumers who never use
 * SQLite can import baileys' public types without needing
 * `@types/better-sqlite3` resolvable in their project. The runtime
 * expectation is unchanged: pass a `better-sqlite3` `Database` instance.
 */
export type SqliteAuthStateOptions = {
	/**
	 * Filesystem path to the SQLite database file. The file will be created if
	 * it does not exist. Use `':memory:'` for an in-process ephemeral store
	 * (useful in tests).
	 */
	dbPath: string
	/**
	 * If supplied, overrides the default `better-sqlite3` import — primarily
	 * for tests / advanced consumers that want to inject a pre-opened
	 * handle.
	 *
	 * **Runtime contract**: must be a `better-sqlite3` `Database` instance.
	 * Typed as `unknown` here so consumers who don't use SQLite never need
	 * to resolve `better-sqlite3` types (the field is cast at the boundary
	 * inside the implementation).
	 */
	database?: unknown
	/**
	 * Additional `PRAGMA` statements to apply after the defaults. Use this for
	 * ops tuning (e.g. `'cache_size = -8000'`, `'mmap_size = 268435456'`)
	 * without re-implementing the whole init path. Each entry is passed
	 * verbatim to `db.pragma(...)`.
	 */
	extraPragmas?: ReadonlyArray<string>
	/**
	 * Optional logger for visibility into init / contention / migration paths.
	 * If omitted, the store runs silently.
	 */
	logger?: ILogger
}

function sleep(ms: number) {
	return new Promise<void>(resolve => setTimeout(resolve, ms))
}

/**
 * SQLite-backed authentication state for Baileys.
 *
 * Adapted from upstream WhiskeySockets/Baileys #2575 (Stage 5) with InfiniteAPI
 * additions:
 *   - `busy_timeout` PRAGMA + retry wrapper around the per-call BEGIN IMMEDIATE
 *     so transient SQLITE_BUSY under cross-process contention is absorbed
 *     rather than propagated to the caller as an error;
 *   - optional `extraPragmas` for ops tuning without forking;
 *   - optional `logger` for init / migration / contention observability.
 *
 * Why this and not `useMultiFileAuthState`?
 *   - cross-process safe (SQLite handles file locking);
 *   - true per-call atomicity via `BEGIN IMMEDIATE; ...; COMMIT` — a multi-type
 *     `set({ session, 'identity-key' })` either commits both types or rolls
 *     back the whole call (closes the cross-file gap that the multi-file
 *     adapter can only approximate);
 *   - constant-time point reads under arbitrarily large state;
 *   - efficient `list`/`listIds` enumeration for bulk operations and migration.
 *   - WhatsApp's mobile clients use SQLite + WAL for `msgstore.db` /
 *     `axolotl.db` — this adapter mirrors that pattern.
 *
 * Concurrency contract:
 *   - point reads via prepared statements (constant-time, no transaction);
 *   - each `set()` runs as a single `BEGIN IMMEDIATE` ... `COMMIT` so the
 *     entire multi-type payload commits atomically or rolls back; under
 *     SQLITE_BUSY the call retries up to `MAX_BUSY_ATTEMPTS` times with
 *     jittered backoff before propagating;
 *   - `clear()` is a single statement and serializes naturally;
 *   - `list`/`listIds` use streaming iterators — readers do not block the
 *     single writer under WAL mode.
 *
 * Lifecycle:
 *   - the returned `close()` closes the underlying SQLite handle;
 *   - the same `dbPath` can be reopened after `close()` to resume.
 *
 * For migrating an existing on-disk `useMultiFileAuthState` folder to this
 * store, see {@link migrateAuthState}.
 */
export async function useSqliteAuthState(opts: SqliteAuthStateOptions): Promise<{
	state: AuthenticationState
	saveCreds: () => Promise<void>
	close: () => void
}> {
	// Track whether this function created the handle. If we did and any
	// subsequent init step (pragma / exec / prepare / loadCreds) throws, we
	// need to close the native handle ourselves — otherwise the caller never
	// sees a `close()` to call and the file descriptor / WAL lock leaks on
	// the startup failure path.
	let db: Database | undefined
	const ownsDb = !opts.database
	try {
		if (opts.database) {
			// Boundary cast: public type is `unknown` to avoid leaking
			// `better-sqlite3` types into our .d.ts (Codex P1 round-3).
			// Runtime contract: must be a `better-sqlite3` Database instance.
			db = opts.database as Database
		} else {
			const Database = await loadBetterSqlite3()
			db = new Database(opts.dbPath)
			opts.logger?.debug({ dbPath: opts.dbPath }, 'sqlite auth state opened')
		}

		for (const pragma of DEFAULT_PRAGMAS) {
			db.pragma(pragma)
		}

		if (opts.extraPragmas?.length) {
			for (const pragma of opts.extraPragmas) {
				db.pragma(pragma)
			}

			opts.logger?.debug({ extraPragmas: opts.extraPragmas }, 'applied extra pragmas')
		}

		db.exec(CREATE_SCHEMA_SQL)

		const stmts = {
			credsSelect: db.prepare('SELECT value FROM creds WHERE key = ?'),
			credsUpsert: db.prepare(
				'INSERT INTO creds (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
			),
			keySelect: db.prepare('SELECT value FROM signal_keys WHERE type = ? AND id = ?'),
			keyUpsert: db.prepare(
				'INSERT INTO signal_keys (type, id, value) VALUES (?, ?, ?) ON CONFLICT(type, id) DO UPDATE SET value = excluded.value'
			),
			keyDelete: db.prepare('DELETE FROM signal_keys WHERE type = ? AND id = ?'),
			keyListIds: db.prepare('SELECT id FROM signal_keys WHERE type = ?'),
			keyList: db.prepare('SELECT id, value FROM signal_keys WHERE type = ?'),
			clearKeys: db.prepare('DELETE FROM signal_keys')
		}

		const loadCreds = (): AuthenticationCreds => {
			const row = stmts.credsSelect.get(CREDS_ROW_KEY) as { value: string } | undefined
			if (!row) return initAuthCreds()
			try {
				return JSON.parse(row.value, BufferJSON.reviver) as AuthenticationCreds
			} catch (cause) {
				// Copilot round-6 fix: wrap the raw `SyntaxError` so operators
				// get the same diagnostic context as the multi-file adapter's
				// `AuthFileCorruptError`. Without this, a torn write to the
				// SQLite `creds` row surfaces as a bare "Unexpected token ..."
				// stack with no indication of WHICH database / row failed.
				// `cause` preserves the original parse exception so any
				// existing handler chain still sees it.
				const error = new Error(
					`Auth state SQLite creds row is corrupt or unreadable (dbPath=${opts.dbPath}, key=${CREDS_ROW_KEY})`
				)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				;(error as any).cause = cause
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				;(error as any).dbPath = opts.dbPath
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				;(error as any).rowKey = CREDS_ROW_KEY
				throw error
			}
		}

		const persistCreds = (creds: AuthenticationCreds): void => {
			stmts.credsUpsert.run(CREDS_ROW_KEY, JSON.stringify(creds, BufferJSON.replacer))
		}

		const creds = loadCreds()

		// One BEGIN IMMEDIATE transaction per `set` call covers every type +
		// every id at once. better-sqlite3's `transaction()` defaults to
		// DEFERRED — the write lock is only acquired on the first writing
		// statement, which under concurrency can produce `SQLITE_BUSY` if
		// two callers race to upgrade their readers to writers. We invoke
		// via the `.immediate(...)` flavour below so the write lock is
		// taken up front and the whole call either gets the lock or fails
		// fast, without leaving the caller mid-write.
		const applySetTx = db.transaction((data: SignalDataSet) => {
			for (const category in data) {
				const type = category as keyof SignalDataTypeMap
				const bucket = data[type]
				if (!bucket) continue
				for (const id in bucket) {
					const value = bucket[id]
					// Copilot round-6 fix: treat BOTH `null` and `undefined` as the
					// delete sentinel, matching the multi-file adapter and the
					// cache layer (`makeCacheableSignalKeyStore`). The previous
					// `if (value === null)` would fall through to upsert when
					// `value === undefined`; `JSON.stringify(undefined, ...)`
					// returns the literal `undefined` (not a string), which
					// better-sqlite3 binds as NULL, violating the schema's
					// `value TEXT NOT NULL` constraint and surfacing as a
					// confusing SQLITE_CONSTRAINT_NOTNULL error to the caller.
					if (value === null || value === undefined) {
						stmts.keyDelete.run(type, id)
					} else {
						stmts.keyUpsert.run(type, id, JSON.stringify(value, BufferJSON.replacer))
					}
				}
			}
		})

		/**
		 * InfiniteAPI addition: retry `applySetTx.immediate(...)` on SQLITE_BUSY
		 * with jittered backoff. The `busy_timeout` pragma absorbs most
		 * contention internally, but if the timer expires under sustained
		 * contention the call still throws SQLITE_BUSY. This wrapper smooths
		 * that out for the multi-process case (sidecar inspectors, parallel
		 * migrations) without changing single-process behaviour.
		 *
		 * Only SQLITE_BUSY / SQLITE_BUSY_SNAPSHOT are retried. Other errors
		 * (SQLITE_CORRUPT, type errors, schema mismatch) propagate immediately.
		 */
		const runSetWithBusyRetry = async (data: SignalDataSet) => {
			let lastError: unknown
			for (let attempt = 0; attempt < MAX_BUSY_ATTEMPTS; attempt++) {
				try {
					applySetTx.immediate(data)
					if (attempt > 0) {
						opts.logger?.debug({ attempts: attempt + 1 }, 'sqlite set succeeded after retries')
					}

					return
				} catch (err: unknown) {
					lastError = err
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const code = (err as any)?.code as string | undefined
					const isBusy = code === 'SQLITE_BUSY' || code === 'SQLITE_BUSY_SNAPSHOT'
					if (!isBusy || attempt === MAX_BUSY_ATTEMPTS - 1) {
						throw err
					}

					const jitter = 0.5 + Math.random()
					const delay = Math.round(BUSY_RETRY_BASE_MS * Math.pow(2, attempt) * jitter)
					opts.logger?.debug({ attempt: attempt + 1, delay, code }, 'sqlite set busy, retrying')
					await sleep(delay)
				}
			}

			// Defensive — loop above always either returns or throws.
			throw lastError
		}

		// `db` is captured by `close` below; the non-null narrowing inside this
		// successful-init branch is local.
		const handle = db
		// Cubic/Codex P2 fix: close() must NOT tear down a caller-owned
		// `opts.database` handle. The caller passed an already-open instance
		// and may be reusing it elsewhere (e.g. shared connection pool,
		// inspector sidecar). Capture ownership at init time so `close()`
		// only acts on handles we opened ourselves.
		const closeOwnsDb = ownsDb
		return {
			state: {
				creds,
				keys: {
					get: async (type, ids) => {
						const out: Record<string, SignalDataTypeMap[typeof type]> = {}
						for (const id of ids) {
							const row = stmts.keySelect.get(type, id) as { value: string } | undefined
							if (!row) continue
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							let value: any = JSON.parse(row.value, BufferJSON.reviver)
							if (type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							out[id] = value as SignalDataTypeMap[typeof type]
						}

						return out
					},
					set: async data => {
						await runSetWithBusyRetry(data)
					},
					clear: async () => {
						stmts.clearKeys.run()
					},
					list: async function* <T extends keyof SignalDataTypeMap>(
						type: T
					): AsyncIterable<readonly [string, SignalDataTypeMap[T]]> {
						for (const row of stmts.keyList.iterate(type) as Iterable<{ id: string; value: string }>) {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							let value: any = JSON.parse(row.value, BufferJSON.reviver)
							if (type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							yield [row.id, value as SignalDataTypeMap[T]] as const
						}
					},
					listIds: async function* <T extends keyof SignalDataTypeMap>(type: T): AsyncIterable<string> {
						for (const row of stmts.keyListIds.iterate(type) as Iterable<{ id: string }>) {
							yield row.id
						}
					}
				}
			},
			saveCreds: async () => {
				persistCreds(creds)
			},
			close: () => {
				if (closeOwnsDb) {
					handle.close()
					opts.logger?.debug({ dbPath: opts.dbPath }, 'sqlite auth state closed')
				} else {
					// Caller injected the handle — lifecycle belongs to them.
					opts.logger?.debug({ dbPath: opts.dbPath }, 'sqlite auth state released (injected handle, not closed)')
				}
			}
		}
	} catch (err) {
		// Init failed AFTER we opened the handle (or while opening it). If we
		// own the handle, close it so the file descriptor / WAL lock doesn't
		// leak — the caller never received a `close()` to call. If the caller
		// passed an existing `opts.database`, leave it alone; lifecycle is
		// theirs.
		if (ownsDb && db) {
			try {
				db.close()
			} catch {
				// best-effort — original error wins.
			}
		}

		opts.logger?.error({ err }, 'sqlite auth state init failed')
		throw err
	}
}
