import { jest } from '@jest/globals'
import { expandAppStateKeys } from 'whatsapp-rust-bridge'
import { proto } from '../../../WAProto/index.js'
import type { ChatModification, LTHashState } from '../../Types'
import { chatModificationToAppPatch, encodeSyncdPatch, newLTHashState } from '../../Utils/chat-utils'
import { hmacSign } from '../../Utils/crypto'
import { fixture, JID, ME, modification, syncResponse } from './app-state-fixtures'

const oldKeyId = Buffer.from('fictional-old-key').toString('base64')
const newKeyId = Buffer.from('fictional-new-key').toString('base64')
const oldKey = { keyData: Buffer.alloc(32, 11) }
const newKey = { keyData: Buffer.alloc(32, 12) }
const getKey = async (id: string) => (id === oldKeyId ? oldKey : newKey)

async function encode(
	mod: ChatModification,
	keyId: string,
	state: LTHashState,
	operation = proto.SyncdMutation.SyncdOperation.SET
) {
	const result = await encodeSyncdPatch({ ...chatModificationToAppPatch(mod, JID), operation }, keyId, state, getKey)
	result.patch.version = { version: result.state.version }
	return result
}

// Build a valid multi-mutation patch: both key generations occur in one server version.
function combine(current: proto.ISyncdPatch, retired: proto.ISyncdPatch, finalHash: Buffer): proto.ISyncdPatch {
	const version = Number(current.version!.version)
	const versionBytes = Buffer.alloc(8)
	versionBytes.writeUInt32BE(version, 4)
	const collection = Buffer.from('regular_low')
	const keys = expandAppStateKeys(newKey.keyData)
	const mutations = [...current.mutations!, ...retired.mutations!]
	const snapshotMac = hmacSign(Buffer.concat([finalHash, versionBytes, collection]), keys.snapshotMacKey, 'sha256')
	const valueMacs = mutations.map(mutation => mutation.record!.value!.blob!.subarray(-32))
	const patchMac = hmacSign(Buffer.concat([snapshotMac, ...valueMacs, versionBytes, collection]), keys.patchMacKey)
	return { ...current, mutations, snapshotMac, patchMac }
}

beforeEach(() => {
	jest.useFakeTimers()
	jest.setSystemTime(1700000100000)
})
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

describe('retired app-state records', () => {
	it.each([
		['read', true, false],
		['read', false, false],
		['archive', true, false],
		['archive', false, false],
		['read', true, true],
		['read', false, true],
		['archive', true, true],
		['archive', false, true]
	] as const)('a new %s=%s survives old-key retirement, same patch=%s', async (kind, value, samePatch) => {
		const f = fixture()
		try {
			await f.sock.authState.keys.set({
				'app-state-sync-key': { [oldKeyId]: oldKey, [newKeyId]: newKey }
			})
			const previous = await encode(modification(kind, !value), oldKeyId, newLTHashState())
			const current = await encode(modification(kind, value), newKeyId, previous.state)
			const retired = await encode(
				modification(kind, !value),
				oldKeyId,
				current.state,
				proto.SyncdMutation.SyncdOperation.REMOVE
			)
			const patches = samePatch
				? [previous.patch, combine(current.patch, retired.patch, retired.state.hash)]
				: [previous.patch, current.patch, retired.patch]
			f.syncReplies.push(syncResponse(patches))
			await f.sock.resyncAppState(['regular_low'], false)
			f.ev.flush()
			expect(f.batches).toEqual([
				{ 'chats.update': [{ id: JID, ...(kind === 'read' ? { unreadCount: value ? 0 : -1 } : { archived: value }) }] }
			])
			expect(f.observations).toEqual([
				expect.objectContaining({ source: 'sync', version: 1, macVerified: true }),
				expect.objectContaining({ source: 'sync', version: 2, macVerified: true })
			])
			expect(await f.version()).toBe(samePatch ? 2 : 3)
			expect(Object.keys((await f.state()).indexValueMap)).toHaveLength(1)
			expect((await f.state()).hash).toEqual(retired.state.hash)
		} finally {
			f.close()
		}
	})

	it('a standalone REMOVE updates the hash without replaying the retired action', async () => {
		const f = fixture()
		try {
			await f.sock.authState.keys.set({ 'app-state-sync-key': { [oldKeyId]: oldKey } })
			const previous = await encode(modification('archive', true), oldKeyId, newLTHashState())
			f.syncReplies.push(syncResponse([previous.patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			f.ev.flush()
			f.batches.length = 0
			f.observations.length = 0
			const retired = await encode(
				modification('archive', true),
				oldKeyId,
				previous.state,
				proto.SyncdMutation.SyncdOperation.REMOVE
			)
			f.syncReplies.push(syncResponse([retired.patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			f.ev.flush()
			expect(f.batches).toEqual([])
			expect(f.observations).toEqual([])
			expect(await f.version()).toBe(2)
			expect((await f.state()).indexValueMap).toEqual({})
			expect((await f.state()).hash).toEqual(Buffer.alloc(128))
		} finally {
			f.close()
		}
	})

	it('an own-device read-self receipt remains message evidence, without inventing full conversation state', async () => {
		const f = fixture()
		try {
			await f.receive('receipt', {
				tag: 'receipt',
				attrs: { from: ME.id, recipient: JID, id: 'fictional-incoming', type: 'read-self', t: '1700000050' }
			})
			expect(f.batches.flatMap(batch => batch['messages.update'] ?? [])).toEqual([
				{
					key: { remoteJid: JID, id: 'fictional-incoming', fromMe: false, participant: undefined },
					update: expect.objectContaining({ status: proto.WebMessageInfo.Status.READ })
				}
			])
			expect(f.raw).toEqual([])
			expect(f.observations).toEqual([])
		} finally {
			f.close()
		}
	})
})
