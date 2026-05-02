import * as decodeWaMessageModule from '../../Utils/decode-wa-message'
import { NACK_REASONS, decodeMessageNode } from '../../Utils/decode-wa-message'
import type { BinaryNode } from '../../WABinary'

describe('NACK_REASONS', () => {
	it('should have all required NACK reason codes', () => {
		expect(NACK_REASONS.ParsingError).toBe(487)
		expect(NACK_REASONS.UnrecognizedStanza).toBe(488)
		expect(NACK_REASONS.UnrecognizedStanzaClass).toBe(489)
		expect(NACK_REASONS.UnrecognizedStanzaType).toBe(490)
		expect(NACK_REASONS.InvalidProtobuf).toBe(491)
		expect(NACK_REASONS.InvalidHostedCompanionStanza).toBe(493)
		expect(NACK_REASONS.MissingMessageSecret).toBe(495)
		expect(NACK_REASONS.SignalErrorOldCounter).toBe(496)
		expect(NACK_REASONS.MessageDeletedOnPeer).toBe(499)
		expect(NACK_REASONS.UnhandledError).toBe(500)
		expect(NACK_REASONS.UnsupportedAdminRevoke).toBe(550)
		expect(NACK_REASONS.UnsupportedLIDGroup).toBe(551)
		expect(NACK_REASONS.DBOperationFailed).toBe(552)
	})

	it('should not export SERVER_ERROR_CODES (removed in this PR)', () => {
		// SERVER_ERROR_CODES was removed from decode-wa-message exports
		expect((decodeWaMessageModule as any).SERVER_ERROR_CODES).toBeUndefined()
	})
})

describe('decodeMessageNode', () => {
	const meId = '1234567890@s.whatsapp.net'
	const meLid = '111111111111111@lid'

	const makeMessageNode = (attrs: Record<string, string>): BinaryNode => ({
		tag: 'message',
		attrs: {
			id: 'test-msg-id',
			t: '1700000000',
			...attrs
		}
	})

	describe('key does not contain username fields', () => {
		it('should not have remoteJidUsername in key for chat messages', () => {
			const node = makeMessageNode({
				from: '9876543210@s.whatsapp.net',
				id: 'msg-001'
			})
			const result = decodeMessageNode(node, meId, meLid)
			// remoteJidUsername was removed from the key in this PR
			expect((result.key as any).remoteJidUsername).toBeUndefined()
		})

		it('should not have participantUsername in key for group messages', () => {
			const node = makeMessageNode({
				from: '123456789012345678@g.us',
				participant: '9876543210@s.whatsapp.net',
				participant_username: 'someuser',
				id: 'msg-002'
			})
			const result = decodeMessageNode(node, meId, meLid)
			// participantUsername was removed from the key in this PR
			expect((result.key as any).participantUsername).toBeUndefined()
		})

		it('should not set remoteJidUsername even when stanza has recipient_username attr', () => {
			const node = makeMessageNode({
				from: meId,
				recipient: '9876543210@s.whatsapp.net',
				recipient_username: 'testuser',
				id: 'msg-003'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect((result.key as any).remoteJidUsername).toBeUndefined()
		})

		it('should not set remoteJidUsername even when stanza has peer_recipient_username attr', () => {
			const node = makeMessageNode({
				from: '9876543210@s.whatsapp.net',
				peer_recipient_username: 'peeruser',
				id: 'msg-004'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect((result.key as any).remoteJidUsername).toBeUndefined()
		})
	})

	describe('key still contains expected fields', () => {
		it('should have correct remoteJid for a chat message', () => {
			const node = makeMessageNode({
				from: '9876543210@s.whatsapp.net',
				id: 'msg-chat'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect(result.key.remoteJid).toBe('9876543210@s.whatsapp.net')
			expect(result.key.fromMe).toBe(false)
			expect(result.key.id).toBe('msg-chat')
		})

		it('should set fromMe correctly for outgoing message (from=me, recipient=other)', () => {
			const node = makeMessageNode({
				from: meId,
				recipient: '9876543210@s.whatsapp.net',
				id: 'msg-outgoing'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect(result.key.fromMe).toBe(true)
			expect(result.key.remoteJid).toBe('9876543210@s.whatsapp.net')
		})

		it('should set participant for group message', () => {
			const node = makeMessageNode({
				from: '123456789012345678@g.us',
				participant: '9876543210@s.whatsapp.net',
				id: 'msg-group'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect(result.key.participant).toBe('9876543210@s.whatsapp.net')
			expect(result.key.remoteJid).toBe('123456789012345678@g.us')
		})

		it('should throw for group messages without participant', () => {
			const node = makeMessageNode({
				from: '123456789012345678@g.us',
				id: 'msg-group-no-participant'
			})
			expect(() => decodeMessageNode(node, meId, meLid)).toThrow('No participant in group message')
		})

		it('should include pushName from notify attr', () => {
			const node = makeMessageNode({
				from: '9876543210@s.whatsapp.net',
				notify: 'Test User',
				id: 'msg-notify'
			})
			const result = decodeMessageNode(node, meId, meLid)
			expect(result.message.pushName).toBe('Test User')
		})
	})
})