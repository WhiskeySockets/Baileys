import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import { decodeBinaryNodeWithBuffer, encodeBinaryNode } from '../../WABinary'
import type { BinaryNode } from '../../WABinary/types'

describe('frame bytes travel alongside the node', () => {
	it('hands back the buffer the node was decoded from', async () => {
		const node: BinaryNode = {
			tag: 'message',
			attrs: { id: 'ABCD1234', from: '5511999998888@s.whatsapp.net' },
			content: [{ tag: 'enc', attrs: { type: 'msg' }, content: new Uint8Array([1, 2, 3]) }]
		}

		const encoded = encodeBinaryNode(node)
		const { node: decoded, decompressed } = await decodeBinaryNodeWithBuffer(encoded)

		expect(decoded.tag).toBe('message')
		expect(decoded.attrs.id).toBe('ABCD1234')

		// The format byte is stripped, since that is what the decoder consumed.
		expect(Buffer.from(decompressed)).toEqual(encoded.subarray(1))
	})

	it('gives bytes that decode to the same node a second time', async () => {
		const node: BinaryNode = {
			tag: 'receipt',
			attrs: { id: 'R1', from: '5511999998888@s.whatsapp.net', type: 'read' }
		}

		const { decompressed } = await decodeBinaryNodeWithBuffer(encodeBinaryNode(node))
		// Format byte prefixed back, since that is what the entry point takes.
		const again = await decodeBinaryNodeWithBuffer(Buffer.concat([Buffer.of(0), decompressed]))

		expect(again.node).toEqual((await decodeBinaryNodeWithBuffer(encodeBinaryNode(node))).node)
	})
})

describe('a decrypted payload is reported per <enc>', () => {
	const decryptedMessage = () => proto.Message.encode({ conversation: 'hello' }).finish()

	/** Pad to a 16-byte boundary the way WhatsApp does. */
	const padRandomMax16 = (bytes: Uint8Array) => {
		const pad = 16 - (bytes.length % 16)
		const out = new Uint8Array(bytes.length + pad)
		out.set(bytes)
		out.fill(pad, bytes.length)
		return out
	}

	it('addresses a payload by the child index it came from, not by counting <enc>', async () => {
		const { decryptMessageNode } = await import('../../Utils/decode-wa-message')
		const plaintext = decryptedMessage()

		// Two `<enc>` at child indices 1 and 2. Counting `<enc>` nodes instead
		// would report 0 and 1, so the positions have to be the child ones.
		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'M1', from: '5511999998888@s.whatsapp.net', t: '1' },
			content: [
				{ tag: 'participants', attrs: {} },
				{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: padRandomMax16(plaintext) },
				{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: padRandomMax16(plaintext) }
			]
		}

		const seen: { childIndex: number; encType: string; unpadded: boolean; bytes: Uint8Array }[] = []
		const { decrypt } = decryptMessageNode(
			stanza,
			'5511111111111:1@s.whatsapp.net',
			'',
			echoingRepository() as never,
			createSilentLogger() as never,
			payload =>
				seen.push({
					childIndex: payload.childIndex,
					encType: payload.encType,
					unpadded: payload.unpadded,
					bytes: payload.plaintext
				})
		)
		await decrypt()

		expect(seen.map(entry => entry.childIndex)).toEqual([1, 2])
		expect(seen.map(entry => entry.encType)).toEqual(['msg', 'pkmsg'])
		expect(seen.every(entry => entry.unpadded)).toBe(true)
		expect(Buffer.from(seen[0]!.bytes)).toEqual(Buffer.from(plaintext))
	})

	it('hands over a plaintext whose padding will not strip', async () => {
		const { decryptMessageNode } = await import('../../Utils/decode-wa-message')

		// A padding byte claiming more than the buffer holds. The ratchet has
		// already advanced, so this plaintext exists exactly once.
		const badlyPadded = new Uint8Array([1, 2, 3, 99])

		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'M2', from: '5511999998888@s.whatsapp.net', t: '1' },
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: badlyPadded }]
		}

		const seen: { unpadded: boolean; bytes: Uint8Array }[] = []
		const { decrypt } = decryptMessageNode(
			stanza,
			'5511111111111:1@s.whatsapp.net',
			'',
			echoingRepository() as never,
			createSilentLogger() as never,
			payload => seen.push({ unpadded: payload.unpadded, bytes: payload.plaintext })
		)
		await decrypt()

		expect(seen).toHaveLength(1)
		expect(seen[0]!.unpadded).toBe(false)
		expect(Buffer.from(seen[0]!.bytes)).toEqual(Buffer.from(badlyPadded))
	})

	it('ignores a <plaintext> child, which never went through Signal', async () => {
		const { decryptMessageNode } = await import('../../Utils/decode-wa-message')

		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'M3', from: '5511999998888@s.whatsapp.net', t: '1' },
			content: [{ tag: 'plaintext', attrs: {}, content: decryptedMessage() }]
		}

		const seen: unknown[] = []
		const { decrypt } = decryptMessageNode(
			stanza,
			'5511111111111:1@s.whatsapp.net',
			'',
			echoingRepository() as never,
			createSilentLogger() as never,
			payload => seen.push(payload)
		)
		await decrypt()

		expect(seen).toHaveLength(0)
	})

	it('is handed a copy, so it cannot change what the message decodes to', async () => {
		const { decryptMessageNode } = await import('../../Utils/decode-wa-message')

		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'M5', from: '5511999998888@s.whatsapp.net', t: '1' },
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: padRandomMax16(decryptedMessage()) }]
		}

		const { fullMessage, decrypt } = decryptMessageNode(
			stanza,
			'5511111111111:1@s.whatsapp.net',
			'',
			echoingRepository() as never,
			createSilentLogger() as never,
			// These bytes go to the protobuf parser right after this returns.
			payload => payload.plaintext.fill(0xff)
		)
		await decrypt()

		expect(fullMessage.messageStubType).toBeUndefined()
		expect(fullMessage.message?.conversation).toBe('hello')
	})

	it('keeps decrypting when the callback throws', async () => {
		const { decryptMessageNode } = await import('../../Utils/decode-wa-message')

		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'M4', from: '5511999998888@s.whatsapp.net', t: '1' },
			content: [{ tag: 'enc', attrs: { type: 'msg', v: '2' }, content: padRandomMax16(decryptedMessage()) }]
		}

		let calls = 0
		const { fullMessage, decrypt } = decryptMessageNode(
			stanza,
			'5511111111111:1@s.whatsapp.net',
			'',
			echoingRepository() as never,
			createSilentLogger() as never,
			() => {
				calls += 1
				throw new Error('observer blew up')
			}
		)
		await decrypt()

		// Without this the test would also pass if the callback never ran, which
		// is the other way to not see an exception.
		expect(calls).toBe(1)

		// Not a CIPHERTEXT stub: the message decrypted, the observer did not.
		expect(fullMessage.messageStubType).toBeUndefined()
		expect(fullMessage.message?.conversation).toBe('hello')
	})
})

/** Hands the ciphertext straight back, so the test covers the hook and not libsignal. */
const echoingRepository = () => ({
	decryptMessage: jest.fn(async ({ ciphertext }: { ciphertext: Uint8Array }) => ciphertext),
	decryptGroupMessage: jest.fn(),
	processSenderKeyDistributionMessage: jest.fn(),
	lidMapping: {
		getLIDForPN: jest.fn(async () => undefined),
		getPNForLID: jest.fn(async () => undefined),
		storeLIDPNMappings: jest.fn(async () => {})
	}
})

const createSilentLogger = () => ({
	child: jest.fn().mockReturnThis(),
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	fatal: jest.fn(),
	level: 'silent'
})
