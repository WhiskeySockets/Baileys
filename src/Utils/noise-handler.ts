import { Boom } from '@hapi/boom'
import { createCipheriv, createDecipheriv } from 'crypto'
import { proto } from '../../WAProto'
import { NOISE_MODE, NOISE_WA_HEADER } from '../Defaults'
import { KeyPair } from '../Types'
import { Binary } from '../WABinary'
import { BinaryNode, decodeBinaryNode } from '../WABinary'
import { Curve, hkdf, sha256 } from './crypto'

const generateIV = (counter: number) => {
	const iv = new ArrayBuffer(12)
	new DataView(iv).setUint32(8, counter)

	return new Uint8Array(iv)
}

export const makeNoiseHandler = ({ public: publicKey, private: privateKey }: KeyPair) => {

	const authenticate = (data: Uint8Array) => {
		if(!isFinished) {
			hash = sha256(Buffer.from(Binary.build(hash, data).readByteArray()))
		}
	}

	const encrypt = (plaintext: Uint8Array) => {
		const authTagLength = 128 >> 3
		const cipher = createCipheriv('aes-256-gcm', encKey, generateIV(writeCounter), { authTagLength })
		cipher.setAAD(hash)

		const result = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()])

		writeCounter += 1
		
		authenticate(result)
		return result
	}

	const decrypt = (ciphertext: Uint8Array) => {
		// before the handshake is finished, we use the same counter
		// after handshake, the counters are different
		const iv = generateIV(isFinished ? readCounter : writeCounter)
		const cipher = createDecipheriv('aes-256-gcm', decKey, iv)
		// decrypt additional adata
		const tagLength = 128 >> 3
		const enc = ciphertext.slice(0, ciphertext.length-tagLength)
		const tag = ciphertext.slice(ciphertext.length-tagLength)
		// set additional data
		cipher.setAAD(hash)
		cipher.setAuthTag(tag)

		const result = Buffer.concat([cipher.update(enc), cipher.final()])

		if(isFinished) {
			readCounter += 1
		} else {
			writeCounter += 1
		}
		
		authenticate(ciphertext)
		return result
	}

	const localHKDF = (data: Uint8Array) => {
		const key = hkdf(Buffer.from(data), 64, { salt, info: '' })
		return [key.slice(0, 32), key.slice(32)]
	}

	const mixIntoKey = (data: Uint8Array) => {
		const [write, read] = localHKDF(data)
		salt = write
		encKey = read
		decKey = read
		readCounter = 0
		writeCounter = 0
	}

	const finishInit = () => {
		const [write, read] = localHKDF(new Uint8Array(0))
		encKey = write
		decKey = read
		hash = Buffer.from([])
		readCounter = 0
		writeCounter = 0
		isFinished = true
	}
	
	const data = Binary.build(NOISE_MODE).readBuffer()
	let hash = Buffer.from(data.byteLength === 32 ? data : sha256(Buffer.from(data)))
	let salt = hash
	let encKey = hash
	let decKey = hash
	let readCounter = 0
	let writeCounter = 0
	let isFinished = false
	let sentIntro = false

	const outBinary = new Binary()
	const inBinary = new Binary()

	authenticate(NOISE_WA_HEADER)
	authenticate(publicKey)

	return {
		encrypt,
		decrypt,
		authenticate,
		mixIntoKey,
		finishInit,
		processHandshake: ({ serverHello }: proto.HandshakeMessage, noiseKey: KeyPair) => {
			authenticate(serverHello!.ephemeral!)
			mixIntoKey(Curve.sharedKey(privateKey, serverHello.ephemeral!))
	
			const decStaticContent = decrypt(serverHello!.static!)
			mixIntoKey(Curve.sharedKey(privateKey, decStaticContent))
	
			const certDecoded = decrypt(serverHello!.payload!)
			const { details: certDetails, signature: certSignature } = proto.NoiseCertificate.decode(certDecoded)
	
			const { key: certKey } = proto.NoiseCertificateDetails.decode(certDetails)
	
			if(Buffer.compare(decStaticContent, certKey) !== 0) {
				throw new Boom('certification match failed', { statusCode: 400 })
			}
	
			const keyEnc = encrypt(noiseKey.public)
			mixIntoKey(Curve.sharedKey(noiseKey.private, serverHello!.ephemeral!))

			return keyEnc
		},
		encodeFrame: (data: Buffer | Uint8Array) => {
			if(isFinished) {
				data = encrypt(data)
			}

			const introSize = sentIntro ? 0 : NOISE_WA_HEADER.length

			outBinary.ensureAdditionalCapacity(introSize + 3 + data.byteLength)
	
			if(!sentIntro) {
				outBinary.writeByteArray(NOISE_WA_HEADER)
				sentIntro = true
			}
	
			outBinary.writeUint8(data.byteLength >> 16)
			outBinary.writeUint16(65535 & data.byteLength)
			outBinary.write(data)
	
			const bytes = outBinary.readByteArray()
			return bytes as Uint8Array
		},
		decodeFrame: (newData: Buffer | Uint8Array, onFrame: (buff: Uint8Array | BinaryNode) => void) => {
			// the binary protocol uses its own framing mechanism
			// on top of the WS frames
			// so we get this data and separate out the frames
			const getBytesSize = () => {
				return (inBinary.readUint8() << 16) | inBinary.readUint16()
			}

			const peekSize = () => {
				return !(inBinary.size() < 3) && getBytesSize() <= inBinary.size()
			}

			inBinary.writeByteArray(newData)
			while(inBinary.peek(peekSize)) {
				const bytes = getBytesSize()
				let frame: Uint8Array | BinaryNode = inBinary.readByteArray(bytes)
				if(isFinished) {
					const result = decrypt(frame as Uint8Array)
					const unpacked = new Binary(result).decompressed()
					frame = decodeBinaryNode(unpacked)
				}

				onFrame(frame)
			}

			inBinary.peek(peekSize)
		}
	}	
}