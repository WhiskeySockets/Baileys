import { Browsers, getPlatformId, isValidBrowserPreset } from '../../Utils/browser-utils'

describe('browser-utils', () => {
	describe('Browsers', () => {
		describe('ubuntu', () => {
			it('should return correct tuple for Ubuntu', () => {
				const result = Browsers.ubuntu('Chrome')
				expect(result).toEqual(['Ubuntu', 'Chrome', '22.04.4'])
			})

			it('should handle empty browser string', () => {
				const result = Browsers.ubuntu('')
				expect(result).toEqual(['Ubuntu', '', '22.04.4'])
			})
		})

		describe('macOS', () => {
			it('should return correct tuple for macOS', () => {
				const result = Browsers.macOS('Safari')
				expect(result).toEqual(['Mac OS', 'Safari', '14.4.1'])
			})
		})

		describe('windows', () => {
			it('should return correct tuple for Windows', () => {
				const result = Browsers.windows('Edge')
				expect(result).toEqual(['Windows', 'Edge', '10.0.22631'])
			})
		})

		describe('baileys', () => {
			it('should return correct tuple for Baileys', () => {
				const result = Browsers.baileys('Baileys')
				expect(result).toEqual(['Baileys', 'Baileys', '6.5.0'])
			})
		})

		describe('appropriate', () => {
			it('should return a valid tuple with platform detection', () => {
				const result = Browsers.appropriate('MyApp')
				expect(result).toHaveLength(3)
				expect(typeof result[0]).toBe('string')
				expect(result[1]).toBe('MyApp')
				expect(typeof result[2]).toBe('string')
			})

			it('should never return undefined for platform', () => {
				const result = Browsers.appropriate('Test')
				expect(result[0]).toBeDefined()
				expect(result[0]).not.toBe('')
				// Should be a valid platform name
				expect(['Ubuntu', 'Mac OS', 'Windows', 'AIX', 'Android', 'FreeBSD', 'OpenBSD', 'Solaris']).toContain(result[0])
			})
		})
	})

	describe('getPlatformId', () => {
		it('should return platform ID for valid browser string', () => {
			const result = getPlatformId('chrome')
			expect(result).toBe('1')
		})

		it('should be case-insensitive', () => {
			const lowercase = getPlatformId('chrome')
			const uppercase = getPlatformId('CHROME')
			const mixed = getPlatformId('Chrome')
			expect(lowercase).toBe(uppercase)
			expect(uppercase).toBe(mixed)
		})

		it('should return default ID for empty string', () => {
			const result = getPlatformId('')
			expect(result).toBe('1')
		})

		it('should return default ID for whitespace-only string', () => {
			const result = getPlatformId('   ')
			expect(result).toBe('1')
		})

		it('should return default ID for unknown browser', () => {
			const result = getPlatformId('unknown_browser_xyz')
			expect(result).toBe('1')
		})

		it('should handle string with leading/trailing whitespace', () => {
			const result = getPlatformId('  chrome  ')
			expect(result).toBe('1')
		})

		it('should return default ID for undefined input', () => {
			// @ts-expect-error - Testing runtime behavior with invalid input
			const result = getPlatformId(undefined)
			expect(result).toBe('1')
		})

		it('should return default ID for null input', () => {
			// @ts-expect-error - Testing runtime behavior with invalid input
			const result = getPlatformId(null)
			expect(result).toBe('1')
		})

		it('should return default ID for number input', () => {
			// @ts-expect-error - Testing runtime behavior with invalid input
			const result = getPlatformId(123)
			expect(result).toBe('1')
		})

		it('should return default ID for object input', () => {
			// @ts-expect-error - Testing runtime behavior with invalid input
			const result = getPlatformId({ browser: 'chrome' })
			expect(result).toBe('1')
		})

		it('should always return a string', () => {
			const validResult = getPlatformId('chrome')
			const invalidResult = getPlatformId('nonexistent')
			expect(typeof validResult).toBe('string')
			expect(typeof invalidResult).toBe('string')
		})
	})

	describe('isValidBrowserPreset', () => {
		it('should return true for valid preset keys', () => {
			expect(isValidBrowserPreset('ubuntu')).toBe(true)
			expect(isValidBrowserPreset('macOS')).toBe(true)
			expect(isValidBrowserPreset('windows')).toBe(true)
			expect(isValidBrowserPreset('baileys')).toBe(true)
			expect(isValidBrowserPreset('appropriate')).toBe(true)
		})

		it('should return false for invalid preset keys', () => {
			expect(isValidBrowserPreset('invalid')).toBe(false)
			expect(isValidBrowserPreset('UBUNTU')).toBe(false)
			expect(isValidBrowserPreset('Ubuntu')).toBe(false)
		})

		it('should return false for non-string values', () => {
			expect(isValidBrowserPreset(undefined)).toBe(false)
			expect(isValidBrowserPreset(null)).toBe(false)
			expect(isValidBrowserPreset(123)).toBe(false)
			expect(isValidBrowserPreset({})).toBe(false)
			expect(isValidBrowserPreset([])).toBe(false)
		})

		it('should work as type guard', () => {
			const input: unknown = 'ubuntu'
			if (isValidBrowserPreset(input)) {
				// TypeScript should allow this after the type guard
				const config = Browsers[input]('Test')
				expect(config).toHaveLength(3)
			}
		})
	})

	describe('edge cases and robustness', () => {
		it('should not throw on any Browsers method call', () => {
			expect(() => Browsers.ubuntu('test')).not.toThrow()
			expect(() => Browsers.macOS('test')).not.toThrow()
			expect(() => Browsers.windows('test')).not.toThrow()
			expect(() => Browsers.baileys('test')).not.toThrow()
			expect(() => Browsers.appropriate('test')).not.toThrow()
		})

		it('should not throw on getPlatformId with any input', () => {
			expect(() => getPlatformId('valid')).not.toThrow()
			expect(() => getPlatformId('')).not.toThrow()
			// @ts-expect-error - Testing runtime behavior
			expect(() => getPlatformId(undefined)).not.toThrow()
			// @ts-expect-error - Testing runtime behavior
			expect(() => getPlatformId(null)).not.toThrow()
			// @ts-expect-error - Testing runtime behavior
			expect(() => getPlatformId({})).not.toThrow()
		})

		it('all Browsers methods should return readonly-compatible tuples', () => {
			const presets = ['ubuntu', 'macOS', 'windows', 'baileys', 'appropriate'] as const
			for (const preset of presets) {
				const result = Browsers[preset]('Test')
				expect(Array.isArray(result)).toBe(true)
				expect(result.length).toBe(3)
				expect(result.every(item => typeof item === 'string')).toBe(true)
			}
		})
	})
})
