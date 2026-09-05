import { jest } from '@jest/globals'
import type { SocketConfig } from '../../Types'
import type { ILogger } from '../../Utils/logger'
import { type BinaryNode, getBinaryNodeChild } from '../../WABinary'

const orderResponse = {
	order: {
		price_details: { currency: 'MXN', total_amount: '300000' },
		products: [
			{
				id: 'product-1',
				name: 'Notebook',
				currency: 'MXN',
				price: '150000',
				quantity: '2',
				media: { images: [{ request_image_url: 'https://example.invalid/thumb.jpg' }] }
			}
		]
	}
}

const logger: ILogger = {
	level: 'silent',
	child: () => logger,
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn()
}

const query = jest.fn(
	async (_node: BinaryNode): Promise<BinaryNode> => ({
		tag: 'iq',
		attrs: {},
		content: [
			{
				tag: 'result',
				attrs: {},
				content: Buffer.from(JSON.stringify({ data: { xwa_checkout_get_order_info: orderResponse } }))
			}
		]
	})
)

jest.unstable_mockModule('../../Socket/messages-recv', () => ({
	makeMessagesRecvSocket: () => ({
		authState: {
			creds: {
				me: { id: '15550000001:4@s.whatsapp.net', lid: '11111111111111:7@lid' }
			}
		},
		generateMessageTag: () => 'message-tag-1',
		query,
		waUploadToServer: jest.fn()
	})
}))

describe('business order socket', () => {
	it('sends the MEX query and parses its data-path response', async () => {
		const { makeBusinessSocket } = await import('../../Socket/business')
		const socket = makeBusinessSocket({ logger } as SocketConfig)

		await expect(socket.getOrderDetails('order-1', 'token-1', '11111111111111:3@lid')).resolves.toEqual({
			price: { currency: 'MXN', total: 300000 },
			products: [
				{
					id: 'product-1',
					name: 'Notebook',
					currency: 'MXN',
					price: 150000,
					quantity: 2,
					imageUrl: 'https://example.invalid/thumb.jpg'
				}
			]
		})

		expect(query).toHaveBeenCalledTimes(1)
		expect(logger.debug).toHaveBeenCalledWith(
			{
				queryId: '26593811266898374',
				requestedJidType: 'lid',
				resolvedJidType: 'pn',
				usedOwnPnAlias: true
			},
			'querying order details through MEX'
		)
		const request = query.mock.calls[0]![0]
		expect(request.attrs).toEqual({
			id: 'message-tag-1',
			type: 'get',
			to: '@s.whatsapp.net',
			xmlns: 'w:mex'
		})

		const queryNode = getBinaryNodeChild(request, 'query')!
		expect(queryNode.attrs.query_id).toBe('26593811266898374')
		expect(JSON.parse(queryNode.content!.toString())).toEqual({
			variables: {
				request: {
					order: {
						id: 'order-1',
						jid: '15550000001@s.whatsapp.net',
						token: { sensitive_string_value: 'token-1' },
						image_dimensions: { width: 100, height: 100 },
						direct_connection_encrypted_info: null
					}
				}
			}
		})
	})
})
