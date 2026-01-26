import { calculateSignature, verifySignature } from 'libsignal/src/curve'
import { proto } from '../../../WAProto/index.js'
import { CiphertextMessage } from './ciphertext-message'

interface SenderKeyMessageStructure {
	id: number
	iteration: number
	ciphertext: string | Buffer | Uint8Array
}



export class SenderKeyMessage extends CiphertextMessage {
	private static readonly SIGNATURE_LENGTH = 64
	private readonly messageVersion: number
	private readonly keyId: number
	private readonly iteration: number
	private readonly ciphertext: Uint8Array
	private readonly signature: Uint8Array
	private readonly serialized: Uint8Array

	constructor(
		keyId?: number | null,
		iteration?: number | null,
		ciphertext?: Uint8Array | null,
		signatureKey?: Uint8Array | null,
		serialized?: Uint8Array | null
	) {
		super()

		// parse a serialized message
		if (serialized) {
			const version = serialized[0]!
			const message = serialized.subarray(1, serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)
			const signature = serialized.subarray(serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)

			const senderKeyMessage = proto.SenderKeyMessage.decode(message).toJSON() as SenderKeyMessageStructure

			this.serialized = SenderKeyMessage._toUint8Array(serialized)
			this.messageVersion = (version & 0xff) >> 4
			this.keyId = senderKeyMessage.id
			this.iteration = senderKeyMessage.iteration
			this.ciphertext = SenderKeyMessage._ensureUint8Array(senderKeyMessage.ciphertext)
			this.signature = SenderKeyMessage._toUint8Array(signature)
		} else {
			// build from parts
			const version = (((this.CURRENT_VERSION << 4) | this.CURRENT_VERSION) & 0xff) % 256

			const ciphertextBuffer = SenderKeyMessage._toUint8Array(ciphertext!)
			const message = proto.SenderKeyMessage.encode(
				proto.SenderKeyMessage.create({
					id: keyId!,
					iteration: iteration!,
					ciphertext: SenderKeyMessage._uint8ArrayToProtoBytes(ciphertextBuffer)
				})
			).finish() as Uint8Array

			const signature = this.getSignature(signatureKey!, SenderKeyMessage._concatUint8Arrays(new Uint8Array([version]), message))

			this.serialized = SenderKeyMessage._concatUint8Arrays(new Uint8Array([version]), message, signature)
			this.messageVersion = this.CURRENT_VERSION
			this.keyId = keyId!
			this.iteration = iteration!
			this.ciphertext = ciphertextBuffer
			this.signature = signature
		}
	}

	public getKeyId(): number {
		return this.keyId
	}

	public getIteration(): number {
		return this.iteration
	}

	public getCipherText(): Uint8Array {
		return this.ciphertext
	}

	// throws on invalid signature (keeps old behavior)
	public verifySignature(signatureKey: Uint8Array): void {
		const part1 = this.serialized.subarray(0, this.serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)
		const part2 = this.serialized.subarray(this.serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)
		const res = verifySignature(signatureKey, part1, part2)
		if (!res) throw new Error('Invalid signature!')
	}

	// async-friendly, returns boolean
	public async verifySignatureAsync(signatureKey: Uint8Array): Promise<boolean> {
		const part1 = this.serialized.subarray(0, this.serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)
		const part2 = this.serialized.subarray(this.serialized.length - SenderKeyMessage.SIGNATURE_LENGTH)
		try {
			return verifySignature(signatureKey, part1, part2) === true
		} catch {
			return false
		}
	}

	private getSignature(signatureKey: Uint8Array, serialized: Uint8Array): Uint8Array {
		return SenderKeyMessage._toUint8Array(calculateSignature(signatureKey, serialized))
	}

	public serialize(): Uint8Array {
		return this.serialized
	}

	public getType(): number {
		return 4
	}

	// simple JSON for logs
	public toJSON() {
		return {
			version: this.messageVersion,
			keyId: this.keyId,
			iteration: this.iteration,
			ciphertext: SenderKeyMessage._uint8ArrayToBase64(this.ciphertext),
			signature: SenderKeyMessage._uint8ArrayToHex(this.signature)
		}
	}

	// decode minimal fields without creating an instance
	public static decode(serialized: Uint8Array): { version: number; id: number; iteration: number; ciphertext: Uint8Array } {
		const s = SenderKeyMessage._toUint8Array(serialized)
		const version = s[0]!
		const message = s.subarray(1, s.length - SenderKeyMessage.SIGNATURE_LENGTH)
		const senderKeyMessage = proto.SenderKeyMessage.decode(message).toJSON() as SenderKeyMessageStructure
		return {
			version: (version & 0xff) >> 4,
			id: senderKeyMessage.id,
			iteration: senderKeyMessage.iteration,
			ciphertext: SenderKeyMessage._ensureUint8Array(senderKeyMessage.ciphertext)
		}
	}

	 
 // Cross-environment helpers
	

	private static _ensureUint8Array(input: string | Buffer | Uint8Array): Uint8Array {
		if (typeof input === 'string') return SenderKeyMessage._base64ToUint8Array(input)
		return SenderKeyMessage._toUint8Array(input)
	}

	private static _toUint8Array(input: Buffer | Uint8Array | ArrayLike<number>): Uint8Array {
		if (input instanceof Uint8Array) return input
		if (typeof Buffer !== 'undefined' && (input as any) instanceof Buffer) {
			return new Uint8Array((input as Buffer).buffer, (input as Buffer).byteOffset, (input as Buffer).byteLength)
		}
		return new Uint8Array(input as ArrayLike<number>)
	}

	private static _concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
		let totalLength = 0
		for (const a of arrays) totalLength += a.length
		const result = new Uint8Array(totalLength)
		let offset = 0
		for (const a of arrays) {
			result.set(a, offset)
			offset += a.length
		}
		return result
	}

	private static _uint8ArrayToProtoBytes(u8: Uint8Array): Uint8Array {
		return u8
	}

	private static _base64ToUint8Array(b64: string): Uint8Array {
		if (typeof Buffer !== 'undefined') {
			const buf = Buffer.from(b64, 'base64')
			return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
		}
		const binary = atob(b64)
		const len = binary.length
		const bytes = new Uint8Array(len)
		for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
		return bytes
	}

	private static _uint8ArrayToBase64(u8: Uint8Array): string {
		if (typeof Buffer !== 'undefined') return Buffer.from(u8).toString('base64')
		let binary = ''
		for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i])
		return btoa(binary)
	}

	private static _uint8ArrayToHex(u8: Uint8Array): string {
		let s = ''
		for (let i = 0; i < u8.length; i++) {
			const h = u8[i].toString(16)
			s += (h.length === 1 ? '0' : '') + h
		}
		return s
	}
}
