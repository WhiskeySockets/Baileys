import { platform, release } from 'os'
import { proto } from '../../WAProto/index.js'
import type { BrowsersMap } from '../Types'

const PLATFORM_FALLBACK = 'Ubuntu' as const

const PLATFORM_MAP = {
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
	win32: 'Windows'
} as const satisfies Record<NodeJS.Platform, string | undefined>

const PLATFORM_TYPE = proto.DeviceProps.PlatformType as Record<string, number | string>
const DEFAULT_PLATFORM_ID =
	typeof PLATFORM_TYPE.CHROME === 'number' ? PLATFORM_TYPE.CHROME.toString() : '1'

const getPlatformName = () => PLATFORM_MAP[platform()] ?? PLATFORM_FALLBACK

const normalizeBrowserKey = (browser: string) => {
	if (typeof browser !== 'string') {
		return ''
	}

	return browser.trim().toUpperCase()
}

export const Browsers: BrowsersMap = {
	ubuntu: browser => ['Ubuntu', browser, '22.04.4'],
	macOS: browser => ['Mac OS', browser, '14.4.1'],
	baileys: browser => ['Baileys', browser, '6.5.0'],
	windows: browser => ['Windows', browser, '10.0.22631'],
	/** The appropriate browser based on your OS & release */
	appropriate: browser => [getPlatformName(), browser, release()]
}

export const getPlatformId = (browser: string) => {
	const key = normalizeBrowserKey(browser)
	if (!key) {
		return DEFAULT_PLATFORM_ID
	}

	const platformType = PLATFORM_TYPE[key]
	return typeof platformType === 'number' ? platformType.toString() : DEFAULT_PLATFORM_ID
}
