import { jest } from '@jest/globals'
import { randomBytes } from 'crypto'
import { proto } from '../../../WAProto/index.js'
import type { LTHashState, WAPatchName } from '../../Types'
import {
	decodeSyncdMutations,
	decodeSyncdSnapshot,
	encodeSyncdPatch,
	newLTHashState
} from '../../Utils/chat-utils'

/**
 * Resilience tests for app-state-sync decode paths.
 *
 * Covers:
 *  - decodeSyncdMutations skips undecryptable records instead of aborting
 *    (key-not-found, HMAC mismatch, AES decrypt failure).
 *  - decodeSyncdSnapshot soft-fails the aggregate LTHash MAC verify when
 *    records were skipped, rather than throwing and losing the whole snapshot.
 */

const NAME: WAPatchName = 'regular'
const MY_KEY_ID = Buffer.from(randomBytes(16)).toString('base64')

// 32-byte app-state-sync key — fed to expandAppStateKeys via mutationKeys().
const APP_STATE_KEY: proto.Message.IAppStateSyncKeyData = {
	keyData: randomBytes(32),
	fingerprint: { rawId: 1, currentIndex: 0, deviceIndexes: [0] },
	timestamp: Date.now()
}

const getAppStateSyncKey = async (keyId: string) => {
	if (keyId === MY_KEY_ID) return APP_STATE_KEY
	return null
}

/** Produce one valid encoded record by round-tripping through encodeSyncdPatch. */
const encodeValidRecord = async (state: LTHashState) => {
	const { patch, state: newState } = await encodeSyncdPatch(
		{
			type: NAME,
			index: ['conversation', `jid-${Math.random()}`, 'archive'],
			syncAction: { archiveChatAction: { archived: true } },
			apiVersion: 0,
			operation: proto.SyncdMutation.SyncdOperation.SET
		},
		MY_KEY_ID,
		state,
		getAppStateSyncKey
	)
	const firstMutation = patch.mutations![0]!
	return { record: firstMutation.record!, newState, patch }
}

/** Build a collector for the onMutation callback so tests can assert on processed records. */
const collector = () => {
	const seen: unknown[] = []
	const onMutation = (m: { syncAction: unknown; index: unknown }) => {
		seen.push(m.index)
	}
	return { seen, onMutation }
}

describe('decodeSyncdMutations resilience', () => {
	it('skips a record whose key is not found (no throw)', async () => {
		const initial = newLTHashState()
		const { record } = await encodeValidRecord(initial)

		// Swap the keyId to one the getAppStateSyncKey function will reject.
		const orphan: proto.ISyncdRecord = {
			...record,
			keyId: { id: Buffer.from('unknown-key-id') }
		}
		const { seen, onMutation } = collector()

		const result = await decodeSyncdMutations([orphan], initial, getAppStateSyncKey, onMutation, true)

		expect(result).toBeDefined()
		expect(seen.length).toBe(0)
	})

	it('skips a record whose content HMAC does not verify (no throw)', async () => {
		const initial = newLTHashState()
		const { record } = await encodeValidRecord(initial)

		// Flip the trailing HMAC so Buffer.compare(contentHmac, ogValueMac) !== 0.
		const blob = Buffer.from(record.value!.blob!)
		blob[blob.length - 1] = (blob[blob.length - 1]! ^ 0xff) & 0xff
		const tampered: proto.ISyncdRecord = {
			...record,
			value: { blob }
		}
		const { seen, onMutation } = collector()

		const result = await decodeSyncdMutations([tampered], initial, getAppStateSyncKey, onMutation, true)

		expect(result).toBeDefined()
		expect(seen.length).toBe(0)
	})

	it('skips a record whose AES decrypt fails (no throw)', async () => {
		// Hand-craft a record whose HMAC verifies (validateMacs=false path) but
		// whose ciphertext is garbage. We pass validateMacs=false so the HMAC
		// short-circuit doesn't fire first.
		const initial = newLTHashState()
		const keyId = Buffer.from(MY_KEY_ID, 'base64')
		// Provide a non-AES-block-aligned ciphertext so Decipheriv.final() throws "bad decrypt".
		const encContent = randomBytes(17)
		const fakeValueMac = randomBytes(32)
		const record: proto.ISyncdRecord = {
			keyId: { id: keyId },
			value: { blob: Buffer.concat([encContent, fakeValueMac]) },
			index: { blob: randomBytes(32) }
		}
		const { seen, onMutation } = collector()

		const result = await decodeSyncdMutations([record], initial, getAppStateSyncKey, onMutation, false)

		expect(result).toBeDefined()
		expect(seen.length).toBe(0)
	})

	it('processes good records alongside a bad one in the same batch', async () => {
		const initial = newLTHashState()
		const { record: good1, newState: s1 } = await encodeValidRecord(initial)
		const { record: good2 } = await encodeValidRecord(s1)

		const bad: proto.ISyncdRecord = {
			...good1,
			keyId: { id: Buffer.from('unknown-key-id') }
		}
		const { seen, onMutation } = collector()

		const result = await decodeSyncdMutations(
			[good1, bad, good2],
			initial,
			getAppStateSyncKey,
			onMutation,
			true
		)

		expect(result).toBeDefined()
		// Both valid records should have been emitted via onMutation.
		expect(seen.length).toBe(2)
	})
})

describe('decodeSyncdSnapshot resilience', () => {
	it('warns and returns partial state when aggregate LTHash MAC verify fails', async () => {
		// Encode a valid record so we have a realistic snapshot shape, then
		// deliberately corrupt snapshot.mac so the aggregate LTHash verify fails.
		// Without the softening, this throws `failed to verify LTHash ... from snapshot`
		// and the whole syncd-state decode aborts (the primary user-visible symptom).
		const initial = newLTHashState()
		const { record, patch } = await encodeValidRecord(initial)

		const corruptedMac = Buffer.from(patch.snapshotMac!)
		corruptedMac[0] = (corruptedMac[0]! ^ 0xff) & 0xff

		const keyIdBytes = Buffer.from(MY_KEY_ID, 'base64')
		const snapshot: proto.ISyncdSnapshot = {
			version: { version: 1 },
			mac: corruptedMac,
			keyId: { id: keyIdBytes },
			records: [record]
		}

		const warn = jest.fn()
		const logger = { warn, debug: jest.fn(), trace: jest.fn(), info: jest.fn(), error: jest.fn() }

		const { state, mutationMap } = await decodeSyncdSnapshot(
			NAME,
			snapshot,
			getAppStateSyncKey,
			undefined,
			true,
			logger as unknown as Parameters<typeof decodeSyncdSnapshot>[5]
		)

		expect(state).toBeDefined()
		expect(warn).toHaveBeenCalledTimes(1)
		const call = warn.mock.calls[0] as [Record<string, unknown>, string]
		expect(call[0]).toMatchObject({ name: NAME })
		expect(call[1]).toMatch(/LTHash verification failed/)
		// The valid record should still have been processed into the mutation map.
		expect(Object.keys(mutationMap).length).toBe(1)
	})
})
