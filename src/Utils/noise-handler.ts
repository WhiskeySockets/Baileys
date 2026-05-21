import { Boom } from '@hapi/boom'
import { Mutex } from 'async-mutex'
import { proto } from '../../WAProto/index.js'
import { NOISE_MODE, WA_CERT_DETAILS } from '../Defaults'
import type { KeyPair } from '../Types'
import type { BinaryNode } from '../WABinary'
import { decodeBinaryNode } from '../WABinary'
import { aesDecryptGCM, aesEncryptGCM, Curve, hkdf, sha256 } from './crypto'
import type { ILogger } from './logger'

const IV_LENGTH = 12

const EMPTY_BUFFER = Buffer.alloc(0)

/**
 * Builds a fresh AES-GCM IV from the counter on every call. Stage 7 (M10):
 * the previous implementation reused a single shared `Uint8Array` and mutated
 * its bytes in place. Safe only because `aesEncryptGCM` is synchronous — any
 * future move to an async/streaming AEAD silently reuses the IV with the same
 * key, which is catastrophic for AES-GCM. The fresh allocation costs ~12
 * bytes per call and removes the implicit "must stay sync" invariant.
 *
 * Single source of truth for handshake AND transport IV construction (the
 * earlier `generateIV` ArrayBuffer+DataView variant was identical in output
 * — 12 zero bytes with the counter written as big-endian uint32 at offset
 * 8 — but a redundant second implementation; consolidating prevents the
 * two from drifting apart in future edits).
 */
const ivForCounter = (counter: number): Uint8Array => {
	const iv = new Uint8Array(IV_LENGTH)
	iv[8] = (counter >>> 24) & 0xff
	iv[9] = (counter >>> 16) & 0xff
	iv[10] = (counter >>> 8) & 0xff
	iv[11] = counter & 0xff
	return iv
}

/**
 * Test-only export of {@link ivForCounter}. Not part of the public API
 * surface — the leading underscore + `__testOnly_` prefix flag that.
 *
 * The M10 regression test uses this to assert that consecutive calls
 * return distinct `Uint8Array` instances. A ciphertext-inequality check
 * alone passes even when the IV buffer is shared and merely mutated
 * between calls (counter still advances → ciphertexts differ); the
 * identity check pins the "fresh allocation per call" contract directly.
 */
export const __testOnly_ivForCounter = ivForCounter

class TransportState {
	private readCounter = 0
	private writeCounter = 0

	constructor(
		private readonly encKey: Uint8Array,
		private readonly decKey: Uint8Array
	) {}

	encrypt(plaintext: Uint8Array): Uint8Array {
		const c = this.writeCounter++
		return aesEncryptGCM(plaintext, this.encKey, ivForCounter(c), EMPTY_BUFFER)
	}

	decrypt(ciphertext: Uint8Array): Buffer {
		const c = this.readCounter++
		return aesDecryptGCM(ciphertext, this.decKey, ivForCounter(c), EMPTY_BUFFER) as Buffer
	}
}

export const makeNoiseHandler = ({
	keyPair: { private: privateKey, public: publicKey },
	NOISE_HEADER,
	logger,
	routingInfo
}: {
	keyPair: KeyPair
	NOISE_HEADER: Uint8Array
	logger: ILogger
	routingInfo?: Buffer | undefined
}) => {
	logger = logger.child({ class: 'ns' })

	const data = Buffer.from(NOISE_MODE)
	let hash = data.byteLength === 32 ? data : sha256(data)
	let salt: Uint8Array = hash
	let encKey: Uint8Array = hash
	let decKey: Uint8Array = hash
	let counter = 0
	let sentIntro = false

	let inBytes: Buffer = Buffer.alloc(0)

	/**
	 * Serializes `decodeFrame` so concurrent socket reads don't interleave on
	 * the shared `inBytes` buffer and the awaited `processData` loop (M10).
	 * Critical because `processData` awaits `decodeBinaryNode` in transport
	 * mode — a second `decodeFrame` invocation that arrives mid-await would
	 * otherwise see a half-drained `inBytes` and either lose frames or
	 * de-frame across two distinct payloads.
	 */
	const decodeFrameMutex = new Mutex()

	let transport: TransportState | null = null
	let isWaitingForTransport = false
	let pendingOnFrame: ((buff: Uint8Array | BinaryNode) => void) | null = null

	let introHeader: Buffer
	if (routingInfo) {
		introHeader = Buffer.alloc(7 + routingInfo.byteLength + NOISE_HEADER.length)
		introHeader.write('ED', 0, 'utf8')
		introHeader.writeUint8(0, 2)
		introHeader.writeUint8(1, 3)
		introHeader.writeUint8(routingInfo.byteLength >> 16, 4)
		introHeader.writeUint16BE(routingInfo.byteLength & 65535, 5)
		introHeader.set(routingInfo, 7)
		introHeader.set(NOISE_HEADER, 7 + routingInfo.byteLength)
	} else {
		introHeader = Buffer.from(NOISE_HEADER)
	}

	const authenticate = (data: Uint8Array) => {
		if (!transport) {
			hash = sha256(Buffer.concat([hash, data]))
		}
	}

	const encrypt = (plaintext: Uint8Array): Uint8Array => {
		if (transport) {
			return transport.encrypt(plaintext)
		}

		const result = aesEncryptGCM(plaintext, encKey, ivForCounter(counter++), hash)
		authenticate(result)
		return result
	}

	const decrypt = (ciphertext: Uint8Array): Uint8Array => {
		if (transport) {
			return transport.decrypt(ciphertext)
		}

		const result = aesDecryptGCM(ciphertext, decKey, ivForCounter(counter++), hash)
		authenticate(ciphertext)
		return result
	}

	const localHKDF = (data: Uint8Array): [Uint8Array, Uint8Array] => {
		const key = hkdf(Buffer.from(data), 64, { salt, info: '' })
		return [key.subarray(0, 32), key.subarray(32)]
	}

	const mixIntoKey = (data: Uint8Array) => {
		const [write, read] = localHKDF(data)
		salt = write
		encKey = read
		decKey = read
		counter = 0
	}

	const finishInit = async () => {
		isWaitingForTransport = true
		const [write, read] = localHKDF(new Uint8Array(0))
		transport = new TransportState(write, read)
		isWaitingForTransport = false

		logger.trace('Noise handler transitioned to Transport state')

		if (pendingOnFrame) {
			logger.trace({ length: inBytes.length }, 'Flushing buffered frames after transport ready')
			await processData(pendingOnFrame)
			pendingOnFrame = null
		}
	}

	const processData = async (onFrame: (buff: Uint8Array | BinaryNode) => void) => {
		let size: number | undefined

		while (true) {
			if (inBytes.length < 3) return

			size = (inBytes[0]! << 16) | (inBytes[1]! << 8) | inBytes[2]!

			if (inBytes.length < size + 3) return

			let frame: Uint8Array | BinaryNode = inBytes.subarray(3, size + 3)
			inBytes = inBytes.subarray(size + 3)

			if (transport) {
				const result = transport.decrypt(frame)
				frame = await decodeBinaryNode(result)
			}

			if (logger.level === 'trace') {
				logger.trace({ msg: (frame as BinaryNode)?.attrs?.id }, 'recv frame')
			}

			onFrame(frame)
		}
	}

	authenticate(NOISE_HEADER)
	authenticate(publicKey)

	return {
		encrypt,
		decrypt,
		authenticate,
		mixIntoKey,
		finishInit,
		processHandshake: ({ serverHello }: proto.HandshakeMessage, noiseKey: KeyPair) => {
			authenticate(serverHello!.ephemeral!)
			mixIntoKey(Curve.sharedKey(privateKey, serverHello!.ephemeral!))

			const decStaticContent = decrypt(serverHello!.static!)
			mixIntoKey(Curve.sharedKey(privateKey, decStaticContent))

			const certDecoded = decrypt(serverHello!.payload!)

			const { intermediate: certIntermediate, leaf } = proto.CertChain.decode(certDecoded)
			// leaf
			if (!leaf?.details || !leaf?.signature) {
				throw new Boom('invalid noise leaf certificate', { statusCode: 400 })
			}

			if (!certIntermediate?.details || !certIntermediate?.signature) {
				throw new Boom('invalid noise intermediate certificate', { statusCode: 400 })
			}

			const details = proto.CertChain.NoiseCertificate.Details.decode(certIntermediate.details)

			const { issuerSerial } = details

			const verify = Curve.verify(details.key!, leaf.details, leaf.signature)

			const verifyIntermediate = Curve.verify(
				WA_CERT_DETAILS.PUBLIC_KEY,
				certIntermediate.details,
				certIntermediate.signature
			)

			if (!verify) {
				throw new Boom('noise certificate signature invalid', { statusCode: 400 })
			}

			if (!verifyIntermediate) {
				throw new Boom('noise intermediate certificate signature invalid', { statusCode: 400 })
			}

			if (issuerSerial !== WA_CERT_DETAILS.SERIAL) {
				throw new Boom('certification match failed', { statusCode: 400 })
			}

			const keyEnc = encrypt(noiseKey.public)
			mixIntoKey(Curve.sharedKey(noiseKey.private, serverHello!.ephemeral!))

			return keyEnc
		},
		encodeFrame: (data: Buffer | Uint8Array) => {
			if (transport) {
				data = transport.encrypt(data)
			}

			const dataLen = data.byteLength
			const introSize = sentIntro ? 0 : introHeader.length
			const frame = Buffer.allocUnsafe(introSize + 3 + dataLen)

			if (!sentIntro) {
				frame.set(introHeader)
				sentIntro = true
			}

			frame[introSize] = (dataLen >>> 16) & 0xff
			frame[introSize + 1] = (dataLen >>> 8) & 0xff
			frame[introSize + 2] = dataLen & 0xff

			frame.set(data, introSize + 3)

			return frame
		},
		decodeFrame: (newData: Buffer | Uint8Array, onFrame: (buff: Uint8Array | BinaryNode) => void) => {
			// M10: serialize the inBytes mutation + processData drain.
			return decodeFrameMutex.runExclusive(async () => {
				if (isWaitingForTransport) {
					inBytes = Buffer.concat([inBytes, newData])
					pendingOnFrame = onFrame
					return
				}

				if (inBytes.length === 0) {
					inBytes = Buffer.from(newData)
				} else {
					inBytes = Buffer.concat([inBytes, newData])
				}

				await processData(onFrame)
			})
		}
	}
}
