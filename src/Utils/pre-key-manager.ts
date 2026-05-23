import type { SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../Types'
import type { ILogger } from './logger'

/**
 * Pre-key validation + transactional-cache projection.
 *
 * Stage 1 (upstream #2571) dropped the per-instance `PQueue` map that used
 * to live here. All serialization now happens through the {@link LockManager}
 * held by the caller (`auth-utils.addTransactionCapability`), so the
 * validation read and the durable write share one critical section (closes
 * the H2 race).
 *
 * Methods here are pure data-mutation helpers — they assume the caller is
 * already holding any locks required by the store contract.
 *
 * InfiniteAPI customization preserved: `destroyed` flag + `checkDestroyed()`
 * remain as defensive guards against operations after `destroy()` is called
 * (e.g. on socket close). The original purpose was to prevent enqueueing
 * tasks on cleared queues — even without queues, we keep the flag so a
 * post-destroy `processOperations()` call surfaces as an explicit error
 * instead of silently mutating data on a torn-down manager.
 */
export class PreKeyManager {
	/**
	 * Defensive flag — guards method ENTRY against operations after `destroy()`
	 * is called. `checkDestroyed()` runs synchronously at the top of each
	 * public method, so a caller that hasn't yet entered cannot proceed once
	 * `destroyed=true` is observed.
	 *
	 * Not a full memory barrier: once a method passes the entry guard, it can
	 * await internally and the destroyed flag may flip during the await. The
	 * stronger "drain in-flight operations before teardown" guarantee lives
	 * one level up in `auth-utils.addTransactionCapability.destroy()` via the
	 * `activeTransactions` counter (PR #453) — that's where actual concurrent-
	 * with-destroy safety is enforced. This flag is just the entry barrier.
	 *
	 * Preserved from InfiniteAPI's pre-Stage-1 PreKeyManager. Upstream dropped
	 * this protection but our socket close path benefits from it (avoids
	 * late callers mutating a torn-down manager during reconnect).
	 */
	private destroyed = false

	constructor(
		private readonly store: SignalKeyStore,
		private readonly logger: ILogger
	) {}

	/**
	 * Check if manager has been destroyed.
	 * @throws Error if manager has been destroyed
	 */
	private checkDestroyed(): void {
		if (this.destroyed) {
			throw new Error('PreKeyManager has been destroyed - cannot perform operations')
		}
	}

	/**
	 * In-transaction processing: apply updates to the in-memory cache &
	 * mutation set, and route deletions through {@link processDeletions}.
	 * Caller holds the outer transaction lock.
	 */
	async processOperations<T extends keyof SignalDataTypeMap>(
		data: SignalDataSet,
		keyType: T,
		transactionCache: SignalDataSet,
		mutations: SignalDataSet,
		isInTransaction: boolean
	): Promise<void> {
		this.checkDestroyed()

		type Bucket = { [id: string]: SignalDataTypeMap[T] | null }

		const keyData = data[keyType] as Bucket | undefined
		if (!keyData) return

		// Concrete typed bucket references — internal logic uses the precise
		// `SignalDataTypeMap[T] | null` value type instead of `any`. The
		// SignalDataSet container is a distributed mapped type and assigning
		// a non-distributed bucket back to it requires a narrow cast at the
		// boundary (the only `as` cast remaining; pre-Stage-1 used `as any`).
		const cacheBucket: Bucket = (transactionCache[keyType] as Bucket | undefined) ?? {}
		const mutationsBucket: Bucket = (mutations[keyType] as Bucket | undefined) ?? {}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		transactionCache[keyType] = cacheBucket as any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mutations[keyType] = mutationsBucket as any

		const deletions: string[] = []
		const updates: { [id: string]: SignalDataTypeMap[T] } = {}

		for (const keyId in keyData) {
			const value = keyData[keyId]
			if (value === null) {
				deletions.push(keyId)
			} else if (value !== undefined) {
				updates[keyId] = value
			}
		}

		if (Object.keys(updates).length > 0) {
			Object.assign(cacheBucket, updates)
			Object.assign(mutationsBucket, updates)
		}

		if (deletions.length > 0) {
			await this.processDeletions(keyType, deletions, transactionCache, mutations, isInTransaction)
		}
	}

	/**
	 * Non-transactional pre-deletion validation: drop deletions from `data`
	 * whose targets don't exist in the store. Mutates `data` in place. The
	 * caller is expected to hold a lock that spans this validation read *and*
	 * the subsequent durable write — otherwise a concurrent writer can flip
	 * the existence state between our read and the caller's write (H2).
	 */
	async validateDeletions<T extends keyof SignalDataTypeMap>(data: SignalDataSet, keyType: T): Promise<void> {
		this.checkDestroyed()

		const keyData = data[keyType]
		if (!keyData) return

		const deletionIds = Object.keys(keyData).filter(id => keyData[id] === null)
		if (deletionIds.length === 0) return

		const existingKeys = await this.store.get(keyType, deletionIds)
		for (const keyId of deletionIds) {
			// PR #453 round-5 (Copilot): use `=== undefined` instead of `!value`.
			// Truthiness check would misclassify legitimate falsy stored values
			// (e.g. `lid-mapping: ''` empty string) as "missing" and incorrectly
			// drop the deletion. Currently this method is only invoked with
			// keyType==='pre-key' (a non-falsy object), but the type signature is
			// generic <T extends keyof SignalDataTypeMap> and `lid-mapping: string`
			// exists in the map — guard against the latent trap.
			if (existingKeys[keyId] === undefined) {
				this.logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
				delete data[keyType]![keyId]
			}
		}
	}

	private async processDeletions<T extends keyof SignalDataTypeMap>(
		keyType: T,
		ids: string[],
		transactionCache: SignalDataSet,
		mutations: SignalDataSet,
		isInTransaction: boolean
	): Promise<void> {
		type Bucket = { [id: string]: SignalDataTypeMap[T] | null }
		const cacheBucket = transactionCache[keyType] as Bucket | undefined
		const mutationsBucket = mutations[keyType] as Bucket | undefined

		if (isInTransaction) {
			// In transaction, only allow deletion if key exists in cache.
			// PR #453 round-5: `cacheBucket?.[keyId] !== undefined && cacheBucket[keyId] !== null`
			// instead of truthiness — value can be `null` (already-marked-for-deletion)
			// or a legitimate falsy value (empty string for lid-mapping).
			for (const keyId of ids) {
				const cached = cacheBucket?.[keyId]
				if (cached !== undefined && cached !== null) {
					cacheBucket![keyId] = null
					if (mutationsBucket) mutationsBucket[keyId] = null
				} else {
					this.logger.warn(`Skipping deletion of non-existent ${keyType} in transaction: ${keyId}`)
				}
			}
		} else {
			// Outside transaction, validate against store.
			// PR #453 round-5: same `=== undefined` rationale as validateDeletions.
			const existingKeys = await this.store.get(keyType, ids)
			for (const keyId of ids) {
				if (existingKeys[keyId] !== undefined) {
					if (cacheBucket) cacheBucket[keyId] = null
					if (mutationsBucket) mutationsBucket[keyId] = null
				} else {
					this.logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
				}
			}
		}
	}

	/**
	 * Mark this manager as destroyed. After this call, all operations
	 * (`processOperations`, `validateDeletions`) throw via `checkDestroyed()`.
	 *
	 * Stage 1 (upstream #2571) removed PQueue management here — there's
	 * nothing to physically clean up anymore (lock state lives in the
	 * caller's LockManager). We keep this method as the operational signal
	 * that no further work should be accepted, matching the destroyed-flag
	 * contract used by `auth-utils.addTransactionCapability.destroy()`.
	 */
	destroy(): void {
		if (this.destroyed) return
		this.destroyed = true
		this.logger.debug('PreKeyManager destroyed')
	}
}
