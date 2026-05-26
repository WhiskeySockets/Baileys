/**
 * M11 — identity-change-handler debounce TTL doesn't outlive a long
 * `assertSessions`, letting a second identity change for the same jid race
 * against the in-flight refresh. Stage 3 (upstream #2573) added an
 * `inFlightRefreshes` Set so subsequent invocations are skipped while a
 * refresh is still running.
 *
 * InfiniteAPI hybrid: we keep the existing 5s debounce as a FAST-PATH layer
 * (catches rapid successive notifications cheaply via cache lookup), then
 * fall through to the in-flight Set when the debounce TTL has expired but
 * a previous refresh is still running. Both layers must exit cleanly.
 */
import NodeCache from '@cacheable/node-cache'
import P from 'pino'
import { handleIdentityChange } from '../../Utils/identity-change-handler'
import type { BinaryNode } from '../../WABinary/types'

const buildIdentityNotification = (from: string): BinaryNode => ({
	tag: 'notification',
	attrs: { from },
	content: [
		{
			tag: 'identity',
			attrs: {},
			content: Buffer.from('test-identity-key')
		}
	]
})

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

const silent = P({ level: 'silent' })

describe('handleIdentityChange — in-flight refresh tracking (M11)', () => {
	it('a second identity change for the same jid is skipped while a previous refresh is still running', async () => {
		// Short debounce TTL on purpose — the in-flight guard must catch the
		// second invocation even after the debounce has expired. Window
		// widened (50ms / 300ms / 120ms gap) for stability under full-suite
		// scheduling pressure.
		const debounceCache = new NodeCache<boolean>({ stdTTL: 0.05, useClones: false })
		const inFlightRefreshes = new Set<string>()
		let assertCalls = 0
		const assertSessions = async () => {
			assertCalls++
			await delay(300) // longer than the debounce TTL on purpose
			return true
		}

		const ctx = {
			meId: 'me@s.whatsapp.net',
			meLid: undefined,
			validateSession: async () => ({ exists: true }),
			assertSessions,
			debounceCache,
			inFlightRefreshes,
			logger: silent
		}

		const jid = 'peer@s.whatsapp.net'
		const node = buildIdentityNotification(jid)

		const first = handleIdentityChange(node, ctx)
		// Wait long enough for the debounce TTL to expire but well within the
		// in-flight assertSessions promise. The second invocation should now hit
		// the in-flight guard.
		await delay(120)
		const second = await handleIdentityChange(node, ctx)

		expect(second).toEqual({ action: 'skipped_in_flight' })

		const firstResult = await first
		// InfiniteAPI variant: result includes `hadExistingSession` flag.
		expect(firstResult).toEqual({ action: 'session_refreshed', hadExistingSession: true })
		expect(assertCalls).toBe(1)
	})

	it('different jids do not block each other (per-jid granularity)', async () => {
		const debounceCache = new NodeCache<boolean>({ stdTTL: 1, useClones: false })
		const inFlightRefreshes = new Set<string>()
		let activeRefreshes = 0
		let maxConcurrency = 0
		const assertSessions = async () => {
			activeRefreshes++
			if (activeRefreshes > maxConcurrency) maxConcurrency = activeRefreshes
			await delay(40)
			activeRefreshes--
			return true
		}

		const ctx = {
			meId: 'me@s.whatsapp.net',
			meLid: undefined,
			validateSession: async () => ({ exists: true }),
			assertSessions,
			debounceCache,
			inFlightRefreshes,
			logger: silent
		}

		const [a, b] = await Promise.all([
			handleIdentityChange(buildIdentityNotification('a@s.whatsapp.net'), ctx),
			handleIdentityChange(buildIdentityNotification('b@s.whatsapp.net'), ctx)
		])

		expect(a).toEqual({ action: 'session_refreshed', hadExistingSession: true })
		expect(b).toEqual({ action: 'session_refreshed', hadExistingSession: true })
		expect(maxConcurrency).toBeGreaterThanOrEqual(2)
	})

	it('releases the in-flight marker on assertSessions failure', async () => {
		const debounceCache = new NodeCache<boolean>({ stdTTL: 1, useClones: false })
		const inFlightRefreshes = new Set<string>()
		let attempt = 0
		const assertSessions = async () => {
			attempt++
			if (attempt === 1) throw new Error('first attempt fails')
			return true
		}

		const ctx = {
			meId: 'me@s.whatsapp.net',
			meLid: undefined,
			validateSession: async () => ({ exists: true }),
			assertSessions,
			debounceCache,
			inFlightRefreshes,
			logger: silent
		}

		const jid = 'peer@s.whatsapp.net'
		const node = buildIdentityNotification(jid)

		const first = await handleIdentityChange(node, ctx)
		expect(first.action).toBe('session_refresh_failed')

		// Marker must be cleared so a fresh refresh attempt can proceed.
		expect(inFlightRefreshes.has(jid)).toBe(false)
	})
})
