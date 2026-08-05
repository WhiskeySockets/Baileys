import { describe, expect, it } from '@jest/globals'
import { Curve, generateSignalPubKey, signedKeyPair } from '../../Utils/crypto'

/**
 * `curve.verifySignature` returns false for a well-formed but wrong signature
 * and only throws when the input itself is malformed. A wrapper that returns
 * true whenever nothing threw therefore accepts every 64-byte signature —
 * including a forged noise certificate or account signature.
 */
describe('Curve.verify', () => {
	const message = Buffer.from('the message that was signed')

	const signed = () => {
		const identity = Curve.generateKeyPair()
		const pair = signedKeyPair(identity, 1)
		// signedKeyPair signs the prefixed form of the public key
		return { identity, pair, signedOver: generateSignalPubKey(pair.keyPair.public) }
	}

	it('accepts a signature made with the matching key', () => {
		const { identity, pair, signedOver } = signed()

		expect(Curve.verify(identity.public, signedOver, pair.signature)).toBe(true)
	})

	it('rejects a signature whose bits were altered', () => {
		const { identity, pair, signedOver } = signed()
		const tampered = Buffer.from(pair.signature)
		tampered[0] = tampered[0]! ^ 0xff

		expect(Curve.verify(identity.public, signedOver, tampered)).toBe(false)
	})

	it('rejects a valid signature checked against a different key', () => {
		const { pair, signedOver } = signed()
		const stranger = Curve.generateKeyPair()

		// A forged certificate is exactly this: a real signature from a key the
		// verifier was never meant to trust.
		expect(Curve.verify(stranger.public, signedOver, pair.signature)).toBe(false)
	})

	it('rejects a signature over a different message', () => {
		const { identity, pair } = signed()

		expect(Curve.verify(identity.public, message, pair.signature)).toBe(false)
	})

	it('rejects malformed input instead of throwing', () => {
		const { identity, pair, signedOver } = signed()

		expect(Curve.verify(identity.public, signedOver, Buffer.alloc(10))).toBe(false)
		expect(Curve.verify(Buffer.alloc(3), signedOver, pair.signature)).toBe(false)
	})

	it('rejects an all-zero signature', () => {
		const { identity, signedOver } = signed()

		expect(Curve.verify(identity.public, signedOver, Buffer.alloc(64))).toBe(false)
	})
})
