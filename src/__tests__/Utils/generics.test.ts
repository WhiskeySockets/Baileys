import { Boom } from '@hapi/boom'
import {
	BufferJSON,
	delay,
	delayCancellable,
	promiseTimeout,
	generateMessageID,
	generateMessageIDV2,
	toNumber,
	unixTimestampSeconds,
	debouncedTimeout,
	encodeBigEndian,
	writeRandomPadMax16,
	unpadRandomMax16,
	generateRegistrationId,
	generateMdTagPrefix,
	getStatusFromReceiptType,
	isWABusinessPlatform,
	trimUndefined,
	bytesToCrockford,
	getKeyAuthor,
	generateParticipantHashV2,
} from '../../Utils/generics'
import { proto } from '../../../WAProto'

describe('BufferJSON', () => {
	const originalObject = {
		id: 1,
		key: Buffer.from([1, 2, 3, 4, 5]),
		nested: {
			data: Buffer.from([6, 7, 8])
		}
	}

	const legacyJsonString = '{"id":1,"key":{"0":1,"1":2,"2":3,"3":4,"4":5},"nested":{"data":{"0":6,"1":7,"2":8}}}'

	it('should correctly perform a round trip (stringify with replacer, parse with reviver)', () => {
		const serialized = JSON.stringify(originalObject, BufferJSON.replacer)

		expect(serialized).toContain('"type":"Buffer"')
		expect(serialized).not.toContain('"data":[1,2,3,4,5]')

		const revived = JSON.parse(serialized, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.key)).toBe(true)
		expect(Buffer.isBuffer(revived.nested.data)).toBe(true)
		expect(revived.key).toEqual(originalObject.key)
		expect(revived).toEqual(originalObject)
	})

	it('should correctly revive a legacy JSON string with object-like buffers', () => {
		const revived = JSON.parse(legacyJsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.key)).toBe(true)
		expect(Buffer.isBuffer(revived.nested.data)).toBe(true)
		expect(revived.key).toEqual(originalObject.key)
		expect(revived.nested.data).toEqual(originalObject.nested.data)
		expect(revived.id).toEqual(originalObject.id)
	})

	it('should not corrupt legitimate objects that are not buffers', () => {
		const legitimateProtoObject = {
			'0': 'some-value',
			'1': 'another-value'
		}
		const jsonString = JSON.stringify(legitimateProtoObject)
		const revived = JSON.parse(jsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived)).toBe(false)
		expect(revived).toEqual(legitimateProtoObject)
	})

	it('should not convert other objects or null values', () => {
		const otherObject = {
			a: 1,
			b: 2,
			c: null,
			d: { '0': 1, foo: 'bar' }
		}
		const jsonString = JSON.stringify(otherObject)
		const revived = JSON.parse(jsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.a)).toBe(false)
		expect(revived.c).toBeNull()
		expect(Buffer.isBuffer(revived.d)).toBe(false)
		expect(revived).toEqual(otherObject)
	})

	it('should correctly handle an empty object', () => {
		const revived = JSON.parse('{}', BufferJSON.reviver)
		expect(revived).toEqual({})
	})

	it('should handle Uint8Array correctly', () => {
		const uint8 = new Uint8Array([1, 2, 3])
		const serialized = JSON.stringify({ data: uint8 }, BufferJSON.replacer)
		expect(serialized).toContain('"type":"Buffer"')
	})
})

describe('delay', () => {
	it('should resolve after specified milliseconds', async () => {
		const start = Date.now()
		await delay(50)
		const elapsed = Date.now() - start
		expect(elapsed).toBeGreaterThanOrEqual(45)
		expect(elapsed).toBeLessThan(150)
	})

	it('should handle zero delay', async () => {
		const start = Date.now()
		await delay(0)
		const elapsed = Date.now() - start
		expect(elapsed).toBeLessThan(50)
	})
})

describe('delayCancellable', () => {
	it('should resolve after specified milliseconds', async () => {
		const { delay: delayPromise } = delayCancellable(50)
		const start = Date.now()
		await delayPromise
		const elapsed = Date.now() - start
		expect(elapsed).toBeGreaterThanOrEqual(45)
	})

	it('should reject when cancelled', async () => {
		const { delay: delayPromise, cancel } = delayCancellable(1000)

		setTimeout(() => cancel(), 10)

		await expect(delayPromise).rejects.toThrow('Cancelled')
	})

	it('should include stack trace in cancellation error', async () => {
		const { delay: delayPromise, cancel } = delayCancellable(1000)

		setTimeout(() => cancel(), 10)

		try {
			await delayPromise
		} catch (err) {
			expect(err).toBeInstanceOf(Boom)
			expect((err as Boom).data?.stack).toBeDefined()
		}
	})
})

describe('promiseTimeout', () => {
	it('should resolve if promise completes before timeout', async () => {
		const result = await promiseTimeout(1000, (resolve) => {
			setTimeout(() => resolve('success'), 10)
		})
		expect(result).toBe('success')
	})

	it('should reject with timeout error if promise takes too long', async () => {
		await expect(
			promiseTimeout(50, (resolve) => {
				setTimeout(() => resolve('too late'), 200)
			})
		).rejects.toThrow('Timed Out')
	})

	it('should work without timeout if ms is undefined', async () => {
		const result = await promiseTimeout(undefined, (resolve) => {
			resolve('immediate')
		})
		expect(result).toBe('immediate')
	})

	it('should propagate rejection from inner promise', async () => {
		await expect(
			promiseTimeout(1000, (_, reject) => {
				setTimeout(() => reject(new Error('inner error')), 10)
			})
		).rejects.toThrow('inner error')
	})
})

describe('generateMessageID', () => {
	it('should generate a string starting with 3EB0', () => {
		const id = generateMessageID()
		expect(id).toMatch(/^3EB0[A-F0-9]{36}$/)
	})

	it('should generate unique IDs', () => {
		const ids = new Set<string>()
		for (let i = 0; i < 100; i++) {
			ids.add(generateMessageID())
		}
		expect(ids.size).toBe(100)
	})

	it('should always be uppercase', () => {
		for (let i = 0; i < 10; i++) {
			const id = generateMessageID()
			expect(id).toBe(id.toUpperCase())
		}
	})
})

describe('generateMessageIDV2', () => {
	it('should generate a string starting with 3EB0', () => {
		const id = generateMessageIDV2()
		expect(id).toMatch(/^3EB0[A-F0-9]{18}$/)
	})

	it('should include user info when provided', () => {
		const id1 = generateMessageIDV2('1234567890@s.whatsapp.net')
		const id2 = generateMessageIDV2()
		// Both should be valid format
		expect(id1).toMatch(/^3EB0[A-F0-9]{18}$/)
		expect(id2).toMatch(/^3EB0[A-F0-9]{18}$/)
	})

	it('should generate unique IDs', () => {
		const ids = new Set<string>()
		for (let i = 0; i < 50; i++) {
			ids.add(generateMessageIDV2())
		}
		expect(ids.size).toBe(50)
	})
})

describe('toNumber', () => {
	it('should return number as is', () => {
		expect(toNumber(42)).toBe(42)
		expect(toNumber(0)).toBe(0)
		expect(toNumber(-5)).toBe(-5)
	})

	it('should return 0 for null/undefined', () => {
		expect(toNumber(null)).toBe(0)
		expect(toNumber(undefined)).toBe(0)
	})

	it('should handle Long-like objects with toNumber', () => {
		const longLike = { toNumber: () => 123 }
		expect(toNumber(longLike as any)).toBe(123)
	})

	it('should handle Long-like objects with low property', () => {
		const longLike = { low: 456, high: 0 }
		expect(toNumber(longLike as any)).toBe(456)
	})
})

describe('unixTimestampSeconds', () => {
	it('should return current timestamp in seconds', () => {
		const now = Math.floor(Date.now() / 1000)
		const result = unixTimestampSeconds()
		expect(result).toBeGreaterThanOrEqual(now - 1)
		expect(result).toBeLessThanOrEqual(now + 1)
	})

	it('should return timestamp for specific date', () => {
		const date = new Date('2024-01-01T00:00:00Z')
		const result = unixTimestampSeconds(date)
		expect(result).toBe(1704067200)
	})
})

describe('debouncedTimeout', () => {
	it('should call task after interval', async () => {
		let called = false
		const debounced = debouncedTimeout(50, () => { called = true })
		debounced.start()

		expect(called).toBe(false)
		await delay(100)
		expect(called).toBe(true)
	})

	it('should reset timer on subsequent starts', async () => {
		let callCount = 0
		const debounced = debouncedTimeout(50, () => { callCount++ })

		debounced.start()
		await delay(30)
		debounced.start() // Reset
		await delay(30)
		debounced.start() // Reset again
		await delay(100)

		expect(callCount).toBe(1)
	})

	it('should cancel pending task', async () => {
		let called = false
		const debounced = debouncedTimeout(50, () => { called = true })

		debounced.start()
		debounced.cancel()
		await delay(100)

		expect(called).toBe(false)
	})

	it('should allow changing task', async () => {
		let value = ''
		const debounced = debouncedTimeout(50, () => { value = 'first' })

		debounced.setTask(() => { value = 'second' })
		debounced.start()
		await delay(100)

		expect(value).toBe('second')
	})

	it('should allow changing interval', async () => {
		let called = false
		const debounced = debouncedTimeout(1000, () => { called = true })

		debounced.setInterval(50)
		debounced.start()
		await delay(100)

		expect(called).toBe(true)
	})
})

describe('encodeBigEndian', () => {
	it('should encode number in big endian format', () => {
		const result = encodeBigEndian(0x12345678, 4)
		expect(result).toEqual(new Uint8Array([0x12, 0x34, 0x56, 0x78]))
	})

	it('should handle zero', () => {
		const result = encodeBigEndian(0, 4)
		expect(result).toEqual(new Uint8Array([0, 0, 0, 0]))
	})

	it('should handle different byte lengths', () => {
		expect(encodeBigEndian(0xFF, 1)).toEqual(new Uint8Array([0xFF]))
		expect(encodeBigEndian(0xFFFF, 2)).toEqual(new Uint8Array([0xFF, 0xFF]))
	})

	it('should truncate to specified length', () => {
		const result = encodeBigEndian(0x123456, 2)
		expect(result).toEqual(new Uint8Array([0x34, 0x56]))
	})
})

describe('writeRandomPadMax16 / unpadRandomMax16', () => {
	it('should pad and unpad correctly (round trip)', () => {
		const original = Buffer.from('Hello World')
		const padded = writeRandomPadMax16(original)
		const unpadded = unpadRandomMax16(padded)

		expect(Buffer.from(unpadded)).toEqual(original)
	})

	it('should add 1-16 bytes of padding', () => {
		const original = Buffer.from('test')
		const padded = writeRandomPadMax16(original)

		const paddingLength = padded.length - original.length
		expect(paddingLength).toBeGreaterThanOrEqual(1)
		expect(paddingLength).toBeLessThanOrEqual(16)
	})

	it('should throw on empty buffer unpad', () => {
		expect(() => unpadRandomMax16(Buffer.alloc(0))).toThrow('unpadPkcs7 given empty bytes')
	})

	it('should throw on invalid padding', () => {
		// Create buffer with invalid padding (padding byte > length)
		const invalidPadded = Buffer.from([1, 2, 3, 100])
		expect(() => unpadRandomMax16(invalidPadded)).toThrow()
	})
})

describe('generateRegistrationId', () => {
	it('should generate a 14-bit number', () => {
		for (let i = 0; i < 100; i++) {
			const id = generateRegistrationId()
			expect(id).toBeGreaterThanOrEqual(0)
			expect(id).toBeLessThanOrEqual(16383) // 2^14 - 1
		}
	})

	it('should generate random IDs', () => {
		const ids = new Set<number>()
		for (let i = 0; i < 50; i++) {
			ids.add(generateRegistrationId())
		}
		// Should have high variance (not all same)
		expect(ids.size).toBeGreaterThan(10)
	})
})

describe('generateMdTagPrefix', () => {
	it('should generate valid tag prefix format', () => {
		const prefix = generateMdTagPrefix()
		expect(prefix).toMatch(/^\d+\.\d+-$/)
	})

	it('should generate unique prefixes', () => {
		const prefixes = new Set<string>()
		for (let i = 0; i < 50; i++) {
			prefixes.add(generateMdTagPrefix())
		}
		expect(prefixes.size).toBeGreaterThan(25)
	})
})

describe('getStatusFromReceiptType', () => {
	it('should return DELIVERY_ACK for undefined type', () => {
		expect(getStatusFromReceiptType(undefined)).toBe(proto.WebMessageInfo.Status.DELIVERY_ACK)
	})

	it('should return SERVER_ACK for sender type', () => {
		expect(getStatusFromReceiptType('sender')).toBe(proto.WebMessageInfo.Status.SERVER_ACK)
	})

	it('should return PLAYED for played type', () => {
		expect(getStatusFromReceiptType('played')).toBe(proto.WebMessageInfo.Status.PLAYED)
	})

	it('should return READ for read type', () => {
		expect(getStatusFromReceiptType('read')).toBe(proto.WebMessageInfo.Status.READ)
	})

	it('should return READ for read-self type', () => {
		expect(getStatusFromReceiptType('read-self')).toBe(proto.WebMessageInfo.Status.READ)
	})

	it('should return undefined for unknown type', () => {
		expect(getStatusFromReceiptType('unknown')).toBeUndefined()
	})
})

describe('isWABusinessPlatform', () => {
	it('should return true for smbi platform', () => {
		expect(isWABusinessPlatform('smbi')).toBe(true)
	})

	it('should return true for smba platform', () => {
		expect(isWABusinessPlatform('smba')).toBe(true)
	})

	it('should return false for other platforms', () => {
		expect(isWABusinessPlatform('android')).toBe(false)
		expect(isWABusinessPlatform('ios')).toBe(false)
		expect(isWABusinessPlatform('web')).toBe(false)
		expect(isWABusinessPlatform('')).toBe(false)
	})
})

describe('trimUndefined', () => {
	it('should remove undefined properties', () => {
		const obj = { a: 1, b: undefined, c: 'test', d: undefined }
		const result = trimUndefined(obj)

		expect(result).toEqual({ a: 1, c: 'test' })
		expect('b' in result).toBe(false)
		expect('d' in result).toBe(false)
	})

	it('should keep null values', () => {
		const obj = { a: null, b: undefined }
		const result = trimUndefined(obj)

		expect(result).toEqual({ a: null })
	})

	it('should handle empty object', () => {
		expect(trimUndefined({})).toEqual({})
	})

	it('should handle object with only undefined values', () => {
		const obj = { a: undefined, b: undefined }
		const result = trimUndefined(obj)
		expect(Object.keys(result).length).toBe(0)
	})
})

describe('bytesToCrockford', () => {
	it('should encode bytes to crockford base32', () => {
		const buffer = Buffer.from([0xFF])
		const result = bytesToCrockford(buffer)
		expect(result).toBe('ZW')
	})

	it('should handle empty buffer', () => {
		const result = bytesToCrockford(Buffer.alloc(0))
		expect(result).toBe('')
	})

	it('should produce consistent output', () => {
		const buffer = Buffer.from([1, 2, 3, 4])
		const result1 = bytesToCrockford(buffer)
		const result2 = bytesToCrockford(buffer)
		expect(result1).toBe(result2)
	})

	it('should use crockford characters only', () => {
		const buffer = Buffer.from([0x00, 0xFF, 0x55, 0xAA])
		const result = bytesToCrockford(buffer)
		// Crockford excludes: 0, I, L, O, U
		expect(result).not.toMatch(/[0ILOU]/i)
	})
})

describe('getKeyAuthor', () => {
	it('should return meId when fromMe is true', () => {
		const key = { fromMe: true, remoteJid: '123@s.whatsapp.net' }
		expect(getKeyAuthor(key, 'me@s.whatsapp.net')).toBe('me@s.whatsapp.net')
	})

	it('should return participant when available', () => {
		const key = { fromMe: false, participant: 'user@s.whatsapp.net', remoteJid: 'group@g.us' }
		expect(getKeyAuthor(key)).toBe('user@s.whatsapp.net')
	})

	it('should return remoteJid as fallback', () => {
		const key = { fromMe: false, remoteJid: '123@s.whatsapp.net' }
		expect(getKeyAuthor(key)).toBe('123@s.whatsapp.net')
	})

	it('should handle undefined key', () => {
		expect(getKeyAuthor(undefined)).toBe('')
		expect(getKeyAuthor(null)).toBe('')
	})

	it('should prioritize participantAlt over participant', () => {
		const key = {
			fromMe: false,
			participantAlt: 'alt@s.whatsapp.net',
			participant: 'user@s.whatsapp.net'
		}
		expect(getKeyAuthor(key as any)).toBe('alt@s.whatsapp.net')
	})
})

describe('generateParticipantHashV2', () => {
	it('should generate hash starting with 2:', () => {
		const hash = generateParticipantHashV2(['user1@s.whatsapp.net', 'user2@s.whatsapp.net'])
		expect(hash).toMatch(/^2:.{6}$/)
	})

	it('should produce same hash regardless of order', () => {
		const hash1 = generateParticipantHashV2(['a@s.whatsapp.net', 'b@s.whatsapp.net'])
		const hash2 = generateParticipantHashV2(['b@s.whatsapp.net', 'a@s.whatsapp.net'])
		expect(hash1).toBe(hash2)
	})

	it('should produce different hashes for different participants', () => {
		const hash1 = generateParticipantHashV2(['user1@s.whatsapp.net'])
		const hash2 = generateParticipantHashV2(['user2@s.whatsapp.net'])
		expect(hash1).not.toBe(hash2)
	})

	it('should handle empty array', () => {
		const hash = generateParticipantHashV2([])
		expect(hash).toMatch(/^2:.{6}$/)
	})
})
