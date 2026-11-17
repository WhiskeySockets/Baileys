import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import P from 'pino'
import type { AuthenticationState, CacheStore, SignalDataTypeMap, SocketConfig, WAMessage } from '../../Types'
import type { BinaryNode } from '../../WABinary'

class SyntheticSocket extends EventEmitter {
	sent: Buffer[] = []
	rejectNext = false
	pauseNextSend?: (resume: () => void) => void
	isOpen = true
	isClosed = false
	isClosing = false
	isConnecting = false
	connect() {}
	async close() {
		this.isOpen = false
	}
	send(bytes: Uint8Array, done?: (error?: Error) => void) {
		if (this.rejectNext) {
			this.rejectNext = false
			done?.(new Error('authored transport failure'))
			return false
		}

		let finished = false
		const finish = () => {
			if (finished) return
			finished = true
			this.sent.push(Buffer.from(bytes))
			done?.()
		}

		const pause = this.pauseNextSend
		this.pauseNextSend = undefined
		if (pause) pause(finish)
		else finish()
		return true
	}
}
jest.unstable_mockModule('../../Socket/Client/websocket', () => ({ WebSocketClient: SyntheticSocket }))
const { default: makeWASocket } = await import('../../Socket')
const { DEFAULT_CONNECTION_CONFIG, NOISE_WA_HEADER } = await import('../../Defaults')
const { initAuthCreds } = await import('../../Utils/auth-utils')
const { makeLibSignalRepository } = await import('../../Signal/libsignal')
const { decodeBinaryNode } = await import('../../WABinary')
const { proto } = await import('../../../WAProto/index.js')

// No network or account state: encrypted bytes are an authored fixture and the
// decryptor records its scope before returning the authored plaintext.
it.each([
	[false, true, false, false],
	[true, true, false, false],
	[false, true, false, true],
	[false, false, false, false],
	[false, false, true, false],
	[false, false, true, true]
])(
	'handles status content with offline=%s scope support=%s compound=%s peer=%s',
	async (offline, supported, compound, peerCategory) => {
		const auth: AuthenticationState = {
			creds: {
				...initAuthCreds(),
				me: { id: '100000000001:1@s.whatsapp.net', lid: '100000000002:1@lid', name: 'Synthetic' }
			},
			keys: { get: async () => ({}), set: async () => {} }
		}
		const plaintext = proto.Message.encode({ conversation: 'synthetic status content' }).finish()
		const decrypt = jest.fn<() => Promise<Uint8Array>>().mockResolvedValue(Buffer.concat([plaintext, Buffer.from([1])]))
		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth,
			logger: P({ level: 'silent' }),
			shouldSyncHistoryMessage: () => false,
			makeSignalRepository: (state, logger, lookup) => {
				const repo = makeLibSignalRepository(state, logger, lookup)
				repo.supportsStatusSessions = supported
				repo.decryptMessage = decrypt
				return repo
			}
		})
		const delivered: WAMessage[] = []
		sock.ev.on('messages.upsert', ({ messages }) => delivered.push(...messages))
		sock.ev.emit('connection.update', { receivedPendingNotifications: true })
		const node: BinaryNode = {
			tag: 'status',
			attrs: {
				id: 'synthetic-status',
				from: '120363000000001@g.us',
				participant: '200000000002:2@lid',
				type: 'text',
				t: String(Math.floor(Date.now() / 1000)),
				...(offline ? { offline: '1' } : {}),
				...(peerCategory ? { category: 'peer' } : {})
			},
			content: [
				{ tag: 'meta', attrs: { session_scope: 'status' } },
				{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: Buffer.from('authored ciphertext') },
				...(compound
					? [{ tag: 'enc', attrs: { type: 'skmsg', v: '2' }, content: Buffer.from('authored failing group') }]
					: [])
			]
		}
		try {
			sock.ws.emit('CB:status', node)
			for (let i = 0; i < 50 && delivered.length === 0; i++) await new Promise(resolve => setTimeout(resolve, 10))
			if (!supported) {
				expect(decrypt).not.toHaveBeenCalled()
				expect(delivered).toHaveLength(0)
				const outgoing: BinaryNode[] = []
				const frames = (sock.ws as unknown as SyntheticSocket).sent
				for (let i = 0; i < frames.length; i++)
					outgoing.push(await decodeBinaryNode(frames[i]!.subarray(i === 0 ? 7 : 3)))
				expect(outgoing).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							tag: 'ack',
							attrs: expect.objectContaining({ id: 'synthetic-status', class: 'status', error: '488' })
						})
					])
				)
				expect(outgoing.some(node => node.tag === 'receipt')).toBe(false)
				return
			}

			expect(decrypt).toHaveBeenCalledWith(
				expect.objectContaining({ jid: '200000000002:2@lid', sessionScope: 'status' })
			)
			expect(delivered).toHaveLength(1)
			expect(delivered[0]).toMatchObject({
				statusKind: 'group',
				key: { remoteJid: '120363000000001@g.us', participant: '200000000002@lid' },
				message: { conversation: 'synthetic status content' }
			})
			expect(node.tag).toBe('status')
			const frames = (sock.ws as unknown as SyntheticSocket).sent
			const outgoing: BinaryNode[] = []
			for (let i = 0; i < frames.length; i++) {
				const frame = frames[i]!
				// This synthetic socket never handshakes; the first frame has only the Noise introduction.
				outgoing.push(await decodeBinaryNode(frame.subarray(i === 0 ? 7 : 3)))
			}

			expect(outgoing).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						tag: 'receipt',
						attrs: expect.objectContaining({
							id: 'synthetic-status',
							class: 'status',
							...(peerCategory ? { type: 'peer_msg' } : {})
						})
					})
				])
			)
		} finally {
			await sock.end(new Error('synthetic test complete'))
		}
	}
)

it('sends a status-class retry receipt for a legacy personal message envelope', async () => {
	const auth: AuthenticationState = {
		creds: {
			...initAuthCreds(),
			me: { id: '100000000001:1@s.whatsapp.net', lid: '100000000002:1@lid', name: 'Synthetic' },
			account: {
				details: Buffer.from('authored device'),
				accountSignatureKey: Buffer.alloc(32, 1),
				accountSignature: Buffer.alloc(64, 2),
				deviceSignature: Buffer.alloc(64, 3)
			}
		},
		keys: { get: async () => ({}), set: async () => {} }
	}
	const sock = makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		auth,
		logger: P({ level: 'silent' }),
		shouldSyncHistoryMessage: () => false
	})
	await new Promise<void>(resolve => process.nextTick(resolve))
	sock.ev.emit('connection.update', { receivedPendingNotifications: true })
	try {
		await sock.sendRetryRequest({
			tag: 'message',
			attrs: {
				from: 'status@broadcast',
				participant: '200000000002:2@lid',
				id: 'authored-legacy-retry',
				t: '1794700800'
			},
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: Buffer.from('authored ciphertext') }]
		})
		const frames = (sock.ws as unknown as SyntheticSocket).sent
		const outgoing: BinaryNode[] = []
		for (let i = 0; i < frames.length; i++) outgoing.push(await decodeBinaryNode(frames[i]!.subarray(i === 0 ? 7 : 3)))
		expect(outgoing).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tag: 'receipt',
					attrs: expect.objectContaining({
						id: 'authored-legacy-retry',
						type: 'retry',
						class: 'status',
						to: 'status@broadcast'
					})
				})
			])
		)
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored retry test complete'))
	}
})

async function groupSendFixture(
	batches: string[][] = [['200000000002@lid']],
	patch?: SocketConfig['patchMessageBeforeSending'],
	onInjected?: () => void
) {
	const rows = new Map<string, unknown>()
	let rejectMemoryWrites = false
	let groupRead = 0
	const auth: AuthenticationState = {
		creds: {
			...initAuthCreds(),
			me: { id: '100000000001:1@s.whatsapp.net', lid: '100000000002:1@lid', name: 'Authored' }
		},
		keys: {
			get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) =>
				Object.fromEntries(ids.filter(id => rows.has(`${type}/${id}`)).map(id => [id, rows.get(`${type}/${id}`)])) as {
					[id: string]: SignalDataTypeMap[T]
				},
			set: async data => {
				if (rejectMemoryWrites && data['sender-key-memory']) throw new Error('authored memory store rejection')
				for (const [type, entries] of Object.entries(data))
					for (const [id, value] of Object.entries(entries)) rows.set(`${type}/${id}`, value)
			}
		}
	}
	const cacheRows = new Map<string, unknown>()
	const cache: CacheStore = {
		get: <T>(key: string) => cacheRows.get(key) as T | undefined,
		set: (key, value) => {
			cacheRows.set(key, value)
		},
		del: key => cacheRows.delete(key),
		flushAll: () => cacheRows.clear()
	}
	for (const jid of new Set(batches.flat())) {
		const user = jid.split('@')[0]!
		await cache.set(user, [{ user, server: 'lid', device: 2 }])
	}

	const encrypt = jest
		.fn<() => Promise<{ type: 'msg'; ciphertext: Uint8Array }>>()
		.mockResolvedValue({ type: 'msg', ciphertext: Buffer.from('authored distribution') })
	const sock = makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		auth,
		logger: P({ level: 'silent' }),
		userDevicesCache: cache,
		transactionOpts: { maxCommitRetries: 1, delayBetweenTriesMs: 0 },
		patchMessageBeforeSending: patch ?? DEFAULT_CONNECTION_CONFIG.patchMessageBeforeSending,
		cachedGroupMetadata: async () => ({
			id: '120363000000001@g.us',
			subject: 'Authored',
			owner: undefined,
			participants: batches[Math.min(groupRead++, batches.length - 1)]!.map(id => ({ id, admin: null }))
		}),
		makeSignalRepository: (state, logger, lookup) => {
			const repo = makeLibSignalRepository(state, logger, lookup)
			repo.validateSession = async () => ({ exists: true })
			repo.encryptMessage = encrypt
			repo.injectE2ESession = async () => {
				onInjected?.()
			}

			repo.encryptGroupMessage = async () => ({
				ciphertext: Buffer.from('authored group'),
				senderKeyDistributionMessage: Buffer.from('authored sender key')
			})
			return repo
		}
	})
	await new Promise<void>(resolve => process.nextTick(resolve))
	sock.ev.emit('connection.update', { receivedPendingNotifications: true })
	const transport = sock.ws as unknown as SyntheticSocket
	const group = '120363000000001@g.us'
	return {
		rows,
		sock,
		encrypt,
		transport,
		group,
		rejectMemory: (value: boolean) => {
			rejectMemoryWrites = value
		}
	}
}

it('records sender-key delivery only after transport succeeds', async () => {
	const { rows, sock, encrypt, transport, group, rejectMemory } = await groupSendFixture()
	const device = '200000000002:2@lid'
	try {
		transport.rejectNext = true
		await expect(
			sock.relayMessage(
				group,
				{ conversation: 'authored group message' },
				{ messageId: 'authored-failed', useCachedGroupMetadata: true, useUserDevicesCache: true }
			)
		).rejects.toThrow('authored transport failure')
		expect(rows.has(`sender-key-memory/${group}`)).toBe(false)
		await sock.relayMessage(
			group,
			{ conversation: 'authored group message' },
			{ messageId: 'authored-sent', useCachedGroupMetadata: true, useUserDevicesCache: true }
		)
		expect(encrypt).toHaveBeenCalledTimes(2)
		expect(rows.get(`sender-key-memory/${group}`)).toEqual({ [device]: true })
		rows.delete(`sender-key-memory/${group}`)
		rejectMemory(true)
		expect(
			await sock.relayMessage(
				group,
				{ conversation: 'authored accepted transport' },
				{ messageId: 'authored-cache-rejection', useCachedGroupMetadata: true, useUserDevicesCache: true }
			)
		).toBe('authored-cache-rejection')
		expect(rows.has(`sender-key-memory/${group}`)).toBe(false)
		rejectMemory(false)
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored send test complete'))
	}
})

it('merges delivery markers from concurrent group sends without dropping either device', async () => {
	const { rows, sock, group } = await groupSendFixture([['200000000002@lid'], ['300000000003@lid']])
	try {
		await Promise.all(
			['first', 'second'].map(messageId =>
				sock.relayMessage(
					group,
					{ conversation: 'authored concurrent send' },
					{ messageId, useCachedGroupMetadata: true, useUserDevicesCache: true }
				)
			)
		)
		expect(rows.get(`sender-key-memory/${group}`)).toEqual({ '200000000002:2@lid': true, '300000000003:2@lid': true })
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored concurrency test complete'))
	}
})

it('keeps group transport in sender-chain order while the first distribution is patched', async () => {
	let enter!: () => void,
		release!: () => void,
		distributions = 0
	const entered = new Promise<void>(resolve => {
		enter = resolve
	})
	const gate = new Promise<void>(resolve => {
		release = resolve
	})
	const { sock, group, transport } = await groupSendFixture(undefined, async msg => {
		if (msg.senderKeyDistributionMessage && ++distributions === 1) {
			enter()
			await gate
		}

		return msg
	})
	const options = { useCachedGroupMetadata: true, useUserDevicesCache: true }
	const first = sock.relayMessage(
		group,
		{ conversation: 'authored first' },
		{ ...options, messageId: 'authored-first' }
	)
	let second: ReturnType<typeof sock.relayMessage> | undefined
	try {
		await entered
		second = sock.relayMessage(group, { conversation: 'authored second' }, { ...options, messageId: 'authored-second' })
		await new Promise<void>(resolve => setImmediate(resolve))
		expect(transport.sent).toHaveLength(0)
		release()
		await Promise.all([first, second])
		const sent = await Promise.all(transport.sent.map((frame, i) => decodeBinaryNode(frame.subarray(i === 0 ? 7 : 3))))
		expect(sent.filter(node => node.tag === 'message').map(node => node.attrs.id)).toEqual([
			'authored-first',
			'authored-second'
		])
	} finally {
		release()
		await Promise.allSettled([first, ...(second ? [second] : [])])
		await sock.end(new Error('authored group ordering complete'))
	}
})

it('uses the decryption-time status mode when retrying after the mode changes', async () => {
	let mode: 0 | 3 = 3
	const getMode = jest.fn(() => mode)
	const validate = jest
		.fn<(jid: string, scope?: 'status') => Promise<{ exists: boolean }>>()
		.mockResolvedValue({ exists: false })
	const remove = jest.fn<(jids: string[], scope?: 'status' | 'default') => Promise<void>>().mockResolvedValue(undefined)
	const decrypt = jest.fn<() => Promise<Uint8Array>>().mockImplementation(async () => {
		mode = 0
		throw new Error('authored decryption failure')
	})
	const auth: AuthenticationState = {
		creds: {
			...initAuthCreds(),
			me: { id: '100000000001:1@s.whatsapp.net', lid: '100000000002:1@lid', name: 'Authored' },
			account: {
				details: Buffer.from('authored'),
				accountSignatureKey: Buffer.alloc(32, 1),
				accountSignature: Buffer.alloc(64, 2),
				deviceSignature: Buffer.alloc(64, 3)
			}
		},
		keys: { get: async () => ({}), set: async () => {} }
	}
	const sock = makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		auth,
		logger: P({ level: 'silent' }),
		getStatusSessionMode: getMode,
		retryRequestDelayMs: 0,
		shouldSyncHistoryMessage: () => false,
		makeSignalRepository: (state, logger, lookup) => {
			const repo = makeLibSignalRepository(state, logger, lookup)
			repo.decryptMessage = decrypt
			repo.validateSession = validate
			repo.deleteSession = remove
			return repo
		}
	})
	await new Promise<void>(resolve => process.nextTick(resolve))
	sock.ev.emit('connection.update', { receivedPendingNotifications: true })
	const id = 'authored-mode-change'
	sock.messageRetryManager!.incrementRetryCount(id)
	try {
		sock.ws.emit('CB:status', {
			tag: 'status',
			attrs: {
				id,
				from: 'status@broadcast',
				participant: '200000000002:2@lid',
				type: 'text',
				t: String(Math.floor(Date.now() / 1000))
			},
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: Buffer.from('authored ciphertext') }]
		})
		for (let i = 0; i < 50 && remove.mock.calls.length === 0; i++) await new Promise(resolve => setTimeout(resolve, 10))
		expect(decrypt).toHaveBeenCalledWith(expect.objectContaining({ sessionScope: 'status' }))
		expect(validate).toHaveBeenCalledWith('200000000002:2@lid', 'status')
		expect(remove).toHaveBeenCalledWith(['200000000002:2@lid'], 'status')
		expect(getMode).toHaveBeenCalledTimes(1)
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored mode-change complete'))
	}
})

async function retryTestSocket(overrides: Partial<SocketConfig>) {
	const auth: AuthenticationState = {
		creds: {
			...initAuthCreds(),
			me: { id: '100000000001:1@s.whatsapp.net', lid: '100000000002:1@lid', name: 'Authored' },
			account: {
				details: Buffer.from('authored'),
				accountSignatureKey: Buffer.alloc(32, 1),
				accountSignature: Buffer.alloc(64, 2),
				deviceSignature: Buffer.alloc(64, 3)
			}
		},
		keys: { get: async () => ({}), set: async () => {} }
	}
	const sock = makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		auth,
		logger: P({ level: 'silent' }),
		retryRequestDelayMs: 0,
		shouldSyncHistoryMessage: () => false,
		...overrides
	})
	await new Promise<void>(resolve => process.nextTick(resolve))
	sock.ev.emit('connection.update', { receivedPendingNotifications: true })
	return sock
}

async function sentNodes(transport: SyntheticSocket) {
	return Promise.all(
		transport.sent.map(frame =>
			decodeBinaryNode(frame.subarray(frame.subarray(0, 4).equals(Buffer.from(NOISE_WA_HEADER)) ? 7 : 3))
		)
	)
}

it('shares retry cooldown across phone and linked aliases while keeping scopes separate', async () => {
	const validate = jest.fn<() => Promise<{ exists: boolean }>>().mockResolvedValue({ exists: true })
	const remove = jest.fn<(jids: string[], scope?: 'status' | 'default') => Promise<void>>().mockResolvedValue(undefined)
	let repository: ReturnType<typeof makeLibSignalRepository> | undefined
	const sock = await retryTestSocket({
		makeSignalRepository: (state, logger, lookup) => {
			const repo = makeLibSignalRepository(state, logger, lookup)
			repo.validateSession = validate
			repo.deleteSession = remove
			repository = repo
			return repo
		}
	})
	const pn = '200000000002:2@s.whatsapp.net',
		lid = '300000000003:2@lid'
	validate.mockImplementation(async () => {
		await repository!.lidMapping.storeLIDPNMappings([{ pn, lid }])
		return { exists: true }
	})
	try {
		for (const [id, participant, scoped] of [
			['authored-alias-pn', pn, true],
			['authored-alias-lid', lid, true],
			['authored-alias-chat', pn, false]
		] as const) {
			sock.messageRetryManager!.incrementRetryCount(id)
			await sock.sendRetryRequest({
				tag: scoped ? 'status' : 'message',
				attrs: {
					id,
					from: scoped ? 'status@broadcast' : participant,
					participant,
					t: String(Math.floor(Date.now() / 1000))
				},
				content: [
					...(scoped ? [{ tag: 'meta', attrs: { session_scope: 'status' } }] : []),
					{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: Buffer.from('authored') }
				]
			})
		}

		expect(remove.mock.calls.map(call => call[1])).toEqual(['status', 'default'])
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored alias cooldown complete'))
	}
})

it('keeps a decoded group publication kind when a later child forces retry', async () => {
	const encoded = proto.Message.encode({
		groupStatusMessageV2: { message: { conversation: 'authored group publication' } }
	}).finish()
	const sock = await retryTestSocket({
		makeSignalRepository: (state, logger, lookup) => {
			const repo = makeLibSignalRepository(state, logger, lookup)
			repo.decryptMessage = async () => Buffer.concat([encoded, Buffer.from([1])])
			repo.decryptGroupMessage = async () => {
				throw new Error('authored later group failure')
			}

			return repo
		}
	})
	const transport = sock.ws as unknown as SyntheticSocket
	try {
		sock.ws.emit('CB:message', {
			tag: 'message',
			attrs: {
				id: 'authored-group-kind',
				from: '120363000000001@g.us',
				participant: '200000000002:2@lid',
				type: 'text',
				t: String(Math.floor(Date.now() / 1000))
			},
			content: [
				{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: Buffer.from('authored') },
				{ tag: 'enc', attrs: { type: 'skmsg', v: '2' }, content: Buffer.from('authored later failure') }
			]
		})
		for (let i = 0; i < 50 && transport.sent.length < 2; i++) await new Promise(resolve => setTimeout(resolve, 10))
		const outgoing = await sentNodes(transport)
		expect(outgoing).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tag: 'receipt',
					attrs: expect.objectContaining({ id: 'authored-group-kind', type: 'retry', class: 'status' })
				})
			])
		)
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored decoded-kind complete'))
	}
})

it('orders a retry marker reset after an in-flight group relay finishes its marker write', async () => {
	let injected!: () => void
	const injection = new Promise<void>(resolve => {
		injected = resolve
	})
	const { sock, rows, transport, group, encrypt } = await groupSendFixture(undefined, undefined, injected)
	rows.set(`sender-key-memory/${group}`, { '400000000004:2@lid': true })
	let release!: () => void, entered!: () => void
	const sending = new Promise<void>(resolve => {
		entered = resolve
	})
	transport.pauseNextSend = resume => {
		release = resume
		entered()
	}

	const first = sock.relayMessage(
		group,
		{ conversation: 'authored in-flight group send' },
		{ messageId: 'authored-in-flight', useCachedGroupMetadata: true, useUserDevicesCache: true }
	)
	try {
		await sending
		// An authored, parser-valid retry bundle is injected by the fixture repository, not live keys.
		sock.ws.emit('CB:receipt', {
			tag: 'receipt',
			attrs: {
				id: 'authored-uncached-retry',
				from: group,
				participant: '200000000002:2@lid',
				type: 'retry',
				t: String(Math.floor(Date.now() / 1000))
			},
			content: [
				{ tag: 'retry', attrs: { count: '1' } },
				{ tag: 'registration', attrs: {}, content: Buffer.from([0, 0, 0, 1]) },
				{
					tag: 'keys',
					attrs: {},
					content: [
						{ tag: 'type', attrs: {}, content: Buffer.from([5]) },
						{ tag: 'identity', attrs: {}, content: Buffer.alloc(32, 1) },
						{
							tag: 'skey',
							attrs: {},
							content: [
								{ tag: 'id', attrs: {}, content: Buffer.from([0, 0, 1]) },
								{ tag: 'value', attrs: {}, content: Buffer.alloc(32, 2) },
								{ tag: 'signature', attrs: {}, content: Buffer.alloc(64, 3) }
							]
						}
					]
				}
			]
		})
		await injection
		await new Promise<void>(resolve => setImmediate(resolve))
		expect(rows.get(`sender-key-memory/${group}`)).toEqual({ '400000000004:2@lid': true })
		release()
		await first
		for (let i = 0; i < 50; i++) {
			if ((await sentNodes(transport)).some(node => node.tag === 'ack' && node.attrs.id === 'authored-uncached-retry'))
				break
			await new Promise(resolve => setTimeout(resolve, 10))
		}

		expect(rows.get(`sender-key-memory/${group}`)).toBeNull()
		await sock.relayMessage(
			group,
			{ conversation: 'authored after reset' },
			{ messageId: 'authored-after-reset', useCachedGroupMetadata: true, useUserDevicesCache: true }
		)
		expect(encrypt).toHaveBeenCalledTimes(2)
	} finally {
		release?.()
		await Promise.allSettled([first])
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored marker reset complete'))
	}
})

it('records only successfully transported distribution recipients', async () => {
	const { sock, rows, group, encrypt } = await groupSendFixture([['200000000002@lid', '300000000003@lid']])
	encrypt.mockRejectedValueOnce(new Error('authored one-device encryption failure'))
	try {
		await sock.relayMessage(
			group,
			{ conversation: 'authored partial distribution' },
			{ messageId: 'authored-partial', useCachedGroupMetadata: true, useUserDevicesCache: true }
		)
		expect(rows.get(`sender-key-memory/${group}`)).toEqual({ '300000000003:2@lid': true })
		await sock.relayMessage(
			group,
			{ conversation: 'authored retry distribution' },
			{ messageId: 'authored-next', useCachedGroupMetadata: true, useUserDevicesCache: true }
		)
		expect(encrypt).toHaveBeenCalledTimes(3)
		expect(rows.get(`sender-key-memory/${group}`)).toEqual({ '200000000002:2@lid': true, '300000000003:2@lid': true })
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored partial distribution complete'))
	}
})

it('shares the default retry cooldown across incoming and outgoing retries', async () => {
	let repository!: ReturnType<typeof makeLibSignalRepository>
	const remove = jest.fn<(jids: string[], scope?: 'default' | 'status') => Promise<void>>().mockResolvedValue(undefined)
	const sock = await retryTestSocket({
		makeSignalRepository: (state, logger, lookup) => {
			const repo = makeLibSignalRepository(state, logger, lookup)
			repo.validateSession = async () => ({ exists: true })
			repo.deleteSession = remove
			repository = repo
			return repo
		}
	})
	const pn = '200000000002:2@s.whatsapp.net',
		lid = '300000000003:2@lid'
	await repository.lidMapping.storeLIDPNMappings([{ pn, lid }])
	try {
		sock.messageRetryManager!.incrementRetryCount('authored-incoming-chat')
		await sock.sendRetryRequest({
			tag: 'message',
			attrs: { id: 'authored-incoming-chat', from: pn, t: String(Math.floor(Date.now() / 1000)) },
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: Buffer.from('authored') }]
		})
		expect(remove).toHaveBeenCalledTimes(1)
		sock.ws.emit('CB:receipt', {
			tag: 'receipt',
			attrs: { id: 'authored-outgoing-chat', from: lid, type: 'retry', t: String(Math.floor(Date.now() / 1000)) },
			content: [{ tag: 'retry', attrs: { count: '2' } }]
		})
		const transport = sock.ws as unknown as SyntheticSocket
		const answered = new Set<string>()
		for (let i = 0; i < 50; i++) {
			// This path fetches a fresh bundle even when the cooldown prevents deletion.
			// Finish its synthetic transport request; no account or remote service is used.
			for (const node of await sentNodes(transport)) {
				if (node.tag === 'iq' && node.attrs.xmlns === 'encrypt' && !answered.has(node.attrs.id!)) {
					answered.add(node.attrs.id!)
					sock.ws.emit(`TAG:${node.attrs.id}`, {
						tag: 'iq',
						attrs: { id: node.attrs.id!, type: 'result' },
						content: [{ tag: 'list', attrs: {}, content: [] }]
					})
				}
			}

			if ((await sentNodes(transport)).some(node => node.tag === 'ack' && node.attrs.id === 'authored-outgoing-chat'))
				break
			await new Promise(resolve => setTimeout(resolve, 10))
		}

		expect(
			(await sentNodes(transport)).some(node => node.tag === 'ack' && node.attrs.id === 'authored-outgoing-chat')
		).toBe(true)
		expect(remove).toHaveBeenCalledTimes(1)
	} finally {
		sock.messageRetryManager?.clear()
		await sock.end(new Error('authored bidirectional cooldown complete'))
	}
})

it.each([
	['status', 'status@broadcast', 'personal'],
	['status', '120363000000001@g.us', 'group'],
	['message', '200000000002@lid', undefined]
] as const)('preserves placeholder publication context for %s from %s', async (tag, from, statusKind) => {
	const id = 'authored-placeholder-publication'
	let retiring = false,
		finishResend!: () => void
	const resendFinished = new Promise<void>(resolve => {
		finishResend = resolve
	})
	const rows = new Map<string, unknown>()
	const cache: CacheStore = {
		get: <T>(key: string) => {
			if (retiring && key === id) finishResend()
			return rows.get(key) as T | undefined
		},
		set: (key, value) => {
			rows.set(key, value)
		},
		del: key => rows.delete(key),
		flushAll: () => rows.clear()
	}
	const sock = await retryTestSocket({ placeholderResendCache: cache })
	const recovered: WAMessage[] = []
	sock.ev.on('messages.upsert', ({ messages }) => recovered.push(...messages))
	try {
		sock.ws.emit(`CB:${tag}`, {
			tag,
			attrs: { id, from, participant: '200000000002:2@lid', type: 'text', t: String(Math.floor(Date.now() / 1000)) },
			content: [{ tag: 'unavailable', attrs: {} }]
		} satisfies BinaryNode)
		for (let attempt = 0; attempt < 50 && !rows.has(id); attempt++)
			await new Promise(resolve => setTimeout(resolve, 10))
		const cached = rows.get(id) as Partial<WAMessage> | undefined
		expect(cached).toBeDefined()
		expect(cached?.statusKind).toBe(statusKind)
		const { default: processMessage } = await import('../../Utils/process-message')
		await processMessage(
			{
				key: { remoteJid: '100000000001@s.whatsapp.net', fromMe: true, id: 'authored-pdo-response' },
				message: {
					protocolMessage: {
						type: proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE,
						peerDataOperationRequestResponseMessage: {
							stanzaId: 'authored-pdo',
							peerDataOperationResult: [
								{
									placeholderMessageResendResponse: {
										webMessageInfoBytes: proto.WebMessageInfo.encode({
											key: { remoteJid: from, id, fromMe: false },
											message: { conversation: 'authored recovered content' }
										}).finish()
									}
								}
							]
						}
					}
				}
			},
			{
				shouldProcessHistoryMsg: false,
				placeholderResendCache: cache,
				ev: sock.ev,
				creds: sock.authState.creds,
				keyStore: sock.authState.keys,
				signalRepository: sock.signalRepository,
				options: {},
				getMessage: async () => undefined,
				logger: P({ level: 'silent' })
			}
		)
		const message = recovered.find(
			message => message.key.id === id && message.message?.conversation === 'authored recovered content'
		)
		expect(message?.message?.conversation).toBe('authored recovered content')
		expect(message?.statusKind).toBe(statusKind)
		expect(rows.has(id)).toBe(false)
	} finally {
		retiring = true
		rows.clear()
		await resendFinished
		await sock.end(new Error('authored placeholder test complete'))
	}
})
