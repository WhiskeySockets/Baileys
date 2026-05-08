import type { LTHashState } from '../../Types'
import { ensureLTHashStateVersion } from '../../Utils/chat-utils'

describe('ensureLTHashStateVersion', () => {
	const makeState = (version: any): LTHashState => ({
		version,
		hash: Buffer.alloc(128),
		indexValueMap: { someKey: { valueMac: Buffer.from([1, 2, 3]) } }
	})

	it('should return state unchanged for valid numeric version', () => {
		const state = makeState(5)
		const result = ensureLTHashStateVersion(state)
		expect(result).toBe(state)
		expect(result.version).toBe(5)
	})

	it('should fix undefined version to 0', () => {
		const state = makeState(undefined)
		const result = ensureLTHashStateVersion(state)
		expect(result.version).toBe(0)
	})

	it('should fix null version to 0', () => {
		const state = makeState(null)
		const result = ensureLTHashStateVersion(state)
		expect(result.version).toBe(0)
	})

	it('should fix NaN version to 0', () => {
		const state = makeState(NaN)
		const result = ensureLTHashStateVersion(state)
		expect(result.version).toBe(0)
	})

	it('should fix string version to 0', () => {
		const state = makeState('3' as any)
		const result = ensureLTHashStateVersion(state)
		expect(result.version).toBe(0)
	})

	it('should keep version 0 as-is', () => {
		const state = makeState(0)
		const result = ensureLTHashStateVersion(state)
		expect(result).toBe(state)
		expect(result.version).toBe(0)
	})

	it('should preserve other state fields', () => {
		const state = makeState(undefined)
		const originalHash = state.hash
		const originalMap = state.indexValueMap
		const result = ensureLTHashStateVersion(state)
		expect(result.hash).toBe(originalHash)
		expect(result.indexValueMap).toBe(originalMap)
	})

	it('should allow .toString() after fix without throwing', () => {
		const state = makeState(undefined)
		ensureLTHashStateVersion(state)
		expect(() => state.version.toString()).not.toThrow()
		expect(state.version.toString()).toBe('0')
	})
})
