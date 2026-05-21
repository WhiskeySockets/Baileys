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
	const emittedAll: Array<{ event: string; payload: unknown }> = []
	;(events as any).on('messages.upsert', (upsert: any) => emittedUpserts.push(upsert))

	// `processMessage` emits multiple event types depending on the message
	// shape (e.g. `chats.update` for the chat snapshot, plus per-content
	// events for protocol messages). The idempotency contract is that the
	// SECOND pass for the same (msgId, sender) MUST NOT fire any of them,
	// not just `messages.upsert`. Tracking the full emit count lets us
	// assert the absence of duplicate side effects regardless of which
	// branch the test fixture happens to exercise.
	const origEmit = (events as any).emit.bind(events)
	;(events as any).emit = (event: string, ...args: unknown[]) => {
		emittedAll.push({ event, payload: args[0] })
		return origEmit(event, ...args)
	}

	return {
		emittedUpserts,
		emittedAll,
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
		const { ctx, emittedAll } = makeContext(cache)

		const msg = realMessage('msg-1')

		await processMessage(msg, ctx as any)
		const emitsAfterFirst = emittedAll.length

		await processMessage(msg, ctx as any)

		// The guard set the cache entry on the first pass.
		const flag = await cache.get<boolean>('msg-1:sender@s.whatsapp.net')
		expect(flag).toBe(true)

		// Behavioral contract: a second pass for the same (msgId, sender)
		// MUST NOT trigger ANY new emissions on the event bus. The audit's
		// M8 finding was specifically about duplicate side effects
		// (doubled `messages.upsert`, doubled history appends, repeated
		// session migrations, clobbered tc-token state) — any of which
		// surface as additional events. Asserting only the cache flag
		// would pass even if the second pass fell through and re-emitted.
		expect(emittedAll.length).toBe(emitsAfterFirst)
	})

	it('different (msgId, sender) pairs are independent', async () => {
		const cache = new NodeCache<boolean>({ stdTTL: 600, useClones: false }) as unknown as CacheStore
		const { ctx, emittedAll } = makeContext(cache)

		await processMessage(realMessage('msg-1'), ctx as any)
		const afterFirst = emittedAll.length

		await processMessage(realMessage('msg-2'), ctx as any)

		expect(await cache.get<boolean>('msg-1:sender@s.whatsapp.net')).toBe(true)
		expect(await cache.get<boolean>('msg-2:sender@s.whatsapp.net')).toBe(true)

		// Different ids → each pass runs independently and produces its
		// own emissions. Pins the dependency on the (msgId, sender) key
		// in the guard, not on some coarser global flag.
		expect(emittedAll.length).toBeGreaterThan(afterFirst)
	})

	it('without the cache, no guard is applied (back-compat)', async () => {
		const { ctx } = makeContext(undefined)
		// Just verify the call doesn't throw with no cache supplied.
		await expect(processMessage(realMessage('msg-1'), ctx as any)).resolves.toBeUndefined()
	})

	it('rolls back the idempotency marker if processMessage throws so retries can re-enter', async () => {
		// CodeRabbit + cubic P1: the eager `set` in the M8 guard would
		// permanently mark a message as processed even if the body threw.
		// A retry / redelivery for the same id then silently fell into the
		// "already processed" branch and the message was lost. The fix
		// wraps the body in try/catch and `del`s the key on throw.
		const cache = new NodeCache<boolean>({ stdTTL: 600, useClones: false }) as unknown as CacheStore
		const { ctx } = makeContext(cache)

		// Make the body throw by handing it a getMessage that itself throws
		// during a path processMessage takes. Easiest: a poll-update path
		// requires getMessage; provide a malformed message with a poll
		// update so processMessage navigates into the failing branch.
		// Simpler: force a throw via a sentinel error in ev.emit.
		;(ctx.ev as any).emit = () => {
			throw new Error('synthetic post-set failure')
		}

		const msg = realMessage('rollback-target')
		await expect(processMessage(msg, ctx as any)).rejects.toThrow('synthetic post-set failure')

		// The marker MUST be gone — otherwise the redelivery path would skip.
		const flag = await cache.get<boolean>('rollback-target:sender@s.whatsapp.net')
		expect(flag).toBeUndefined()
	})
})
