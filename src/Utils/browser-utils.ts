import { platform, release } from 'os'
import { proto } from '../../WAProto/index.js'
import type { BrowsersMap } from '../Types'

const PLATFORM_MAP = {
	aix: 'AIX',
	darwin: 'Mac OS',
	win32: 'Windows',
	android: 'Android',
	freebsd: 'FreeBSD',
	openbsd: 'OpenBSD',
	sunos: 'Solaris',
	linux: undefined,
	haiku: undefined,
	cygwin: undefined,
	netbsd: undefined
}

export const Browsers: BrowsersMap = {
	ubuntu: browser => ['Ubuntu', browser, '22.04.4'],
	macOS: browser => ['Mac OS', browser, '14.4.1'],
	baileys: browser => ['Baileys', browser, '6.5.0'],
	windows: browser => ['Windows', browser, '10.0.22631'],
	/** The appropriate browser based on your OS & release */
	appropriate: browser => [PLATFORM_MAP[platform()] || 'Ubuntu', browser, release()],
	/** Android companion device. apiLevel is the Android API level (e.g. '14') */
	android: (apiLevel: string) => [apiLevel, 'Android', '']
}

/**
 * Checks if the browser tuple represents an Android companion device.
 * @param browser - Browser tuple [os, platform, version]
 * @returns True if platform is 'Android' (case-insensitive)
 */
export const isAndroidBrowser = (browser: [string, string, string]): boolean => {
	return browser[1]?.toUpperCase() === 'ANDROID'
}

export const getPlatformId = (browser: string) => {
	const platformType = proto.DeviceProps.PlatformType[browser.toUpperCase() as any]
	if (platformType !== undefined) {
		return platformType.toString()
	}

	// 'ANDROID' is not in the PlatformType enum — map to ANDROID_PHONE
	if (browser.toUpperCase() === 'ANDROID') {
		const androidPhone = proto.DeviceProps.PlatformType['ANDROID_PHONE' as any]
		if (androidPhone !== undefined) {
			return androidPhone.toString()
		}
	}

	return '1' // Chrome
}
