import { Boom } from '@hapi/boom'
import type { AuthenticationCreds, Contact, SignalDataSet, SignalKeyStore } from '../../Types'
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

describe('addTransactionCapability', () => {
	it('serializes transactions that use different keys against the same store', async () => {
		const raw = makeInMemoryStore()
		await raw.set({ 'sender-key-memory': { group1: { deviceA: true } } })

		const state = addTransactionCapability(raw, makeTestLogger(), { maxCommitRetries: 1, delayBetweenTriesMs: 5 })

		// mirrors the real collision: an outgoing relayMessage() transaction (keyed by meId) racing
		// the own-identity PN->LID migration socket.ts fires on every connection open (keyed by
		// migrate-N-sessions-<lidUser>) - two different keys, same underlying sender-key-memory record.
		const aHasRead = deferred()
		const aMayWrite = deferred()
		const bDone = deferred<void>()

		const txA = state.transaction(async () => {
			const existing = await state.get('sender-key-memory', ['group1'])
			aHasRead.resolve()
			await aMayWrite.promise
			await state.set({ 'sender-key-memory': { group1: { ...existing.group1, deviceB: true } } })
		}, 'relayMessage-meId')

		await aHasRead.promise

		const txB = state
			.transaction(async () => {
				const existing = await state.get('sender-key-memory', ['group1'])
				await state.set({ 'sender-key-memory': { group1: { ...existing.group1, deviceC: true } } })
			}, 'migrate-1-sessions-lidUser')
			.then(() => bDone.resolve())

		// give txB a real chance to run to completion here - it only can if it's NOT
		// blocked behind txA's still-open transaction, which is exactly the bug.
		await Promise.race([bDone.promise, new Promise(r => setTimeout(r, 30))])

		aMayWrite.resolve()
		await Promise.all([txA, txB])

		const final = await raw.get('sender-key-memory', ['group1'])
		expect(final.group1).toEqual({ deviceA: true, deviceB: true, deviceC: true })
	})
})
