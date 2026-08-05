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

const BROWSER_TO_COMPANION_WEB_CLIENT: Record<string, CompanionWebClientType> = {
	Chrome: CompanionWebClientType.CHROME,
	Edge: CompanionWebClientType.EDGE,
	Firefox: CompanionWebClientType.FIREFOX,
	IE: CompanionWebClientType.IE,
	Opera: CompanionWebClientType.OPERA,
	Safari: CompanionWebClientType.SAFARI
}

const DEFAULT_PAIRING_CODE_BROWSER_PLATFORM = { id: '1', displayName: 'Chrome' }

const PAIRING_CODE_BROWSER_PLATFORM: Record<string, { id: string; displayName: string }> = {
	Chrome: DEFAULT_PAIRING_CODE_BROWSER_PLATFORM,
	Firefox: { id: '2', displayName: 'Firefox' },
	IE: { id: '3', displayName: 'IE' },
	Opera: { id: '4', displayName: 'Opera' },
	Safari: { id: '5', displayName: 'Safari' },
	Edge: { id: '6', displayName: 'Edge' }
}

const PAIRING_CODE_OS_DISPLAY = new Set(['Mac OS', 'Windows', 'Ubuntu'])

export type PairingCodePlatform = {
	id: string
	display: string
}

export const getCompanionWebClientType = ([os, browserName]: WABrowserDescription): CompanionWebClientType => {
	if (browserName === 'Desktop') {
		return os === 'Windows' ? CompanionWebClientType.UWP : CompanionWebClientType.ELECTRON
	}

	return BROWSER_TO_COMPANION_WEB_CLIENT[browserName] || CompanionWebClientType.OTHER_WEB_CLIENT
}

export const getCompanionPlatformId = (browser: WABrowserDescription): string => {
	return getCompanionWebClientType(browser).toString()
}

export const getPairingCodePlatform = ([os, browserName]: WABrowserDescription): PairingCodePlatform => {
	const browser = PAIRING_CODE_BROWSER_PLATFORM[browserName] || DEFAULT_PAIRING_CODE_BROWSER_PLATFORM
	const osDisplay = PAIRING_CODE_OS_DISPLAY.has(os) ? os : 'Mac OS'

	return {
		id: browser.id,
		display: `${browser.displayName} (${osDisplay})`
	}
}

export const buildPairingQRData = (
	ref: string,
	noiseKeyB64: string,
	identityKeyB64: string,
	advB64: string,
	browser: WABrowserDescription
): string => {
	return (
		'https://wa.me/settings/linked_devices#' +
		[ref, noiseKeyB64, identityKeyB64, advB64, getCompanionPlatformId(browser)].join(',')
	)
}
