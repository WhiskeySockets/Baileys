import type { AuthenticationState, SignalDataSet, SignalDataTypeMap } from '../Types'
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
 * Adapted verbatim from upstream WhiskeySockets/Baileys #2575 (Stage 5).
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

	// 1. Copy creds. `AuthenticationState.creds` is a plain object — `Object.assign`
	//    in-place onto the destination keeps the property writes typed against
	//    `AuthenticationCreds` instead of routing every key through paired
	//    `any` casts. Callers that use the destination's `saveCreds`-style API
	//    are expected to persist.
	Object.assign(to.creds, from.creds)

	result.creds.copied = true
	logger?.info('migrateAuthState: creds copied')

	/**
	 * Build a single-type `SignalDataSet` payload for `to.keys.set`. The
	 * inputs (`type: T`, `batch: { [id]: SignalDataTypeMap[T] | null }`) are
	 * strongly typed; the assignment to `payload[type]` requires one narrow
	 * cast because `SignalDataSet` is a mapped type whose distributive
	 * index TypeScript can't tie back to the caller's `T`. The runtime
	 * shape is unambiguous and the cast is contained to this single
	 * helper instead of the previous `as any` at every call site.
	 */
	function buildSetPayload<T extends keyof SignalDataTypeMap>(
		type: T,
		batch: { [id: string]: SignalDataTypeMap[T] | null }
	): SignalDataSet {
		const payload: SignalDataSet = {}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(payload as any)[type] = batch
		return payload
	}

	// 2. Per-type record migration.
	for (const type of ALL_TYPES) {
		let batch: { [id: string]: SignalDataTypeMap[typeof type] | null } = {}
		let batchCount = 0
		let total = 0

		// `flush` is INTENTIONALLY not wrapped in the listing try/catch below:
		// a destination write failure must propagate so the migration rejects
		// and the operator notices, rather than getting silently logged as a
		// "source enumeration" warning.
		const flush = async () => {
			if (batchCount === 0) return
			await to.keys.set(buildSetPayload(type, batch))
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

		// Drain the source iterator and stage records in `batch`. Source-side
		// errors are recoverable (we record a warning per type, then continue
		// to the next type so a partially-listable source doesn't lose every
		// other type's records). Destination-side errors are NOT — they MUST
		// propagate so the operator notices and can re-run the migration.
		//
		// Cubic P1 fix: previous structure used `for await ... { await flush() }`
		// inside ONE try/catch. A destination throw from the in-loop `flush()`
		// got caught by the outer source-listing catch and downgraded to a
		// warning — the migration then either silently dropped remaining
		// records for that type or attempted to flush the same broken batch
		// twice. Manual iteration lets us catch source `.next()` errors at
		// the call site only, while in-loop `flush()` throws propagate up to
		// the caller untouched.
		//
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const sourceIter = (from.keys.list(type) as AsyncIterable<readonly [string, any]>)[Symbol.asyncIterator]()

		// Cubic P2 fix (round-3): wrap the whole iteration in try/finally so
		// the source iterator is ALWAYS released, regardless of how we exit.
		// Round-1 only called `sourceIter.return?.()` in the source-error
		// branch; an in-loop `flush()` throw (destination error) bypassed
		// cleanup entirely and leaked the source cursor / prepared statement.
		// The `try { return await ... }` in `flush()` already lets the throw
		// reach this finally — we just need to make the cleanup unconditional.
		try {
			while (true) {
				let next: IteratorResult<readonly [string, SignalDataTypeMap[typeof type] | null]>
				try {
					next = await sourceIter.next()
				} catch (e) {
					result.warnings.push(`failed to enumerate source records for ${type}: ${String(e)}`)
					break
				}

				if (next.done) break
				const [id, value] = next.value
				if (existingIds?.has(id)) continue
				batch[id] = value
				batchCount++
				if (batchCount >= batchSize) {
					// Flush throws propagate — destination errors must NOT be
					// swallowed as source warnings. The outer try/finally
					// guarantees iterator cleanup before the throw reaches
					// the caller.
					await flush()
				}
			}
		} finally {
			// Best-effort iterator cleanup. Source stores typically release
			// the cursor/statement here (e.g. better-sqlite3 finalises the
			// prepared SELECT iteration). Swallow any error — the original
			// throw (if any) takes precedence.
			try {
				await sourceIter.return?.()
			} catch {
				// best-effort cleanup; ignore.
			}
		}

		// Final flush: a destination `to.keys.set` failure aborts the
		// migration. The caller's `await` rejects with the underlying store
		// error.
		await flush()

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
