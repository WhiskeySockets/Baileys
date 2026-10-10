/**
 * Reproduction for the per-socket AsyncLocalStorage heap leak.
 *
 * `addTransactionCapability` runs once per socket. When it created its own
 * AsyncLocalStorage, every socket added one more live instance for the life of
 * the process, and under Node's legacy async-context propagation every live
 * instance tags every pending async resource. Long-running servers that open
 * and close many sockets grew the heap without bound.
 *
 * The guard: however many stores are wrapped, every transaction runs on the
 * same AsyncLocalStorage instance.
 */
import { jest } from '@jest/globals'
import { AsyncLocalStorage } from 'async_hooks'
import type { SignalKeyStore } from '../../Types'
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

const makeNoopStore = (): SignalKeyStore => ({
	async get() {
		return {}
	},
	async set() {}
})

const opts = { maxCommitRetries: 1, delayBetweenTriesMs: 1 }

describe('addTransactionCapability — shared AsyncLocalStorage', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('does not allocate a new AsyncLocalStorage per wrapped store', async () => {
		const instances = new Set<AsyncLocalStorage<unknown>>()
		const originalRun = AsyncLocalStorage.prototype.run
		jest.spyOn(AsyncLocalStorage.prototype, 'run').mockImplementation(function (
			this: AsyncLocalStorage<unknown>,
			...args: Parameters<typeof originalRun>
		) {
			instances.add(this)
			return originalRun.apply(this, args)
		})

		const socketCount = 50
		for (let i = 0; i < socketCount; i++) {
			const keys = addTransactionCapability(makeNoopStore(), silentLogger(), opts)
			await keys.transaction(async () => {}, 'key')
			await keys.transactWith({ records: [{ type: 'session', id: `jid-${i}` }] }, async () => {})
		}

		expect(instances.size).toBe(1)
	})
})
