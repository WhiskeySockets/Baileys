import type { LTHashState } from '../../Types'
import { ensureLTHashStateVersion, newLTHashState } from '../../Utils/chat-utils'

describe('History sync resilience — app state version guard', () => {
	it('should not crash when version is undefined and .toString() is called', () => {
		const state: LTHashState = {
			version: undefined as any,
			hash: Buffer.alloc(128),
			indexValueMap: {}
		}

		ensureLTHashStateVersion(state)

		expect(() => state.version.toString()).not.toThrow()
		expect(state.version.toString()).toBe('0')
	})

	it('should handle the resyncAppState flow without crash', () => {
		const corruptedState: LTHashState = {
			version: null as any,
			hash: Buffer.alloc(128),
			indexValueMap: {}
		}

		const state = ensureLTHashStateVersion(corruptedState)

		const versionStr = state.version.toString()
		const returnSnapshot = (!state.version).toString()

		expect(versionStr).toBe('0')
		expect(returnSnapshot).toBe('true')
	})

	it('should handle the appPatch flow with corrupted currentSyncVersion', () => {
		const currentSyncVersion: LTHashState = {
			version: undefined as any,
			hash: Buffer.alloc(128),
			indexValueMap: { key1: { valueMac: Buffer.from([1]) } }
		}

		const initial = currentSyncVersion ? ensureLTHashStateVersion(currentSyncVersion) : newLTHashState()

		expect(initial.version).toBe(0)
		expect(initial.indexValueMap).toHaveProperty('key1')
	})

	it('should fall back to newLTHashState when no currentSyncVersion', () => {
		const currentSyncVersion: LTHashState | undefined = undefined

		const initial = currentSyncVersion ? ensureLTHashStateVersion(currentSyncVersion) : newLTHashState()

		expect(initial.version).toBe(0)
		expect(initial.hash.length).toBe(128)
		expect(Object.keys(initial.indexValueMap)).toHaveLength(0)
	})

	it('should not alter valid versions during sync', () => {
		const state: LTHashState = {
			version: 42,
			hash: Buffer.alloc(128),
			indexValueMap: {}
		}

		const result = ensureLTHashStateVersion(state)

		expect(result.version).toBe(42)
		expect(result.version.toString()).toBe('42')
		expect(result).toBe(state)
	})
})
