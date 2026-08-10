import { randomBytes } from 'crypto'
import type { AuthenticationCreds, WABrowserDescription } from '../Types'
import type { BinaryNode } from '../WABinary'
import { getBinaryNodeChild } from '../WABinary'
import type { ILogger } from './logger'

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

export type PairingQRRenderer = {
	/** Render the next ref's QR. False once the server's allotment is spent. */
	next(): boolean
	/** Re-render the QR on screen. Consumes no ref; false if none is shown yet. */
	refresh(): boolean
}

/**
 * Holds the ref currently on screen so it can be re-rendered.
 *
 * `render` is called with the ref rather than a finished payload so the caller
 * can read the adv secret at render time: a `companion_reg_refresh` rotates it
 * mid-flow, and every QR emitted afterwards has to advertise the new value.
 */
export const makePairingQRRenderer = (refs: string[], render: (ref: string) => void): PairingQRRenderer => {
	let index = 0
	let current: string | undefined

	return {
		next() {
			const ref = refs[index]
			if (ref === undefined) {
				return false
			}

			index += 1
			current = ref
			render(ref)
			return true
		},
		refresh() {
			if (current === undefined) {
				return false
			}

			render(current)
			return true
		}
	}
}

export type CompanionRegRefreshContext = {
	creds: AuthenticationCreds
	emitCredsUpdate: (update: Partial<AuthenticationCreds>) => void
	refreshQR: () => void
	logger: ILogger
}

export type CompanionRegRefreshOutcome = 'rotated' | 'ignored_malformed' | 'ignored_registered'

/** The two children WA Web's parser accepts on this notification. */
const COMPANION_REG_REFRESH_CHILDREN = ['companion_reg_refresh', 'pair-device-rotate-qr'] as const

/**
 * `<notification type="companion_reg_refresh">` - the server retiring an
 * unpaired companion's registration material.
 *
 * WA Web accepts the stanza with either a `companion_reg_refresh` or a
 * `pair-device-rotate-qr` child, rejects it when neither is present, and
 * answers by regenerating the adv secret key. That key is a quarter of what
 * the pairing QR advertises, so a client that only acks keeps offering a QR
 * built on a secret the server has already retired: the phone scans it,
 * reports a failed link, and no pair-success ever arrives.
 *
 * The ack itself is unchanged - the generic notification path already sends
 * it - so this only adds the rotation and the re-render.
 */
export const handleCompanionRegRefresh = (
	node: BinaryNode,
	{ creds, emitCredsUpdate, refreshQR, logger }: CompanionRegRefreshContext
): CompanionRegRefreshOutcome => {
	if (!COMPANION_REG_REFRESH_CHILDREN.some(tag => getBinaryNodeChild(node, tag))) {
		logger.warn({ node }, 'companion_reg_refresh carries neither expected child; ignoring')
		return 'ignored_malformed'
	}

	// WA Web rotates unconditionally; a registered session is the one case
	// where that is wrong here. `creds.me` is set by pair-success and by
	// requestPairingCode, and in both cases the adv secret is what a completed
	// or pending pairing is verified against - re-minting it would break the
	// session rather than refresh a pending registration.
	if (creds.me) {
		logger.debug({ id: node.attrs.id }, 'companion_reg_refresh on a registered session; keeping the adv secret')
		return 'ignored_registered'
	}

	// Same construction as initAuthCreds and as WA Web's generateADVSecretKey:
	// 32 CSPRNG bytes, base64.
	creds.advSecretKey = randomBytes(32).toString('base64')
	emitCredsUpdate({ advSecretKey: creds.advSecretKey })

	logger.info({ id: node.attrs.id }, 'rotated the adv secret the server asked to retire; re-rendering the pairing QR')
	refreshQR()
	return 'rotated'
}
