import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { BufferJSON } from '../../Utils/generics'

/**
 * Sending into a group starts with distributing your own sender key. Nothing
 * covered that, and seeding an empty record before building one made it fail
 * with InvalidSenderKeySession, which would have left every group unusable for
 * sending.
 */
const logger = P({ level: 'silent' })

const makeParty = () => {
	const data: { [type: string]: { [id: string]: unknown } } = {}
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
		creds: initAuthCreds(),
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}

	return { auth, data, repository: makeLibSignalRepository(auth, logger) }
}

const groupJid = '120363000000000001@g.us'
const aliceJid = '5511900000001@s.whatsapp.net'
const bobJid = '5511900000002@s.whatsapp.net'

describe('group sender keys', () => {
	it('builds a distribution message on a store that has none', async () => {
		const alice = makeParty()

		const skdm = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })

		expect(skdm.length).toBeGreaterThan(0)
		expect(await alice.repository.hasSenderKey({ group: groupJid, meId: aliceJid })).toBe(true)
	})

	it('returns the same sender key on a second call', async () => {
		const alice = makeParty()

		const first = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })
		const second = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })

		// A fresh key each time would strand every peer that adopted the first.
		expect(Buffer.from(second).toString('base64')).toBe(Buffer.from(first).toString('base64'))
	})

	it('carries a message from the distributor to a peer', async () => {
		const alice = makeParty()
		const bob = makeParty()

		const skdm = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })
		await bob.repository.processSenderKeyDistributionMessage({
			authorJid: aliceJid,
			item: { groupId: groupJid, axolotlSenderKeyDistributionMessage: skdm } as never
		})

		const sent = await alice.repository.encryptGroupMessage({
			group: groupJid,
			meId: aliceJid,
			data: Buffer.from('hello group')
		})
		const received = await bob.repository.decryptGroupMessage({
			group: groupJid,
			authorJid: aliceJid,
			msg: sent.ciphertext
		})

		expect(Buffer.from(received).toString()).toBe('hello group')
	})

	it('reads a stored key whose buffers came back as base64 text', async () => {
		const alice = makeParty()
		const bob = makeParty()

		const skdm = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })
		await bob.repository.processSenderKeyDistributionMessage({
			authorJid: aliceJid,
			item: { groupId: groupJid, axolotlSenderKeyDistributionMessage: skdm } as never
		})

		// A store that round-trips its rows through BufferJSON writes every
		// buffer as { type: 'Buffer', data: '<base64>' } instead of a byte
		// array. Both shapes reach us, and reading one of them as absent would
		// leave the record with empty keys and fail far from here.
		const [key] = Object.keys(bob.data['sender-key']!)
		const states = JSON.parse(Buffer.from(bob.data['sender-key']![key!] as Uint8Array).toString())
		const rewritten = JSON.stringify(states, BufferJSON.replacer)
		bob.data['sender-key']![key!] = Buffer.from(rewritten)

		// The replacer also rewrites a { type: 'Buffer', data: [...] } object,
		// which is what JSON.parse leaves behind, so pin the shape rather than
		// trusting that it produced one.
		expect(JSON.parse(rewritten)[0].senderChainKey.seed).toEqual({
			type: 'Buffer',
			data: expect.any(String)
		})

		const sent = await alice.repository.encryptGroupMessage({
			group: groupJid,
			meId: aliceJid,
			data: Buffer.from('hello group')
		})
		const received = await bob.repository.decryptGroupMessage({
			group: groupJid,
			authorJid: aliceJid,
			msg: sent.ciphertext
		})

		expect(Buffer.from(received).toString()).toBe('hello group')
	})

	it('stores rotated states oldest first, the order the JS backend reads', async () => {
		const bob = makeParty()
		const statesOf = () => {
			const [key] = Object.keys(bob.data['sender-key']!)
			return JSON.parse(Buffer.from(bob.data['sender-key']![key!] as Uint8Array).toString()) as {
				senderKeyId: number
			}[]
		}

		const distribute = async () => {
			const sender = makeParty()
			const skdm = await sender.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })
			await bob.repository.processSenderKeyDistributionMessage({
				authorJid: aliceJid,
				item: { groupId: groupJid, axolotlSenderKeyDistributionMessage: skdm } as never
			})
		}

		const seen: number[] = []
		for (let round = 0; round < 3; round++) {
			await distribute()
			// Reading after each round also exercises the import: from the second
			// one on, the bridge parses the row it wrote and has to recover the
			// same order it will write back.
			seen.push(statesOf().at(-1)!.senderKeyId)
		}

		// The JS backend takes the LAST entry as the current state and drops the
		// FIRST one on overflow. The core keeps the newest in front, so writing
		// its order out unchanged would make a rollback pick the stale key and
		// evict the freshest one.
		expect(statesOf().map(state => state.senderKeyId)).toEqual(seen)
	})

	it('lets two members each distribute and send', async () => {
		const alice = makeParty()
		const bob = makeParty()

		for (const [from, jid, other] of [
			[alice, aliceJid, bob],
			[bob, bobJid, alice]
		] as const) {
			const skdm = await from.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: jid })
			await other.repository.processSenderKeyDistributionMessage({
				authorJid: jid,
				item: { groupId: groupJid, axolotlSenderKeyDistributionMessage: skdm } as never
			})

			const sent = await from.repository.encryptGroupMessage({
				group: groupJid,
				meId: jid,
				data: Buffer.from(`from ${jid}`)
			})
			const received = await other.repository.decryptGroupMessage({
				group: groupJid,
				authorJid: jid,
				msg: sent.ciphertext
			})
			expect(Buffer.from(received).toString()).toBe(`from ${jid}`)
		}
	})
})
