import { jest } from '@jest/globals'
import type { ILogger } from '../../Utils/logger'
import { hasSessionCipherYieldPatch, patchSessionCipherYield } from '../../Signal/libsignal'

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
