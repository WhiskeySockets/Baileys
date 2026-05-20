import type { SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../Types'
import type { ILogger } from './logger'

/**
 * Pre-key validation + transactional-cache projection.
 *
 * Stage 1 dropped the per-instance `PQueue` map that used to live here. All
 * serialization now happens through the {@link LockManager} held by the
 * caller (`auth-utils.addTransactionCapability`), so the validation read and
 * the durable write share one critical section (closes the H2 race).
 *
 * Methods here are pure data-mutation helpers — they assume the caller is
 * already holding any locks required by the store contract.
 */
export class PreKeyManager {
	constructor(
		private readonly store: SignalKeyStore,
		private readonly logger: ILogger
	) {}

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
		const keyData = data[keyType]
		if (!keyData) return

		const deletionIds = Object.keys(keyData).filter(id => keyData[id] === null)
		if (deletionIds.length === 0) return

		const existingKeys = await this.store.get(keyType, deletionIds)
		for (const keyId of deletionIds) {
			if (!existingKeys[keyId]) {
				this.logger.warn({ keyType, keyId }, 'skipping deletion of non-existent record')
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
			// In transaction, only allow deletion if key exists in cache
			for (const keyId of ids) {
				if (cacheBucket?.[keyId]) {
					cacheBucket[keyId] = null
					if (mutationsBucket) mutationsBucket[keyId] = null
				} else {
					this.logger.warn({ keyType, keyId }, 'skipping deletion of non-existent record (in transaction)')
				}
			}
		} else {
			// Outside transaction, validate against store
			const existingKeys = await this.store.get(keyType, ids)
			for (const keyId of ids) {
				if (existingKeys[keyId]) {
					if (cacheBucket) cacheBucket[keyId] = null
					if (mutationsBucket) mutationsBucket[keyId] = null
				} else {
					this.logger.warn({ keyType, keyId }, 'skipping deletion of non-existent record')
				}
			}
		}
	}
}
