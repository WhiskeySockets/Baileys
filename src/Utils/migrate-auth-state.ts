import type { AuthenticationState, SignalDataTypeMap } from '../Types'
import type { ILogger } from './logger'

/**
 * Result of a {@link migrateAuthState} run.
 *
 * `counts` maps each `SignalDataType` to the number of records copied. The
 * `verified` flag is `true` when post-migration id sets match between source
 * and destination.
 */
export type MigrateAuthStateResult = {
	creds: { copied: boolean }
	counts: Partial<Record<keyof SignalDataTypeMap, number>>
	verified: boolean
	warnings: string[]
}

export type MigrateAuthStateOptions = {
	from: AuthenticationState
	to: AuthenticationState
	/** Maximum records buffered between a `list` pull and a `set` push. Defaults to 100. */
	batchSize?: number
	/**
	 * If true, the destination store is consulted to detect already-migrated
	 * records — they're skipped rather than re-written. Lets a partially
	 * failed run resume safely. Defaults to true.
	 */
	skipExisting?: boolean
	logger?: ILogger
	/**
	 * When `true`, after copying every type the migrator enumerates the source
	 * AND the destination to verify the id sets match. Adds a full extra pass
	 * over the source. Defaults to true. The result's `verified` flag reflects
	 * the outcome — set this to `false` for very large stores where the verify
	 * pass is too expensive.
	 */
	verify?: boolean
}

/** Every record type that `migrateAuthState` will iterate. */
const ALL_TYPES: ReadonlyArray<keyof SignalDataTypeMap> = [
	'pre-key',
	'session',
	'sender-key',
	'sender-key-memory',
	'app-state-sync-key',
	'app-state-sync-version',
	'lid-mapping',
	'device-list',
	'tctoken',
	'identity-key'
]

/**
 * Copy a full authentication state (creds + every signal key record) from one
 * {@link AuthenticationState} to another. Used to migrate operators from
 * `useMultiFileAuthState` (deprecated) to a SQL-backed or other compliant
 * adapter without re-pairing the device.
 *
 * Requirements:
 * - The `from.keys` store MUST implement `list(type)` (added by Stage 1's type
 *   lift). Without it the migrator cannot enumerate records.
 * - The destination's `set(data)` MUST be at least per-call atomic for the
 *   pairs of types it observes. Crashes between batches leave a partial state
 *   on the destination; re-running with the default `skipExisting: true`
 *   safely resumes (writes are upserts; existing ids are skipped).
 *
 * Operational notes:
 * - The source is never mutated.
 * - Listing reads bypass the cache layer (see
 *   `makeCacheableSignalKeyStore.list`) so we always observe the durable
 *   content of the source.
 * - Logs `info` per type with counts; `warn` for any verification mismatch.
 */
export async function migrateAuthState({
	from,
	to,
	batchSize = 100,
	skipExisting = true,
	logger,
	verify = true
}: MigrateAuthStateOptions): Promise<MigrateAuthStateResult> {
	if (!from.keys.list) {
		throw new Error(
			'migrateAuthState: source store does not implement `list(type)`. Upgrade the source adapter or supply the records manually.'
		)
	}

	const result: MigrateAuthStateResult = {
		creds: { copied: false },
		counts: {},
		verified: false,
		warnings: []
	}

	// 1. Copy creds. `AuthenticationState.creds` is a plain object, so we
	//    just assign it onto the destination's creds in-place. Callers that
	//    use the destination's `saveCreds`-style API are expected to persist.
	for (const k of Object.keys(from.creds) as Array<keyof typeof from.creds>) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(to.creds as any)[k] = (from.creds as any)[k]
	}

	result.creds.copied = true
	logger?.info('migrateAuthState: creds copied')

	// 2. Per-type record migration.
	for (const type of ALL_TYPES) {
		let batch: Record<string, SignalDataTypeMap[typeof type]> = {}
		let batchCount = 0
		let total = 0

		const flush = async () => {
			if (batchCount === 0) return
			await to.keys.set({ [type]: batch } as any)
			total += batchCount
			batch = {}
			batchCount = 0
		}

		// Optional: pre-fetch destination ids so we skip records already there.
		let existingIds: Set<string> | null = null
		if (skipExisting && to.keys.listIds) {
			existingIds = new Set<string>()
			try {
				for await (const id of to.keys.listIds(type)) existingIds.add(id)
			} catch (e) {
				result.warnings.push(`failed to enumerate existing destination ids for ${type}: ${String(e)}`)
				existingIds = null
			}
		}

		try {
			for await (const [id, value] of from.keys.list(type)) {
				if (existingIds?.has(id)) continue
				batch[id] = value
				batchCount++
				if (batchCount >= batchSize) await flush()
			}

			await flush()
		} catch (e) {
			result.warnings.push(`failed to enumerate source records for ${type}: ${String(e)}`)
		}

		result.counts[type] = total
		logger?.info({ type, count: total }, 'migrateAuthState: copied type')
	}

	// 3. Verify (best-effort).
	if (verify) {
		const verifyOk = await verifyMigration(from, to, logger, result.warnings)
		result.verified = verifyOk
	}

	logger?.info(
		{ counts: result.counts, verified: result.verified, warnings: result.warnings.length },
		'migrateAuthState: done'
	)
	return result
}

async function verifyMigration(
	from: AuthenticationState,
	to: AuthenticationState,
	logger: ILogger | undefined,
	warnings: string[]
): Promise<boolean> {
	if (!from.keys.listIds && !from.keys.list) return false
	if (!to.keys.listIds && !to.keys.list) return false

	let ok = true
	for (const type of ALL_TYPES) {
		const fromIds = await collectIds(from, type)
		const toIds = await collectIds(to, type)
		// A null from `collectIds` means we couldn't enumerate that side at
		// all — that's a verification gap, not a clean pass. Surface it as
		// a warning and fail the overall verified flag.
		if (fromIds === null || toIds === null) {
			warnings.push(`verification skipped for ${type}: unable to enumerate one side`)
			ok = false
			continue
		}

		for (const id of fromIds) {
			if (!toIds.has(id)) {
				warnings.push(`destination missing ${type}:${id}`)
				ok = false
			}
		}

		// Symmetric check: destination should not have records the source
		// doesn't. An extra id in `to` means either a stale leftover from a
		// prior partial run or an unrelated write to the destination during
		// migration — both are signal worth surfacing.
		for (const id of toIds) {
			if (!fromIds.has(id)) {
				warnings.push(`destination has unexpected ${type}:${id}`)
				ok = false
			}
		}
	}

	logger?.info({ ok }, 'migrateAuthState: verification complete')
	return ok
}

async function collectIds(state: AuthenticationState, type: keyof SignalDataTypeMap): Promise<Set<string> | null> {
	const out = new Set<string>()
	try {
		if (state.keys.listIds) {
			for await (const id of state.keys.listIds(type)) out.add(id)
		} else if (state.keys.list) {
			for await (const [id] of state.keys.list(type)) out.add(id)
		} else {
			return null
		}

		return out
	} catch {
		return null
	}
}
