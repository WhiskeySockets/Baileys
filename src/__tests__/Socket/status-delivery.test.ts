import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import P from 'pino'
import type { AuthenticationState, WAMessage } from '../../Types'
import type { BinaryNode } from '../../WABinary'

class SyntheticSocket extends EventEmitter {
	sent: Buffer[] = []
	isOpen = true
	isClosed = false
	isClosing = false
	isConnecting = false
	connect() {}
	async close() {
		this.isOpen = false
	}
	send(bytes: Uint8Array, done?: (error?: Error) => void) {
		this.sent.push(Buffer.from(bytes))
		done?.()
		return true
	}
}
jest.unstable_mockModule('../../Socket/Client/websocket', () => ({ WebSocketClient: SyntheticSocket }))
const { default: makeWASocket } = await import('../../Socket')
const { DEFAULT_CONNECTION_CONFIG } = await import('../../Defaults')
const { initAuthCreds } = await import('../../Utils/auth-utils')
const { makeLibSignalRepository } = await import('../../Signal/libsignal')
const { decodeBinaryNode } = await import('../../WABinary')
const { proto } = await import('../../../WAProto/index.js')

// No network or account state: encrypted bytes are an authored fixture and the
// decryptor records its scope before returning the authored plaintext.
it.each([false, true])('delivers encrypted status content with offline=%s', async offline => {
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
			...(offline ? { offline: '1' } : {})
		},
		content: [
			{ tag: 'meta', attrs: { session_scope: 'status' } },
			{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: Buffer.from('authored ciphertext') }
		]
	}
	try {
		sock.ws.emit('CB:status', node)
		for (let i = 0; i < 50 && delivered.length === 0; i++) await new Promise(resolve => setTimeout(resolve, 10))
		expect(decrypt).toHaveBeenCalledWith(expect.objectContaining({ jid: '200000000002:2@lid', sessionScope: 'status' }))
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
					attrs: expect.objectContaining({ id: 'synthetic-status', class: 'status' })
				})
			])
		)
	} finally {
		await sock.end(new Error('synthetic test complete'))
	}
})
