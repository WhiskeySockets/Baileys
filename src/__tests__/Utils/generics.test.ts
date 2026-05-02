import { BufferJSON, getCallStatusFromNode } from '../../Utils/generics'
import type { BinaryNode } from '../../WABinary'

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

describe('getCallStatusFromNode', () => {
	const makeNode = (tag: string, attrs: Record<string, string> = {}): BinaryNode => ({
		tag,
		attrs
	})

	it('should return "offer" for tag "offer"', () => {
		expect(getCallStatusFromNode(makeNode('offer'))).toBe('offer')
	})

	it('should return "offer" for tag "offer_notice"', () => {
		expect(getCallStatusFromNode(makeNode('offer_notice'))).toBe('offer')
	})

	it('should return "timeout" for tag "terminate" with reason "timeout"', () => {
		expect(getCallStatusFromNode(makeNode('terminate', { reason: 'timeout' }))).toBe('timeout')
	})

	it('should return "terminate" for tag "terminate" with non-timeout reason', () => {
		expect(getCallStatusFromNode(makeNode('terminate', { reason: 'caller-cancel' }))).toBe('terminate')
	})

	it('should return "terminate" for tag "terminate" with no reason', () => {
		expect(getCallStatusFromNode(makeNode('terminate'))).toBe('terminate')
	})

	it('should return "reject" for tag "reject"', () => {
		expect(getCallStatusFromNode(makeNode('reject'))).toBe('reject')
	})

	it('should return "accept" for tag "accept"', () => {
		expect(getCallStatusFromNode(makeNode('accept'))).toBe('accept')
	})

	it('should return "ringing" for unknown/default tag', () => {
		expect(getCallStatusFromNode(makeNode('ringing'))).toBe('ringing')
	})

	// These tags were removed from the PR - they now fall through to the default 'ringing' case
	it('should return "ringing" for previously supported "preaccept" tag (removed in PR)', () => {
		expect(getCallStatusFromNode(makeNode('preaccept'))).toBe('ringing')
	})

	it('should return "ringing" for previously supported "transport" tag (removed in PR)', () => {
		expect(getCallStatusFromNode(makeNode('transport'))).toBe('ringing')
	})

	it('should return "ringing" for previously supported "relaylatency" tag (removed in PR)', () => {
		expect(getCallStatusFromNode(makeNode('relaylatency'))).toBe('ringing')
	})

	it('should return "ringing" for completely unknown tag', () => {
		expect(getCallStatusFromNode(makeNode('somethingelse'))).toBe('ringing')
	})
})
