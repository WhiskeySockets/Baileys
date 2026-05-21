import { BufferJSON, runDetached } from '../../Utils/generics'

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

describe('runDetached', () => {
	const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

	it('logs the actual rejection even when context carries a colliding `err` key', async () => {
		// Stage 9 round 2 fix: the logger payload spreads `context` BEFORE
		// `err` so a caller-supplied `context.err` (e.g. a previous failure
		// they're carrying through) can't shadow the actual exception that
		// just fired. Pre-fix the order was `{ err, ...context }` which
		// would let `context.err` overwrite the real one in the log.
		const errorCalls: Array<{ obj: unknown; msg?: string }> = []
		const logger = { error: (obj: unknown, msg?: string) => errorCalls.push({ obj, msg }) }

		runDetached(
			async () => {
				throw new Error('actual-detached-failure')
			},
			logger,
			{ op: 'unit-test', err: 'caller-supplied-misleading-value' }
		)

		// Detached rejection lands on a microtask later.
		await delay(10)

		expect(errorCalls).toHaveLength(1)
		const payload = errorCalls[0]!.obj as { op: string; err: unknown }
		expect(payload.op).toBe('unit-test')
		// The REAL Error must win — not the caller's misleading string.
		expect(payload.err).toBeInstanceOf(Error)
		expect((payload.err as Error).message).toBe('actual-detached-failure')
	})
})
