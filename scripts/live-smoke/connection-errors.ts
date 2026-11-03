import { DisconnectReason } from '../../src/Types'

export class PairingLoggedOutError extends Error {}

export const describeDisconnectReason = (reason: number | undefined): string =>
	reason === undefined ? 'unknown reason' : `${DisconnectReason[reason] ?? 'unknown reason'} (${reason})`

export const connectionFailure = (reason: number | undefined, authDir: string): Error | undefined => {
	if (reason === DisconnectReason.loggedOut) {
		return new PairingLoggedOutError('The paired account logged out while connecting (loggedOut, 401)')
	}

	let hint: string
	switch (reason) {
		case DisconnectReason.badSession:
			hint = `Remove the invalid retained pairing at ${JSON.stringify(authDir)} and rerun to pair again.`
			break
		case DisconnectReason.connectionReplaced:
			hint = 'Close the competing connection and rerun. The retained pairing has been preserved.'
			break
		case DisconnectReason.multideviceMismatch:
			hint = 'Check linked-device support and client compatibility before pairing again.'
			break
		case DisconnectReason.forbidden:
			hint = 'Check account access and restrictions in WhatsApp before retrying.'
			break
		default:
			return
	}

	return new Error(`Connection closed: ${describeDisconnectReason(reason)}. ${hint}`)
}
