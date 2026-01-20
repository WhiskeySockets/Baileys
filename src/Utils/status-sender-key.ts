import type { SignalKeyStore, StatusSenderKeyData } from '../Types'
import { STORIES_JID } from '../WABinary/jid-utils'
import type { ILogger } from './logger'
import { makeMutex } from './make-mutex'

/**
 * Status sender key management matching WhatsApp Web's WAWebUserPrefsStatus behavior.
 * Tracks which devices have received the sender key for status broadcasts.
 *
 * Key behaviors:
 * - Uses mutex locking to prevent race conditions
 * - markStatusHasSenderKey() resets rotateKey and clears map if rotating
 * - markStatusSenderKeyRotate() only triggers rotation if JIDs actually had the key
 * - getStatusSkDistribList() auto-detects recipient removal and triggers rotation
 */
export class StatusSenderKeyManager {
	private readonly mutex = makeMutex()

	constructor(
		private readonly keys: SignalKeyStore,
		private readonly logger?: ILogger
	) {}

	/** Get the current status sender key map from storage */
	async getStatusSenderKeyMap(): Promise<StatusSenderKeyData> {
		const result = await this.keys.get('status-sender-key', [STORIES_JID])
		return result[STORIES_JID] ?? { rotateKey: false, senderKey: {} }
	}

	/**
	 * Mark that devices have received the status sender key.
	 * Called after successfully sending sender key distribution messages.
	 * If rotateKey was true, starts with empty map (rotation complete).
	 */
	async markStatusHasSenderKey(jids: string[]): Promise<void> {
		if (jids.length === 0) {
			return
		}

		await this.mutex.mutex(async () => {
			const current = await this.getStatusSenderKeyMap()

			// If rotating, start fresh; otherwise preserve existing entries
			const newSenderKey: Record<string, boolean> = current.rotateKey ? {} : { ...current.senderKey }
			for (const jid of jids) {
				newSenderKey[jid] = true
			}

			await this.setStatusSenderKeyData({ rotateKey: false, senderKey: newSenderKey })

			this.logger?.trace(
				{ jids: jids.length, wasRotating: current.rotateKey },
				'marked devices as having status sender key'
			)
		})
	}

	/** Store status sender key data */
	private async setStatusSenderKeyData(data: StatusSenderKeyData): Promise<void> {
		await this.keys.set({
			'status-sender-key': { [STORIES_JID]: data }
		})
	}

	/**
	 * Mark that key rotation is needed if any of the provided JIDs have the sender key.
	 * Called when contacts are removed from status privacy list.
	 * Only triggers rotation if removed JIDs actually had the sender key.
	 */
	async markStatusSenderKeyRotate(jids: string[]): Promise<void> {
		if (jids.length === 0) {
			return
		}

		await this.mutex.mutex(async () => {
			const current = await this.getStatusSenderKeyMap()
			if (current.rotateKey) {
				return // Already rotating
			}

			const needsRotation = jids.some(jid => current.senderKey[jid])
			if (needsRotation) {
				await this.setStatusSenderKeyData({ rotateKey: true, senderKey: {} })
				this.logger?.debug({ removedJids: jids.length }, 'marked status sender key for rotation')
			}
		})
	}

	/**
	 * Forget that specific devices have the sender key.
	 * Called on sender key distribution failures.
	 * Removes JIDs from map while preserving rotateKey state.
	 */
	async markForgetStatusSenderKey(jids: string[]): Promise<void> {
		if (jids.length === 0) {
			return
		}

		await this.mutex.mutex(async () => {
			const current = await this.getStatusSenderKeyMap()
			for (const jid of jids) {
				delete current.senderKey[jid]
			}

			await this.setStatusSenderKeyData(current)
			this.logger?.trace({ jids: jids.length }, 'removed devices from status sender key map')
		})
	}

	/** Reset status sender key state, triggering fresh distribution on next status post */
	async resetStatusSenderKey(): Promise<void> {
		await this.mutex.mutex(async () => {
			await this.setStatusSenderKeyData({ rotateKey: false, senderKey: {} })
			this.logger?.debug('reset status sender key state')
		})
	}

	/**
	 * Separate devices into those needing sender key distribution vs those that already have it.
	 *
	 * @returns skDistribList (need key), participantList (have key), needsRotation flag
	 */
	async getStatusSkDistribList(deviceJids: string[]): Promise<{
		skDistribList: string[]
		participantList: string[]
		needsRotation: boolean
	}> {
		if (deviceJids.length === 0) {
			return { skDistribList: [], participantList: [], needsRotation: false }
		}

		return this.mutex.mutex(async () => {
			const { rotateKey, senderKey } = await this.getStatusSenderKeyMap()
			const senderKeyCount = Object.keys(senderKey).length

			// Case 1: Need rotation or no one has the key yet - distribute to all
			if (rotateKey || senderKeyCount === 0) {
				this.logger?.debug(
					{ total: deviceJids.length, needsRotation: rotateKey, senderKeyEmpty: senderKeyCount === 0 },
					'status sender key: distributing to all devices (rotation or empty)'
				)
				return { skDistribList: deviceJids, participantList: [], needsRotation: rotateKey }
			}

			// Partition devices by sender key status
			const skDistribList: string[] = []
			const participantList: string[] = []
			for (const jid of deviceJids) {
				if (senderKey[jid]) {
					participantList.push(jid)
				} else {
					skDistribList.push(jid)
				}
			}

			// Case 2: Fewer recipients have key than stored - recipients were removed, trigger rotation
			if (participantList.length < senderKeyCount) {
				await this.setStatusSenderKeyData({ rotateKey: true, senderKey: {} })
				this.logger?.debug(
					{
						total: deviceJids.length,
						storedKeyCount: senderKeyCount,
						currentWithKey: participantList.length,
						reason: 'recipients removed from status list'
					},
					'status sender key: auto-rotation triggered, distributing to all devices'
				)
				return { skDistribList: deviceJids, participantList: [], needsRotation: true }
			}

			// Case 3: Normal operation
			this.logger?.debug(
				{ total: deviceJids.length, needsKey: skDistribList.length, hasKey: participantList.length },
				'separated status devices by sender key status'
			)
			return { skDistribList, participantList, needsRotation: false }
		})
	}
}
