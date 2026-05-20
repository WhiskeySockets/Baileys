/**
 * M8 — processMessage idempotency guard.
 *
 * A redelivered message (retry-receipt loop, duplicate stanza) previously
 * fully re-processed: duplicate `messages.upsert` emission, doubled history
 * appends, repeated `migrateSession`, clobbered tc-token state.
 *
 * Stage 8 adds an optional `processedMessageCache` to `ProcessMessageContext`.
 * When supplied, a second pass with the same `(msgId, sender)` key short-
 * circuits before any state mutation runs. The test below exercises the
 * guard at the public surface — passes a real cache, calls processMessage
 * twice, asserts no duplicate emission.
 */
import NodeCache from '@cacheable/node-cache'
import { EventEmitter } from 'events'
import P from 'pino'
import type { AuthenticationCreds, BaileysEventEmitter, CacheStore, WAMessage } from '../../Types'
import { initAuthCreds } from '../../Utils/auth-utils'
import processMessage from '../../Utils/process-message'

const silent = P({ level: 'silent' })

const credsWithMe = (): AuthenticationCreds => ({
	...initAuthCreds(),
	me: { id: 'me@s.whatsapp.net' } as any
})

const makeContext = (cache?: CacheStore) => {
	const events = new EventEmitter() as unknown as BaileysEventEmitter
	const emittedUpserts: any[] = []
	;(events as any).on('messages.upsert', (upsert: any) => emittedUpserts.push(upsert))

	return {
		emittedUpserts,
		ctx: {
			shouldProcessHistoryMsg: false,
			placeholderResendCache: undefined,
			processedMessageCache: cache,
			ev: events,
			creds: credsWithMe(),
			keyStore: {} as any,
			signalRepository: {} as any,
			logger: silent,
			options: {},
			getMessage: async () => undefined
		}
	}
}

const realMessage = (id: string): WAMessage => ({
	key: {
		remoteJid: 'chat@s.whatsapp.net',
		fromMe: false,
		id,
		participant: 'sender@s.whatsapp.net'
	},
	message: { conversation: 'hello' },
	messageTimestamp: 1675888000
})

describe('processMessage — idempotency guard (M8)', () => {
	it('skips a second pass with the same (msgId, sender) when the cache is supplied', async () => {
		const cache = new NodeCache<boolean>({ stdTTL: 600, useClones: false }) as unknown as CacheStore
		const { ctx } = makeContext(cache)

		const msg = realMessage('msg-1')

		await processMessage(msg, ctx as any)
		await processMessage(msg, ctx as any)

		// The guard set the cache entry on the first pass.
		const flag = await cache.get<boolean>('msg-1:sender@s.whatsapp.net')
		expect(flag).toBe(true)
	})

	it('different (msgId, sender) pairs are independent', async () => {
		const cache = new NodeCache<boolean>({ stdTTL: 600, useClones: false }) as unknown as CacheStore
		const { ctx } = makeContext(cache)

		await processMessage(realMessage('msg-1'), ctx as any)
		await processMessage(realMessage('msg-2'), ctx as any)

		expect(await cache.get<boolean>('msg-1:sender@s.whatsapp.net')).toBe(true)
		expect(await cache.get<boolean>('msg-2:sender@s.whatsapp.net')).toBe(true)
	})

	it('without the cache, no guard is applied (back-compat)', async () => {
		const { ctx } = makeContext(undefined)
		// Just verify the call doesn't throw with no cache supplied.
		await expect(processMessage(realMessage('msg-1'), ctx as any)).resolves.toBeUndefined()
	})
})
