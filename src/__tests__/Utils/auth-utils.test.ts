import { Boom } from '@hapi/boom'
// wrapped - single line exceeds prettier's 120-char printWidth
import type {
	AuthenticationCreds,
	Contact,
	SignalDataSet,
	SignalKeyStore,
	SignalKeyStoreWithTransaction
} from '../../Types'
import { addTransactionCapability, assertMeId, initAuthCreds } from '../../Utils/auth-utils'
import type { ILogger } from '../../Utils/logger'

const credsWithMe = (me?: Partial<Contact>): AuthenticationCreds => ({
	...initAuthCreds(),
	me: me as Contact | undefined
})

const makeTestLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => makeTestLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

const makeInMemoryStore = (): SignalKeyStore => {
	const db: { [type: string]: { [id: string]: unknown } } = {}
	return {
		get: async (type, ids) => {
			const table = db[type] || {}
			const result: { [id: string]: unknown } = {}
			for (const id of ids) {
				if (table[id] !== undefined) {
					result[id] = table[id]
				}
			}

			return result as never
		},
		set: async (data: SignalDataSet) => {
			for (const type of Object.keys(data)) {
				const entries = data[type as keyof SignalDataSet] as { [id: string]: unknown }
				const table = (db[type] = db[type] || {})
				for (const id of Object.keys(entries)) {
					if (entries[id] === null) {
						delete table[id]
					} else {
						table[id] = entries[id]
					}
				}
			}
		}
	}
}

const deferred = <T = void>() => {
	let resolve!: (value: T) => void
	const promise = new Promise<T>(r => (resolve = r))
	return { promise, resolve }
}

const flushMicrotasks = async (times = 50) => {
	for (let i = 0; i < times; i++) {
		await Promise.resolve()
	}
}

describe('assertMeId', () => {
	it('returns me.id when authenticated', () => {
		const creds = credsWithMe({ id: '5511999999999@s.whatsapp.net' })
		expect(assertMeId(creds)).toBe('5511999999999@s.whatsapp.net')
	})

	it('throws Boom 401 when creds.me is undefined', () => {
		const creds = credsWithMe(undefined)
		try {
			assertMeId(creds)
			throw new Error('expected throw')
		} catch (err) {
			expect(err).toBeInstanceOf(Boom)
			expect((err as Boom).output.statusCode).toBe(401)
			expect((err as Error).message).toMatch(/not authenticated/)
		}
	})

	it('throws Boom 401 when me has no id', () => {
		const creds = credsWithMe({})
		expect(() => assertMeId(creds)).toThrow(/not authenticated/)
	})

	it('throws Boom 401 when me.id is empty string', () => {
		const creds = credsWithMe({ id: '' })
		expect(() => assertMeId(creds)).toThrow(/not authenticated/)
	})
})

const runInterleavingScenario = async (
	raw: SignalKeyStore,
	stateA: SignalKeyStoreWithTransaction,
	stateB: SignalKeyStoreWithTransaction
) => {
	const aHasRead = deferred()
	const aMayWrite = deferred()
	let bSettled = false

	const txA = stateA.transaction(async () => {
		const existing = await stateA.get('sender-key-memory', ['group1'])
		aHasRead.resolve()
		await aMayWrite.promise
		await stateA.set({ 'sender-key-memory': { group1: { ...existing.group1, deviceB: true } } })
	}, 'relayMessage-meId')

	await aHasRead.promise

	const txB = stateB
		.transaction(async () => {
			const existing = await stateB.get('sender-key-memory', ['group1'])
			await stateB.set({ 'sender-key-memory': { group1: { ...existing.group1, deviceC: true } } })
		}, 'migrate-1-sessions-lidUser')
		.then(() => {
			bSettled = true
		})

	await flushMicrotasks()
	expect(bSettled).toBe(false)

	aMayWrite.resolve()
	await Promise.all([txA, txB])

	return raw.get('sender-key-memory', ['group1'])
}

describe('addTransactionCapability', () => {
	it('serializes transactions that use different keys against the same store', async () => {
		const raw = makeInMemoryStore()
		await raw.set({ 'sender-key-memory': { group1: { deviceA: true } } })

		const state = addTransactionCapability(raw, makeTestLogger(), { maxCommitRetries: 1, delayBetweenTriesMs: 5 })

		const final = await runInterleavingScenario(raw, state, state)
		expect(final.group1).toEqual({ deviceA: true, deviceB: true, deviceC: true })
	})

	it('serializes transactions from two separate wrappers over the same store', async () => {
		const raw = makeInMemoryStore()
		await raw.set({ 'sender-key-memory': { group1: { deviceA: true } } })

		const logger = makeTestLogger()
		const opts = { maxCommitRetries: 1, delayBetweenTriesMs: 5 }
		const stateA = addTransactionCapability(raw, logger, opts)
		const stateB = addTransactionCapability(raw, logger, opts)

		const final = await runInterleavingScenario(raw, stateA, stateB)
		expect(final.group1).toEqual({ deviceA: true, deviceB: true, deviceC: true })
	})
})
