import type { BinaryNode } from '../../WABinary'
import { USyncTextStatusProtocol } from '../../WAUSync/Protocols/USyncTextStatusProtocol'

describe('USyncTextStatusProtocol', () => {
	const protocol = new USyncTextStatusProtocol()

	it('returns correct name and query element', () => {
		expect(protocol.name).toBe('text_status')
		expect(protocol.getQueryElement()).toEqual({
			tag: 'text_status',
			attrs: {}
		})
		expect(protocol.getUserElement()).toBeNull()
	})

	it('parses full text_status binary node correctly', () => {
		const updateTimeSeconds = 1770000000
		const node: BinaryNode = {
			tag: 'text_status',
			attrs: {
				text: 'Listening to: Redbone — Childish Gambino',
				ephemeral_duration_sec: '86400',
				last_update_time: String(updateTimeSeconds)
			},
			content: [
				{
					tag: 'emoji',
					attrs: { content: '\u{1F3B5}' }
				}
			]
		}

		const parsed = protocol.parser(node)
		expect(parsed).toEqual({
			text: 'Listening to: Redbone — Childish Gambino',
			emoji: '\u{1F3B5}',
			ephemeralDurationSeconds: 86400,
			lastUpdateTime: new Date(updateTimeSeconds * 1000)
		})
	})

	it('parses minimal text_status without optional emoji and duration', () => {
		const node: BinaryNode = {
			tag: 'text_status',
			attrs: {
				text: 'Available'
			}
		}

		const parsed = protocol.parser(node)
		expect(parsed).toEqual({
			text: 'Available',
			emoji: undefined,
			ephemeralDurationSeconds: undefined,
			lastUpdateTime: undefined
		})
	})

	it('returns undefined on error node child to avoid failing other USync protocols', () => {
		const node: BinaryNode = {
			tag: 'text_status',
			attrs: {},
			content: [
				{
					tag: 'error',
					attrs: { code: '404', text: 'Not found' }
				}
			]
		}

		expect(protocol.parser(node)).toBeUndefined()
	})
})
