import type { BinaryNode } from '../WABinary'
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

export const getCompanionWebClientType = ([os, browserName]: WABrowserDescription): CompanionWebClientType => {
	if (browserName === 'Desktop') {
		return os === 'Windows' ? CompanionWebClientType.UWP : CompanionWebClientType.ELECTRON
	}

	return BROWSER_TO_COMPANION_WEB_CLIENT[browserName] || CompanionWebClientType.OTHER_WEB_CLIENT
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
	return (
		'https://wa.me/settings/linked_devices#' +
		[ref, noiseKeyB64, identityKeyB64, advB64, getCompanionPlatformId(browser)].join(',')
	)
}

/**
 * Builds the `link_code_companion_reg` stanza sent when pairing by code.
 *
 * Extracted from `requestPairingCode` so the payload can be asserted directly:
 * the only impure parts of that flow are the ephemeral key derivation and the
 * message tag, both of which are passed in.
 *
 * `platformDisplay` overrides `companion_platform_display`. WhatsApp validates
 * that field -- see `companionPlatformDisplay` in SocketConfig.
 */
export const buildCompanionRegNode = ({
	jid,
	wrappedEphemeralPub,
	serverAuthKeyPub,
	browser,
	platformDisplay
}: {
	jid: string
	wrappedEphemeralPub: Uint8Array
	serverAuthKeyPub: Uint8Array
	browser: WABrowserDescription
	platformDisplay?: string
}): BinaryNode => ({
	tag: 'link_code_companion_reg',
	attrs: {
		jid,
		stage: 'companion_hello',
		should_show_push_notification: 'true'
	},
	content: [
		{
			tag: 'link_code_pairing_wrapped_companion_ephemeral_pub',
			attrs: {},
			content: wrappedEphemeralPub
		},
		{
			tag: 'companion_server_auth_key_pub',
			attrs: {},
			content: serverAuthKeyPub
		},
		{
			tag: 'companion_platform_id',
			attrs: {},
			content: getCompanionPlatformId(browser)
		},
		{
			tag: 'companion_platform_display',
			attrs: {},
			content: platformDisplay ?? `${browser[1]} (${browser[0]})`
		},
		{
			tag: 'link_code_pairing_nonce',
			attrs: {},
			content: '0'
		}
	]
})
