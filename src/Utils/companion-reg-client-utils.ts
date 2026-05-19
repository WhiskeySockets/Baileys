import type { WABrowserDescription } from '../Types'

export enum CompanionWebClientType {
	UNKNOWN = 0,
	CHROME = 1,
	EDGE = 2,
	FIREFOX = 3,
	IE = 4,
	OPERA = 5,
	SAFARI = 6,
	ELECTRON = 7,
	UWP = 8,
	OTHER_WEB_CLIENT = 9
}

// Use a Map (not a plain object) to avoid prototype-pollution lookups
// where browser names like `toString` or `constructor` would return inherited
// function values instead of CompanionWebClientType. Keys are lowercased and
// the input is lowercased on lookup to handle every casing (Chrome/chrome/CHROME,
// IE/ie/Ie/iE) consistently — matching the normalize-then-lookup pattern used by
// the existing browser-utils helper `getPlatformId`.
const BROWSER_TO_COMPANION_WEB_CLIENT = new Map<string, CompanionWebClientType>([
	['chrome', CompanionWebClientType.CHROME],
	['edge', CompanionWebClientType.EDGE],
	['firefox', CompanionWebClientType.FIREFOX],
	['ie', CompanionWebClientType.IE],
	['opera', CompanionWebClientType.OPERA],
	['safari', CompanionWebClientType.SAFARI],
	// Android must declare Chrome (1) for pair-code companions; see the matching
	// `pairPlatformId` override in src/Socket/socket.ts.
	['android', CompanionWebClientType.CHROME]
])

export const getCompanionWebClientType = ([os, browserName]: WABrowserDescription): CompanionWebClientType => {
	if (browserName === 'Desktop') {
		return os === 'Windows' ? CompanionWebClientType.UWP : CompanionWebClientType.ELECTRON
	}

	const key = typeof browserName === 'string' ? browserName.trim().toLowerCase() : ''
	return BROWSER_TO_COMPANION_WEB_CLIENT.get(key) ?? CompanionWebClientType.OTHER_WEB_CLIENT
}

export const getCompanionPlatformId = (browser: WABrowserDescription): string => {
	return getCompanionWebClientType(browser).toString()
}

export const buildPairingQRData = (
	ref: string,
	noiseKeyB64: string,
	identityKeyB64: string,
	advB64: string,
	browser: WABrowserDescription
): string => {
	// InfiniteAPI keeps the legacy 4-field QR payload (`<ref>,<noise>,<identity>,<adv>`)
	// because:
	// 1. The WhatsApp app QR scanner accepts the bare comma-joined form without the URL prefix.
	// 2. The upstream `URL#<...>,<platformId>` format produced `linked_devices#,<ref>` (extra
	//    leading comma after the fragment) and emitted platform 9 for `Browsers.android()`,
	//    breaking pair-code companions that must declare Chrome (1).
	// The browser argument is preserved for API parity with upstream.
	void browser
	return [ref, noiseKeyB64, identityKeyB64, advB64].join(',')
}
