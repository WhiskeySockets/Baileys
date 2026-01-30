import { Browsers, getPlatformId, isValidBrowserPreset, detectedOSVersions } from '../../Utils/browser-utils'

describe('browser-utils', () => {
	describe('Browsers', () => {
		describe('ubuntu', () => {
			it('should return correct tuple for Ubuntu', () => {
				const result = Browsers.ubuntu('Chrome')
				expect(result[0]).toBe('Ubuntu')
				expect(result[1]).toBe('Chrome')
				expect(result[2]).toMatch(/^\d+\.\d+/) // Version format like '24.04' or '24.04.1'
			})

			it('should handle empty browser string', () => {
				const result = Browsers.ubuntu('')
				expect(result[0]).toBe('Ubuntu')
				expect(result[1]).toBe('')
			})

			it('should use auto-detected or fallback version', () => {
				const result = Browsers.ubuntu('Test')
				// Version should be a non-empty string
				expect(typeof result[2]).toBe('string')
				expect(result[2].length).toBeGreaterThan(0)
			})
		})

		describe('macOS', () => {
			it('should return correct tuple for macOS', () => {
				const result = Browsers.macOS('Safari')
				expect(result[0]).toBe('Mac OS')
				expect(result[1]).toBe('Safari')
				expect(result[2]).toMatch(/^\d+\.\d+/) // Version format like '15.2'
			})
		})

		describe('windows', () => {
			it('should return correct tuple for Windows', () => {
				const result = Browsers.windows('Edge')
				expect(result[0]).toBe('Windows')
				expect(result[1]).toBe('Edge')
				expect(result[2]).toMatch(/^\d+\.\d+\.\d+/) // Version format like '10.0.26100'
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

			it('should return a valid version string', () => {
				const result = Browsers.appropriate('Test')
				expect(result[2]).toBeDefined()
				expect(typeof result[2]).toBe('string')
				expect(result[2].length).toBeGreaterThan(0)
			})
		})
	})

	describe('detectedOSVersions', () => {
		it('should expose detected versions', () => {
			expect(detectedOSVersions).toBeDefined()
			expect(typeof detectedOSVersions.ubuntu).toBe('string')
			expect(typeof detectedOSVersions.macOS).toBe('string')
			expect(typeof detectedOSVersions.windows).toBe('string')
			expect(typeof detectedOSVersions.baileys).toBe('string')
		})

		it('should have valid version formats', () => {
			// Ubuntu: X.X or X.X.X
			expect(detectedOSVersions.ubuntu).toMatch(/^\d+\.\d+(\.\d+)?$/)
			// macOS: X.X or X.X.X
			expect(detectedOSVersions.macOS).toMatch(/^\d+\.\d+(\.\d+)?$/)
			// Windows: X.X.XXXXX
			expect(detectedOSVersions.windows).toMatch(/^\d+\.\d+\.\d+$/)
			// Baileys: semver
			expect(detectedOSVersions.baileys).toMatch(/^\d+\.\d+\.\d+$/)
		})

		it('should match Browsers preset versions', () => {
			expect(Browsers.ubuntu('Test')[2]).toBe(detectedOSVersions.ubuntu)
			expect(Browsers.macOS('Test')[2]).toBe(detectedOSVersions.macOS)
			expect(Browsers.windows('Test')[2]).toBe(detectedOSVersions.windows)
			expect(Browsers.baileys('Test')[2]).toBe(detectedOSVersions.baileys)
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
			const result = getPlatformId(undefined)
			expect(result).toBe('1')
		})

		it('should return default ID for null input', () => {
			const result = getPlatformId(null)
			expect(result).toBe('1')
		})

		it('should return default ID for number input', () => {
			const result = getPlatformId(123)
			expect(result).toBe('1')
		})

		it('should return default ID for object input', () => {
			const result = getPlatformId({ browser: 'chrome' })
			expect(result).toBe('1')
		})

		it('should return default ID for array input', () => {
			const result = getPlatformId(['chrome'])
			expect(result).toBe('1')
		})

		it('should always return a string', () => {
			const validResult = getPlatformId('chrome')
			const invalidResult = getPlatformId('nonexistent')
			const undefinedResult = getPlatformId(undefined)
			expect(typeof validResult).toBe('string')
			expect(typeof invalidResult).toBe('string')
			expect(typeof undefinedResult).toBe('string')
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
			expect(isValidBrowserPreset('MacOS')).toBe(false)
		})

		it('should return false for non-string values', () => {
			expect(isValidBrowserPreset(undefined)).toBe(false)
			expect(isValidBrowserPreset(null)).toBe(false)
			expect(isValidBrowserPreset(123)).toBe(false)
			expect(isValidBrowserPreset({})).toBe(false)
			expect(isValidBrowserPreset([])).toBe(false)
			expect(isValidBrowserPreset(true)).toBe(false)
		})

		// Critical security test: inherited properties should not match
		it('should return false for inherited Object properties (security)', () => {
			expect(isValidBrowserPreset('toString')).toBe(false)
			expect(isValidBrowserPreset('constructor')).toBe(false)
			expect(isValidBrowserPreset('valueOf')).toBe(false)
			expect(isValidBrowserPreset('hasOwnProperty')).toBe(false)
			expect(isValidBrowserPreset('__proto__')).toBe(false)
			expect(isValidBrowserPreset('prototype')).toBe(false)
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
			expect(() => getPlatformId(undefined)).not.toThrow()
			expect(() => getPlatformId(null)).not.toThrow()
			expect(() => getPlatformId({})).not.toThrow()
			expect(() => getPlatformId([])).not.toThrow()
			expect(() => getPlatformId(Symbol('test'))).not.toThrow()
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

		it('version strings should never be empty', () => {
			const presets = ['ubuntu', 'macOS', 'windows', 'baileys', 'appropriate'] as const
			for (const preset of presets) {
				const result = Browsers[preset]('Test')
				expect(result[2].length).toBeGreaterThan(0)
			}
		})
	})

	describe('version detection', () => {
		it('should detect a reasonable Ubuntu version', () => {
			const version = detectedOSVersions.ubuntu
			// Should be at least 18.04 (oldest supported LTS)
			const majorVersion = parseFloat(version)
			expect(majorVersion).toBeGreaterThanOrEqual(18)
		})

		it('should detect a reasonable macOS version', () => {
			const version = detectedOSVersions.macOS
			// Should be at least macOS 10.x or 11+
			const majorVersion = parseFloat(version)
			expect(majorVersion).toBeGreaterThanOrEqual(10)
		})

		it('should detect a reasonable Windows version', () => {
			const version = detectedOSVersions.windows
			// Should start with 10. (Windows 10/11)
			expect(version).toMatch(/^10\./)
		})
	})
})
