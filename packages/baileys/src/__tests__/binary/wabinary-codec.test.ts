import { describe, expect, it } from '@jest/globals'
import { decodeBinaryNode } from '../../WABinary/decode'
import { encodeBinaryNode } from '../../WABinary/encode'
import type { BinaryNode } from '../../WABinary/types'

/**
 * Wire-level cases the bridge migration got wrong, kept here because they are
 * about what Baileys puts on the socket rather than about the codec's shape.
 */
describe('WABinary codec', () => {
	it('omits attributes that are null or undefined', async () => {
		// These reach the encoder unset from real call sites: a USync user
		// queried by phone has no jid, and a media retry can have no
		// participant. Stringifying them sends the text "undefined".
		const node = {
			tag: 'user',
			attrs: { jid: undefined, phone: '+5511900000001', participant: null }
		} as unknown as BinaryNode

		const decoded = await decodeBinaryNode(encodeBinaryNode(node))
		expect(decoded.attrs).toEqual({ phone: '+5511900000001' })
	})

	it('keeps the leading @ on a server-only jid', async () => {
		// `handleEncryptNotification` routes on `from === S_WHATSAPP_NET`, so a
		// bare `s.whatsapp.net` sends the pre-key count down the
		// identity-change branch and replenishment never runs.
		const node: BinaryNode = { tag: 'iq', attrs: { from: '@s.whatsapp.net', type: 'result', id: '1' } }

		expect((await decodeBinaryNode(encodeBinaryNode(node))).attrs.from).toBe('@s.whatsapp.net')
	})

	it('round trips a frame back to the same bytes', async () => {
		const node: BinaryNode = {
			tag: 'message',
			attrs: { from: '@s.whatsapp.net', type: 'text', t: '1785984009' },
			content: [{ tag: 'enc', attrs: { v: '2', type: 'pkmsg' }, content: Buffer.alloc(64, 7) }]
		}

		const frame = encodeBinaryNode(node)
		expect(encodeBinaryNode(await decodeBinaryNode(frame))).toEqual(frame)
	})
})

describe('WABinary encoder guards', () => {
	it('refuses a node with no tag', () => {
		// An empty tag has no valid encoding; interning it put a malformed
		// stanza on the socket instead of failing here.
		expect(() => encodeBinaryNode({ tag: '', attrs: {} })).toThrow('tag cannot be undefined')
		expect(() => encodeBinaryNode({ tag: 'a', attrs: {}, content: [{ tag: '', attrs: {} }] })).toThrow(
			'tag cannot be undefined'
		)
	})

	it('drops a child left out of a conditionally built list', async () => {
		const node = {
			tag: 'a',
			attrs: {},
			content: [null, { tag: 'b', attrs: {} }, undefined]
		} as unknown as BinaryNode

		const decoded = await decodeBinaryNode(encodeBinaryNode(node))
		expect((decoded.content as BinaryNode[]).map(child => child.tag)).toEqual(['b'])
	})
})
