import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DisconnectReason } from '../../src/Types'
import { connectionFailure, describeDisconnectReason, PairingLoggedOutError } from './connection-errors'

describe('live-smoke connection failures', () => {
	it('keeps logout distinct so an expired retained pairing can be reset', () => {
		assert.ok(connectionFailure(DisconnectReason.loggedOut, '/synthetic/auth') instanceof PairingLoggedOutError)
	})

	it('stops on invalid sessions with instructions for resetting the retained pairing', () => {
		assert.match(
			connectionFailure(DisconnectReason.badSession, '/synthetic/auth')!.message,
			/badSession.*500.*Remove.*synthetic\/auth/
		)
	})

	it('stops on a competing connection without suggesting a credential reset', () => {
		const error = connectionFailure(DisconnectReason.connectionReplaced, '/synthetic/auth')!
		assert.match(error.message, /connectionReplaced.*440.*Close the competing connection/)
		assert.match(error.message, /pairing has been preserved/)
	})

	it('stops on account and compatibility failures with actionable diagnostics', () => {
		assert.match(
			connectionFailure(DisconnectReason.forbidden, '/synthetic/auth')!.message,
			/forbidden.*403.*restrictions/
		)
		assert.match(
			connectionFailure(DisconnectReason.multideviceMismatch, '/synthetic/auth')!.message,
			/multideviceMismatch.*411.*compatibility/
		)
	})

	it('allows pairing handoffs and transient failures to reconnect', () => {
		for (const reason of [
			DisconnectReason.restartRequired,
			DisconnectReason.connectionClosed,
			DisconnectReason.connectionLost,
			DisconnectReason.unavailableService,
			undefined,
			599
		]) {
			assert.equal(connectionFailure(reason, '/synthetic/auth'), undefined)
		}
		assert.equal(describeDisconnectReason(DisconnectReason.restartRequired), 'restartRequired (515)')
		assert.equal(describeDisconnectReason(599), 'unknown reason (599)')
		assert.equal(describeDisconnectReason(undefined), 'unknown reason')
	})
})
