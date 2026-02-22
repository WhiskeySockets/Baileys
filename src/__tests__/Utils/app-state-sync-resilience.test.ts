import { Boom } from '@hapi/boom'
import type { LTHashState, WAPatchName } from '../../Types'
import { ensureLTHashStateVersion, newLTHashState } from '../../Utils/chat-utils'

const MAX_SYNC_ATTEMPTS = 2

type MockKeyStore = {
	store: Record<string, LTHashState | null>
	get: (type: string, ids: string[]) => Promise<Record<string, LTHashState | null>>
	set: (data: Record<string, Record<string, LTHashState | null | undefined>>) => Promise<void>
	transaction: <T>(fn: () => Promise<T>) => Promise<T>
}

function createMockKeyStore(initialState?: Record<string, LTHashState | null>): MockKeyStore {
	const store: Record<string, LTHashState | null> = { ...initialState }
	return {
		store,
		get: async (_type: string, ids: string[]) => {
			const result: Record<string, LTHashState | null> = {}
			for (const id of ids) {
				result[id] = store[id] ?? null
			}

			return result
		},
		set: async (data: Record<string, Record<string, LTHashState | null | undefined>>) => {
			for (const _type in data) {
				for (const key in data[_type]) {
					store[key] = data[_type][key] ?? null
				}
			}
		},
		transaction: async <T>(fn: () => Promise<T>) => fn()
	}
}

function makeValidState(version: number): LTHashState {
	return {
		version,
		hash: Buffer.alloc(128),
		indexValueMap: {
			someIndex: { valueMac: Buffer.from([1, 2, 3, 4]) }
		}
	}
}

type SyncRequest = {
	name: WAPatchName
	version: string
	return_snapshot: string
}

async function simulateResyncBehavior(
	collections: WAPatchName[],
	keyStore: MockKeyStore,
	decodeFn: (
		name: WAPatchName,
		state: LTHashState,
		forceSnapshot: boolean
	) => Promise<{ newState: LTHashState; hasMore: boolean }>
): Promise<{ requests: SyncRequest[]; attempts: Record<string, number> }> {
	const allRequests: SyncRequest[] = []
	const attemptsMap: Record<string, number | undefined> = {}
	const forceSnapshotCollections = new Set<WAPatchName>()

	const collectionsToHandle = new Set<string>(collections)

	while (collectionsToHandle.size) {
		const states = {} as Record<WAPatchName, LTHashState>
		const requests: SyncRequest[] = []

		for (const name of collectionsToHandle as Set<WAPatchName>) {
			const result = await keyStore.get('app-state-sync-version', [name])
			let state = result[name]

			if (state) {
				state = ensureLTHashStateVersion(state)
			} else {
				state = newLTHashState()
			}

			states[name] = state

			const shouldForceSnapshot = forceSnapshotCollections.has(name)
			if (shouldForceSnapshot) {
				forceSnapshotCollections.delete(name)
			}

			requests.push({
				name,
				version: state.version.toString(),
				return_snapshot: (shouldForceSnapshot || !state.version).toString()
			})
		}

		allRequests.push(...requests)

		for (const name of collectionsToHandle as Set<WAPatchName>) {
			try {
				const shouldForceSnapshot = requests.find(r => r.name === name)?.return_snapshot === 'true'
				const { newState, hasMore } = await decodeFn(name, states[name], shouldForceSnapshot)
				await keyStore.set({ 'app-state-sync-version': { [name]: newState } })
				if (!hasMore) {
					collectionsToHandle.delete(name)
				}
			} catch (_error: any) {
				attemptsMap[name] = (attemptsMap[name] || 0) + 1

				const statusCode = _error.output?.statusCode
				const isIrrecoverableError =
					(attemptsMap[name] ?? 0) >= MAX_SYNC_ATTEMPTS ||
					statusCode === 400 ||
					statusCode === 404 ||
					statusCode === 405 ||
					statusCode === 406 ||
					_error.name === 'TypeError'

				if (isIrrecoverableError) {
					collectionsToHandle.delete(name)
				} else {
					forceSnapshotCollections.add(name)
				}
			}
		}
	}

	return { requests: allRequests, attempts: attemptsMap as Record<string, number> }
}

describe('App State Sync Resilience', () => {
	it('should preserve state version on failure', async () => {
		const keyStore = createMockKeyStore({
			regular_low: makeValidState(42)
		})

		await simulateResyncBehavior(['regular_low'], keyStore, async () => {
			throw new Boom('tried remove, but no previous op')
		})

		const state = keyStore.store.regular_low
		expect(state).not.toBeNull()
		expect(state!.version).toBe(42)
	})

	it('should force snapshot on retry while keeping the version', async () => {
		const keyStore = createMockKeyStore({
			regular_low: makeValidState(42)
		})

		const { requests } = await simulateResyncBehavior(['regular_low'], keyStore, async () => {
			throw new Boom('tried remove, but no previous op')
		})

		expect(requests[0]).toEqual({
			name: 'regular_low',
			version: '42',
			return_snapshot: 'false'
		})

		expect(requests[1]).toEqual({
			name: 'regular_low',
			version: '42',
			return_snapshot: 'true'
		})
	})

	it('should enforce MAX_SYNC_ATTEMPTS = 2', async () => {
		let callCount = 0
		await simulateResyncBehavior(['regular_low'], createMockKeyStore({ regular_low: makeValidState(10) }), async () => {
			callCount++
			throw new Boom('test error')
		})

		expect(callCount).toBe(2)
	})

	it.each([400, 404, 405, 406])('should immediately stop on %d (WA Web fatal classification)', async statusCode => {
		let callCount = 0
		await simulateResyncBehavior(['regular_low'], createMockKeyStore({ regular_low: makeValidState(42) }), async () => {
			callCount++
			throw new Boom('fatal error', { statusCode })
		})

		expect(callCount).toBe(1)
	})

	it('should immediately stop on TypeError', async () => {
		let callCount = 0
		await simulateResyncBehavior(['regular_low'], createMockKeyStore({ regular_low: makeValidState(42) }), async () => {
			callCount++
			throw new TypeError("Cannot read properties of undefined (reading 'length')")
		})

		expect(callCount).toBe(1)
	})

	it('should handle multiple collections independently', async () => {
		const keyStore = createMockKeyStore({
			regular_low: makeValidState(42),
			regular: makeValidState(10)
		})

		const failCounts: Record<string, number> = { regular_low: 0, regular: 0 }
		const { requests } = await simulateResyncBehavior(['regular_low', 'regular'], keyStore, async name => {
			failCounts[name] = (failCounts[name] || 0) + 1
			if (name === 'regular_low') {
				throw new Boom('tried remove, but no previous op')
			}

			if ((failCounts[name] || 0) <= 1) {
				throw new Boom('temporary error')
			}

			return { newState: makeValidState(11), hasMore: false }
		})

		expect(failCounts.regular_low).toBe(2)
		expect(failCounts.regular).toBe(2)

		expect(keyStore.store.regular_low!.version).toBe(42)
		expect(keyStore.store.regular!.version).toBe(11)

		const regularRequests = requests.filter(r => r.name === 'regular')
		expect(regularRequests[0]!.return_snapshot).toBe('false')
		expect(regularRequests[1]!.return_snapshot).toBe('true')
	})

	it('should recover via snapshot after first failure', async () => {
		const keyStore = createMockKeyStore({
			regular_low: makeValidState(42)
		})

		let callCount = 0
		await simulateResyncBehavior(['regular_low'], keyStore, async (_name, _state, forceSnapshot) => {
			callCount++
			if (callCount === 1) {
				throw new Boom('tried remove, but no previous op')
			}

			expect(forceSnapshot).toBe(true)
			return { newState: makeValidState(50), hasMore: false }
		})

		expect(callCount).toBe(2)
		expect(keyStore.store.regular_low!.version).toBe(50)
	})

	it('should handle has_more_patches correctly', async () => {
		const keyStore = createMockKeyStore({
			regular_low: makeValidState(42)
		})

		let callCount = 0
		await simulateResyncBehavior(['regular_low'], keyStore, async () => {
			callCount++
			if (callCount === 1) {
				return { newState: makeValidState(45), hasMore: true }
			}

			if (callCount === 2) {
				return { newState: makeValidState(48), hasMore: false }
			}

			throw new Error('should not reach here')
		})

		expect(callCount).toBe(2)
		expect(keyStore.store.regular_low!.version).toBe(48)
	})

	it('should handle all 5 collections failing simultaneously', async () => {
		const allCollections: WAPatchName[] = [
			'critical_block',
			'critical_unblock_low',
			'regular_high',
			'regular_low',
			'regular'
		]
		const initialStates: Record<string, LTHashState> = {}
		for (const name of allCollections) {
			initialStates[name] = makeValidState(100)
		}

		const keyStore = createMockKeyStore(initialStates)

		const { requests } = await simulateResyncBehavior(allCollections, keyStore, async () => {
			throw new Boom('tried remove, but no previous op')
		})

		expect(requests).toHaveLength(10)

		for (const name of allCollections) {
			expect(keyStore.store[name]!.version).toBe(100)
		}

		for (const name of allCollections) {
			const collRequests = requests.filter(r => r.name === name)
			expect(collRequests).toHaveLength(2)
			expect(collRequests[0]!.return_snapshot).toBe('false')
			expect(collRequests[1]!.return_snapshot).toBe('true')
		}
	})
})
