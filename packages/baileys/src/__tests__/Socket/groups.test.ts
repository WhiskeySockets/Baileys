import { Boom } from '@hapi/boom'
import { extractGroupMetadata } from '../../Socket/groups'
import type { BinaryNode } from '../../WABinary'

const minimalGroupNode = (overrides: Partial<BinaryNode['attrs']> = {}): BinaryNode => ({
	tag: 'group',
	attrs: {
		id: '120363000000000000',
		creation: '1700000000',
		s_t: '1700000000',
		subject: 'Test Group',
		...overrides
	},
	content: []
})

describe('extractGroupMetadata', () => {
	it('parses a valid <group> node', () => {
		const result: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'result' },
			content: [minimalGroupNode()]
		}

		const meta = extractGroupMetadata(result)

		expect(meta.id).toBe('120363000000000000@g.us')
		expect(meta.subject).toBe('Test Group')
	})

	it('keeps the @-suffix when group id already contains it', () => {
		const result: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'result' },
			content: [minimalGroupNode({ id: '120363000000000000@g.us' })]
		}

		expect(extractGroupMetadata(result).id).toBe('120363000000000000@g.us')
	})

	it('throws Boom with the server <error> code+text when no <group> is present', () => {
		const result: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'error' },
			content: [
				{
					tag: 'error',
					attrs: { code: '403', text: 'forbidden' }
				}
			]
		}

		const captured = captureThrow(() => extractGroupMetadata(result))
		expect(captured).toBeInstanceOf(Boom)
		expect((captured as Boom).output.statusCode).toBe(403)
		expect((captured as Error).message).toBe('forbidden')
	})

	it('falls back to a generic Boom when neither <group> nor <error> is present', () => {
		const result: BinaryNode = { tag: 'iq', attrs: { type: 'result' }, content: [] }

		expect(() => extractGroupMetadata(result)).toThrow(/missing <group>/)
	})

	it('throws when the <group> node lacks an id', () => {
		const group = minimalGroupNode()
		delete (group.attrs as Record<string, string>).id
		const result: BinaryNode = { tag: 'iq', attrs: { type: 'result' }, content: [group] }

		expect(() => extractGroupMetadata(result)).toThrow(/missing group id/)
	})

	it('uses default code 500 when <error> has no code attribute', () => {
		const result: BinaryNode = {
			tag: 'iq',
			attrs: { type: 'error' },
			content: [{ tag: 'error', attrs: {} }]
		}

		const captured = captureThrow(() => extractGroupMetadata(result))
		expect((captured as Boom).output.statusCode).toBe(500)
	})
})

const captureThrow = (fn: () => unknown): unknown => {
	try {
		fn()
	} catch (err) {
		return err
	}

	throw new Error('expected function to throw')
}
