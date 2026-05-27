import { proto } from '../../../WAProto/index.js'
import type { AuthenticationCreds, AuthenticationState, SignalDataSet, SignalDataTypeMap } from '../../Types'
import { initAuthCreds } from '../auth-utils'
import { BufferJSON } from '../generics'
import type { ILogger } from '../logger'
import { WaAlignedSqliteStore, type WaAlignedSqliteStoreOptions } from './store'

const CREDS_ROW_KEY = '__creds__'
const MAX_BUSY_ATTEMPTS = 5
const BUSY_RETRY_BASE_MS = 25

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export type UseWaAlignedSqliteAuthStateOptions = WaAlignedSqliteStoreOptions

/**
 * WA-aligned multi-DB authentication state for Baileys.
 *
 * Same API as `useMultiFileAuthState` / `useSqliteAuthState`, but the
 * underlying persistence is split across 5 physical SQLite files mirroring
 * WhatsApp Android's own layout:
 *
 *   sessionDir/
 *     creds.db       — auth credentials + app_state_sync_keys
 *     axolotl.db     — Signal Protocol (signal_kv opaque in v1; typed tables
 *                      reserved for phase 9.5 integration)
 *     msgstore.db    — JID routing, device cache, quarantine, retry counters
 *                      (schemas reserved for phase 9.1–9.4 integration)
 *     wa.db          — contacts + TC tokens (schemas reserved for phase 9.6)
 *     sync.db        — app-state sync (schemas reserved for phase 9.7)
 *
 * **v1 contract:** behaves exactly like `useSqliteAuthState` — auth creds in
 * `creds.db`, signal data in `axolotl.db.signal_kv` (opaque, JSON-encoded
 * via BufferJSON). The msgstore/wa/sync DB files are created with their
 * schemas but their typed tables remain empty until the corresponding
 * follow-up phases route the respective components to them.
 *
 * Why open all 5 files up front instead of lazily? Disk allocation + WAL
 * checkpointing both have one-time costs; doing them at startup means the
 * first message flow doesn't pay them. The cost is ~80 KB per session for
 * empty WAL files — negligible.
 */
export async function useWaAlignedSqliteAuthState(opts: UseWaAlignedSqliteAuthStateOptions): Promise<{
	state: AuthenticationState
	saveCreds: () => Promise<void>
	close: () => void
	/** Exposed for advanced consumers and the upcoming phase 9.1+ integrations. */
	store: WaAlignedSqliteStore
}> {
	const store = new WaAlignedSqliteStore(opts)
	await store.open()

	let creds: AuthenticationCreds
	let credsStmts: ReturnType<typeof prepareCredsStatements>
	let signalStmts: ReturnType<typeof prepareSignalStatements>

	try {
		credsStmts = prepareCredsStatements(store)
		signalStmts = prepareSignalStatements(store)
		creds = loadCreds(credsStmts, opts.logger)
	} catch (err) {
		store.close()
		throw err
	}

	const persistCreds = (): void => {
		credsStmts.upsert.run(CREDS_ROW_KEY, JSON.stringify(creds, BufferJSON.replacer), Date.now())
	}

	const applySetTx = store.handle('axolotl.db').transaction((data: SignalDataSet) => {
		for (const category in data) {
			const type = category as keyof SignalDataTypeMap
			const bucket = data[type]
			if (!bucket) continue
			for (const id in bucket) {
				const value = bucket[id]
				if (value === null || value === undefined) {
					signalStmts.del.run(type, id)
				} else {
					signalStmts.upsert.run(type, id, JSON.stringify(value, BufferJSON.replacer))
				}
			}
		}
	})

	const runSetWithBusyRetry = async (data: SignalDataSet): Promise<void> => {
		let lastError: unknown
		for (let attempt = 0; attempt < MAX_BUSY_ATTEMPTS; attempt++) {
			try {
				applySetTx.immediate(data)
				return
			} catch (err) {
				const code = (err as { code?: string } | null)?.code
				if (code !== 'SQLITE_BUSY' && code !== 'SQLITE_BUSY_SNAPSHOT') throw err
				lastError = err
				const jitter = 0.5 + Math.random()
				const delay = Math.floor(BUSY_RETRY_BASE_MS * Math.pow(2, attempt) * jitter)
				opts.logger?.warn?.({ attempt: attempt + 1, delay, code }, 'wa-aligned-sqlite: SQLITE_BUSY, retrying')
				await sleep(delay)
			}
		}

		throw lastError
	}

	const state: AuthenticationState = {
		creds,
		keys: {
			get: async (type, ids) => {
				const out: { [_: string]: SignalDataTypeMap[typeof type] } = {}
				for (const id of ids) {
					const row = signalStmts.select.get(type, id) as { value: string } | undefined
					if (!row) continue
					let parsed = JSON.parse(row.value, BufferJSON.reviver)
					if (type === 'app-state-sync-key' && parsed) {
						parsed = proto.Message.AppStateSyncKeyData.fromObject(parsed)
					}

					out[id] = parsed as SignalDataTypeMap[typeof type]
				}

				return out
			},
			set: async data => {
				await runSetWithBusyRetry(data)
			},
			clear: async () => {
				signalStmts.clear.run()
			},
			list: async function* <T extends keyof SignalDataTypeMap>(
				type: T
			): AsyncIterable<readonly [string, SignalDataTypeMap[T]]> {
				for (const row of signalStmts.list.iterate(type) as Iterable<{ id: string; value: string }>) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					let value: any = JSON.parse(row.value, BufferJSON.reviver)
					if (type === 'app-state-sync-key' && value) {
						value = proto.Message.AppStateSyncKeyData.fromObject(value)
					}

					yield [row.id, value as SignalDataTypeMap[T]] as const
				}
			},
			listIds: async function* <T extends keyof SignalDataTypeMap>(type: T): AsyncIterable<string> {
				for (const row of signalStmts.listIds.iterate(type) as Iterable<{ id: string }>) {
					yield row.id
				}
			}
		}
	}

	return {
		state,
		saveCreds: async () => {
			persistCreds()
		},
		close: () => store.close(),
		store
	}
}

function prepareCredsStatements(store: WaAlignedSqliteStore) {
	const db = store.handle('creds.db')
	return {
		select: db.prepare('SELECT value FROM creds WHERE key = ?'),
		upsert: db.prepare(
			'INSERT INTO creds (key, value, updated_at) VALUES (?, ?, ?) ' +
				'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
		)
	}
}

function prepareSignalStatements(store: WaAlignedSqliteStore) {
	const db = store.handle('axolotl.db')
	return {
		select: db.prepare('SELECT value FROM signal_kv WHERE type = ? AND id = ?'),
		upsert: db.prepare(
			'INSERT INTO signal_kv (type, id, value) VALUES (?, ?, ?) ' +
				'ON CONFLICT(type, id) DO UPDATE SET value = excluded.value'
		),
		del: db.prepare('DELETE FROM signal_kv WHERE type = ? AND id = ?'),
		listIds: db.prepare('SELECT id FROM signal_kv WHERE type = ?'),
		list: db.prepare('SELECT id, value FROM signal_kv WHERE type = ?'),
		clear: db.prepare('DELETE FROM signal_kv')
	}
}

function loadCreds(
	stmts: ReturnType<typeof prepareCredsStatements>,
	logger: ILogger | undefined
): AuthenticationCreds {
	const row = stmts.select.get(CREDS_ROW_KEY) as { value: string } | undefined
	if (!row) {
		logger?.info?.('wa-aligned-sqlite: creds.db empty, initializing fresh credentials')
		return initAuthCreds()
	}

	try {
		return JSON.parse(row.value, BufferJSON.reviver) as AuthenticationCreds
	} catch (cause) {
		const error = new Error(`wa-aligned-sqlite creds row is corrupt (key=${CREDS_ROW_KEY})`)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(error as any).cause = cause
		throw error
	}
}
