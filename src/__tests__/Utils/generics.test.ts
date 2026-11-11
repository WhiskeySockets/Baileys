import { BufferJSON, unpadRandomMax16, writeRandomPadMax16 } from '../../Utils/generics'

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
})

describe('unpadRandomMax16', () => {
	it('should round-trip data padded by writeRandomPadMax16', () => {
		const data = new Uint8Array([1, 2, 3, 4, 5])
		const padded = writeRandomPadMax16(data)
		// writeRandomPadMax16 always appends 1..16 pad bytes, so padding must grow the buffer
		expect(padded.length).toBeGreaterThan(data.length)
		expect(unpadRandomMax16(padded)).toEqual(data)
	})

	it('should throw on empty input', () => {
		expect(() => unpadRandomMax16(new Uint8Array([]))).toThrow('unpadPkcs7 given empty bytes')
	})

	it('should reject a trailing pad byte of 0 instead of returning the full buffer', () => {
		// A pad length of 0 is invalid PKCS7 (writeRandomPadMax16 only ever emits 1..16).
		// Previously this silently returned the whole buffer, masking corrupted input.
		const corrupted = new Uint8Array([0x41, 0x42, 0x43, 0x00])
		expect(() => unpadRandomMax16(corrupted)).toThrow('but pad is 0')
	})

	it('should reject a pad byte larger than the buffer', () => {
		const corrupted = new Uint8Array([0x41, 0x05])
		expect(() => unpadRandomMax16(corrupted)).toThrow('but pad is 5')
	})
})
