import { Boom } from '@hapi/boom'
import type { AuthenticationCreds, Contact, SignalKeyStore } from '../../Types'
import { addTransactionCapability, assertMeId, initAuthCreds } from '../../Utils/auth-utils'
import logger from '../../Utils/logger'

const credsWithMe = (me?: Partial<Contact>): AuthenticationCreds => ({
	...initAuthCreds(),
	me: me as Contact | undefined
})

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

const createMemoryStore = () =>
	({
		get: async () => ({}),
		set: async () => {}
	}) as unknown as SignalKeyStore

describe('addTransactionCapability disposeTransactionStorage', () => {
	it('exposes a dispose method that leaves the store usable', async () => {
		const keys = addTransactionCapability(createMemoryStore(), logger, {
			maxCommitRetries: 3,
			delayBetweenTriesMs: 10
		})
		expect(typeof keys.disposeTransactionStorage).toBe('function')
		await keys.transaction(async () => {}, 'dispose-test')
		expect(() => keys.disposeTransactionStorage?.()).not.toThrow()
		// Disposing only releases the storage; a later transaction re-enables it
		await expect(keys.transaction(async () => 'ok', 'dispose-test-2')).resolves.toBe('ok')
	})
})
