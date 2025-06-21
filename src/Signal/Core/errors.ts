// @ts-nocheck

class SignalError extends Error {}

export class UntrustedIdentityKeyError extends SignalError {
	constructor(addr, identityKey) {
		super()
		this.name = 'UntrustedIdentityKeyError'
		this.addr = addr
		this.identityKey = identityKey
	}
}

export class SessionError extends SignalError {
	constructor(message) {
		super(message)
		this.name = 'SessionError'
	}
}

export class MessageCounterError extends SessionError {
	constructor(message) {
		super(message)
		this.name = 'MessageCounterError'
	}
}

export class PreKeyError extends SessionError {
	constructor(message) {
		super(message)
		this.name = 'PreKeyError'
	}
}
