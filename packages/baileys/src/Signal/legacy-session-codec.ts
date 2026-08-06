/**
 * Converts between the JS libsignal on-disk session JSON and the bridge's typed
 * `LegacySessionRecordV1` model.
 *
 * The bridge deliberately knows nothing about Baileys' storage shape: it speaks
 * the typed model, and the core owns the actual protocol translation (including
 * the HKDF split that a raw field-by-field copy gets wrong). This module is the
 * only place that understands the legacy JSON, and it goes BOTH ways —
 * `toTypedRecord` for reading an upgraded store, `fromTypedRecord` for handing a
 * session back in the shape the pre-WASM code can still read.
 */
import type {
	LegacySessionChainV1,
	LegacySessionMessageKeyV1,
	LegacySessionRecordV1,
	LegacySessionV1
} from 'whatsapp-rust-bridge'
import type { LegacySessionRecord } from './legacy-session'

/** libsignal chain roles, from `chain_type.js`. */
const CHAIN_ROLE = { SENDING: 1, RECEIVING: 2 } as const

type LegacyChainJson = {
	chainKey?: { counter?: number; key?: string }
	chainType?: number
	messageKeys?: { [index: string]: string }
}

type LegacyEntryJson = {
	registrationId?: number
	currentRatchet?: {
		ephemeralKeyPair?: { pubKey?: string; privKey?: string }
		lastRemoteEphemeralKey?: string
		previousCounter?: number
		rootKey?: string
	}
	indexInfo?: {
		baseKey?: string
		baseKeyType?: number
		closed?: number
		used?: number
		created?: number
		remoteIdentityKey?: string
	}
	_chains?: { [ratchetKey: string]: LegacyChainJson }
	pendingPreKey?: { preKeyId?: number; signedKeyId?: number; baseKey?: string }
}

const decode = (value: string | undefined, label: string): Uint8Array => {
	if (typeof value !== 'string') {
		throw new TypeError(`legacy session: ${label} must be base64 text`)
	}

	return new Uint8Array(Buffer.from(value, 'base64'))
}

const encode = (value: Uint8Array): string => Buffer.from(value).toString('base64')

const toTypedChain = (ratchetKey: string, chain: LegacyChainJson): LegacySessionChainV1 => {
	const messageKeys: LegacySessionMessageKeyV1[] = []
	for (const [index, seed] of Object.entries(chain.messageKeys || {})) {
		// The stored value is the message-key SEED; the core re-derives the
		// cipher/mac/iv split from it. Copying it in as a cipher key (and zeroing
		// the rest) produces a session that fails its MAC on first use.
		messageKeys.push({ index: Number(index), seed: decode(seed, `messageKeys[${index}]`) })
	}

	return {
		ratchetKey: decode(ratchetKey, 'chain ratchetKey'),
		role: chain.chainType ?? CHAIN_ROLE.RECEIVING,
		chainKey: {
			counter: chain.chainKey?.counter ?? 0,
			key: chain.chainKey?.key ? decode(chain.chainKey.key, 'chainKey.key') : undefined
		},
		messageKeys
	}
}

const toTypedSession = (entry: LegacyEntryJson, recordRegistrationId?: number): LegacySessionV1 => {
	const ratchet = entry.currentRatchet
	const index = entry.indexInfo
	const registrationId = typeof entry.registrationId === 'number' ? entry.registrationId : recordRegistrationId
	if (!ratchet || !index || typeof registrationId !== 'number') {
		throw new TypeError('legacy session: entry is missing registrationId/currentRatchet/indexInfo')
	}

	return {
		registrationId,
		ratchet: {
			keyPair: {
				public: decode(ratchet.ephemeralKeyPair?.pubKey, 'ephemeralKeyPair.pubKey'),
				private: decode(ratchet.ephemeralKeyPair?.privKey, 'ephemeralKeyPair.privKey')
			},
			lastRemoteEphemeralKey: decode(ratchet.lastRemoteEphemeralKey, 'lastRemoteEphemeralKey'),
			previousCounter: ratchet.previousCounter ?? 0,
			rootKey: decode(ratchet.rootKey, 'rootKey')
		},
		index: {
			baseKey: decode(index.baseKey, 'indexInfo.baseKey'),
			baseKeyRole: index.baseKeyType ?? 0,
			closedTimestamp: index.closed ?? -1,
			usedAtMs: index.used ?? 0,
			createdAtMs: index.created ?? 0,
			remoteIdentityKey: decode(index.remoteIdentityKey, 'indexInfo.remoteIdentityKey')
		},
		chains: Object.entries(entry._chains || {}).map(([ratchetKey, chain]) => toTypedChain(ratchetKey, chain)),
		pendingPreKey: entry.pendingPreKey
			? {
					preKeyId: entry.pendingPreKey.preKeyId,
					signedPreKeyId: entry.pendingPreKey.signedKeyId ?? 0,
					baseKey: decode(entry.pendingPreKey.baseKey, 'pendingPreKey.baseKey')
				}
			: undefined
	}
}

/** Legacy on-disk JSON → the bridge's typed model. */
export const toTypedRecord = (record: LegacySessionRecord): LegacySessionRecordV1 => {
	// A hole in the record is skipped rather than cast: converting undefined
	// would throw and take the whole record with it, losing the live sessions
	// alongside the broken entry.
	const sessions = Object.entries(record._sessions || {})
		.filter((pair): pair is [string, LegacyEntryJson] => pair[1] !== undefined && pair[1] !== null)
		.map(([indexKey, entry]) => ({
			indexKey: decode(indexKey, 'session index key'),
			session: toTypedSession(entry, record.registrationId)
		}))

	return { sessions }
}

/** The bridge's typed model → legacy on-disk JSON, byte-for-byte comparable. */
export const fromTypedRecord = (record: LegacySessionRecordV1): LegacySessionRecord => {
	const sessions: Record<string, unknown> = {}
	for (const indexed of record.sessions) {
		const s = indexed.session
		const chains: Record<string, LegacyChainJson> = {}
		for (const chain of s.chains) {
			const messageKeys: Record<string, string> = {}
			for (const key of chain.messageKeys) {
				messageKeys[String(key.index)] = encode(key.seed)
			}

			chains[encode(chain.ratchetKey)] = {
				chainKey: {
					counter: chain.chainKey.counter,
					...(chain.chainKey.key ? { key: encode(chain.chainKey.key) } : {})
				},
				chainType: chain.role,
				messageKeys
			}
		}

		sessions[encode(indexed.indexKey)] = {
			registrationId: s.registrationId,
			currentRatchet: {
				ephemeralKeyPair: {
					pubKey: encode(s.ratchet.keyPair.public),
					privKey: encode(s.ratchet.keyPair.private)
				},
				lastRemoteEphemeralKey: encode(s.ratchet.lastRemoteEphemeralKey),
				previousCounter: s.ratchet.previousCounter,
				rootKey: encode(s.ratchet.rootKey)
			},
			indexInfo: {
				baseKey: encode(s.index.baseKey),
				baseKeyType: s.index.baseKeyRole,
				closed: s.index.closedTimestamp,
				used: s.index.usedAtMs,
				created: s.index.createdAtMs,
				remoteIdentityKey: encode(s.index.remoteIdentityKey)
			},
			_chains: chains,
			...(s.pendingPreKey
				? {
						pendingPreKey: {
							preKeyId: s.pendingPreKey.preKeyId,
							signedKeyId: s.pendingPreKey.signedPreKeyId,
							baseKey: encode(s.pendingPreKey.baseKey)
						}
					}
				: {})
		}
	}

	return { _sessions: sessions as never, version: 'v1' }
}
