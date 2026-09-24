/**
 * Cross-store isolation of the shared AsyncLocalStorage.
 *
 * The transaction context storage is a single process-wide AsyncLocalStorage
 * (the heap-leak fix — a per-socket instance leaks under Node's legacy
 * async-context propagation). Because the instance is shared, its value is
 * keyed by a per-store token so a wrapped store only ever resolves its own
 * context, even when a second wrapped store runs inside the first store's
 * transaction callback.
 *
 * Regression guard for: store B running inside store A's transaction seeing
 * A's ambient context and committing B's writes into A's backing store.
 */
import type { SignalDataSet, SignalKeyStore } from '../../Types'
import { addTransactionCapability } from '../../Utils/auth-utils'
import type { ILogger } from '../../Utils/logger'

const silentLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => silentLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

const makeInMemoryStore = (): SignalKeyStore => {
	const data: Record<string, Record<string, unknown>> = {}
	return {
		async get(type, ids) {
			const bucket = data[type] ?? {}
			const out: Record<string, any> = {}
			for (const id of ids) {
				if (id in bucket) out[id] = bucket[id]
			}

			return out
		},
		async set(d: SignalDataSet) {
			for (const type in d) {
				data[type] = data[type] ?? {}
				const bucket = data[type]
				const incoming = (d as any)[type] as Record<string, unknown>
				for (const id in incoming) {
					const v = incoming[id]
					if (v === null) delete bucket[id]
					else bucket[id] = v
				}
			}
		}
	}
}

const opts = { maxCommitRetries: 1, delayBetweenTriesMs: 1 }

describe('addTransactionCapability — cross-store isolation', () => {
	it('does not leak a transaction context into another store in the same async chain', async () => {
		const backingA = makeInMemoryStore()
		const backingB = makeInMemoryStore()
		const a = addTransactionCapability(backingA, silentLogger(), opts)
		const b = addTransactionCapability(backingB, silentLogger(), opts)

		await a.transaction(async () => {
			// b is untouched by a's ambient context
			expect(b.isInTransaction()).toBe(false)
			await b.set({ 'app-state-sync-key': { '1': { keyId: 9 } } } as never)
			await a.set({ 'app-state-sync-key': { '1': { keyId: 1 } } } as never)
		}, 'app-state-sync-key')

		// b's write went straight to its own backing store, not into a's mutations
		expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 9 })
		expect((await backingA.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 1 })
	})

	it('keeps nested transactions across stores isolated by token', async () => {
		const backingA = makeInMemoryStore()
		const backingB = makeInMemoryStore()
		const a = addTransactionCapability(backingA, silentLogger(), opts)
		const b = addTransactionCapability(backingB, silentLogger(), opts)

		await a.transaction(async () => {
			await a.set({ 'app-state-sync-key': { '1': { keyId: 1 } } } as never)
			await b.transaction(async () => {
				expect(a.isInTransaction()).toBe(true)
				expect(b.isInTransaction()).toBe(true)
				await b.set({ 'app-state-sync-key': { '1': { keyId: 2 } } } as never)
			}, 'app-state-sync-key')
		}, 'app-state-sync-key')

		expect((await backingA.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 1 })
		expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 2 })
	})
})
