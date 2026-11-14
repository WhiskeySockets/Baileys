import NodeCache from '@cacheable/node-cache'
import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import P from 'pino'
import { proto } from '../../../WAProto/index.js'
import type { BinaryNode } from '../../WABinary'

const sentFrames: Uint8Array[] = []

// Stands in for the WebSocket so the socket runs offline; it records each frame sent.
class RecordingSocketClient extends EventEmitter {
	isOpen = true
	isClosed = false
	isClosing = false
	isConnecting = false
	connect() {}
	close() {
		this.isOpen = false
		this.isClosed = true
	}
	send(data: Uint8Array, cb?: (err?: Error) => void) {
		sentFrames.push(Uint8Array.from(data))
		cb?.()
		return true
	}
}

jest.unstable_mockModule('../../Socket/Client/websocket', () => ({ WebSocketClient: RecordingSocketClient }))

const { default: makeWASocket } = await import('../../Socket')
const { DEFAULT_CONNECTION_CONFIG } = await import('../../Defaults')
const { initAuthCreds } = await import('../../Utils/auth-utils')
const { encodeWAMessage, unpadRandomMax16 } = await import('../../Utils/generics')
const { decodeBinaryNode, getAllBinaryNodeChildren, getBinaryNodeChild } = await import('../../WABinary')

const ME_PN_USER = '15550001111'
const ME_ID = `${ME_PN_USER}:4@s.whatsapp.net`
// Our LID matches the synthetic reply vector's target sender (15550009999@lid).
const ME_LID = '15550009999:4@lid'
const BOT = '867051314767696@bot'
const SECRET = Uint8Array.from({ length: 32 }, (_, i) => i)

// Before the Noise handshake a frame is the intro header (first frame only), a 3-byte length, then the node.
const decodeSentNode = async (frame: Uint8Array): Promise<BinaryNode> => {
	for (let offset = 0; offset + 3 <= frame.length; offset++) {
		const length = (frame[offset]! << 16) | (frame[offset + 1]! << 8) | frame[offset + 2]!
		if (length === frame.length - offset - 3) {
			return decodeBinaryNode(Buffer.from(frame.subarray(offset + 3)))
		}
	}

	throw new Error('frame without a length prefix')
}

const sentNodes = () => Promise.all(sentFrames.map(decodeSentNode))

const withSocket = async (
	{
		getMessage = async () => undefined,
		hasSession = () => true,
		decrypted = { conversation: 'unused' }
	}: {
		getMessage?: (key: proto.IMessageKey) => Promise<proto.IMessage | undefined>
		hasSession?: (jid: string) => boolean
		/** what a Signal-encrypted stanza decrypts to */
		decrypted?: proto.IMessage
	},
	run: (sock: ReturnType<typeof makeWASocket>, encrypted: { jid: string; data: Uint8Array }[]) => Promise<void>
) => {
	const creds = initAuthCreds()
	creds.me = { id: ME_ID, lid: ME_LID, name: 'Test' }
	const userDevicesCache = new NodeCache<unknown>({ stdTTL: 300, useClones: false })
	await userDevicesCache.set(ME_PN_USER, [
		{ user: ME_PN_USER, server: 's.whatsapp.net', device: 0 },
		{ user: ME_PN_USER, server: 's.whatsapp.net', device: 4 }
	])
	const encrypted: { jid: string; data: Uint8Array }[] = []
	const sock = makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		logger: P({ level: 'silent' }),
		auth: { creds, keys: { get: async () => ({}), set: async () => {} } },
		userDevicesCache: userDevicesCache as never,
		// nothing answers queries offline; let them time out quickly
		defaultQueryTimeoutMs: 300,
		getMessage,
		makeSignalRepository: (auth, logger, pnFromLIDUSync) => ({
			...DEFAULT_CONNECTION_CONFIG.makeSignalRepository(auth, logger, pnFromLIDUSync),
			validateSession: async (jid: string) => ({ exists: hasSession(jid) }),
			decryptMessage: async () => encodeWAMessage(decrypted),
			encryptMessage: async ({ jid, data }) => {
				encrypted.push({ jid, data })
				return { type: 'msg' as const, ciphertext: new Uint8Array([1, 2, 3]) }
			}
		})
	})

	try {
		sentFrames.length = 0
		await run(sock, encrypted)
	} finally {
		// let the socket's startup tasks settle first, or end() leaves the event buffer timer running
		await new Promise(resolve => setTimeout(resolve, 50))
		await sock.end(undefined)
	}
}

describe('sending to a native bot', () => {
	it('sends the bot a message carrying a messageSecret and persona, and keeps them on the message', async () => {
		await withSocket({}, async (sock, encrypted) => {
			const message: proto.IMessage = { conversation: 'hi' }
			await sock.relayMessage(BOT, message, { messageId: 'PROMPT_1' })

			const secret = message.messageContextInfo?.messageSecret
			expect(secret?.length).toBe(32)
			expect(message.messageContextInfo?.botMetadata?.personaId).toBe('867051314767696$760019659443059')

			const decode = (data: Uint8Array) => proto.Message.decode(unpadRandomMax16(data))
			const toBot = encrypted.find(item => item.jid === BOT)
			expect(toBot).toBeDefined()
			expect(decode(toBot!.data).conversation).toBe('hi')
			expect(Buffer.from(decode(toBot!.data).messageContextInfo!.messageSecret!)).toEqual(Buffer.from(secret!))

			const toOwnPhone = encrypted.find(item => item.jid === `${ME_PN_USER}@s.whatsapp.net`)
			expect(decode(toOwnPhone!.data).deviceSentMessage?.destinationJid).toBe(BOT)

			const stanza = (await sentNodes()).find(node => node.tag === 'message')
			expect(stanza?.attrs.to).toBe(BOT)
			const recipients = getAllBinaryNodeChildren(getBinaryNodeChild(stanza, 'participants')!).map(
				node => node.attrs.jid
			)
			expect(recipients).toEqual(expect.arrayContaining([BOT, `${ME_PN_USER}@s.whatsapp.net`]))
		})
	})

	it("asks the server for the bot's Signal session by its bot JID", async () => {
		await withSocket({ hasSession: jid => jid !== BOT }, async sock => {
			// the session query goes unanswered offline and times out; only its contents matter here
			await sock.relayMessage(BOT, { conversation: 'hi' }, { messageId: 'PROMPT_3' })

			const keyQuery = (await sentNodes()).find(node => node.tag === 'iq' && node.attrs.xmlns === 'encrypt')
			const users = getAllBinaryNodeChildren(getBinaryNodeChild(keyQuery, 'key')!).map(node => node.attrs.jid)
			expect(users).toEqual([BOT])
		})
	})

	it('keeps an existing messageSecret and persona', async () => {
		await withSocket({}, async sock => {
			const message: proto.IMessage = {
				conversation: 'hi',
				messageContextInfo: { messageSecret: SECRET, botMetadata: { personaId: 'custom' } }
			}
			await sock.relayMessage(BOT, message, { messageId: 'PROMPT_2' })

			expect(message.messageContextInfo?.messageSecret).toBe(SECRET)
			expect(message.messageContextInfo?.botMetadata?.personaId).toBe('custom')
		})
	})
})

describe('receiving a native bot reply', () => {
	// Message { conversation: "test-ai" } encrypted for reply RESPONSE_FIXTURE_1 under SECRET (synthetic, not user data)
	const reply: BinaryNode = {
		tag: 'message',
		attrs: { id: 'RESPONSE_FIXTURE_1', from: BOT, t: '1700000000', type: 'text' },
		content: [
			{ tag: 'meta', attrs: { target_id: 'PROMPT_1' } },
			{
				tag: 'enc',
				attrs: { v: '2', type: 'msmsg' },
				content: proto.MessageSecretMessage.encode({
					version: 0,
					encIv: Buffer.from('000102030405060708090a0b', 'hex'),
					encPayload: Buffer.from('60b618fee5dc5d068259e089a357c3db42eb3841c3d969d4dd', 'hex')
				}).finish()
			}
		]
	}

	type Received = { upserts: proto.IWebMessageInfo[]; nodes: BinaryNode[] }

	// Feed the stanza in and wait until the handler's last step (the upsert, or the ack that ends it) is visible.
	const receive = async (sock: ReturnType<typeof makeWASocket>, stanza: BinaryNode, done: (r: Received) => boolean) => {
		const upserts: proto.IWebMessageInfo[] = []
		sock.ev.on('messages.upsert', ({ messages }) => upserts.push(...messages))
		sock.ws.emit('CB:message', stanza)
		const deadline = Date.now() + 3000
		let received: Received = { upserts, nodes: [] }
		while (Date.now() < deadline) {
			sock.ev.flush()
			received = { upserts, nodes: await sentNodes() }
			if (done(received)) break
			await new Promise(resolve => setTimeout(resolve, 10))
		}

		return received
	}

	const upserted = ({ upserts }: Received) => upserts.length > 0
	const acked = ({ nodes }: Received) => nodes.some(node => node.tag === 'ack')

	it('decrypts the reply with the secret of our prompt and acknowledges it', async () => {
		const lookups: proto.IMessageKey[] = []
		await withSocket(
			{
				getMessage: async key => {
					lookups.push(key)
					return { conversation: 'prompt', messageContextInfo: { messageSecret: SECRET } }
				}
			},
			async sock => {
				const { upserts, nodes } = await receive(sock, reply, upserted)

				expect(lookups).toEqual([{ remoteJid: BOT, id: 'PROMPT_1', fromMe: true }])
				expect(upserts.map(msg => msg.message?.conversation)).toEqual(['test-ai'])
				const receipt = nodes.find(node => node.tag === 'receipt')
				expect(receipt?.attrs).toMatchObject({ id: 'RESPONSE_FIXTURE_1', to: BOT })
				expect(nodes.some(node => node.tag === 'ack' && node.attrs.error)).toBe(false)
			}
		)
	})

	it('nacks with 495 and sends no retry receipt when the secret is missing', async () => {
		await withSocket({}, async sock => {
			const { upserts, nodes } = await receive(sock, reply, acked)

			expect(upserts).toEqual([])
			expect(nodes.find(node => node.tag === 'ack')?.attrs).toMatchObject({ id: 'RESPONSE_FIXTURE_1', error: '495' })
			expect(nodes.some(node => node.tag === 'receipt')).toBe(false)
		})
	})

	it("files our other device's copy of a message to the bot under the bot chat and receipts it to that device", async () => {
		const OWN_PHONE = '15550009999:2@lid'
		const copy: BinaryNode = {
			tag: 'message',
			attrs: { id: 'PROMPT_9', from: OWN_PHONE, recipient: BOT, t: '1700000000', type: 'text' },
			content: [{ tag: 'enc', attrs: { v: '2', type: 'msg' }, content: new Uint8Array([1, 2, 3]) }]
		}
		await withSocket(
			{
				decrypted: {
					deviceSentMessage: { destinationJid: BOT, message: { conversation: 'asked on the phone' } }
				}
			},
			async sock => {
				const { upserts, nodes } = await receive(sock, copy, upserted)

				expect(upserts.map(msg => [msg.key?.remoteJid, msg.key?.fromMe, msg.message?.conversation])).toEqual([
					[BOT, true, 'asked on the phone']
				])
				// as WhatsApp clients do: to the device it came from, naming the chat as recipient
				const receipt = nodes.find(node => node.tag === 'receipt')
				expect(receipt?.attrs).toMatchObject({ id: 'PROMPT_9', to: OWN_PHONE, recipient: BOT, type: 'sender' })
			}
		)
	})
})
