import { proto } from '../../../WAProto/index.js'
import type { WAMessage } from '../../Types'
import {
	isDecryptionFailure,
	isRecoverableDecryptionError,
	isPreKeyDecryptionError,
	shouldAttemptRetry
} from '../../Utils'
import { MISSING_KEYS_ERROR_TEXT, NO_MESSAGE_FOUND_ERROR_TEXT } from '../../Utils/decode-wa-message'

describe('Message Error Utils', () => {
	describe('isDecryptionFailure', () => {
		it('should return true for CIPHERTEXT stub type', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT
			} as WAMessage
			expect(isDecryptionFailure(msg)).toBe(true)
		})

		it('should return false for other stub types', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.E2E_ENCRYPTED
			} as WAMessage
			expect(isDecryptionFailure(msg)).toBe(false)
		})

		it('should return false when no stub type', () => {
			const msg = {} as WAMessage
			expect(isDecryptionFailure(msg)).toBe(false)
		})
	})

	describe('isRecoverableDecryptionError', () => {
		it('should return true for MISSING_KEYS_ERROR_TEXT', () => {
			const msg = {
				messageStubParameters: [MISSING_KEYS_ERROR_TEXT]
			} as WAMessage
			expect(isRecoverableDecryptionError(msg)).toBe(true)
		})

		it('should return true for NO_MESSAGE_FOUND_ERROR_TEXT', () => {
			const msg = {
				messageStubParameters: [NO_MESSAGE_FOUND_ERROR_TEXT]
			} as WAMessage
			expect(isRecoverableDecryptionError(msg)).toBe(true)
		})

		it('should return false for other errors', () => {
			const msg = {
				messageStubParameters: ['PreKey not found']
			} as WAMessage
			expect(isRecoverableDecryptionError(msg)).toBe(false)
		})

		it('should return false when no stub parameters', () => {
			const msg = {} as WAMessage
			expect(isRecoverableDecryptionError(msg)).toBe(false)
		})
	})

	describe('isPreKeyDecryptionError', () => {
		it('should return true when error contains PreKey', () => {
			const msg = {
				messageStubParameters: ['PreKey not found for session']
			} as WAMessage
			expect(isPreKeyDecryptionError(msg)).toBe(true)
		})

		it('should return false for other errors', () => {
			const msg = {
				messageStubParameters: ['Session not found']
			} as WAMessage
			expect(isPreKeyDecryptionError(msg)).toBe(false)
		})

		it('should return false when no stub parameters', () => {
			const msg = {} as WAMessage
			expect(isPreKeyDecryptionError(msg)).toBe(false)
		})
	})

	describe('shouldAttemptRetry', () => {
		it('should return true for non-peer decryption failure with non-recoverable error', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['PreKey error']
			} as WAMessage
			expect(shouldAttemptRetry(msg, 'message')).toBe(true)
		})

		it('should return false for peer category', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['PreKey error']
			} as WAMessage
			expect(shouldAttemptRetry(msg, 'peer')).toBe(false)
		})

		it('should return false for recoverable errors', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: [MISSING_KEYS_ERROR_TEXT]
			} as WAMessage
			expect(shouldAttemptRetry(msg, 'message')).toBe(false)
		})

		it('should return false when not a decryption failure', () => {
			const msg = {
				messageStubType: proto.WebMessageInfo.StubType.E2E_ENCRYPTED
			} as WAMessage
			expect(shouldAttemptRetry(msg, 'message')).toBe(false)
		})
	})
})
