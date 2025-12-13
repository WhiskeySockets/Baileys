import {
	getBinaryNodeChildren,
	getAllBinaryNodeChildren,
	getBinaryNodeChild,
	getBinaryNodeChildBuffer,
	getBinaryNodeChildString,
	getBinaryNodeChildUInt,
	assertNodeErrorFree,
	reduceBinaryNodeToDictionary,
	binaryNodeToString
} from '../../WABinary/generic-utils'
import type { BinaryNode } from '../../WABinary/types'

describe('getBinaryNodeChildren', () => {
	it('should return children with matching tag', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [
				{ tag: 'child', attrs: { id: '1' } },
				{ tag: 'other', attrs: { id: '2' } },
				{ tag: 'child', attrs: { id: '3' } }
			]
		}

		const children = getBinaryNodeChildren(node, 'child')
		expect(children.length).toBe(2)
		expect(children[0]!.attrs.id).toBe('1')
		expect(children[1]!.attrs.id).toBe('3')
	})

	it('should return empty array if no matching children', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'other', attrs: {} }]
		}

		const children = getBinaryNodeChildren(node, 'nonexistent')
		expect(children).toEqual([])
	})

	it('should return empty array if content is not an array', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: 'string content'
		}

		const children = getBinaryNodeChildren(node, 'child')
		expect(children).toEqual([])
	})

	it('should return empty array if node is undefined', () => {
		const children = getBinaryNodeChildren(undefined, 'child')
		expect(children).toEqual([])
	})

	it('should return empty array if content is undefined', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {}
		}

		const children = getBinaryNodeChildren(node, 'child')
		expect(children).toEqual([])
	})
})

describe('getAllBinaryNodeChildren', () => {
	it('should return all children', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [
				{ tag: 'child1', attrs: {} },
				{ tag: 'child2', attrs: {} },
				{ tag: 'child3', attrs: {} }
			]
		}

		const children = getAllBinaryNodeChildren(node)
		expect(children.length).toBe(3)
	})

	it('should return empty array if content is not an array', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: Buffer.from([1, 2, 3])
		}

		const children = getAllBinaryNodeChildren(node)
		expect(children).toEqual([])
	})

	it('should return empty array if content is undefined', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {}
		}

		const children = getAllBinaryNodeChildren(node)
		expect(children).toEqual([])
	})
})

describe('getBinaryNodeChild', () => {
	it('should return first child with matching tag', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [
				{ tag: 'child', attrs: { id: '1' } },
				{ tag: 'child', attrs: { id: '2' } }
			]
		}

		const child = getBinaryNodeChild(node, 'child')
		expect(child?.attrs.id).toBe('1')
	})

	it('should return undefined if no matching child', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'other', attrs: {} }]
		}

		const child = getBinaryNodeChild(node, 'child')
		expect(child).toBeUndefined()
	})

	it('should return undefined if node is undefined', () => {
		const child = getBinaryNodeChild(undefined, 'child')
		expect(child).toBeUndefined()
	})

	it('should return undefined if content is not an array', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: 'string'
		}

		const child = getBinaryNodeChild(node, 'child')
		expect(child).toBeUndefined()
	})
})

describe('getBinaryNodeChildBuffer', () => {
	it('should return Buffer content from child', () => {
		const bufferContent = Buffer.from([1, 2, 3, 4])
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'data', attrs: {}, content: bufferContent }]
		}

		const buffer = getBinaryNodeChildBuffer(node, 'data')
		expect(buffer).toEqual(bufferContent)
	})

	it('should return Uint8Array content from child', () => {
		const uint8Content = new Uint8Array([5, 6, 7, 8])
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'data', attrs: {}, content: uint8Content }]
		}

		const buffer = getBinaryNodeChildBuffer(node, 'data')
		expect(buffer).toEqual(uint8Content)
	})

	it('should return undefined for string content', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'data', attrs: {}, content: 'string' }]
		}

		const buffer = getBinaryNodeChildBuffer(node, 'data')
		expect(buffer).toBeUndefined()
	})

	it('should return undefined if child not found', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: []
		}

		const buffer = getBinaryNodeChildBuffer(node, 'data')
		expect(buffer).toBeUndefined()
	})
})

describe('getBinaryNodeChildString', () => {
	it('should return string content directly', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'text', attrs: {}, content: 'hello world' }]
		}

		const str = getBinaryNodeChildString(node, 'text')
		expect(str).toBe('hello world')
	})

	it('should convert Buffer content to string', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'text', attrs: {}, content: Buffer.from('buffer text') }]
		}

		const str = getBinaryNodeChildString(node, 'text')
		expect(str).toBe('buffer text')
	})

	it('should convert Uint8Array content to string', () => {
		const text = 'uint8 text'
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'text', attrs: {}, content: new Uint8Array(Buffer.from(text)) }]
		}

		const str = getBinaryNodeChildString(node, 'text')
		expect(str).toBe(text)
	})

	it('should return undefined for other content types', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'text', attrs: {}, content: [{ tag: 'nested', attrs: {} }] }]
		}

		const str = getBinaryNodeChildString(node, 'text')
		expect(str).toBeUndefined()
	})

	it('should return undefined if child not found', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: []
		}

		const str = getBinaryNodeChildString(node, 'text')
		expect(str).toBeUndefined()
	})
})

describe('getBinaryNodeChildUInt', () => {
	it('should read 1-byte unsigned integer', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'num', attrs: {}, content: Buffer.from([255]) }]
		}

		const num = getBinaryNodeChildUInt(node, 'num', 1)
		expect(num).toBe(255)
	})

	it('should read 2-byte unsigned integer (big endian)', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'num', attrs: {}, content: Buffer.from([0x01, 0x00]) }]
		}

		const num = getBinaryNodeChildUInt(node, 'num', 2)
		expect(num).toBe(256)
	})

	it('should read 4-byte unsigned integer', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [{ tag: 'num', attrs: {}, content: Buffer.from([0x00, 0x01, 0x00, 0x00]) }]
		}

		const num = getBinaryNodeChildUInt(node, 'num', 4)
		expect(num).toBe(65536)
	})

	it('should return undefined if child not found', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: []
		}

		const num = getBinaryNodeChildUInt(node, 'num', 4)
		expect(num).toBeUndefined()
	})
})

describe('assertNodeErrorFree', () => {
	it('should not throw for node without error', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'result' },
			content: [{ tag: 'success', attrs: {} }]
		}

		expect(() => assertNodeErrorFree(node)).not.toThrow()
	})

	it('should throw Boom error with text', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'error' },
			content: [{ tag: 'error', attrs: { text: 'Something went wrong', code: '500' } }]
		}

		expect(() => assertNodeErrorFree(node)).toThrow('Something went wrong')
	})

	it('should throw with "Unknown error" if no text', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'error' },
			content: [{ tag: 'error', attrs: { code: '404' } }]
		}

		expect(() => assertNodeErrorFree(node)).toThrow('Unknown error')
	})

	it('should include error code in Boom data', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'error' },
			content: [{ tag: 'error', attrs: { text: 'Not found', code: '404' } }]
		}

		try {
			assertNodeErrorFree(node)
			fail('Should have thrown')
		} catch (e: any) {
			expect(e.data).toBe(404)
		}
	})
})

describe('reduceBinaryNodeToDictionary', () => {
	it('should reduce nodes to dictionary using name attribute', () => {
		const node: BinaryNode = {
			tag: 'props',
			attrs: {},
			content: [
				{ tag: 'prop', attrs: { name: 'key1', value: 'value1' } },
				{ tag: 'prop', attrs: { name: 'key2', value: 'value2' } }
			]
		}

		const dict = reduceBinaryNodeToDictionary(node, 'prop')
		expect(dict).toEqual({
			key1: 'value1',
			key2: 'value2'
		})
	})

	it('should use config_code when name is not string', () => {
		const node: BinaryNode = {
			tag: 'config',
			attrs: {},
			content: [{ tag: 'item', attrs: { config_code: 'code1', config_value: 'configval1' } }]
		}

		const dict = reduceBinaryNodeToDictionary(node, 'item')
		expect(dict).toEqual({
			code1: 'configval1'
		})
	})

	it('should prefer value over config_value', () => {
		const node: BinaryNode = {
			tag: 'props',
			attrs: {},
			content: [{ tag: 'prop', attrs: { name: 'key', value: 'val', config_value: 'configval' } }]
		}

		const dict = reduceBinaryNodeToDictionary(node, 'prop')
		expect(dict.key).toBe('val')
	})

	it('should return empty dict for no matching children', () => {
		const node: BinaryNode = {
			tag: 'empty',
			attrs: {},
			content: []
		}

		const dict = reduceBinaryNodeToDictionary(node, 'prop')
		expect(dict).toEqual({})
	})
})

describe('binaryNodeToString', () => {
	it('should format simple node', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: { id: '123' }
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('<test')
		expect(str).toContain("id='123'")
		expect(str).toContain('/>')
	})

	it('should format node with string content', () => {
		const node: BinaryNode = {
			tag: 'message',
			attrs: {},
			content: 'Hello World'
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('<message')
		expect(str).toContain('Hello World')
		expect(str).toContain('</message>')
	})

	it('should format node with buffer content as hex', () => {
		const node: BinaryNode = {
			tag: 'data',
			attrs: {},
			content: Buffer.from([0xab, 0xcd, 0xef])
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('abcdef')
	})

	it('should format node with child nodes', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: { name: 'root' },
			content: [
				{ tag: 'child1', attrs: {} },
				{ tag: 'child2', attrs: {} }
			]
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('<parent')
		expect(str).toContain('<child1')
		expect(str).toContain('<child2')
		expect(str).toContain('</parent>')
	})

	it('should format deeply nested nodes with indentation', () => {
		const node: BinaryNode = {
			tag: 'l1',
			attrs: {},
			content: [
				{
					tag: 'l2',
					attrs: {},
					content: [{ tag: 'l3', attrs: {} }]
				}
			]
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('\t')
	})

	it('should filter out undefined attributes', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: { defined: 'yes', undef: undefined as any }
		}

		const str = binaryNodeToString(node)
		expect(str).toContain("defined='yes'")
		expect(str).not.toContain('undef')
	})

	it('should handle null/undefined node', () => {
		expect(binaryNodeToString(null as any)).toBeNull()
		expect(binaryNodeToString(undefined as any)).toBeUndefined()
	})

	it('should handle Uint8Array content', () => {
		const node: BinaryNode = {
			tag: 'data',
			attrs: {},
			content: new Uint8Array([0x12, 0x34])
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('1234')
	})

	it('should handle array directly', () => {
		const arr: BinaryNode[] = [
			{ tag: 'item1', attrs: {} },
			{ tag: 'item2', attrs: {} }
		]

		const str = binaryNodeToString(arr)
		expect(str).toContain('item1')
		expect(str).toContain('item2')
	})

	it('should handle multiple attributes', () => {
		const node: BinaryNode = {
			tag: 'node',
			attrs: { a: '1', b: '2', c: '3' }
		}

		const str = binaryNodeToString(node)
		expect(str).toContain("a='1'")
		expect(str).toContain("b='2'")
		expect(str).toContain("c='3'")
	})

	it('should handle empty attrs object', () => {
		const node: BinaryNode = {
			tag: 'empty',
			attrs: {}
		}

		const str = binaryNodeToString(node)
		expect(str).toContain('<empty')
		expect(str).toContain('/>')
	})
})

describe('edge cases', () => {
	it('should handle complex nested structure', () => {
		const complexNode: BinaryNode = {
			tag: 'root',
			attrs: { version: '1' },
			content: [
				{
					tag: 'users',
					attrs: {},
					content: [
						{
							tag: 'user',
							attrs: { id: '1' },
							content: [
								{ tag: 'name', attrs: {}, content: 'John' },
								{ tag: 'data', attrs: {}, content: Buffer.from([1, 2, 3]) }
							]
						}
					]
				},
				{
					tag: 'config',
					attrs: {},
					content: [{ tag: 'setting', attrs: { name: 'debug', value: 'true' } }]
				}
			]
		}

		// Test various operations on complex structure
		const users = getBinaryNodeChild(complexNode, 'users')
		expect(users).toBeDefined()

		const user = getBinaryNodeChild(users, 'user')
		expect(user?.attrs.id).toBe('1')

		const name = getBinaryNodeChildString(user, 'name')
		expect(name).toBe('John')

		const data = getBinaryNodeChildBuffer(user, 'data')
		expect(data).toEqual(Buffer.from([1, 2, 3]))

		const config = getBinaryNodeChild(complexNode, 'config')
		const settings = reduceBinaryNodeToDictionary(config!, 'setting')
		expect(settings.debug).toBe('true')

		const str = binaryNodeToString(complexNode)
		expect(str).toContain('<root')
		expect(str).toContain('<users')
		expect(str).toContain('John')
	})
})
