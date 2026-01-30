import { platform, release } from 'os'
import { readFileSync, existsSync } from 'fs'
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
 * Default OS version fallback when detection fails
 */
const DEFAULT_OS_VERSION = '1.0.0' as const

/**
 * Fallback versions used when automatic detection fails.
 * These should be updated periodically to reflect current OS versions.
 * Last updated: 2025-01
 */
const FALLBACK_VERSIONS = {
	ubuntu: '24.04.1',
	macOS: '15.2',
	windows: '10.0.26100',
	baileys: '6.5.0',
} as const

/**
 * Maps Darwin kernel versions to macOS marketing versions.
 * Darwin 24.x = macOS 15.x (Sequoia)
 * Darwin 23.x = macOS 14.x (Sonoma)
 * Darwin 22.x = macOS 13.x (Ventura)
 * Darwin 21.x = macOS 12.x (Monterey)
 * Darwin 20.x = macOS 11.x (Big Sur)
 */
const DARWIN_TO_MACOS: Readonly<Record<number, number>> = {
	24: 15, // Sequoia
	23: 14, // Sonoma
	22: 13, // Ventura
	21: 12, // Monterey
	20: 11, // Big Sur
	19: 10, // Catalina (10.15)
} as const

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
 *
 * Note: Protobuf enums have bidirectional mappings (name→value and value→name).
 * We filter to only include string keys with numeric values.
 */
const BROWSER_TO_PLATFORM_ID: ReadonlyMap<string, string> = (() => {
	const platformType = proto.DeviceProps?.PlatformType
	if (!platformType || typeof platformType !== 'object') {
		return new Map<string, string>()
	}

	const entries: Array<[string, string]> = []
	for (const [key, value] of Object.entries(platformType)) {
		if (typeof value === 'number' && typeof key === 'string' && !/^\d+$/.test(key)) {
			entries.push([key.toUpperCase(), value.toString()])
		}
	}
	return new Map(entries)
})()

// ============================================================
// Version Detection Functions
// ============================================================

/**
 * Detects the Linux distribution version by reading /etc/os-release.
 * This file is standard on most modern Linux distributions.
 *
 * @returns The VERSION_ID from os-release, or fallback version
 *
 * @example
 * // On Ubuntu 24.04:
 * getLinuxVersion() // Returns '24.04' or '24.04.1'
 */
const getLinuxVersion = (): string => {
	try {
		const osReleasePaths = ['/etc/os-release', '/usr/lib/os-release']

		for (const filePath of osReleasePaths) {
			if (existsSync(filePath)) {
				const content = readFileSync(filePath, 'utf-8')

				// Try VERSION_ID first (e.g., "24.04")
				const versionIdMatch = content.match(/^VERSION_ID\s*=\s*"?([^"\n]+)"?/m)
				if (versionIdMatch?.[1]) {
					return versionIdMatch[1]
				}

				// Fallback to VERSION (e.g., "24.04.1 LTS (Noble Numbat)")
				const versionMatch = content.match(/^VERSION\s*=\s*"?([0-9][0-9.]*)/m)
				if (versionMatch?.[1]) {
					return versionMatch[1]
				}
			}
		}
	} catch {
		// Silently fail and use fallback
	}

	return FALLBACK_VERSIONS.ubuntu
}

/**
 * Converts Darwin kernel version to macOS marketing version.
 * Darwin versions map to macOS versions with an offset.
 *
 * @returns macOS version string (e.g., '15.2')
 *
 * @example
 * // On macOS Sequoia with Darwin 24.2.0:
 * getMacOSVersion() // Returns '15.2'
 */
const getMacOSVersion = (): string => {
	try {
		const darwinVersion = release() // e.g., '24.2.0'
		const parts = darwinVersion.split('.')
		const majorVersionStr = parts[0]
		const minorVersionStr = parts[1]

		if (!majorVersionStr) {
			return FALLBACK_VERSIONS.macOS
		}

		const majorVersion = parseInt(majorVersionStr, 10)
		if (isNaN(majorVersion)) {
			return FALLBACK_VERSIONS.macOS
		}

		const minorVersion = minorVersionStr || '0'
		const macOSMajor = DARWIN_TO_MACOS[majorVersion]

		if (macOSMajor === undefined) {
			// For newer Darwin versions, estimate macOS version
			// Darwin 24 = macOS 15, so offset is 9
			const estimatedMajor = majorVersion >= 20 ? majorVersion - 9 : 10
			return `${estimatedMajor}.${minorVersion}`
		}

		// Special case: macOS 10.x (Catalina and earlier)
		if (macOSMajor === 10) {
			return `10.15.${minorVersion}`
		}

		return `${macOSMajor}.${minorVersion}`
	} catch {
		return FALLBACK_VERSIONS.macOS
	}
}

/**
 * Gets Windows version directly from os.release().
 * Windows correctly reports version (e.g., '10.0.22631').
 *
 * @returns Windows version string
 */
const getWindowsVersion = (): string => {
	try {
		const version = release()
		// Validate it looks like a Windows version (X.X.XXXXX)
		if (/^\d+\.\d+\.\d+$/.test(version)) {
			return version
		}
	} catch {
		// Silently fail
	}

	return FALLBACK_VERSIONS.windows
}

/**
 * Detects the current OS version automatically based on the platform.
 * Uses platform-specific methods for accurate version detection.
 *
 * @returns Object containing detected versions for all platforms
 */
const detectOSVersions = (): Readonly<{
	ubuntu: string
	macOS: string
	windows: string
	baileys: string
}> => {
	const currentPlatform = (() => {
		try {
			return platform()
		} catch {
			return 'linux' as NodeJS.Platform
		}
	})()

	// Detect versions based on current platform
	// For non-matching platforms, use fallback values
	return {
		ubuntu: currentPlatform === 'linux' ? getLinuxVersion() : FALLBACK_VERSIONS.ubuntu,
		macOS: currentPlatform === 'darwin' ? getMacOSVersion() : FALLBACK_VERSIONS.macOS,
		windows: currentPlatform === 'win32' ? getWindowsVersion() : FALLBACK_VERSIONS.windows,
		baileys: FALLBACK_VERSIONS.baileys,
	}
}

/**
 * Cached OS versions, detected once at module load.
 * This ensures consistent versions throughout the application lifecycle.
 */
const OS_VERSIONS = detectOSVersions()

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
 * @param browser - The browser identifier to normalize (accepts any type for runtime safety)
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
 * Gets the appropriate OS version for the current platform.
 * Uses automatic detection with fallback to sensible defaults.
 *
 * @returns OS version string appropriate for the current platform
 */
const getAppropriateVersion = (): string => {
	try {
		const currentPlatform = platform()

		switch (currentPlatform) {
		case 'darwin':
			return OS_VERSIONS.macOS
		case 'win32':
			return OS_VERSIONS.windows
		case 'linux':
			return OS_VERSIONS.ubuntu
		default:
			// For other platforms, try os.release() directly
			const version = release()
			return version || DEFAULT_OS_VERSION
		}
	} catch {
		return DEFAULT_OS_VERSION
	}
}

// ============================================================
// Exported Constants
// ============================================================

/**
 * Browser configuration presets for WhatsApp device registration.
 * Each factory returns a tuple of [platform, browser, version].
 *
 * Versions are automatically detected at module load:
 * - Linux: Reads /etc/os-release for distribution version
 * - macOS: Converts Darwin kernel version to macOS version
 * - Windows: Uses os.release() directly
 *
 * @example
 * // Use Ubuntu preset with auto-detected version
 * const config = Browsers.ubuntu('Chrome')
 * // Returns: ['Ubuntu', 'Chrome', '24.04.1'] (version detected automatically)
 *
 * @example
 * // Use automatic platform and version detection
 * const config = Browsers.appropriate('MyApp')
 * // Returns: ['Mac OS', 'MyApp', '15.2'] (on macOS Sequoia)
 */
export const Browsers: BrowsersMap = {
	ubuntu: (browser: string): [string, string, string] => ['Ubuntu', browser, OS_VERSIONS.ubuntu],
	macOS: (browser: string): [string, string, string] => ['Mac OS', browser, OS_VERSIONS.macOS],
	windows: (browser: string): [string, string, string] => ['Windows', browser, OS_VERSIONS.windows],
	baileys: (browser: string): [string, string, string] => ['Baileys', browser, OS_VERSIONS.baileys],
	appropriate: (browser: string): [string, string, string] => [getPlatformName(), browser, getAppropriateVersion()],
} as const

/**
 * Exposed OS versions for debugging and logging purposes.
 * These are the versions that will be used by the Browsers presets.
 */
export const detectedOSVersions = OS_VERSIONS

// ============================================================
// Exported Functions
// ============================================================

/**
 * Resolves the platform type ID for a given browser name.
 * Uses the WhatsApp protocol buffer definitions for mapping.
 *
 * This function safely handles invalid inputs (null, undefined, non-strings)
 * by returning the default Chrome platform ID.
 *
 * @param browser - Browser identifier (e.g., 'chrome', 'firefox', 'safari').
 *                  Accepts unknown types for runtime safety.
 * @returns Platform type ID as string (defaults to '1' for Chrome)
 *
 * @example
 * getPlatformId('chrome')   // Returns '1'
 * getPlatformId('CHROME')   // Returns '1' (case-insensitive)
 * getPlatformId('firefox')  // Returns platform-specific ID
 * getPlatformId('')         // Returns '1' (default)
 */
export const getPlatformId = (browser: unknown): string => {
	const key = normalizeBrowserKey(browser)
	if (key === null) {
		return DEFAULT_PLATFORM_ID
	}

	return BROWSER_TO_PLATFORM_ID.get(key) ?? DEFAULT_PLATFORM_ID
}

/**
 * Type guard to check if a value is a valid browser preset key.
 * Useful for external validation before using Browsers presets.
 *
 * Uses Object.prototype.hasOwnProperty to avoid matching inherited
 * properties like 'toString' or 'constructor'.
 *
 * @param value - Value to check
 * @returns True if value is a valid browser preset key ('ubuntu', 'macOS', 'windows', 'baileys', 'appropriate')
 *
 * @example
 * isValidBrowserPreset('ubuntu')      // true
 * isValidBrowserPreset('macOS')       // true
 * isValidBrowserPreset('invalid')     // false
 * isValidBrowserPreset('toString')    // false (inherited property)
 *
 * @example
 * if (isValidBrowserPreset(userInput)) {
 *   const config = Browsers[userInput]('MyApp')
 * }
 */
export const isValidBrowserPreset = (value: unknown): value is keyof BrowsersMap => {
	return typeof value === 'string' && Object.prototype.hasOwnProperty.call(Browsers, value)
}
