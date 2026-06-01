import Long from 'long'
import $protobuf from 'protobufjs/minimal.js'

const $util = $protobuf.util

// proto implementation
function longToStringOld(value: any, unsigned?: boolean): string {
	if (typeof value === 'string') return value
	if (typeof value === 'number') return String(value)
	if (!$util.Long) return String(value)
	const normalized = ($util.Long as any).fromValue(value)
	const prepared =
		unsigned && normalized && typeof normalized.toUnsigned === 'function' ? normalized.toUnsigned() : normalized
	return prepared.toString()
}

// bigint implementation
function longToStringNew(value: any, unsigned?: boolean): string {
	if (typeof value === 'string') return value
	if (typeof value === 'number') return String(value)
	if (value && typeof value.low === 'number' && typeof value.high === 'number') {
		const lo = BigInt(value.low >>> 0)
		const hi = BigInt(value.high >>> 0)
		const combined = (hi << 32n) | lo
		if (!unsigned && value.high < 0) {
			return (combined - (1n << 64n)).toString()
		}

		return combined.toString()
	}

	return String(value)
}

function longToNumberOld(value: any, unsigned?: boolean): number {
	if (typeof value === 'number') return value
	if (typeof value === 'string') return Number(value)
	if (!$util.Long) return Number(value)
	const normalized = ($util.Long as any).fromValue(value)
	const prepared =
		unsigned && normalized && typeof normalized.toUnsigned === 'function'
			? normalized.toUnsigned()
			: typeof normalized.toSigned === 'function'
				? normalized.toSigned()
				: normalized
	return prepared.toNumber()
}

function longToNumberNew(value: any, unsigned?: boolean): number {
	if (typeof value === 'number') return value
	if (typeof value === 'string') return Number(value)
	if (value && typeof value.low === 'number' && typeof value.high === 'number') {
		const lo = BigInt(value.low >>> 0)
		const hi = BigInt(value.high >>> 0)
		const combined = (hi << 32n) | lo
		if (!unsigned && value.high < 0) {
			return Number(combined - (1n << 64n))
		}

		return Number(combined)
	}

	return Number(value)
}

describe('BigInt vs Long equivalence validation', () => {
	// Test cases: [description, Long value, unsigned flag]
	const testCases: [string, Long, boolean][] = [
		// Basic values
		['zero unsigned', Long.fromNumber(0, true), true],
		['zero signed', Long.fromNumber(0, false), false],
		['one unsigned', Long.fromNumber(1, true), true],
		['one signed', Long.fromNumber(1, false), false],

		// Typical WhatsApp timestamps (seconds since epoch)
		['timestamp 2023', Long.fromNumber(1700000000, true), true],
		['timestamp 2025', Long.fromNumber(1750000000, true), true],
		['timestamp as signed', Long.fromNumber(1700000000, false), false],

		// File sizes
		['small file', Long.fromNumber(1024, true), true],
		['medium file 10MB', Long.fromNumber(10485760, true), true],
		['large file 2GB', Long.fromNumber(2147483648, true), true],

		// Boundary values - 32-bit
		['max int32', Long.fromNumber(2147483647, false), false],
		['min int32', Long.fromNumber(-2147483648, false), false],
		['max uint32', Long.fromNumber(4294967295, true), true],

		// Around MAX_SAFE_INTEGER
		['MAX_SAFE_INTEGER', Long.fromString('9007199254740991', false), false],
		['MAX_SAFE_INTEGER + 1', Long.fromString('9007199254740992', false), false],
		['MAX_SAFE_INTEGER unsigned', Long.fromString('9007199254740991', true), true],

		// Large unsigned values
		['large unsigned', Long.fromString('9999999999999999999', true), true],
		['max uint64', Long.fromString('18446744073709551615', true), true],
		['max uint64 - 1', Long.fromString('18446744073709551614', true), true],

		// Signed negative values
		['negative one', Long.fromNumber(-1, false), false],
		['negative small', Long.fromNumber(-100, false), false],
		['negative large', Long.fromNumber(-2147483648, false), false],
		['min int64', Long.fromString('-9223372036854775808', false), false],
		['max int64', Long.fromString('9223372036854775807', false), false],
		['-1 as signed Long', Long.fromBits(-1, -1, false), false],

		// Tricky bit patterns
		['high=1, low=0', Long.fromBits(0, 1, true), true],
		['high=0, low=-1 (0xFFFFFFFF)', Long.fromBits(-1, 0, true), true],
		['high=-1, low=-1 unsigned (max uint64)', Long.fromBits(-1, -1, true), true],
		['high=0x7FFFFFFF, low=0xFFFFFFFF (max int64)', Long.fromBits(-1, 0x7fffffff, false), false],
		['high=0x80000000, low=0 (min int64)', Long.fromBits(0, -2147483648, false), false],

		// Powers of 2
		['2^32', Long.fromString('4294967296', true), true],
		['2^32 signed', Long.fromString('4294967296', false), false],
		['2^48', Long.fromString('281474976710656', true), true],
		['2^63', Long.fromString('9223372036854775808', true), true]
	]

	describe('longToString equivalence', () => {
		for (const [desc, longVal, unsigned] of testCases) {
			it(`${desc}: Long(${longVal.low}, ${longVal.high}, ${unsigned})`, () => {
				const oldResult = longToStringOld(longVal, unsigned)
				const newResult = longToStringNew(longVal, unsigned)
				expect(newResult).toBe(oldResult)
			})
		}
	})

	describe('longToNumber equivalence', () => {
		for (const [desc, longVal, unsigned] of testCases) {
			it(`${desc}: Long(${longVal.low}, ${longVal.high}, ${unsigned})`, () => {
				const oldResult = longToNumberOld(longVal, unsigned)
				const newResult = longToNumberNew(longVal, unsigned)
				// For large values, both may lose precision equally (Number limitation)
				// So we compare string representations
				expect(newResult.toString()).toBe(oldResult.toString())
			})
		}
	})

	describe('non-Long inputs (fallback paths)', () => {
		it('string passthrough', () => {
			expect(longToStringNew('12345')).toBe('12345')
			expect(longToStringNew('0')).toBe('0')
		})
		it('number passthrough', () => {
			expect(longToStringNew(42)).toBe('42')
			expect(longToStringNew(0)).toBe('0')
			expect(longToStringNew(-1)).toBe('-1')
		})
		it('null/undefined fallback', () => {
			expect(longToStringNew(null)).toBe('null')
			expect(longToStringNew(undefined)).toBe('undefined')
		})
		it('object without low/high', () => {
			expect(longToStringNew({ foo: 'bar' })).toBe('[object Object]')
		})
	})

	describe('fuzz: random Long values', () => {
		it('100 random unsigned values match', () => {
			for (let i = 0; i < 100; i++) {
				const low = (Math.random() * 0xffffffff) | 0
				const high = (Math.random() * 0xffffffff) | 0
				const longVal = Long.fromBits(low, high, true)
				const oldResult = longToStringOld(longVal, true)
				const newResult = longToStringNew(longVal, true)
				expect(newResult).toBe(oldResult)
			}
		})

		it('100 random signed values match', () => {
			for (let i = 0; i < 100; i++) {
				const low = (Math.random() * 0xffffffff) | 0
				const high = (Math.random() * 0xffffffff) | 0
				const longVal = Long.fromBits(low, high, false)
				const oldResult = longToStringOld(longVal, false)
				const newResult = longToStringNew(longVal, false)
				expect(newResult).toBe(oldResult)
			}
		})
	})
})
