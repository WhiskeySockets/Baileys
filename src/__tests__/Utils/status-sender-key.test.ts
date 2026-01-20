import type { SignalKeyStore, StatusSenderKeyData } from '../../Types'
import { StatusSenderKeyManager } from '../../Utils/status-sender-key'

/**
 * Mock implementation of SignalKeyStore for testing
 */
function createMockKeyStore(): SignalKeyStore & { storage: Map<string, any> } {
	const storage = new Map<string, any>()

	return {
		storage,
		async get(type: string, ids: string[]): Promise<{ [id: string]: any }> {
			const result: { [id: string]: any } = {}
			for (const id of ids) {
				const key = `${type}:${id}`
				if (storage.has(key)) {
					result[id] = storage.get(key)
				}
			}

			return result
		},
		async set(data: { [type: string]: { [id: string]: any } }): Promise<void> {
			for (const [type, values] of Object.entries(data)) {
				for (const [id, value] of Object.entries(values)) {
					const key = `${type}:${id}`
					if (value === null) {
						storage.delete(key)
					} else {
						storage.set(key, value)
					}
				}
			}
		}
	}
}

describe('StatusSenderKeyManager', () => {
	let keyStore: SignalKeyStore & { storage: Map<string, any> }
	let manager: StatusSenderKeyManager

	beforeEach(() => {
		keyStore = createMockKeyStore()
		manager = new StatusSenderKeyManager(keyStore)
	})

	describe('getStatusSenderKeyMap', () => {
		it('should return default empty state when no data exists', async () => {
			const result = await manager.getStatusSenderKeyMap()
			expect(result).toEqual({ rotateKey: false, senderKey: {} })
		})

		it('should return stored state when data exists', async () => {
			const storedData: StatusSenderKeyData = {
				rotateKey: true,
				senderKey: { 'user1@s.whatsapp.net': true, 'user2@s.whatsapp.net': true }
			}
			keyStore.storage.set('status-sender-key:status@broadcast', storedData)

			const result = await manager.getStatusSenderKeyMap()
			expect(result).toEqual(storedData)
		})
	})

	describe('markStatusHasSenderKey', () => {
		it('should do nothing for empty jids array', async () => {
			await manager.markStatusHasSenderKey([])
			const result = await manager.getStatusSenderKeyMap()
			expect(result).toEqual({ rotateKey: false, senderKey: {} })
		})

		it('should mark jids as having sender key', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(false)
			expect(result.senderKey['user1@s.whatsapp.net']).toBe(true)
			expect(result.senderKey['user2@s.whatsapp.net']).toBe(true)
		})

		it('should add to existing sender key map', async () => {
			// First mark
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net'])
			// Second mark
			await manager.markStatusHasSenderKey(['user2@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.senderKey['user1@s.whatsapp.net']).toBe(true)
			expect(result.senderKey['user2@s.whatsapp.net']).toBe(true)
		})

		it('should reset rotateKey to false and clear map when rotating', async () => {
			// Set up rotation state
			keyStore.storage.set('status-sender-key:status@broadcast', {
				rotateKey: true,
				senderKey: { 'old-user@s.whatsapp.net': true }
			})

			// Mark new jids during rotation
			await manager.markStatusHasSenderKey(['new-user@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(false)
			// Old user should be gone (map cleared during rotation)
			expect(result.senderKey['old-user@s.whatsapp.net']).toBeUndefined()
			// New user should be present
			expect(result.senderKey['new-user@s.whatsapp.net']).toBe(true)
		})
	})

	describe('markStatusSenderKeyRotate', () => {
		it('should do nothing for empty jids array', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net'])
			await manager.markStatusSenderKeyRotate([])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(false)
		})

		it('should not trigger rotation if none of the jids have the key', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net'])
			await manager.markStatusSenderKeyRotate(['user2@s.whatsapp.net', 'user3@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(false)
			expect(result.senderKey['user1@s.whatsapp.net']).toBe(true)
		})

		it('should trigger rotation if any jid has the key', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])
			await manager.markStatusSenderKeyRotate(['user1@s.whatsapp.net', 'user3@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(true)
			// Map should be cleared
			expect(Object.keys(result.senderKey).length).toBe(0)
		})

		it('should not do anything if already rotating', async () => {
			// Set up rotation state
			keyStore.storage.set('status-sender-key:status@broadcast', {
				rotateKey: true,
				senderKey: {}
			})

			// Try to rotate again - should be no-op
			await manager.markStatusSenderKeyRotate(['user1@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(true)
		})
	})

	describe('markForgetStatusSenderKey', () => {
		it('should do nothing for empty jids array', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net'])
			await manager.markForgetStatusSenderKey([])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.senderKey['user1@s.whatsapp.net']).toBe(true)
		})

		it('should remove specified jids from sender key map', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net', 'user3@s.whatsapp.net'])
			await manager.markForgetStatusSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.senderKey['user1@s.whatsapp.net']).toBeUndefined()
			expect(result.senderKey['user2@s.whatsapp.net']).toBeUndefined()
			expect(result.senderKey['user3@s.whatsapp.net']).toBe(true)
		})

		it('should preserve rotateKey state', async () => {
			keyStore.storage.set('status-sender-key:status@broadcast', {
				rotateKey: true,
				senderKey: { 'user1@s.whatsapp.net': true }
			})

			await manager.markForgetStatusSenderKey(['user1@s.whatsapp.net'])

			const result = await manager.getStatusSenderKeyMap()
			expect(result.rotateKey).toBe(true)
		})
	})

	describe('resetStatusSenderKey', () => {
		it('should clear all state', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])
			await manager.resetStatusSenderKey()

			const result = await manager.getStatusSenderKeyMap()
			expect(result).toEqual({ rotateKey: false, senderKey: {} })
		})
	})

	describe('getStatusSkDistribList', () => {
		it('should return empty lists for empty device array', async () => {
			const result = await manager.getStatusSkDistribList([])
			expect(result).toEqual({
				skDistribList: [],
				participantList: [],
				needsRotation: false
			})
		})

		it('should return all devices in skDistribList when no sender keys exist', async () => {
			const devices = ['user1@s.whatsapp.net', 'user2@s.whatsapp.net']
			const result = await manager.getStatusSkDistribList(devices)

			expect(result.skDistribList).toEqual(devices)
			expect(result.participantList).toEqual([])
			expect(result.needsRotation).toBe(false)
		})

		it('should return all devices in skDistribList when rotation is needed', async () => {
			// Set rotation state
			keyStore.storage.set('status-sender-key:status@broadcast', {
				rotateKey: true,
				senderKey: { 'user1@s.whatsapp.net': true }
			})

			const devices = ['user1@s.whatsapp.net', 'user2@s.whatsapp.net']
			const result = await manager.getStatusSkDistribList(devices)

			expect(result.skDistribList).toEqual(devices)
			expect(result.participantList).toEqual([])
			expect(result.needsRotation).toBe(true)
		})

		it('should correctly separate devices with and without sender key', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])

			const devices = ['user1@s.whatsapp.net', 'user2@s.whatsapp.net', 'user3@s.whatsapp.net', 'user4@s.whatsapp.net']
			const result = await manager.getStatusSkDistribList(devices)

			expect(result.skDistribList).toEqual(['user3@s.whatsapp.net', 'user4@s.whatsapp.net'])
			expect(result.participantList).toEqual(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])
			expect(result.needsRotation).toBe(false)
		})

		it('should trigger auto-rotation when stored recipients are missing from current list', async () => {
			// Mark 3 users as having key
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net', 'user3@s.whatsapp.net'])

			// Now only pass 2 of them (user3 was removed from status privacy)
			const devices = ['user1@s.whatsapp.net', 'user2@s.whatsapp.net', 'user4@s.whatsapp.net']
			const result = await manager.getStatusSkDistribList(devices)

			// Should trigger rotation and return all devices in skDistribList
			expect(result.skDistribList).toEqual(devices)
			expect(result.participantList).toEqual([])
			expect(result.needsRotation).toBe(true)

			// Verify rotation state was persisted
			const state = await manager.getStatusSenderKeyMap()
			expect(state.rotateKey).toBe(true)
			expect(Object.keys(state.senderKey).length).toBe(0)
		})

		it('should not trigger rotation when all stored recipients are present (with new additions)', async () => {
			await manager.markStatusHasSenderKey(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])

			// Pass all stored users plus new ones
			const devices = ['user1@s.whatsapp.net', 'user2@s.whatsapp.net', 'user3@s.whatsapp.net']
			const result = await manager.getStatusSkDistribList(devices)

			expect(result.skDistribList).toEqual(['user3@s.whatsapp.net'])
			expect(result.participantList).toEqual(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])
			expect(result.needsRotation).toBe(false)
		})
	})

	describe('concurrency handling', () => {
		it('should handle concurrent markStatusHasSenderKey calls correctly', async () => {
			// Simulate concurrent calls
			await Promise.all([
				manager.markStatusHasSenderKey(['user1@s.whatsapp.net']),
				manager.markStatusHasSenderKey(['user2@s.whatsapp.net']),
				manager.markStatusHasSenderKey(['user3@s.whatsapp.net'])
			])

			const result = await manager.getStatusSenderKeyMap()
			// Due to mutex, all should be present
			expect(result.senderKey['user1@s.whatsapp.net']).toBe(true)
			expect(result.senderKey['user2@s.whatsapp.net']).toBe(true)
			expect(result.senderKey['user3@s.whatsapp.net']).toBe(true)
		})
	})
})
