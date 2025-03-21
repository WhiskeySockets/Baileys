import * as libsignal from 'libsignal'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import { KeyPair } from '../Types'

// insure browser & node compatibility
const { subtle } = globalThis.crypto

/** prefix version byte to the pub keys, required for some curve crypto functions */
export const generateSignalPubKey = (pubKey: Uint8Array | Buffer) => (
	pubKey.length === 33
		? pubKey
		: Buffer.concat([ KEY_BUNDLE_TYPE, pubKey ])
)

export const Curve = {
	generateKeyPair: (): KeyPair => {
		const { pubKey, privKey } = libsignal.curve.generateKeyPair()
		return {
			private: Buffer.from(privKey),
			// remove version byte
			public: Buffer.from((pubKey as Uint8Array).slice(1))
		}
	},
	sharedKey: (privateKey: Uint8Array, publicKey: Uint8Array) => {
		const shared = libsignal.curve.calculateAgreement(generateSignalPubKey(publicKey), privateKey)
		return Buffer.from(shared)
	},
	sign: (privateKey: Uint8Array, buf: Uint8Array) => (
		libsignal.curve.calculateSignature(privateKey, buf)
	),
	verify: (pubKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => {
		try {
			libsignal.curve.verifySignature(generateSignalPubKey(pubKey), message, signature)
			return true
		} catch(error) {
			return false
		}
	}
}

export const signedKeyPair = (identityKeyPair: KeyPair, keyId: number) => {
	const preKey = Curve.generateKeyPair()
	const pubKey = generateSignalPubKey(preKey.public)

	const signature = Curve.sign(identityKeyPair.private, pubKey)

	return { keyPair: preKey, signature, keyId }
}

/**
 * encrypt AES 256 GCM;
 * where the tag tag is suffixed to the ciphertext
 * */
export async function aesEncryptGCM(plaintext: Uint8Array, key: Uint8Array, iv: Uint8Array, additionalData: Uint8Array): Promise<Buffer> {
	// Import the 256-bit key as a CryptoKey for AES-GCM encryption
	const cryptoKey = await crypto.subtle.importKey(
		'raw', // Key format is raw binary
		key, // The key as a Uint8Array
		{ name: 'AES-GCM' }, // Algorithm specification
		false, // Key is not extractable
		['encrypt'] // Key usage
	)

	// Define the AES-GCM parameters
	const algorithm = {
		name: 'AES-GCM', // Algorithm name
		iv: iv, // Initialization vector
		additionalData: additionalData, // Additional authenticated data
		tagLength: 128 // Authentication tag length in bits (16 bytes)
	}

	// Encrypt the plaintext; returns an ArrayBuffer with ciphertext + tag
	const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, plaintext)

	// Convert the ArrayBuffer to a Uint8Array and return it
	return Buffer.from(encrypted)
}

/**
 * decrypt AES 256 GCM;
 * where the auth tag is suffixed to the ciphertext
 * */
export async function aesDecryptGCM(ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array, additionalData: Uint8Array): Promise<Buffer> {
	// Import the 256-bit key as a CryptoKey for AES-GCM encryption
	const cryptoKey = await crypto.subtle.importKey(
		'raw', // Key format is raw binary
		key, // The key as a Uint8Array
		{ name: 'AES-GCM' }, // Algorithm specification
		false, // Key is not extractable
		['decrypt'] // Key usage
	)

	// Define the AES-GCM parameters
	const algorithm = {
		name: 'AES-GCM', // Algorithm name
		iv: iv, // Initialization vector
		additionalData: additionalData, // Additional authenticated data
		tagLength: 128 // Authentication tag length in bits (16 bytes)
	}

	// Decrypt the encrypted data
	const decrypted = await crypto.subtle.decrypt(
		algorithm,
		cryptoKey,
		ciphertext
	)

	return Buffer.from(decrypted)
}

export async function aesEncryptCTR(plaintext: Uint8Array | Buffer, key: Uint8Array | Buffer, iv: Uint8Array | Buffer): Promise<Buffer> {
	// Convert inputs to Uint8Array if they're Buffers
	const plaintextArray = plaintext instanceof Uint8Array ? plaintext : new Uint8Array(plaintext)
	const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key)
	const ivArray = iv instanceof Uint8Array ? iv : new Uint8Array(iv)

	// Import the key
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyArray,
		{ name: 'AES-CTR', length: 256 },
		false,
		['encrypt']
	)

	// Encrypt the data
	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-CTR',
			counter: ivArray,
			length: 128 // Standard CTR counter length in bits
		},
		cryptoKey,
		plaintextArray
	)

	return Buffer.from(ciphertext)
}

export async function aesDecryptCTR(ciphertext: Uint8Array | Buffer, key: Uint8Array | Buffer, iv: Uint8Array | Buffer): Promise<Buffer> {
	// Convert inputs to Uint8Array if they're Buffers
	const ciphertextArray = ciphertext instanceof Uint8Array ? ciphertext : new Uint8Array(ciphertext)
	const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key)
	const ivArray = iv instanceof Uint8Array ? iv : new Uint8Array(iv)

	// Import the key
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyArray,
		{ name: 'AES-CTR', length: 256 },
		false,
		['decrypt']
	)

	// Decrypt the data
	const result = await crypto.subtle.decrypt(
		{
			name: 'AES-CTR',
			counter: ivArray,
			length: 128 // Standard CTR counter length in bits
		},
		cryptoKey,
		ciphertextArray
	)

	return Buffer.from(result)
}

/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */
export async function aesDecrypt(buffer: Buffer, key: Buffer) {
	return aesDecryptWithIV(buffer.slice(16, buffer.length), key, buffer.slice(0, 16))
}

/** decrypt AES 256 CBC */
export async function aesDecryptWithIV(
	buffer: Buffer | Uint8Array,
	key: Buffer | Uint8Array,
	IV: Buffer | Uint8Array
): Promise<Buffer> {
	// Convert inputs to Uint8Array if they're Buffers
	const ciphertext = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
	const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key)
	const iv = IV instanceof Uint8Array ? IV : new Uint8Array(IV)

	// Import the key
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyArray,
		{ name: 'AES-CBC', length: 256 },
		false,
		['decrypt']
	)

	// Decrypt the data
	const result = await crypto.subtle.decrypt(
		{
			name: 'AES-CBC',
			iv: iv
		},
		cryptoKey,
		ciphertext
	)

	return Buffer.from(result)
}

// encrypt AES 256 CBC; where a random IV is prefixed to the buffer
export async function aesEncrypt(
	buffer: Buffer | Uint8Array,
	key: Buffer | Uint8Array
): Promise<Buffer> {
	// Generate random IV (16 bytes for AES-CBC)
	const iv = crypto.getRandomValues(new Uint8Array(16))

	// Convert input to Uint8Array if it's a Buffer
	const plaintext = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
	const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key)

	// Import the key
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyArray,
		{ name: 'AES-CBC', length: 256 },
		false,
		['encrypt']
	)

	// Encrypt the data
	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-CBC',
			iv: iv
		},
		cryptoKey,
		plaintext
	)

	// Combine IV and ciphertext (prefix IV to the ciphertext)
	const result = new Uint8Array(iv.length + ciphertext.byteLength)
	result.set(iv, 0)
	result.set(new Uint8Array(ciphertext), iv.length)

	return Buffer.from(result.buffer)
}

// sign HMAC using SHA 256 or SHA 512
export async function hmacSign(
	buffer: Buffer | Uint8Array,
	key: Buffer | Uint8Array,
	variant: 'sha256' | 'sha512' = 'sha256'
): Promise<Buffer> {
	// Convert inputs to Uint8Array if they're Buffers
	const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
	const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key)

	// Import the key for HMAC
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyArray,
		{
			name: 'HMAC',
			hash: { name: variant === 'sha256' ? 'SHA-256' : 'SHA-512' }
		},
		false,
		['sign']
	)

	// Generate the HMAC signature
	const signature = await crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		data
	)

	return Buffer.from(signature)
}

export async function sha256(buffer: Buffer | Uint8Array) {
	const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)
	return Buffer.from(hashBuffer)
}

export function md5(buffer: Buffer | Uint8Array): Buffer {
	// Convert input to Uint8Array if it's a Buffer
	const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)

	// Implementation of MD5 in pure JavaScript
	// MD5 constants
	const K = new Uint32Array([
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
		0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
		0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
		0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
		0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
		0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
		0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
		0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
		0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
		0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
		0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
	])

	// Shift amounts
	const S = new Uint8Array([
		7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
		5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
		4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
		6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
	])

	// MD5 functions
	const F = (x: number, y: number, z: number) => (x & y) | (~x & z)
	const G = (x: number, y: number, z: number) => (x & z) | (y & ~z)
	const H = (x: number, y: number, z: number) => x ^ y ^ z
	const I = (x: number, y: number, z: number) => y ^ (x | ~z)

	// Left rotate function
	const ROTATE_LEFT = (x: number, n: number) => (x << n) | (x >>> (32 - n))

	// Helper to add values keeping them as 32-bit unsigned integers
	const add32 = (a: number, b: number) => {
		return (a + b) & 0xFFFFFFFF
	}

	// Initialize hash values (little-endian)
	let a0 = 0x67452301
	let b0 = 0xefcdab89
	let c0 = 0x98badcfe
	let d0 = 0x10325476

	// Pre-processing: padding the message
	const paddedLength = (((data.length + 8) >>> 6) + 1) << 6 // Length in bytes, padded to 64 bytes
	const paddedData = new Uint8Array(paddedLength)
	paddedData.set(data, 0)
	paddedData[data.length] = 0x80 // Append 1 bit (byte 0x80)

	// Append the length in bits as a 64-bit little-endian integer
	const bitLength = data.length * 8
	const dataView = new DataView(paddedData.buffer)
	dataView.setUint32(paddedLength - 8, bitLength, true)
	dataView.setUint32(paddedLength - 4, 0, true)

	// Process the message in 64-byte chunks
	for(let i = 0; i < paddedLength; i += 64) {
		// Break chunk into sixteen 32-bit words
		const words = new Uint32Array(16)
		for(let j = 0; j < 16; j++) {
			words[j] = dataView.getUint32(i + j * 4, true) // Little-endian
		}

		// Initialize hash value for this chunk
		let a = a0
		let b = b0
		let c = c0
		let d = d0

		// Main loop
		for(let j = 0; j < 64; j++) {
			let f: number, g: number

			if(j < 16) {
				f = F(b, c, d)
				g = j
			} else if(j < 32) {
				f = G(b, c, d)
				g = (5 * j + 1) % 16
			} else if(j < 48) {
				f = H(b, c, d)
				g = (3 * j + 5) % 16
			} else {
				f = I(b, c, d)
				g = (7 * j) % 16
			}

			const temp = d
			d = c
			c = b
			b = add32(b, ROTATE_LEFT(add32(add32(a, f), add32(K[j], words[g])), S[j]))
			a = temp
		}

		// Add this chunk's hash to result
		a0 = add32(a0, a)
		b0 = add32(b0, b)
		c0 = add32(c0, c)
		d0 = add32(d0, d)
	}

	// Output as bytes in little-endian format
	const hashBytes = new Uint8Array(16)
	const hashView = new DataView(hashBytes.buffer)
	hashView.setUint32(0, a0, true)
	hashView.setUint32(4, b0, true)
	hashView.setUint32(8, c0, true)
	hashView.setUint32(12, d0, true)

	return Buffer.from(hashBytes)
}

// HKDF key expansion
export async function hkdf(
	buffer: Uint8Array | Buffer,
	expandedLength: number,
	info: { salt?: Buffer, info?: string }
): Promise<Buffer> {
	// Ensure we have a Uint8Array for the key material
	const inputKeyMaterial = buffer instanceof Uint8Array
		? buffer
		: new Uint8Array(buffer)

	// Set default values if not provided
	const salt = info.salt ? new Uint8Array(info.salt) : new Uint8Array(0)
	const infoBytes = info.info
		? new TextEncoder().encode(info.info)
		: new Uint8Array(0)

	// Import the input key material
	const importedKey = await subtle.importKey(
		'raw',
		inputKeyMaterial,
		{ name: 'HKDF' },
		false,
		['deriveBits']
	)

	// Derive bits using HKDF
	const derivedBits = await subtle.deriveBits(
		{
			name: 'HKDF',
			hash: 'SHA-256',
			salt: salt,
			info: infoBytes
		},
		importedKey,
		expandedLength * 8 // Convert bytes to bits
	)

	return Buffer.from(derivedBits)
}


export async function derivePairingCodeKey(pairingCode: string, salt: Buffer): Promise<Buffer> {
	// Convert inputs to formats Web Crypto API can work with
	const encoder = new TextEncoder()
	const pairingCodeBuffer = encoder.encode(pairingCode)
	const saltBuffer = salt instanceof Uint8Array ? salt : new Uint8Array(salt)

	// Import the pairing code as key material
	const keyMaterial = await subtle.importKey(
		'raw',
		pairingCodeBuffer,
		{ name: 'PBKDF2' },
		false,
		['deriveBits']
	)

	// Derive bits using PBKDF2 with the same parameters
	// 2 << 16 = 131,072 iterations
	const derivedBits = await subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: saltBuffer,
			iterations: 2 << 16,
			hash: 'SHA-256'
		},
		keyMaterial,
		32 * 8 // 32 bytes * 8 = 256 bits
	)

	return Buffer.from(derivedBits)
}

export function randomBytes(size: number): Buffer {
	const bytes = new Uint8Array(size)
	crypto.getRandomValues(bytes)
	return Buffer.from(bytes)
}
