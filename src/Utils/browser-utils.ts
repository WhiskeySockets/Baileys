import { platform, release } from 'os'
import { proto } from '../../WAProto/index.js'
import type { BrowsersMap } from '../Types'

// ============================================================
// Constants
// ============================================================

/**
 * Default platform name when OS detection fails or returns unsupported value
 */
const DEFAULT_PLATFORM_NAME = 'Ubuntu' as const

/**
 * Default platform ID (Chrome = 1) for unknown browser mappings
 * @see proto.DeviceProps.PlatformType
 */
const DEFAULT_PLATFORM_ID = '1' as const

/**
 * Maps Node.js platform identifiers to WhatsApp-recognized platform names.
 * Values of `undefined` will fall back to DEFAULT_PLATFORM_NAME.
 */
const PLATFORM_MAP: Readonly<Record<NodeJS.Platform, string | undefined>> = {
	aix: 'AIX',
	android: 'Android',
	cygwin: undefined,
	darwin: 'Mac OS',
	freebsd: 'FreeBSD',
	haiku: undefined,
	linux: undefined,
	netbsd: undefined,
	openbsd: 'OpenBSD',
	sunos: 'Solaris',
	win32: 'Windows',
} as const

// ============================================================
// Platform Type Resolution
// ============================================================

/**
 * Pre-computed map of browser names to platform IDs.
 * Built once at module load to avoid repeated proto access.
 */
const BROWSER_TO_PLATFORM_ID: ReadonlyMap<string, string> = (() => {
	const platformType = proto.DeviceProps?.PlatformType
	if (!platformType || typeof platformType !== 'object') {
		return new Map<string, string>()
	}

	const entries: Array<[string, string]> = []
	for (const [key, value] of Object.entries(platformType)) {
		// PlatformType has both numeric values and reverse mappings
		// We only want the string keys with numeric values
		if (typeof value === 'number' && typeof key === 'string' && !/^\d+$/.test(key)) {
			entries.push([key.toUpperCase(), value.toString()])
		}
	}
	return new Map(entries)
})()

// ============================================================
// Helper Functions
// ============================================================

/**
 * Resolves the current platform name for WhatsApp device identification.
 * Uses the OS platform detection with a fallback to Ubuntu.
 *
 * @returns Platform name string (never undefined)
 */
const getPlatformName = (): string => {
	try {
		const currentPlatform = platform()
		return PLATFORM_MAP[currentPlatform] ?? DEFAULT_PLATFORM_NAME
	} catch {
		return DEFAULT_PLATFORM_NAME
	}
}

/**
 * Normalizes a browser identifier for platform type lookup.
 *
 * @param browser - The browser identifier to normalize
 * @returns Uppercase trimmed string, or null if input is invalid
 */
const normalizeBrowserKey = (browser: unknown): string | null => {
	if (typeof browser !== 'string') {
		return null
	}
	const normalized = browser.trim()
	return normalized.length > 0 ? normalized.toUpperCase() : null
}

/**
 * Safely gets the OS release version with fallback
 *
 * @returns OS release string or empty string on failure
 */
const safeRelease = (): string => {
	try {
		return release()
	} catch {
		return ''
	}
}

// ============================================================
// Exported Constants
// ============================================================

/**
 * Browser configuration presets for WhatsApp device registration.
 * Each factory returns a tuple of [platform, browser, version].
 *
 * @example
 * // Use Ubuntu preset
 * const config = Browsers.ubuntu('Chrome')
 * // Returns: ['Ubuntu', 'Chrome', '22.04.4']
 *
 * @example
 * // Use automatic platform detection
 * const config = Browsers.appropriate('MyApp')
 * // Returns: ['Mac OS', 'MyApp', '23.1.0'] (on macOS)
 */
export const Browsers: BrowsersMap = {
	ubuntu: (browser: string): [string, string, string] => ['Ubuntu', browser, '22.04.4'],
	macOS: (browser: string): [string, string, string] => ['Mac OS', browser, '14.4.1'],
	windows: (browser: string): [string, string, string] => ['Windows', browser, '10.0.22631'],
	baileys: (browser: string): [string, string, string] => ['Baileys', browser, '6.5.0'],
	appropriate: (browser: string): [string, string, string] => [getPlatformName(), browser, safeRelease()],
} as const

// ============================================================
// Exported Functions
// ============================================================

/**
 * Resolves the platform type ID for a given browser name.
 * Uses the WhatsApp protocol buffer definitions for mapping.
 *
 * @param browser - Browser identifier (e.g., 'chrome', 'firefox', 'safari')
 * @returns Platform type ID as string (defaults to '1' for Chrome)
 *
 * @example
 * getPlatformId('chrome')   // Returns '1'
 * getPlatformId('CHROME')   // Returns '1' (case-insensitive)
 * getPlatformId('firefox')  // Returns platform-specific ID
 * getPlatformId('')         // Returns '1' (default)
 * getPlatformId(undefined)  // Returns '1' (default, handles invalid input)
 */
export const getPlatformId = (browser: string): string => {
	const key = normalizeBrowserKey(browser)
	if (key === null) {
		return DEFAULT_PLATFORM_ID
	}

	return BROWSER_TO_PLATFORM_ID.get(key) ?? DEFAULT_PLATFORM_ID
}

/**
 * Type guard to check if a platform string is a valid browser preset key.
 * Useful for external validation before using Browsers presets.
 *
 * @param value - Value to check
 * @returns True if value is a valid browser preset key
 *
 * @example
 * if (isValidBrowserPreset(userInput)) {
 *   const config = Browsers[userInput]('MyApp')
 * }
 */
export const isValidBrowserPreset = (value: unknown): value is keyof BrowsersMap => {
	return typeof value === 'string' && value in Browsers
}
