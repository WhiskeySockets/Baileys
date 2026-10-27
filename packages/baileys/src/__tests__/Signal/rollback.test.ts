import { describe, expect, it } from '@jest/globals'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import P from 'pino'
import type { LegacySessionRecord } from '../../Signal/legacy-session'
import { isLegacySessionRecord } from '../../Signal/legacy-session'
import { fromTypedRecord, toTypedRecord } from '../../Signal/legacy-session-codec'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability } from '../../Utils/auth-utils'
import type { ILogger } from '../../Utils/logger'
import fixture from '../fixtures/legacy-session-rc9.json'

/**
 * Going back to a pre-WASM release. Sessions and group sender keys are both
 * written in the shape the JS backend reads, so a rollback is swapping the
 * package: there is no conversion step to get wrong, and no group key to
 * redistribute. These cases pin that, since nothing else would catch the day a
 * row starts being written in the native shape instead.
 */
const logger = P({ level: 'silent' })

const revive = (value: unknown): unknown => {
	if (typeof value === 'object' && value !== null && (value as { type?: string }).type === 'Buffer') {
		const { data } = value as { data: number[] | string }
		return typeof data === 'string' ? Buffer.from(data, 'base64') : Buffer.from(data)
	}

	if (Array.isArray(value)) return value.map(revive)
	if (ArrayBuffer.isView(value)) return value
	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, revive(v)]))
	}

	return value
}

const makeParty = (side: 'alice' | 'bob' = 'bob') => {
	const data = revive(fixture[side].store) as Record<string, Record<string, unknown>>
	const store: SignalKeyStore = {
		get: async (type, ids) => {
			const bucket = data[type] || {}
			const out: { [id: string]: SignalDataTypeMap[typeof type] } = {}
			for (const id of ids) {
				if (bucket[id] !== undefined && bucket[id] !== null) out[id] = bucket[id] as never
			}

			return out
		},
		set: async (update: SignalDataSet) => {
			for (const type of Object.keys(update)) {
				data[type] ||= {}
				const bucket = update[type as keyof SignalDataSet]!
				for (const id of Object.keys(bucket)) {
					const value = (bucket as Record<string, unknown>)[id]
					if (value === null) delete data[type]![id]
					else data[type]![id] = value
				}
			}
		}
	}

	const auth: SignalAuthState = {
		creds: revive(fixture[side].creds) as never,
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}

	return { data, auth, creds: auth.creds, repository: makeLibSignalRepository(auth, logger) }
}

const { aliceJid, groupJid } = fixture.jids
const sessionAddr = '5511900000001.0'

const makeOldRepository = async (auth: SignalAuthState) => {
	const require = createRequire(import.meta.resolve('whatsapp-rust-bridge'))
	const oldModule = new URL('./Signal/libsignal.js', pathToFileURL(require.resolve('baileys')))
	const oldEngine = (await import(oldModule.href)) as {
		makeLibSignalRepository(
			auth: SignalAuthState,
			logger: ILogger
		): Pick<
			ReturnType<typeof makeLibSignalRepository>,
			'encryptGroupMessage' | 'decryptGroupMessage' | 'encryptMessage' | 'decryptMessage'
		>
	}
	return oldEngine.makeLibSignalRepository(auth, logger)
}

describe('rolling back to a pre-WASM release', () => {
	it('lets the old group engine consume skipped keys and continue after a rollback', async () => {
		const alice = makeParty('alice')
		const bob = makeParty()
		const oldAlice = await makeOldRepository(alice.auth)
		const oldBob = await makeOldRepository(bob.auth)
		try {
			const modernMessage = await alice.repository.encryptGroupMessage({
				group: groupJid,
				meId: aliceJid,
				data: Buffer.from('modern group message')
			})
			expect(
				Buffer.from(
					await bob.repository.decryptGroupMessage({
						group: groupJid,
						authorJid: aliceJid,
						msg: modernMessage.ciphertext
					})
				).toString()
			).toBe('modern group message')

			const skipped = fixture.pendingGroup[0]!
			expect(
				Buffer.from(
					await oldBob.decryptGroupMessage({
						group: groupJid,
						authorJid: aliceJid,
						msg: Buffer.from(skipped.ct, 'base64')
					})
				).toString()
			).toBe(skipped.pt)

			const oldMessage = await oldAlice.encryptGroupMessage({
				group: groupJid,
				meId: aliceJid,
				data: Buffer.from('old group message')
			})
			expect(
				Buffer.from(
					await bob.repository.decryptGroupMessage({
						group: groupJid,
						authorJid: aliceJid,
						msg: oldMessage.ciphertext
					})
				).toString()
			).toBe('old group message')
		} finally {
			alice.repository.close?.()
			bob.repository.close?.()
		}
	})

	it('continues both directions after the old JS engine reads an advanced legacy row', async () => {
		const alice = makeParty('alice')
		const bob = makeParty()
		try {
			for (const message of fixture.pending) {
				await bob.repository.decryptMessage({
					jid: aliceJid,
					type: message.type as 'msg' | 'pkmsg',
					ciphertext: Buffer.from(message.ct, 'base64')
				})
			}

			const beforeRollback = await bob.repository.encryptMessage({
				jid: aliceJid,
				data: Buffer.from('before rollback')
			})
			expect(
				Buffer.from(await alice.repository.decryptMessage({ jid: fixture.jids.bobJid, ...beforeRollback })).toString()
			).toBe('before rollback')

			const oldBob = await makeOldRepository(bob.auth)
			const next = await alice.repository.encryptMessage({
				jid: fixture.jids.bobJid,
				data: Buffer.from('after rollback')
			})
			expect(next.type).toBe('msg')
			expect(
				Buffer.from(
					await oldBob.decryptMessage({ jid: aliceJid, type: next.type, ciphertext: Buffer.from(next.ciphertext) })
				).toString()
			).toBe('after rollback')

			const reply = await oldBob.encryptMessage({ jid: aliceJid, data: Buffer.from('old engine reply') })
			expect(reply.type).toBe('msg')
			const readBack = await alice.repository.decryptMessage({
				jid: fixture.jids.bobJid,
				...reply
			})
			expect(Buffer.from(readBack).toString()).toBe('old engine reply')
		} finally {
			alice.repository.close?.()
			bob.repository.close?.()
		}
	})

	it('leaves a session it advanced in the shape the old build reads', async () => {
		const bob = makeParty()

		// Use the upgraded state the way a running client would.
		for (const message of fixture.pending) {
			await bob.repository.decryptMessage({
				jid: aliceJid,
				type: message.type as 'msg' | 'pkmsg',
				ciphertext: Buffer.from(message.ct, 'base64')
			})
		}

		await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('from-new-bob') })

		// No conversion step: the row is already what a pre-WASM release writes,
		// which is what makes going back a matter of swapping the package.
		const stored = bob.data.session![sessionAddr] as { _sessions?: Record<string, unknown> }
		expect(isLegacySessionRecord(stored)).toBe(true)
		expect(Object.keys(stored._sessions ?? {}).length).toBeGreaterThan(0)
		for (const entry of Object.values(stored._sessions ?? {})) {
			expect(entry).toHaveProperty('currentRatchet')
			expect(entry).toHaveProperty('indexInfo')
		}
	})

	it('keeps the stored record stable through the bridge round trip', async () => {
		const bob = makeParty()
		await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('one more') })

		const stored = bob.data.session![sessionAddr] as LegacySessionRecord
		// legacy JSON -> typed model -> legacy JSON must be stable, or the old
		// build would read back something we never meant to write.
		const again = fromTypedRecord(toTypedRecord(stored))

		expect(JSON.stringify(again)).toBe(JSON.stringify(stored))
	})

	it('leaves a group sender key in the shape the old build reads', async () => {
		const bob = makeParty()

		await bob.repository.decryptGroupMessage({
			group: groupJid,
			authorJid: aliceJid,
			msg: Buffer.from(fixture.pendingGroup[0]!.ct, 'base64')
		})

		const stored = bob.data['sender-key']?.[`${groupJid}::5511900000001::0`]
		expect(ArrayBuffer.isView(stored)).toBe(true)

		// The JS backend parses this row as JSON, so a rollback keeps the group
		// working instead of needing the sender keys redistributed.
		const states = JSON.parse(Buffer.from(stored as Uint8Array).toString())
		expect(Array.isArray(states)).toBe(true)
		expect(states.length).toBeGreaterThan(0)
		for (const state of states) {
			expect(state).toHaveProperty('senderKeyId')
			expect(state.senderChainKey).toHaveProperty('seed')
			expect(state.senderSigningKey).toHaveProperty('public')
		}
	})

	it('advances that row without leaving the legacy shape', async () => {
		const bob = makeParty()
		const first = bob.data['sender-key']?.[`${groupJid}::5511900000001::0`]

		await bob.repository.decryptGroupMessage({
			group: groupJid,
			authorJid: aliceJid,
			msg: Buffer.from(fixture.pendingGroup[0]!.ct, 'base64')
		})

		const after = bob.data['sender-key']?.[`${groupJid}::5511900000001::0`]
		expect(after).not.toEqual(first)
		expect(() => JSON.parse(Buffer.from(after as Uint8Array).toString())).not.toThrow()
	})
})
