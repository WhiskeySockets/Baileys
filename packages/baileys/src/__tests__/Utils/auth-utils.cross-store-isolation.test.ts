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
import type { SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
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

type StoreBuckets = { [T in keyof SignalDataTypeMap]: { [id: string]: SignalDataTypeMap[T] } }

const emptyBuckets = (): StoreBuckets => ({
	'pre-key': {},
	session: {},
	'sender-key': {},
	'sender-key-memory': {},
	'app-state-sync-key': {},
	'app-state-sync-version': {},
	'lid-mapping': {},
	'device-list': {},
	tctoken: {},
	'identity-key': {}
})

const makeInMemoryStore = (): SignalKeyStore => {
	const data = emptyBuckets()

	const write = <T extends keyof SignalDataTypeMap>(type: T, incoming: SignalDataSet[T]) => {
		const bucket: { [id: string]: SignalDataTypeMap[T] } = data[type]
		for (const id in incoming) {
			const v = incoming[id]
			if (v === null || v === undefined) delete bucket[id]
			else bucket[id] = v
		}
	}

	return {
		async get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]) {
			const bucket: { [id: string]: SignalDataTypeMap[T] } = data[type]
			const out: { [id: string]: SignalDataTypeMap[T] } = {}
			for (const id of ids) {
				const v = bucket[id]
				if (v !== undefined) out[id] = v
			}

			return out
		},
		async set(d: SignalDataSet) {
			for (const type of Object.keys(d) as (keyof SignalDataTypeMap)[]) {
				write(type, d[type])
			}
		}
	}
}

const opts = { maxCommitRetries: 1, delayBetweenTriesMs: 1 }

type WrappedStore = ReturnType<typeof addTransactionCapability>
type EnterTransaction = (store: WrappedStore, work: () => Promise<void>) => Promise<void>

// Both entry points set up the shared context on their own, so each one is guarded
const viaTransaction: EnterTransaction = (store, work) => store.transaction(work, 'app-state-sync-key')
const viaTransactWith: EnterTransaction = (store, work) =>
	store.transactWith({ records: [{ type: 'app-state-sync-key', id: '1' }] }, work)

const entryPoints: [string, EnterTransaction][] = [
	['transaction', viaTransaction],
	['transactWith', viaTransactWith]
]

const nestedEntryPoints: [string, EnterTransaction, string, EnterTransaction][] = [
	['transaction', viaTransaction, 'transaction', viaTransaction],
	['transactWith', viaTransactWith, 'transactWith', viaTransactWith],
	['transaction', viaTransaction, 'transactWith', viaTransactWith],
	['transactWith', viaTransactWith, 'transaction', viaTransaction]
]

describe('addTransactionCapability — cross-store isolation', () => {
	it.each(entryPoints)(
		'%s does not leak a transaction context into another store in the same async chain',
		async (_name, enter) => {
			const backingA = makeInMemoryStore()
			const backingB = makeInMemoryStore()
			const a = addTransactionCapability(backingA, silentLogger(), opts)
			const b = addTransactionCapability(backingB, silentLogger(), opts)

			await enter(a, async () => {
				// b is untouched by a's ambient context
				expect(b.isInTransaction()).toBe(false)
				await b.set({ 'app-state-sync-key': { '1': { keyId: 9 } } } as never)
				await a.set({ 'app-state-sync-key': { '1': { keyId: 1 } } } as never)

				// b's write went straight to its own backing store, not into a's mutations
				expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 9 })
				// a's write is still buffered until its own transaction commits
				expect((await backingA.get('app-state-sync-key', ['1']))['1']).toBeUndefined()
			})

			expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 9 })
			expect((await backingA.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 1 })
		}
	)

	it.each(nestedEntryPoints)(
		'keeps %s on one store isolated from a nested %s on another',
		async (_outerName, enterOuter, _innerName, enterInner) => {
			const backingA = makeInMemoryStore()
			const backingB = makeInMemoryStore()
			const a = addTransactionCapability(backingA, silentLogger(), opts)
			const b = addTransactionCapability(backingB, silentLogger(), opts)

			await enterOuter(a, async () => {
				await a.set({ 'app-state-sync-key': { '1': { keyId: 1 } } } as never)
				await enterInner(b, async () => {
					expect(a.isInTransaction()).toBe(true)
					expect(b.isInTransaction()).toBe(true)
					await b.set({ 'app-state-sync-key': { '1': { keyId: 2 } } } as never)
				})

				// b committed on its own exit, a is still inside its transaction
				expect(b.isInTransaction()).toBe(false)
				expect(a.isInTransaction()).toBe(true)
				expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 2 })
				expect((await backingA.get('app-state-sync-key', ['1']))['1']).toBeUndefined()
			})

			expect((await backingA.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 1 })
			expect((await backingB.get('app-state-sync-key', ['1']))['1']).toMatchObject({ keyId: 2 })
		}
	)
})
