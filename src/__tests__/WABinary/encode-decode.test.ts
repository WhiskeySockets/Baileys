import { encodeBinaryNode } from '../../WABinary/encode'
import { decodeBinaryNode, decodeDecompressedBinaryNode, decompressingIfRequired } from '../../WABinary/decode'
import * as constants from '../../WABinary/constants'
import type { BinaryNode } from '../../WABinary/types'

describe('encodeBinaryNode', () => {
	it('should encode a simple node with no content', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'get' }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
		expect(encoded.length).toBeGreaterThan(0)
	})

	it('should encode a node with string content', () => {
		const node: BinaryNode = {
			tag: 'message',
			attrs: { id: '123' },
			content: 'Hello World'
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode a node with buffer content', () => {
		const node: BinaryNode = {
			tag: 'media',
			attrs: {},
			content: Buffer.from([0x01, 0x02, 0x03])
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode a node with Uint8Array content', () => {
		const node: BinaryNode = {
			tag: 'media',
			attrs: {},
			content: new Uint8Array([0x01, 0x02, 0x03])
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode a node with child nodes', () => {
		const node: BinaryNode = {
			tag: 'parent',
			attrs: {},
			content: [
				{ tag: 'child1', attrs: { name: 'first' } },
				{ tag: 'child2', attrs: { name: 'second' } }
			]
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should skip undefined attributes', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: {
				defined: 'value',
				undefined: undefined as any
			}
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should skip null attributes', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: {
				defined: 'value',
				null: null as any
			}
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should throw for invalid tag', () => {
		const node: BinaryNode = {
			tag: '' as any,
			attrs: {}
		}

		expect(() => encodeBinaryNode(node)).toThrow()
	})

	it('should encode nibble strings (numeric with - and .)', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: { phone: '1234567890' }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode hex strings', () => {
		const node: BinaryNode = {
			tag: 'test',
			attrs: { hex: 'ABCDEF123456' }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode JID strings', () => {
		const node: BinaryNode = {
			tag: 'message',
			attrs: { to: '1234567890@s.whatsapp.net' }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode known tokens efficiently', () => {
		const node: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'set', xmlns: 'w:profile:picture' }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should handle empty content array', () => {
		const node: BinaryNode = {
			tag: 'list',
			attrs: {},
			content: []
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should handle deeply nested nodes', () => {
		const node: BinaryNode = {
			tag: 'level1',
			attrs: {},
			content: [
				{
					tag: 'level2',
					attrs: {},
					content: [
						{
							tag: 'level3',
							attrs: { deep: 'true' }
						}
					]
				}
			]
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})

	it('should encode long strings', () => {
		const longString = 'a'.repeat(1000)
		const node: BinaryNode = {
			tag: 'test',
			attrs: { data: longString }
		}

		const encoded = encodeBinaryNode(node)
		expect(encoded).toBeInstanceOf(Buffer)
	})
})

describe('decodeDecompressedBinaryNode', () => {
	it('should decode an encoded simple node', () => {
		const original: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'get', id: 'test123' }
		}

		const encoded = encodeBinaryNode(original)
		// Skip the first byte (compression flag)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('iq')
		expect(decoded.attrs.type).toBe('get')
		expect(decoded.attrs.id).toBe('test123')
	})

	it('should decode a node with string content', () => {
		const original: BinaryNode = {
			tag: 'message',
			attrs: { id: '456' },
			content: 'Hello World'
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('message')
		// String content is decoded as Buffer
		expect(Buffer.isBuffer(decoded.content) || decoded.content instanceof Uint8Array).toBe(true)
		expect(Buffer.from(decoded.content as Buffer).toString('utf-8')).toBe('Hello World')
	})

	it('should decode a node with buffer content', () => {
		const original: BinaryNode = {
			tag: 'media',
			attrs: {},
			content: Buffer.from([0x01, 0x02, 0x03, 0x04])
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('media')
		expect(Buffer.isBuffer(decoded.content)).toBe(true)
		expect(decoded.content).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x04]))
	})

	it('should decode a node with child nodes', () => {
		const original: BinaryNode = {
			tag: 'parent',
			attrs: { name: 'root' },
			content: [
				{ tag: 'child1', attrs: { order: '1' } },
				{ tag: 'child2', attrs: { order: '2' } }
			]
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('parent')
		expect(Array.isArray(decoded.content)).toBe(true)
		expect((decoded.content as BinaryNode[]).length).toBe(2)
		expect((decoded.content as BinaryNode[])[0]!.tag).toBe('child1')
		expect((decoded.content as BinaryNode[])[1]!.tag).toBe('child2')
	})

	it('should decode nibble-encoded strings', () => {
		const original: BinaryNode = {
			tag: 'test',
			attrs: { number: '123-456.789' }
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.attrs.number).toBe('123-456.789')
	})

	it('should decode hex-encoded strings', () => {
		const original: BinaryNode = {
			tag: 'test',
			attrs: { hex: 'ABCD1234' }
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.attrs.hex).toBe('ABCD1234')
	})

	it('should decode JID attributes', () => {
		const original: BinaryNode = {
			tag: 'message',
			attrs: { to: '1234567890@s.whatsapp.net' }
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.attrs.to).toBe('1234567890@s.whatsapp.net')
	})

	it('should throw on end of stream', () => {
		const truncated = Buffer.from([0x00, 0x01])

		expect(() => decodeDecompressedBinaryNode(truncated, constants)).toThrow()
	})

	it('should handle deeply nested structures', () => {
		const original: BinaryNode = {
			tag: 'l1',
			attrs: {},
			content: [
				{
					tag: 'l2',
					attrs: {},
					content: [
						{
							tag: 'l3',
							attrs: { level: '3' }
						}
					]
				}
			]
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		const l2 = (decoded.content as BinaryNode[])[0]
		const l3 = (l2!.content as BinaryNode[])[0]
		expect(l3!.attrs.level).toBe('3')
	})
})

describe('decompressingIfRequired', () => {
	it('should skip first byte for non-compressed data', async () => {
		const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03])
		const result = await decompressingIfRequired(buffer)

		expect(result).toEqual(Buffer.from([0x01, 0x02, 0x03]))
	})

	it('should decompress zlib data when flag is set', async () => {
		// Create a simple compressed buffer
		const { deflate } = await import('zlib')
		const { promisify } = await import('util')
		const deflateAsync = promisify(deflate)

		const original = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
		const compressed = await deflateAsync(original)

		// Set compression flag (bit 1)
		const flagged = Buffer.concat([Buffer.from([0x02]), compressed])

		const result = await decompressingIfRequired(flagged)
		expect(result).toEqual(original)
	})
})

describe('decodeBinaryNode (full decode with decompression)', () => {
	it('should decode a complete binary node', async () => {
		const original: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'result', id: 'abc123' }
		}

		const encoded = encodeBinaryNode(original)
		const decoded = await decodeBinaryNode(encoded)

		expect(decoded.tag).toBe('iq')
		expect(decoded.attrs.type).toBe('result')
		expect(decoded.attrs.id).toBe('abc123')
	})
})

describe('roundtrip encoding/decoding', () => {
	it('should preserve simple node through encode/decode', () => {
		const original: BinaryNode = {
			tag: 'test',
			attrs: { foo: 'bar', baz: 'qux' }
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe(original.tag)
		expect(decoded.attrs).toEqual(original.attrs)
	})

	it('should preserve string content through encode/decode', () => {
		const original: BinaryNode = {
			tag: 'message',
			attrs: {},
			content: 'Test message content'
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		// String content is decoded as Buffer
		expect(Buffer.from(decoded.content as Buffer).toString('utf-8')).toBe(original.content)
	})

	it('should preserve buffer content through encode/decode', () => {
		const original: BinaryNode = {
			tag: 'data',
			attrs: {},
			content: Buffer.from([0x00, 0x11, 0x22, 0x33, 0xff])
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.content).toEqual(original.content)
	})

	it('should preserve nested nodes through encode/decode', () => {
		const original: BinaryNode = {
			tag: 'container',
			attrs: { version: '1' },
			content: [
				{ tag: 'item', attrs: { id: '1', name: 'first' } },
				{ tag: 'item', attrs: { id: '2', name: 'second' } },
				{
					tag: 'nested',
					attrs: {},
					content: [{ tag: 'deep', attrs: { level: 'deep' } }]
				}
			]
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('container')
		expect(decoded.attrs.version).toBe('1')

		const content = decoded.content as BinaryNode[]
		expect(content.length).toBe(3)
		expect(content[0]!.tag).toBe('item')
		expect(content[0]!.attrs.id).toBe('1')
		expect(content[2]!.tag).toBe('nested')

		const nestedContent = content[2]!.content as BinaryNode[]
		expect(nestedContent[0]!.tag).toBe('deep')
	})

	it('should preserve WhatsApp-like message structure', () => {
		const original: BinaryNode = {
			tag: 'message',
			attrs: {
				to: '1234567890@s.whatsapp.net',
				type: 'text',
				id: 'MSG123456'
			},
			content: [
				{
					tag: 'body',
					attrs: {},
					content: 'Hello from test!'
				}
			]
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.tag).toBe('message')
		expect(decoded.attrs.to).toBe('1234567890@s.whatsapp.net')
		expect(decoded.attrs.type).toBe('text')

		const body = (decoded.content as BinaryNode[])[0]
		expect(body!.tag).toBe('body')
		// String content is decoded as Buffer
		expect(Buffer.from(body!.content as Buffer).toString('utf-8')).toBe('Hello from test!')
	})

	it('should preserve mixed content types', () => {
		const binaryData = Buffer.from([0x89, 0x50, 0x4e, 0x47]) // PNG header

		const original: BinaryNode = {
			tag: 'media',
			attrs: { type: 'image' },
			content: [
				{ tag: 'enc', attrs: {}, content: binaryData },
				{ tag: 'caption', attrs: {}, content: 'Photo caption' }
			]
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		const content = decoded.content as BinaryNode[]
		expect(Buffer.isBuffer(content[0]!.content)).toBe(true)
		expect(content[0]!.content).toEqual(binaryData)
		// String content is decoded as Buffer
		expect(Buffer.from(content[1]!.content as Buffer).toString('utf-8')).toBe('Photo caption')
	})

	it('should handle large binary content', () => {
		const largeBuffer = Buffer.alloc(10000)
		for (let i = 0; i < largeBuffer.length; i++) {
			largeBuffer[i] = i % 256
		}

		const original: BinaryNode = {
			tag: 'large',
			attrs: {},
			content: largeBuffer
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(decoded.content).toEqual(largeBuffer)
	})

	it('should handle many child nodes', () => {
		const children: BinaryNode[] = Array.from({ length: 100 }, (_, i) => ({
			tag: 'item',
			attrs: { index: String(i) }
		}))

		const original: BinaryNode = {
			tag: 'list',
			attrs: { count: '100' },
			content: children
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		const decodedChildren = decoded.content as BinaryNode[]
		expect(decodedChildren.length).toBe(100)

		for (let i = 0; i < 100; i++) {
			expect(decodedChildren[i]!.attrs.index).toBe(String(i))
		}
	})

	it('should preserve special characters in strings', () => {
		const original: BinaryNode = {
			tag: 'text',
			attrs: {},
			content: 'Hello 你好 مرحبا 🎉 <>&"'
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		// String content is decoded as Buffer
		expect(Buffer.from(decoded.content as Buffer).toString('utf-8')).toBe(original.content)
	})
})

describe('edge cases', () => {
	it('should handle empty string content', () => {
		const original: BinaryNode = {
			tag: 'empty',
			attrs: {},
			content: ''
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		// Empty string is encoded as empty list and decoded as empty array
		expect(Array.isArray(decoded.content) || decoded.content === '').toBe(true)
	})

	it('should handle empty buffer content', () => {
		const original: BinaryNode = {
			tag: 'empty',
			attrs: {},
			content: Buffer.alloc(0)
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(Buffer.isBuffer(decoded.content)).toBe(true)
		expect((decoded.content as Buffer).length).toBe(0)
	})

	it('should handle node with many attributes', () => {
		const attrs: Record<string, string> = {}
		for (let i = 0; i < 20; i++) {
			attrs[`attr${i}`] = `value${i}`
		}

		const original: BinaryNode = {
			tag: 'manyattrs',
			attrs
		}

		const encoded = encodeBinaryNode(original)
		const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

		expect(Object.keys(decoded.attrs).length).toBe(20)
		for (let i = 0; i < 20; i++) {
			expect(decoded.attrs[`attr${i}`]).toBe(`value${i}`)
		}
	})

	it('should handle known WhatsApp tags', () => {
		// These are known tags from the WhatsApp protocol
		const knownTags = ['iq', 'message', 'receipt', 'notification', 'stream:features']

		for (const tag of knownTags) {
			const original: BinaryNode = {
				tag,
				attrs: { id: 'test' }
			}

			const encoded = encodeBinaryNode(original)
			const decoded = decodeDecompressedBinaryNode(encoded.slice(1), constants)

			expect(decoded.tag).toBe(tag)
		}
	})
})
