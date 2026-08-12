import {
	buildCompanionRegNode,
	CompanionWebClientType,
	getCompanionWebClientType
} from '../../Utils/companion-reg-client-utils'
// Imported from the module rather than the `WABinary` barrel: the barrel pulls
// in WAProto, which the other suites in this folder already trip over.
import { getBinaryNodeChild } from '../../WABinary/generic-utils'
import type { BinaryNode } from '../../WABinary/types'
import type { WABrowserDescription } from '../../Types'

const EPHEMERAL_PUB = new Uint8Array([1, 2, 3])
const AUTH_KEY_PUB = new Uint8Array([4, 5, 6])

const build = (browser: WABrowserDescription, platformDisplay?: string) =>
	buildCompanionRegNode({
		jid: '15551234567@s.whatsapp.net',
		wrappedEphemeralPub: EPHEMERAL_PUB,
		serverAuthKeyPub: AUTH_KEY_PUB,
		browser,
		platformDisplay
	})

const childContent = (node: BinaryNode, tag: string) => getBinaryNodeChild(node, tag)?.content

describe('buildCompanionRegNode', () => {
	it('derives companion_platform_display from the browser when no override is given', () => {
		const node = build(['Ubuntu', 'Chrome', '22.04.4'])

		expect(childContent(node, 'companion_platform_display')).toBe('Chrome (Ubuntu)')
	})

	it('sends the override as companion_platform_display when one is given', () => {
		const node = build(['My Product', 'Chrome', '22.04.4'], 'Chrome (Windows)')

		expect(childContent(node, 'companion_platform_display')).toBe('Chrome (Windows)')
	})

	it('leaves companion_platform_id derived from the browser, override or not', () => {
		const withOverride = build(['My Product', 'Chrome', '22.04.4'], 'Chrome (Windows)')
		const without = build(['My Product', 'Chrome', '22.04.4'])

		expect(childContent(withOverride, 'companion_platform_id')).toBe(CompanionWebClientType.CHROME.toString())
		expect(childContent(without, 'companion_platform_id')).toBe(CompanionWebClientType.CHROME.toString())
	})

	it('keeps the rest of the stanza identical whether the override is set or not', () => {
		const browser: WABrowserDescription = ['My Product', 'Chrome', '22.04.4']
		const withOverride = build(browser, 'Chrome (Windows)')
		const without = build(browser)

		expect(withOverride.attrs).toEqual(without.attrs)
		expect(withOverride.attrs.stage).toBe('companion_hello')

		for (const tag of [
			'link_code_pairing_wrapped_companion_ephemeral_pub',
			'companion_server_auth_key_pub',
			'link_code_pairing_nonce'
		]) {
			expect(childContent(withOverride, tag)).toEqual(childContent(without, tag))
		}
	})
})

describe('getCompanionWebClientType', () => {
	it('maps a known browser name to its client type', () => {
		expect(getCompanionWebClientType(['Ubuntu', 'Chrome', '22.04.4'])).toBe(CompanionWebClientType.CHROME)
	})

	it('falls back to OTHER_WEB_CLIENT for an unknown browser name', () => {
		expect(getCompanionWebClientType(['Ubuntu', 'Arc', '22.04.4'])).toBe(CompanionWebClientType.OTHER_WEB_CLIENT)
	})

	it('distinguishes Desktop builds by operating system', () => {
		expect(getCompanionWebClientType(['Windows', 'Desktop', '10.0'])).toBe(CompanionWebClientType.UWP)
		expect(getCompanionWebClientType(['Mac OS', 'Desktop', '14.4.1'])).toBe(CompanionWebClientType.ELECTRON)
	})
})
