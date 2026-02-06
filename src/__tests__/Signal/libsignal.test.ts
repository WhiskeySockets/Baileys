import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState } from '../../Types'

const logger = P({ level: 'silent' })

describe('jidToSignalProtocolAddress', () => {
	// Create a minimal mock auth state
	const mockAuth: SignalAuthState = {
		creds: {
			registrationId: 1234,
			signedIdentityKey: {
				public: new Uint8Array(32),
				private: new Uint8Array(32)
			},
			signedPreKey: {
				keyId: 1,
				keyPair: {
					public: new Uint8Array(32),
					private: new Uint8Array(32)
				},
				signature: new Uint8Array(64)
			}
		},
		keys: {
			get: async () => ({}),
			set: async () => {},
			transaction: async (work: any) => await work(),
			isInTransaction: () => false
		}
	} as any

	const repository = makeLibSignalRepository(mockAuth, logger)

	describe('device 99 validation', () => {
		it('should accept :99@hosted for hosted PN devices', () => {
			const jid = '5511999887766:99@hosted'
			expect(() => repository.jidToSignalProtocolAddress(jid)).not.toThrow()
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toContain('5511999887766_128.99')
		})

		it('should accept :99@hosted.lid for hosted LID devices', () => {
			const jid = '18217575229588:99@hosted.lid'
			expect(() => repository.jidToSignalProtocolAddress(jid)).not.toThrow()
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toContain('18217575229588_129.99')
		})

		it('should reject :99@lid as invalid (must be @hosted.lid, not @lid)', () => {
			const jid = '18217575229588:99@lid'
			expect(() => repository.jidToSignalProtocolAddress(jid)).toThrow(
				'Unexpected non-hosted device JID with device 99'
			)
		})

		it('should reject :99@s.whatsapp.net as invalid', () => {
			const jid = '5511999887766:99@s.whatsapp.net'
			expect(() => repository.jidToSignalProtocolAddress(jid)).toThrow(
				'Unexpected non-hosted device JID with device 99'
			)
		})

		it('should reject :99@g.us as invalid', () => {
			const jid = '123456789:99@g.us'
			expect(() => repository.jidToSignalProtocolAddress(jid)).toThrow(
				'Unexpected non-hosted device JID with device 99'
			)
		})
	})

	describe('standard device validation', () => {
		it('should handle regular PN JID without device', () => {
			const jid = '5511999887766@s.whatsapp.net'
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toBe('5511999887766.0')
		})

		it('should handle LID JID without device', () => {
			const jid = '18217575229588@lid'
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toBe('18217575229588_1.0')
		})

		it('should handle PN JID with companion device', () => {
			const jid = '5511999887766:1@s.whatsapp.net'
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toBe('5511999887766.1')
		})

		it('should handle LID JID with companion device', () => {
			const jid = '18217575229588:33@lid'
			const result = repository.jidToSignalProtocolAddress(jid)
			expect(result).toBe('18217575229588_1.33')
		})
	})
})
