import PQueue from 'p-queue'
import type { SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../Types'
import type { ILogger } from './logger'

/**
 * Manages pre-key operations with proper concurrency control
 */
export class PreKeyManager {
	private readonly queues = new Map<string, PQueue>()

	/**
	 * Destroyed flag - protected by atomic check-and-set in destroy()
	 *
	 * THREAD SAFETY: Prevents operations from executing after destroy() is called.
	 * All public methods check this flag before proceeding.
	 *
	 * CRITICAL: Prevents race conditions where:
	 * - Operations add tasks to queues after they've been cleared/paused
	 * - New queues are created after destroy() has cleaned them up
	 * - Tasks execute on destroyed resources
	 */
	private destroyed = false

	constructor(
		private readonly store: SignalKeyStore,
		private readonly logger: ILogger
	) {}

	/**
	 * Check if manager has been destroyed
	 * @throws Error if manager has been destroyed
	 */
	private checkDestroyed(): void {
		if (this.destroyed) {
			throw new Error('PreKeyManager has been destroyed - cannot perform operations')
		}
	}

	/**
	 * Get or create a queue for a specific key type
	 */
	private getQueue(keyType: string): PQueue {
		if (!this.queues.has(keyType)) {
			this.queues.set(keyType, new PQueue({ concurrency: 1 }))
		}

		return this.queues.get(keyType)!
	}

	/**
	 * Process pre-key operations (updates and deletions)
	 */
	async processOperations(
		data: SignalDataSet,
		keyType: keyof SignalDataTypeMap,
		transactionCache: SignalDataSet,
		mutations: SignalDataSet,
		isInTransaction: boolean
	): Promise<void> {
		// PROTECTION: Check destroyed flag before processing
		this.checkDestroyed()

		const keyData = data[keyType]
		if (!keyData) return

		return this.getQueue(keyType).add(async () => {
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

			// Process updates (no validation needed)
			if (Object.keys(updates).length > 0) {
				Object.assign(transactionCache[keyType]!, updates)
				Object.assign(mutations[keyType]!, updates)
			}

			// Process deletions with validation
			if (deletions.length > 0) {
				await this.processDeletions(keyType, deletions, transactionCache, mutations, isInTransaction)
			}
		})
	}

	/**
	 * Process deletions with validation
	 */
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

	/**
	 * Validate and process pre-key deletions outside transactions
	 */
	async validateDeletions(data: SignalDataSet, keyType: keyof SignalDataTypeMap): Promise<void> {
		// PROTECTION: Check destroyed flag before processing
		this.checkDestroyed()

		const keyData = data[keyType]
		if (!keyData) return

		return this.getQueue(keyType).add(async () => {
			// Find all deletion requests
			const deletionIds = Object.keys(keyData).filter(id => keyData[id] === null)
			if (deletionIds.length === 0) return

			// Validate deletions
			const existingKeys = await this.store.get(keyType, deletionIds)
			for (const keyId of deletionIds) {
				if (!existingKeys[keyId]) {
					this.logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
					delete data[keyType]![keyId]
				}
			}
		})
	}

	/**
	 * Cleanup all queues and resources
	 * Should be called during connection cleanup to prevent memory leaks
	 */
	destroy(): void {
		// PROTECTION: Atomic check-and-set to prevent race conditions
		// Flag is set IMMEDIATELY after check, BEFORE any operations
		// This prevents:
		// 1. Multiple calls to destroy() (reentrancy guard)
		// 2. Operations from executing after destroy() starts
		// 3. New queues from being created after cleanup
		if (this.destroyed) {
			this.logger.debug('PreKeyManager already destroyed')
			return
		}
		this.destroyed = true  // ← Set IMMEDIATELY to close race window

		this.logger.debug('🗑️ Destroying PreKeyManager')

		this.queues.forEach((queue, keyType) => {
			queue.clear()
			queue.pause()
			this.logger.debug(`Queue for ${keyType} cleared and paused`)
		})

		this.queues.clear()
		this.logger.debug('PreKeyManager destroyed - all queues cleaned up')
	}
}
