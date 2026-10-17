import { getBizBinaryNode, shouldIncludeBizBinaryNode } from '../../WABinary'

const nativeFlowMessage = (name: string) => ({
	interactiveMessage: {
		nativeFlowMessage: { buttons: [{ name, buttonParamsJson: '{}' }] }
	}
})

describe('biz binary node', () => {
	it('includes a biz node for interactive, list, template and buttons messages', () => {
		expect(shouldIncludeBizBinaryNode(nativeFlowMessage('quick_reply'))).toBe(true)
		expect(shouldIncludeBizBinaryNode({ listMessage: { title: 'list' } })).toBe(true)
		expect(shouldIncludeBizBinaryNode({ templateMessage: {} })).toBe(true)
		expect(shouldIncludeBizBinaryNode({ buttonsMessage: {} })).toBe(true)
		expect(shouldIncludeBizBinaryNode({ conversation: 'plain' })).toBe(false)
	})

	it('marks mixed interactive content', () => {
		const node = getBizBinaryNode(nativeFlowMessage('quick_reply'))
		expect(node.tag).toBe('biz')
		expect(node.attrs).toMatchObject({ actual_actors: '2', host_storage: '2' })
		expect(node.content).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tag: 'interactive',
					content: [expect.objectContaining({ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } })]
				})
			])
		)
	})

	it('uses the flow name for known native flows', () => {
		const node = getBizBinaryNode(nativeFlowMessage('mpm'))
		const interactive = (node.content as Array<{ tag: string; content?: unknown }>).find(
			child => child.tag === 'interactive'
		)
		expect(interactive).toBeDefined()
		expect((interactive as { content: unknown[] }).content).toEqual([
			expect.objectContaining({ tag: 'native_flow', attrs: { v: '2', name: 'mpm' } })
		])
	})

	it('marks order detail flows', () => {
		const node = getBizBinaryNode(nativeFlowMessage('review_and_pay'))
		expect(node.attrs.native_flow_name).toBe('order_details')
		expect((node.content as Array<{ tag: string }>).some(child => child.tag === 'quality_control')).toBe(true)
	})
})
