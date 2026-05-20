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
	async processOperations(
		data: SignalDataSet,
		keyType: keyof SignalDataTypeMap,
		transactionCache: SignalDataSet,
		mutations: SignalDataSet,
		isInTransaction: boolean
	): Promise<void> {
		const keyData = data[keyType]
		if (!keyData) return

		// Ensure structures exist
		transactionCache[keyType] = transactionCache[keyType] || ({} as any)
		mutations[keyType] = mutations[keyType] || ({} as any)

		// Separate deletions from updates
		const deletions: string[] = []
		const updates: Record<string, any> = {}

		for (const keyId in keyData) {
			if (keyData[keyId] === null) {
				deletions.push(keyId)
			} else {
				updates[keyId] = keyData[keyId]
			}
		}

		if (Object.keys(updates).length > 0) {
			Object.assign(transactionCache[keyType]!, updates)
			Object.assign(mutations[keyType]!, updates)
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
	async validateDeletions(data: SignalDataSet, keyType: keyof SignalDataTypeMap): Promise<void> {
		const keyData = data[keyType]
		if (!keyData) return

		const deletionIds = Object.keys(keyData).filter(id => keyData[id] === null)
		if (deletionIds.length === 0) return

		const existingKeys = await this.store.get(keyType, deletionIds)
		for (const keyId of deletionIds) {
			if (!existingKeys[keyId]) {
				this.logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
				delete data[keyType]![keyId]
			}
		}
	}

	private async processDeletions(
		keyType: keyof SignalDataTypeMap,
		ids: string[],
		transactionCache: SignalDataSet,
		mutations: SignalDataSet,
		isInTransaction: boolean
	): Promise<void> {
		if (isInTransaction) {
			// In transaction, only allow deletion if key exists in cache
			for (const keyId of ids) {
				if (transactionCache[keyType]?.[keyId]) {
					transactionCache[keyType][keyId] = null
					mutations[keyType]![keyId] = null
				} else {
					this.logger.warn(`Skipping deletion of non-existent ${keyType} in transaction: ${keyId}`)
				}
			}
		} else {
			// Outside transaction, validate against store
			const existingKeys = await this.store.get(keyType, ids)
			for (const keyId of ids) {
				if (existingKeys[keyId]) {
					transactionCache[keyType]![keyId] = null
					mutations[keyType]![keyId] = null
				} else {
					this.logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
				}
			}
		}
	}
}
