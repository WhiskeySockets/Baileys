import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { NOISE_MODE, WA_CERT_DETAILS } from '../Defaults'
import type { KeyPair } from '../Types'
import type { BinaryNode } from '../WABinary'
import { decodeBinaryNode } from '../WABinary'
import { aesDecryptGCM, aesEncryptGCM, Curve, hkdf, sha256 } from './crypto'
import type { ILogger } from './logger'

const IV_LENGTH = 12

const EMPTY_BUFFER = Buffer.alloc(0)

const generateIV = (counter: number): Uint8Array => {
	const iv = new ArrayBuffer(IV_LENGTH)
	new DataView(iv).setUint32(8, counter)
	return new Uint8Array(iv)
}

class TransportState {
	private readCounter = 0
	private writeCounter = 0

	private readonly iv = new Uint8Array(IV_LENGTH)

	constructor(
		private readonly encKey: Buffer,
		private readonly decKey: Buffer
	) {}

	encrypt(plaintext: Uint8Array): Uint8Array {
		const c = this.writeCounter++
		this.iv[8] = (c >>> 24) & 0xff
		this.iv[9] = (c >>> 16) & 0xff
		this.iv[10] = (c >>> 8) & 0xff
		this.iv[11] = c & 0xff

		return aesEncryptGCM(plaintext, this.encKey, this.iv, EMPTY_BUFFER)
	}

	decrypt(ciphertext: Uint8Array): Buffer {
		const c = this.readCounter++
		this.iv[8] = (c >>> 24) & 0xff
		this.iv[9] = (c >>> 16) & 0xff
		this.iv[10] = (c >>> 8) & 0xff
		this.iv[11] = c & 0xff

		return aesDecryptGCM(ciphertext, this.decKey, this.iv, EMPTY_BUFFER) as Buffer
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
	let salt = hash
	let encKey = hash
	let decKey = hash
	let counter = 0
	let sentIntro = false

	let inBytes: Buffer = Buffer.alloc(0)

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

		const result = aesEncryptGCM(plaintext, encKey, generateIV(counter++), hash)
		authenticate(result)
		return result
	}

	const decrypt = (ciphertext: Uint8Array): Uint8Array => {
		if (transport) {
			return transport.decrypt(ciphertext)
		}

		const result = aesDecryptGCM(ciphertext, decKey, generateIV(counter++), hash)
		authenticate(ciphertext)
		return result
	}

	const localHKDF = async (data: Uint8Array) => {
		const key = await hkdf(Buffer.from(data), 64, { salt, info: '' })
		return [key.subarray(0, 32), key.subarray(32)]
	}

	const mixIntoKey = async (data: Uint8Array) => {
		const [write, read] = await localHKDF(data)
		salt = write!
		encKey = read!
		decKey = read!
		counter = 0
	}

	const finishInit = async () => {
		isWaitingForTransport = true
		const [write, read] = await localHKDF(new Uint8Array(0))
		transport = new TransportState(write!, read!)
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
		processHandshake: async ({ serverHello }: proto.HandshakeMessage, noiseKey: KeyPair) => {
			authenticate(serverHello!.ephemeral!)
			await mixIntoKey(Curve.sharedKey(privateKey, serverHello!.ephemeral!))

			const decStaticContent = decrypt(serverHello!.static!)
			await mixIntoKey(Curve.sharedKey(privateKey, decStaticContent))

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
			await mixIntoKey(Curve.sharedKey(noiseKey.private, serverHello!.ephemeral!))

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
		decodeFrame: async (newData: Buffer | Uint8Array, onFrame: (buff: Uint8Array | BinaryNode) => void) => {
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
		}
	}
}
