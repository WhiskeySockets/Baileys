import { buildAckStanza } from '../../Utils/stanza-ack'
import { type BinaryNode } from '../../WABinary'

describe('buildAckStanza', () => {
	describe('basic stanza construction', () => {
		it('should build a minimal ACK stanza from a message node', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack).toEqual({
				tag: 'ack',
				attrs: {
					id: 'msg-001',
					to: 'user@s.whatsapp.net',
					class: 'message'
				}
			})
		})

		it('should build ACK for receipt node', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.class).toBe('receipt')
		})

		it('should build ACK for notification node', () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: {
					id: 'notif-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.class).toBe('notification')
		})

		it('should build ACK for call node', () => {
			const node: BinaryNode = {
				tag: 'call',
				attrs: {
					id: 'call-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.class).toBe('call')
		})
	})

	describe('error codes (NACK)', () => {
		it('should include error attribute when errorCode is provided and non-zero', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: { id: 'msg-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node, 500)
			expect(ack.attrs.error).toBe('500')
		})

		it('should include error for all known NACK codes', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: { id: 'msg-001', from: 'user@s.whatsapp.net' }
			}

			const nackCodes = [487, 488, 491, 495, 496, 500, 552]
			for (const code of nackCodes) {
				const ack = buildAckStanza(node, code)
				expect(ack.attrs.error).toBe(code.toString())
			}
		})

		it('should NOT include error when errorCode is 0', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: { id: 'msg-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node, 0)
			expect(ack.attrs.error).toBeUndefined()
		})

		it('should NOT include error when errorCode is undefined', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: { id: 'msg-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.error).toBeUndefined()
		})
	})

	describe('participant and recipient forwarding', () => {
		it('should include participant when present in source node', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'group@g.us',
					participant: 'sender@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.participant).toBe('sender@s.whatsapp.net')
		})

		it('should NOT include participant when absent', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: { id: 'msg-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.participant).toBeUndefined()
		})

		it('should include recipient when present', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'user@s.whatsapp.net',
					recipient: 'me@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.recipient).toBe('me@s.whatsapp.net')
		})

		it('should NOT include recipient when absent', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: { id: 'rcpt-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.recipient).toBeUndefined()
		})

		it('should forward both participant and recipient when both present', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'group@g.us',
					participant: 'sender@s.whatsapp.net',
					recipient: 'me@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.participant).toBe('sender@s.whatsapp.net')
			expect(ack.attrs.recipient).toBe('me@s.whatsapp.net')
		})
	})

	describe('type attribute handling (WA Web: n.type || DROP_ATTR)', () => {
		it('should include type for non-message tags', () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: {
					id: 'notif-001',
					from: 'user@s.whatsapp.net',
					type: 'encrypt'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.type).toBe('encrypt')
		})

		it('should always include type for message tag when present', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net',
					type: 'text'
				}
			}

			// type is always included when present, regardless of errorCode
			const ack = buildAckStanza(node, 0)
			expect(ack.attrs.type).toBe('text')
		})

		it('should include type for message NACK', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net',
					type: 'text'
				}
			}

			const ack = buildAckStanza(node, 500)
			expect(ack.attrs.type).toBe('text')
		})

		it('should NOT include type when source node has no type', () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: { id: 'notif-001', from: 'user@s.whatsapp.net' }
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.type).toBeUndefined()
		})

		it('should include type for receipt tag', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'user@s.whatsapp.net',
					type: 'read'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.type).toBe('read')
		})
	})

	describe('from field for message ACKs (WA Web: sendAck/sendNack always include from)', () => {
		it('should set from=meId for message ACK when meId provided', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node, undefined, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBe('me@s.whatsapp.net')
		})

		it('should set from=meId for message NACK when meId provided', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node, 500, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBe('me@s.whatsapp.net')
		})

		it('should set from=meId for unavailable message with meId', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net',
					type: 'text'
				},
				content: [{ tag: 'unavailable', attrs: {} }]
			}

			const ack = buildAckStanza(node, 0, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBe('me@s.whatsapp.net')
		})

		it('should NOT set from for message ACK without meId', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack.attrs.from).toBeUndefined()
		})

		it('should NOT set from for non-message tags even with meId', () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: {
					id: 'notif-001',
					from: 'user@s.whatsapp.net',
					type: 'encrypt'
				}
			}

			const ack = buildAckStanza(node, 0, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBeUndefined()
		})

		it('should NOT set from for receipt tag even with meId', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node, undefined, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBeUndefined()
		})

		it('should NOT set from for call tag even with meId', () => {
			const node: BinaryNode = {
				tag: 'call',
				attrs: {
					id: 'call-001',
					from: 'user@s.whatsapp.net'
				}
			}

			const ack = buildAckStanza(node, undefined, 'me@s.whatsapp.net')
			expect(ack.attrs.from).toBeUndefined()
		})
	})

	describe('full stanza construction (combined attributes)', () => {
		it('should handle group message NACK with all attributes', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'group@g.us',
					participant: 'sender@s.whatsapp.net',
					type: 'text'
				}
			}

			const ack = buildAckStanza(node, 500, 'me@s.whatsapp.net')
			expect(ack).toEqual({
				tag: 'ack',
				attrs: {
					id: 'msg-001',
					to: 'group@g.us',
					class: 'message',
					error: '500',
					participant: 'sender@s.whatsapp.net',
					type: 'text',
					from: 'me@s.whatsapp.net'
				}
			})
		})

		it('should handle group message ACK (no error) with from', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {
					id: 'msg-001',
					from: 'group@g.us',
					participant: 'sender@s.whatsapp.net',
					type: 'text'
				}
			}

			const ack = buildAckStanza(node, undefined, 'me@s.whatsapp.net')
			expect(ack).toEqual({
				tag: 'ack',
				attrs: {
					id: 'msg-001',
					to: 'group@g.us',
					class: 'message',
					participant: 'sender@s.whatsapp.net',
					type: 'text',
					from: 'me@s.whatsapp.net'
				}
			})
		})

		it('should handle receipt with participant and recipient (no from)', () => {
			const node: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: 'rcpt-001',
					from: 'group@g.us',
					participant: 'sender@s.whatsapp.net',
					recipient: 'me@s.whatsapp.net',
					type: 'read'
				}
			}

			const ack = buildAckStanza(node)
			expect(ack).toEqual({
				tag: 'ack',
				attrs: {
					id: 'rcpt-001',
					to: 'group@g.us',
					class: 'receipt',
					participant: 'sender@s.whatsapp.net',
					recipient: 'me@s.whatsapp.net',
					type: 'read'
				}
			})
		})
	})
})
