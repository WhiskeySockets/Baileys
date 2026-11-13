import { jest } from '@jest/globals'
import P from 'pino'
import type { AuthenticationCreds } from '../../Types'
import { initAuthCreds } from '../../Utils/auth-utils'
import {
	buildPairingQRData,
	handleCompanionRegRefresh,
	makePairingQRRenderer
} from '../../Utils/companion-reg-client-utils'
import type { BinaryNode } from '../../WABinary'

const logger = P({ level: 'silent' })

const notification = (childTag?: string): BinaryNode => ({
	tag: 'notification',
	attrs: { from: 's.whatsapp.net', id: '1', type: 'companion_reg_refresh' },
	content: childTag ? [{ tag: childTag, attrs: {} }] : []
})

const context = (creds: AuthenticationCreds) => {
	const emitCredsUpdate = jest.fn<(update: Partial<AuthenticationCreds>) => void>()
	const refreshQR = jest.fn<() => void>()
	return { ctx: { creds, emitCredsUpdate, refreshQR, logger }, emitCredsUpdate, refreshQR }
}

describe('handleCompanionRegRefresh', () => {
	// WA Web's parser (WAWebHandleCompanionReqRefreshNotification) rejects the
	// stanza outright unless one of these two children is present.
	it.each(['companion_reg_refresh', 'pair-device-rotate-qr'])('rotates the adv secret for a <%s> child', childTag => {
		const creds = initAuthCreds()
		const before = creds.advSecretKey
		const { ctx, emitCredsUpdate, refreshQR } = context(creds)

		expect(handleCompanionRegRefresh(notification(childTag), ctx)).toBe('rotated')

		expect(creds.advSecretKey).not.toBe(before)
		expect(Buffer.from(creds.advSecretKey, 'base64')).toHaveLength(32)
		expect(emitCredsUpdate).toHaveBeenCalledWith({ advSecretKey: creds.advSecretKey })
		expect(refreshQR).toHaveBeenCalledTimes(1)
	})

	it('ignores a notification carrying neither expected child', () => {
		const creds = initAuthCreds()
		const before = creds.advSecretKey
		const { ctx, emitCredsUpdate, refreshQR } = context(creds)

		expect(handleCompanionRegRefresh(notification(), ctx)).toBe('ignored_malformed')
		expect(handleCompanionRegRefresh(notification('something-else'), ctx)).toBe('ignored_malformed')

		expect(creds.advSecretKey).toBe(before)
		expect(emitCredsUpdate).not.toHaveBeenCalled()
		expect(refreshQR).not.toHaveBeenCalled()
	})

	// creds.me is set by pair-success and by requestPairingCode. In both cases
	// the adv secret is the one a pending or completed pairing was verified
	// against, so re-minting it would break the session rather than refresh a
	// pending registration.
	it('leaves a registered session alone', () => {
		const creds: AuthenticationCreds = {
			...initAuthCreds(),
			me: { id: '15551234567@s.whatsapp.net', name: '~' }
		}
		const before = creds.advSecretKey
		const { ctx, emitCredsUpdate, refreshQR } = context(creds)

		expect(handleCompanionRegRefresh(notification('companion_reg_refresh'), ctx)).toBe('ignored_registered')

		expect(creds.advSecretKey).toBe(before)
		expect(emitCredsUpdate).not.toHaveBeenCalled()
		expect(refreshQR).not.toHaveBeenCalled()
	})

	it('mints a fresh secret every time, never a fixed one', () => {
		const creds = initAuthCreds()
		const { ctx } = context(creds)

		handleCompanionRegRefresh(notification('companion_reg_refresh'), ctx)
		const first = creds.advSecretKey
		handleCompanionRegRefresh(notification('companion_reg_refresh'), ctx)

		expect(creds.advSecretKey).not.toBe(first)
	})
})

describe('makePairingQRRenderer', () => {
	it('walks the server-allotted refs in order and reports exhaustion', () => {
		const rendered: string[] = []
		const renderer = makePairingQRRenderer(['ref-1', 'ref-2'], ref => rendered.push(ref))

		expect(renderer.next()).toBe(true)
		expect(renderer.next()).toBe(true)
		expect(renderer.next()).toBe(false)
		expect(rendered).toEqual(['ref-1', 'ref-2'])
	})

	it('re-renders the ref on screen without consuming one', () => {
		const rendered: string[] = []
		const renderer = makePairingQRRenderer(['ref-1', 'ref-2'], ref => rendered.push(ref))

		renderer.next()
		expect(renderer.refresh()).toBe(true)
		expect(renderer.refresh()).toBe(true)

		// The refreshes re-showed ref-1; ref-2 is still unspent.
		expect(rendered).toEqual(['ref-1', 'ref-1', 'ref-1'])
		expect(renderer.next()).toBe(true)
		expect(rendered).toEqual(['ref-1', 'ref-1', 'ref-1', 'ref-2'])
	})

	it('refuses to refresh before a QR has been shown', () => {
		const rendered: string[] = []
		const renderer = makePairingQRRenderer(['ref-1'], ref => rendered.push(ref))

		expect(renderer.refresh()).toBe(false)
		expect(rendered).toEqual([])
	})

	it('does not exhaust the ref pool no matter how often the server asks', () => {
		const renderer = makePairingQRRenderer(['ref-1'], () => {})

		renderer.next()
		for (let i = 0; i < 50; i++) {
			expect(renderer.refresh()).toBe(true)
		}

		// One ref was allotted and one was spent: the pool is where it was.
		expect(renderer.next()).toBe(false)
	})
})

describe('a rotation while a QR is on screen', () => {
	// This is the whole bug: the QR advertises the adv secret, so a QR built
	// before the rotation is scannable but unpairable afterwards.
	it('re-renders the same ref with the new secret', () => {
		const creds = initAuthCreds()
		const emitted: string[] = []
		const renderer = makePairingQRRenderer(['ref-1', 'ref-2'], ref =>
			emitted.push(buildPairingQRData(ref, 'noise', 'identity', creds.advSecretKey, ['Baileys', 'Chrome', '1']))
		)
		const { ctx } = context(creds)

		renderer.next()
		handleCompanionRegRefresh(notification('companion_reg_refresh'), {
			...ctx,
			refreshQR: () => void renderer.refresh()
		})

		expect(emitted).toHaveLength(2)
		const [before, after] = emitted.map(qr => qr.split('#')[1]!.split(','))
		expect(after![0]).toBe(before![0]) // same ref
		expect(after![3]).not.toBe(before![3]) // rotated adv secret
		expect(after![3]).toBe(creds.advSecretKey)
	})
})
