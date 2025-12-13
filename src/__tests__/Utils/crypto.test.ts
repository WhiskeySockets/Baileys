import { randomBytes } from 'crypto'
import {
	Curve,
	signedKeyPair,
	aesEncryptGCM,
	aesDecryptGCM,
	aesEncryptCTR,
	aesDecryptCTR,
	aesEncrypt,
	aesDecrypt,
	aesDecryptWithIV,
	aesEncrypWithIV,
	hmacSign,
	sha256,
	md5,
	hkdf,
	derivePairingCodeKey,
	generateSignalPubKey,
} from '../../Utils/crypto'
import type { KeyPair } from '../../Types'

describe('Curve', () => {
	describe('generateKeyPair', () => {
		it('should generate a valid key pair', () => {
			const keyPair = Curve.generateKeyPair()

			expect(keyPair.public).toBeDefined()
			expect(keyPair.private).toBeDefined()
			expect(Buffer.isBuffer(keyPair.public)).toBe(true)
			expect(Buffer.isBuffer(keyPair.private)).toBe(true)
		})

		it('should generate 32-byte keys', () => {
			const keyPair = Curve.generateKeyPair()

			expect(keyPair.public.length).toBe(32)
			expect(keyPair.private.length).toBe(32)
		})

		it('should generate unique key pairs', () => {
			const keyPair1 = Curve.generateKeyPair()
			const keyPair2 = Curve.generateKeyPair()

			expect(keyPair1.public).not.toEqual(keyPair2.public)
			expect(keyPair1.private).not.toEqual(keyPair2.private)
		})
	})

	describe('sharedKey', () => {
		it('should compute shared key from two key pairs', () => {
			const alice = Curve.generateKeyPair()
			const bob = Curve.generateKeyPair()

			const aliceShared = Curve.sharedKey(alice.private, bob.public)
			const bobShared = Curve.sharedKey(bob.private, alice.public)

			expect(aliceShared).toEqual(bobShared)
		})

		it('should return 32-byte shared key', () => {
			const alice = Curve.generateKeyPair()
			const bob = Curve.generateKeyPair()

			const shared = Curve.sharedKey(alice.private, bob.public)

			expect(Buffer.isBuffer(shared)).toBe(true)
			expect(shared.length).toBe(32)
		})
	})

	describe('sign and verify', () => {
		it('should sign and verify a message', () => {
			const keyPair = Curve.generateKeyPair()
			const message = Buffer.from('Hello, World!')

			const signature = Curve.sign(keyPair.private, message)
			const isValid = Curve.verify(keyPair.public, message, signature)

			expect(isValid).toBe(true)
		})

		it('should verify valid signature', () => {
			const keyPair = Curve.generateKeyPair()
			const message = Buffer.from('Hello, World!')

			const signature = Curve.sign(keyPair.private, message)
			const isValid = Curve.verify(keyPair.public, message, signature)

			expect(isValid).toBe(true)
		})

		it('should produce consistent signatures', () => {
			const keyPair = Curve.generateKeyPair()
			const message = Buffer.from('Test message')

			const signature1 = Curve.sign(keyPair.private, message)
			const signature2 = Curve.sign(keyPair.private, message)

			// Signatures should be valid but may differ due to randomness in signing
			expect(Curve.verify(keyPair.public, message, signature1)).toBe(true)
			expect(Curve.verify(keyPair.public, message, signature2)).toBe(true)
		})
	})
})

describe('signedKeyPair', () => {
	it('should generate a signed pre-key', () => {
		const identityKey = Curve.generateKeyPair()
		const signedPreKey = signedKeyPair(identityKey, 1)

		expect(signedPreKey.keyPair).toBeDefined()
		expect(signedPreKey.signature).toBeDefined()
		expect(signedPreKey.keyId).toBe(1)
	})

	it('should generate valid signature', () => {
		const identityKey = Curve.generateKeyPair()
		const signedPreKey = signedKeyPair(identityKey, 1)

		const pubKey = generateSignalPubKey(signedPreKey.keyPair.public)
		const isValid = Curve.verify(identityKey.public, pubKey, signedPreKey.signature)

		expect(isValid).toBe(true)
	})

	it('should use provided keyId', () => {
		const identityKey = Curve.generateKeyPair()

		expect(signedKeyPair(identityKey, 5).keyId).toBe(5)
		expect(signedKeyPair(identityKey, 100).keyId).toBe(100)
	})
})

describe('generateSignalPubKey', () => {
	it('should add version byte to 32-byte key', () => {
		const key = randomBytes(32)
		const result = generateSignalPubKey(key)

		expect(result.length).toBe(33)
		expect(result[0]).toBe(0x05) // KEY_BUNDLE_TYPE
	})

	it('should return 33-byte key as is', () => {
		const key = Buffer.concat([Buffer.from([0x05]), randomBytes(32)])
		const result = generateSignalPubKey(key)

		expect(result).toEqual(key)
	})
})

describe('AES-GCM', () => {
	const key = randomBytes(32)
	const iv = randomBytes(12)
	const additionalData = Buffer.from('additional')
	const plaintext = Buffer.from('Hello, World!')

	it('should encrypt and decrypt correctly', () => {
		const ciphertext = aesEncryptGCM(plaintext, key, iv, additionalData)
		const decrypted = aesDecryptGCM(ciphertext, key, iv, additionalData)

		expect(decrypted).toEqual(plaintext)
	})

	it('should produce different ciphertext with different IVs', () => {
		const iv1 = randomBytes(12)
		const iv2 = randomBytes(12)

		const ciphertext1 = aesEncryptGCM(plaintext, key, iv1, additionalData)
		const ciphertext2 = aesEncryptGCM(plaintext, key, iv2, additionalData)

		expect(ciphertext1).not.toEqual(ciphertext2)
	})

	it('should fail decryption with wrong key', () => {
		const wrongKey = randomBytes(32)
		const ciphertext = aesEncryptGCM(plaintext, key, iv, additionalData)

		expect(() => aesDecryptGCM(ciphertext, wrongKey, iv, additionalData)).toThrow()
	})

	it('should fail decryption with wrong additional data', () => {
		const ciphertext = aesEncryptGCM(plaintext, key, iv, additionalData)
		const wrongAD = Buffer.from('wrong')

		expect(() => aesDecryptGCM(ciphertext, key, iv, wrongAD)).toThrow()
	})

	it('should include auth tag in ciphertext', () => {
		const ciphertext = aesEncryptGCM(plaintext, key, iv, additionalData)

		// Ciphertext should be longer than plaintext due to auth tag (16 bytes)
		expect(ciphertext.length).toBe(plaintext.length + 16)
	})
})

describe('AES-CTR', () => {
	const key = randomBytes(32)
	const iv = randomBytes(16)
	const plaintext = Buffer.from('Hello, World!')

	it('should encrypt and decrypt correctly', () => {
		const ciphertext = aesEncryptCTR(plaintext, key, iv)
		const decrypted = aesDecryptCTR(ciphertext, key, iv)

		expect(decrypted).toEqual(plaintext)
	})

	it('should produce same length output', () => {
		const ciphertext = aesEncryptCTR(plaintext, key, iv)
		expect(ciphertext.length).toBe(plaintext.length)
	})

	it('should be deterministic with same key/iv', () => {
		const ciphertext1 = aesEncryptCTR(plaintext, key, iv)
		const ciphertext2 = aesEncryptCTR(plaintext, key, iv)

		expect(ciphertext1).toEqual(ciphertext2)
	})
})

describe('AES-CBC', () => {
	const key = randomBytes(32)
	const plaintext = Buffer.from('Hello, World! This is a test.')

	describe('aesEncrypt / aesDecrypt', () => {
		it('should encrypt and decrypt correctly', () => {
			const ciphertext = aesEncrypt(plaintext, key)
			const decrypted = aesDecrypt(ciphertext, key)

			expect(decrypted).toEqual(plaintext)
		})

		it('should prefix IV to ciphertext', () => {
			const ciphertext = aesEncrypt(plaintext, key)

			// Should be longer than plaintext (IV + padding)
			expect(ciphertext.length).toBeGreaterThan(plaintext.length)
			// IV is 16 bytes
			expect(ciphertext.length).toBeGreaterThanOrEqual(16)
		})

		it('should produce different ciphertext each time (random IV)', () => {
			const ciphertext1 = aesEncrypt(plaintext, key)
			const ciphertext2 = aesEncrypt(plaintext, key)

			expect(ciphertext1).not.toEqual(ciphertext2)
		})
	})

	describe('aesEncrypWithIV / aesDecryptWithIV', () => {
		const iv = randomBytes(16)

		it('should encrypt and decrypt with explicit IV', () => {
			const ciphertext = aesEncrypWithIV(plaintext, key, iv)
			const decrypted = aesDecryptWithIV(ciphertext, key, iv)

			expect(decrypted).toEqual(plaintext)
		})

		it('should be deterministic with same IV', () => {
			const ciphertext1 = aesEncrypWithIV(plaintext, key, iv)
			const ciphertext2 = aesEncrypWithIV(plaintext, key, iv)

			expect(ciphertext1).toEqual(ciphertext2)
		})
	})
})

describe('hmacSign', () => {
	const key = randomBytes(32)
	const data = Buffer.from('Hello, World!')

	it('should produce SHA256 HMAC by default', () => {
		const hmac = hmacSign(data, key)

		expect(Buffer.isBuffer(hmac)).toBe(true)
		expect(hmac.length).toBe(32) // SHA256 produces 32 bytes
	})

	it('should produce SHA512 HMAC when specified', () => {
		const hmac = hmacSign(data, key, 'sha512')

		expect(hmac.length).toBe(64) // SHA512 produces 64 bytes
	})

	it('should be deterministic', () => {
		const hmac1 = hmacSign(data, key)
		const hmac2 = hmacSign(data, key)

		expect(hmac1).toEqual(hmac2)
	})

	it('should produce different output with different keys', () => {
		const key2 = randomBytes(32)

		const hmac1 = hmacSign(data, key)
		const hmac2 = hmacSign(data, key2)

		expect(hmac1).not.toEqual(hmac2)
	})

	it('should produce different output with different data', () => {
		const data2 = Buffer.from('Different data')

		const hmac1 = hmacSign(data, key)
		const hmac2 = hmacSign(data2, key)

		expect(hmac1).not.toEqual(hmac2)
	})
})

describe('sha256', () => {
	it('should produce 32-byte hash', () => {
		const hash = sha256(Buffer.from('test'))

		expect(Buffer.isBuffer(hash)).toBe(true)
		expect(hash.length).toBe(32)
	})

	it('should be deterministic', () => {
		const data = Buffer.from('Hello, World!')

		const hash1 = sha256(data)
		const hash2 = sha256(data)

		expect(hash1).toEqual(hash2)
	})

	it('should produce different hash for different inputs', () => {
		const hash1 = sha256(Buffer.from('input1'))
		const hash2 = sha256(Buffer.from('input2'))

		expect(hash1).not.toEqual(hash2)
	})

	it('should match known test vector', () => {
		// SHA256 of empty string
		const hash = sha256(Buffer.from(''))
		const expected = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

		expect(hash.toString('hex')).toBe(expected)
	})
})

describe('md5', () => {
	it('should produce 16-byte hash', () => {
		const hash = md5(Buffer.from('test'))

		expect(Buffer.isBuffer(hash)).toBe(true)
		expect(hash.length).toBe(16)
	})

	it('should be deterministic', () => {
		const data = Buffer.from('Hello, World!')

		const hash1 = md5(data)
		const hash2 = md5(data)

		expect(hash1).toEqual(hash2)
	})

	it('should match known test vector', () => {
		// MD5 of "hello"
		const hash = md5(Buffer.from('hello'))
		const expected = '5d41402abc4b2a76b9719d911017c592'

		expect(hash.toString('hex')).toBe(expected)
	})
})

describe('hkdf', () => {
	it('should derive key of specified length', async () => {
		const ikm = randomBytes(32)
		const derived = await hkdf(ikm, 64, {})

		expect(Buffer.isBuffer(derived)).toBe(true)
		expect(derived.length).toBe(64)
	})

	it('should be deterministic with same inputs', async () => {
		const ikm = randomBytes(32)
		const salt = randomBytes(16)
		const info = 'test info'

		const derived1 = await hkdf(ikm, 32, { salt, info })
		const derived2 = await hkdf(ikm, 32, { salt, info })

		expect(derived1).toEqual(derived2)
	})

	it('should produce different output with different salt', async () => {
		const ikm = randomBytes(32)

		const derived1 = await hkdf(ikm, 32, { salt: Buffer.from('salt1') })
		const derived2 = await hkdf(ikm, 32, { salt: Buffer.from('salt2') })

		expect(derived1).not.toEqual(derived2)
	})

	it('should produce different output with different info', async () => {
		const ikm = randomBytes(32)

		const derived1 = await hkdf(ikm, 32, { info: 'info1' })
		const derived2 = await hkdf(ikm, 32, { info: 'info2' })

		expect(derived1).not.toEqual(derived2)
	})

	it('should work with Buffer input', async () => {
		const ikm = Buffer.from('input key material')
		const derived = await hkdf(ikm, 32, {})

		expect(derived.length).toBe(32)
	})

	it('should work with Uint8Array input', async () => {
		const ikm = new Uint8Array([1, 2, 3, 4, 5])
		const derived = await hkdf(ikm, 32, {})

		expect(derived.length).toBe(32)
	})
})

describe('derivePairingCodeKey', () => {
	it('should derive 32-byte key', async () => {
		const pairingCode = 'ABCD1234'
		const salt = randomBytes(32)

		const key = await derivePairingCodeKey(pairingCode, salt)

		expect(Buffer.isBuffer(key)).toBe(true)
		expect(key.length).toBe(32)
	})

	it('should be deterministic with same inputs', async () => {
		const pairingCode = 'ABCD1234'
		const salt = Buffer.from('fixed_salt_for_test_purposes_32b')

		const key1 = await derivePairingCodeKey(pairingCode, salt)
		const key2 = await derivePairingCodeKey(pairingCode, salt)

		expect(key1).toEqual(key2)
	})

	it('should produce different keys with different pairing codes', async () => {
		const salt = randomBytes(32)

		const key1 = await derivePairingCodeKey('AAAA1111', salt)
		const key2 = await derivePairingCodeKey('BBBB2222', salt)

		expect(key1).not.toEqual(key2)
	})

	it('should produce different keys with different salts', async () => {
		const pairingCode = 'ABCD1234'

		const key1 = await derivePairingCodeKey(pairingCode, Buffer.alloc(32, 1))
		const key2 = await derivePairingCodeKey(pairingCode, Buffer.alloc(32, 2))

		expect(key1).not.toEqual(key2)
	})
})

describe('Edge cases', () => {
	it('should handle empty plaintext in AES-GCM', () => {
		const key = randomBytes(32)
		const iv = randomBytes(12)
		const ad = Buffer.from('')
		const plaintext = Buffer.from('')

		const ciphertext = aesEncryptGCM(plaintext, key, iv, ad)
		const decrypted = aesDecryptGCM(ciphertext, key, iv, ad)

		expect(decrypted).toEqual(plaintext)
	})

	it('should handle large data in AES-CBC', () => {
		const key = randomBytes(32)
		const plaintext = randomBytes(1024 * 10) // 10KB

		const ciphertext = aesEncrypt(plaintext, key)
		const decrypted = aesDecrypt(ciphertext, key)

		expect(decrypted).toEqual(plaintext)
	})

	it('should handle binary data in HMAC', () => {
		const key = randomBytes(32)
		const data = randomBytes(100)

		const hmac = hmacSign(data, key)

		expect(hmac.length).toBe(32)
	})
})
