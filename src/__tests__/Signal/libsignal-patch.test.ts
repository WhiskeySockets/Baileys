import { jest } from '@jest/globals'
import { hasSessionCipherYieldPatch, patchSessionCipherYield } from '../../Signal/libsignal'
import type { ILogger } from '../../Utils/logger'

const mockLogger = {
	info: jest.fn(),
	warn: jest.fn()
} as unknown as ILogger

describe('libsignal SessionCipher yield patch', () => {
	it('should apply SessionCipher doDecryptWhisperMessage patch', () => {
		patchSessionCipherYield(mockLogger)

		expect(hasSessionCipherYieldPatch()).toBe(true)
	})
})
