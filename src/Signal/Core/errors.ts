class SignalError extends Error {}

export class UntrustedIdentityKeyError extends SignalError {
	public addr: string
	public identityKey: Uint8Array

	constructor(addr: string, identityKey: Uint8Array) {
		super()
		this.name = 'UntrustedIdentityKeyError'
		this.addr = addr
		this.identityKey = identityKey
	}
}

export class SessionError extends SignalError {
	constructor(message?: string) {
		super(message)
		this.name = 'SessionError'
	}
}

export class MessageCounterError extends SessionError {
	constructor(message?: string) {
		super(message)
		this.name = 'MessageCounterError'
	}
}

export class PreKeyError extends SessionError {
	constructor(message?: string) {
		super(message)
		this.name = 'PreKeyError'
	}
}
