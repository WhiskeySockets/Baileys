import { SignalKeyPair } from '../../Types'
import BaseKeyType from './base_key_type'
import ChainType from './chain_type'

const CLOSED_SESSIONS_MAX = 40
const SESSION_RECORD_VERSION = 'v1'

interface MessageKeys {
	[index: number]: Buffer
}

interface ChainKey {
	counter: number
	key?: Buffer
}

export interface Chain {
	messageKeys: MessageKeys
	chainKey: ChainKey
	chainType: (typeof ChainType)[keyof typeof ChainType]
}

interface IndexInfo {
	baseKey: Buffer
	baseKeyType: (typeof BaseKeyType)[keyof typeof BaseKeyType]
	closed: number
	used: number
	created: number
	remoteIdentityKey: Buffer
}

interface CurrentRatchet {
	ephemeralKeyPair: SignalKeyPair
	lastRemoteEphemeralKey: Buffer
	previousCounter: number
	rootKey: Buffer
}

interface PendingPreKey {
	signedKeyId: number
	baseKey: Buffer
	preKeyId?: number
}

interface SerializedSessionEntry {
	registrationId: number
	currentRatchet: {
		ephemeralKeyPair: { pubKey: string; privKey: string }
		lastRemoteEphemeralKey: string
		previousCounter: number
		rootKey: string
	}
	indexInfo: {
		baseKey: string
		baseKeyType: number
		closed: number
		used: number
		created: number
		remoteIdentityKey: string
	}
	_chains: { [id: string]: Chain }
	pendingPreKey?: {
		signedKeyId: number
		baseKey: string
		preKeyId?: number
	}
}

export class SessionEntry {
	_chains: { [id: string]: Chain }
	indexInfo: IndexInfo
	currentRatchet: CurrentRatchet
	pendingPreKey?: PendingPreKey
	registrationId?: number

	constructor() {
		this._chains = {}
	}

	toString() {
		const baseKey = this.indexInfo?.baseKey?.toString('base64')
		return `<SessionEntry [baseKey=${baseKey}]>`
	}

	inspect() {
		return this.toString()
	}

	addChain(key: Buffer, value: Chain) {
		const id = key.toString('base64')
		if (this._chains.hasOwnProperty(id)) {
			throw new Error('Overwrite attempt')
		}

		this._chains[id] = value
	}

	getChain(key: Buffer): Chain | undefined {
		return this._chains[key.toString('base64')]
	}

	deleteChain(key: Buffer) {
		const id = key.toString('base64')
		if (!this._chains.hasOwnProperty(id)) {
			throw new ReferenceError('Not Found')
		}

		delete this._chains[id]
	}

	*chains(): Generator<[Buffer, Chain]> {
		for (const [k, v] of Object.entries(this._chains)) {
			yield [Buffer.from(k, 'base64'), v]
		}
	}

	serialize(): SerializedSessionEntry {
		const data: SerializedSessionEntry = {
			registrationId: this.registrationId!,
			currentRatchet: {
				ephemeralKeyPair: {
					pubKey: this.currentRatchet.ephemeralKeyPair.pubKey.toString('base64'),
					privKey: this.currentRatchet.ephemeralKeyPair.privKey.toString('base64')
				},
				lastRemoteEphemeralKey: this.currentRatchet.lastRemoteEphemeralKey.toString('base64'),
				previousCounter: this.currentRatchet.previousCounter,
				rootKey: this.currentRatchet.rootKey.toString('base64')
			},
			indexInfo: {
				baseKey: this.indexInfo.baseKey.toString('base64'),
				baseKeyType: this.indexInfo.baseKeyType,
				closed: this.indexInfo.closed,
				used: this.indexInfo.used,
				created: this.indexInfo.created,
				remoteIdentityKey: this.indexInfo.remoteIdentityKey.toString('base64')
			},
			_chains: this._serialize_chains(this._chains)
		}
		if (this.pendingPreKey) {
			const pendingPreKey = {
				...this.pendingPreKey,
				baseKey: this.pendingPreKey.baseKey.toString('base64')
			}
			data.pendingPreKey = pendingPreKey
		}

		return data
	}

	static deserialize(data: SerializedSessionEntry) {
		const obj = new this()
		obj.registrationId = data.registrationId
		obj.currentRatchet = {
			ephemeralKeyPair: {
				pubKey: Buffer.from(data.currentRatchet.ephemeralKeyPair.pubKey, 'base64'),
				privKey: Buffer.from(data.currentRatchet.ephemeralKeyPair.privKey, 'base64')
			},
			lastRemoteEphemeralKey: Buffer.from(data.currentRatchet.lastRemoteEphemeralKey, 'base64'),
			previousCounter: data.currentRatchet.previousCounter,
			rootKey: Buffer.from(data.currentRatchet.rootKey, 'base64')
		}
		obj.indexInfo = {
			baseKey: Buffer.from(data.indexInfo.baseKey, 'base64'),
			baseKeyType: data.indexInfo.baseKeyType,
			closed: data.indexInfo.closed,
			used: data.indexInfo.used,
			created: data.indexInfo.created,
			remoteIdentityKey: Buffer.from(data.indexInfo.remoteIdentityKey, 'base64')
		}
		obj._chains = this._deserialize_chains(data._chains)
		if (data.pendingPreKey) {
			obj.pendingPreKey = {
				signedKeyId: data.pendingPreKey.signedKeyId,
				baseKey: Buffer.from(data.pendingPreKey.baseKey, 'base64'),
				preKeyId: data.pendingPreKey.preKeyId
			}
		}

		return obj
	}

	_serialize_chains(chains) {
		const r = {}
		for (const key of Object.keys(chains)) {
			const c = chains[key]
			const messageKeys = {}
			for (const [idx, key] of Object.entries(c.messageKeys)) {
				messageKeys[idx] = (key as Buffer).toString('base64')
			}

			r[key] = {
				chainKey: {
					counter: c.chainKey.counter,
					key: c.chainKey.key?.toString('base64')
				},
				chainType: c.chainType,
				messageKeys: messageKeys
			}
		}

		return r
	}

	static _deserialize_chains(chains_data) {
		const r = {}
		for (const key of Object.keys(chains_data)) {
			const c = chains_data[key]
			const messageKeys = {}
			for (const [idx, key] of Object.entries(c.messageKeys)) {
				messageKeys[idx] = Buffer.from(key as string, 'base64')
			}

			r[key] = {
				chainKey: {
					counter: c.chainKey.counter,
					key: c.chainKey.key && Buffer.from(c.chainKey.key, 'base64')
				},
				chainType: c.chainType,
				messageKeys: messageKeys
			}
		}

		return r
	}
}

const migrations = [
	{
		version: 'v1',
		migrate: function (data) {
			const sessions = data._sessions
			if (data.registrationId) {
				for (const key in sessions) {
					if (!sessions[key].registrationId) {
						sessions[key].registrationId = data.registrationId
					}
				}
			} else {
				for (const key in sessions) {
					if (sessions[key].indexInfo.closed === -1) {
						console.error(
							'V1 session storage migration error: registrationId',
							data.registrationId,
							'for open session version',
							data.version
						)
					}
				}
			}
		}
	}
]

class SessionRecord {
	sessions: { [key: string]: SessionEntry }
	version: string

	static createEntry() {
		return new SessionEntry()
	}

	static migrate(data) {
		let run = data.version === undefined
		for (let i = 0; i < migrations.length; ++i) {
			if (run) {
				migrations[i].migrate(data)
			} else if (migrations[i].version === data.version) {
				run = true
			}
		}

		if (!run) {
			throw new Error('Error migrating SessionRecord')
		}
	}

	static deserialize(data: { _sessions: { [key: string]: SerializedSessionEntry }; version: string }) {
		if (data.version !== SESSION_RECORD_VERSION) {
			this.migrate(data)
		}

		const obj = new this()
		if (data._sessions) {
			for (const [key, entry] of Object.entries(data._sessions)) {
				obj.sessions[key] = SessionEntry.deserialize(entry)
			}
		}

		return obj
	}

	constructor() {
		this.sessions = {}
		this.version = SESSION_RECORD_VERSION
	}

	serialize() {
		const _sessions: { [key: string]: SerializedSessionEntry } = {}
		for (const [key, entry] of Object.entries(this.sessions)) {
			_sessions[key] = entry.serialize()
		}

		return {
			_sessions,
			version: this.version
		}
	}

	haveOpenSession() {
		const openSession = this.getOpenSession()
		return !!openSession && typeof openSession.registrationId === 'number'
	}

	getSession(key: Buffer): SessionEntry | undefined {
		const session = this.sessions[key.toString('base64')]
		if (session && session.indexInfo.baseKeyType === BaseKeyType.OURS) {
			throw new Error('Tried to lookup a session using our basekey')
		}

		return session
	}

	getOpenSession(): SessionEntry | undefined {
		for (const session of Object.values(this.sessions)) {
			if (!this.isClosed(session)) {
				return session
			}
		}
	}

	setSession(session: SessionEntry) {
		this.sessions[session.indexInfo.baseKey.toString('base64')] = session
	}

	getSessions(): SessionEntry[] {
		// Return sessions ordered with most recently used first.
		return Array.from(Object.values(this.sessions))
			.map(s => s)
			.sort((a, b) => {
				const aUsed = a.indexInfo?.used || 0
				const bUsed = b.indexInfo?.used || 0
				return aUsed === bUsed ? 0 : aUsed < bUsed ? 1 : -1
			})
	}

	closeSession(session: SessionEntry) {
		if (this.isClosed(session)) {
			return
		}

		session.indexInfo.closed = Date.now()
	}

	openSession(session: SessionEntry) {
		if (!this.isClosed(session)) {
			// console.warn('Session already open')
		}

		session.indexInfo.closed = -1
	}

	isClosed(session: SessionEntry) {
		return session.indexInfo.closed !== -1
	}

	removeOldSessions() {
		while (Object.keys(this.sessions).length > CLOSED_SESSIONS_MAX) {
			let oldestKey: string | undefined
			let oldestSession: SessionEntry | undefined
			for (const [key, session] of Object.entries(this.sessions)) {
				if (
					session.indexInfo.closed !== -1 &&
					(!oldestSession || session.indexInfo.closed < oldestSession.indexInfo.closed)
				) {
					oldestKey = key
					oldestSession = session
				}
			}

			if (oldestKey) {
				delete this.sessions[oldestKey]
			} else {
				throw new Error('Corrupt sessions object')
			}
		}
	}

	deleteAllSessions() {
		for (const key of Object.keys(this.sessions)) {
			delete this.sessions[key]
		}
	}
}

export default SessionRecord
