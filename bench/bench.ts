import { run, bench, group, do_not_optimize, boxplot, summary } from 'mitata'
import { encodeBinaryNode, decodeBinaryNode, type BinaryNode } from '../lib'
import { encodeBinaryNode as encodeBinaryNodeOld } from 'old-baileys'
import { decodeBinaryNode as decodeBinaryNodeOld } from 'old-baileys'

const smallNode: BinaryNode = {
	tag: 'small',
	attrs: {
		to: '1234567890@s.whatsapp.net',
		id: '3EB0622825A79604144A',
		type: 'text',
		t: String(Math.floor(Date.now() / 1000))
	},
	content: [
		{
			tag: 'conversation',
			attrs: {},
			content: 'Hello from a benchmark test!'
		}
	]
}

const mediumNode: BinaryNode = {
	tag: 'medium',
	attrs: {
		to: '1234567890@s.whatsapp.net',
		id: '3EB0622825A79604144A',
		type: 'text',
		t: String(Math.floor(Date.now() / 1000))
	},
	content: [
		{
			tag: 'conversation',
			attrs: {},
			content: 'Hello from a benchmark test! This is a slightly longer message to ensure the test is not trivial.'
		},
		{
			tag: 'ephemeral_setting',
			attrs: {
				timestamp: String(Date.now()),
				expiration: '604800'
			},
			content: undefined
		}
	]
}

const largeNode: BinaryNode = {
	tag: 'large',
	attrs: {
		to: '1234567890@s.whatsapp.net',
		id: '3EB0622825A79604144A',
		type: 'text',
		t: String(Math.floor(Date.now() / 1000))
	},
	content: [
		{
			tag: 'conversation',
			attrs: {},
			content: 'Hello from a benchmark test! This is a slightly longer message to ensure the test is not trivial.'
		},
		{
			tag: 'ephemeral_setting',
			attrs: {
				timestamp: String(Date.now()),
				expiration: '604800'
			},
			content: undefined
		},
		{
			tag: 'basic_500_nodes',
			attrs: {},
			content: new Array(500).fill(smallNode)
		},
		{
			tag: 'ephemeral_setting',
			attrs: {
				timestamp: String(Date.now()),
				expiration: '604800'
			},
			content: [
				{
					tag: 'ephemeral_setting',
					attrs: {
						timestamp: String(Date.now()),
						expiration: '604800'
					},
					content: [
						{
							tag: 'conversation',
							attrs: {},
							content:
								'Hello from a benchmark test! This is a slightly longer message to ensure the test is not trivial.'
						}
					]
				}
			]
		}
	]
}

const nodesToTest = [smallNode, mediumNode, largeNode]

for (const node of nodesToTest) {
	boxplot(async () => {
		summary(() => {
			group(`Encoding (${node.tag} node)`, () => {
				bench('new js', () => {
					const result = encodeBinaryNode(node)
					do_not_optimize(result)
				}).gc('inner')

				bench('Old js', () => {
					const result = encodeBinaryNodeOld(node)
					do_not_optimize(result)
				}).gc('inner')
			})
		})
	})
}

for (const node of nodesToTest) {
	boxplot(async () => {
		summary(() => {
			const encodedNew = encodeBinaryNode(node)
			const encodedOld = encodeBinaryNodeOld(node)
			group(`Decode (${node.tag} node)`, () => {
				bench('new js', async () => {
					const decoded = await decodeBinaryNode(encodedNew)
					do_not_optimize(decoded)
				}).gc('inner')

				bench('Old js', async () => {
					const decoded = await decodeBinaryNodeOld(encodedOld)
					do_not_optimize(decoded)
				}).gc('inner')
			})
		})
	})
}

await run()
