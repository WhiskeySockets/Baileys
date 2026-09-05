import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import {
	BUSINESS_ORDER_MEX_QUERY,
	fetchMexOrderDetails,
	orderMexVariables,
	resolveOrderMexJid
} from '../../Socket/business-mex'
import { parseMexOrderDetails } from '../../Utils/business-mex'
import type { ILogger } from '../../Utils/logger'

const logger: ILogger = {
	level: 'silent',
	child: () => logger,
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn()
}

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

const orderJidFromVariables = (variables: Record<string, unknown>) =>
	(variables.request as { order: { jid: string } }).order.jid

const mexBadRequest = () =>
	new Boom('GraphQL server error: Bad Request', {
		statusCode: 400,
		data: {
			message: 'Bad Request',
			extensions: { error_code: 400, is_retryable: false, severity: 'CRITICAL' },
			path: []
		}
	})

describe('business MEX order lookup', () => {
	it('uses the current persisted query and variable shape from WhatsApp Web', () => {
		expect(BUSINESS_ORDER_MEX_QUERY).toEqual({
			queryId: '26593811266898374',
			dataPath: 'xwa_checkout_get_order_info'
		})
		expect(orderMexVariables('15550000001@s.whatsapp.net', 'order-1', 'token-1')).toEqual({
			request: {
				order: {
					id: 'order-1',
					jid: '15550000001@s.whatsapp.net',
					token: { sensitive_string_value: 'token-1' },
					image_dimensions: { width: 100, height: 100 },
					direct_connection_encrypted_info: null
				}
			}
		})
	})

	it('resolves the current account LID to its PN for the order query', () => {
		expect(resolveOrderMexJid('11111111111111:7@lid', ['15550000001:4@s.whatsapp.net', '11111111111111:7@lid'])).toBe(
			'15550000001@s.whatsapp.net'
		)
	})

	it('preserves PN and external business JIDs', () => {
		const ownJids = ['15550000001@s.whatsapp.net', '11111111111111@lid']

		expect(resolveOrderMexJid('15550000001:4@s.whatsapp.net', ownJids)).toBe('15550000001@s.whatsapp.net')
		expect(resolveOrderMexJid('22222222222222@lid', ownJids)).toBe('22222222222222@lid')
	})

	it('queries once with the resolved PN and returns the parsed order', async () => {
		const executeQuery = jest.fn(async (variables: Record<string, unknown>) => {
			expect(orderJidFromVariables(variables)).toBe('15550000001@s.whatsapp.net')
			return orderResponse
		})

		const result = await fetchMexOrderDetails({
			orderId: 'order-1',
			token: 'token-1',
			requestedJid: '11111111111111@lid',
			ownJids: ['15550000001@s.whatsapp.net', '11111111111111@lid'],
			executeQuery,
			logger
		})

		expect(executeQuery).toHaveBeenCalledTimes(1)
		expect(result).toEqual(parseMexOrderDetails(orderResponse))
	})

	it('propagates GraphQL errors without retrying another alias', async () => {
		const failure = mexBadRequest()
		const executeQuery = jest.fn(async () => Promise.reject(failure))

		await expect(
			fetchMexOrderDetails({
				orderId: 'order-1',
				token: 'token-1',
				requestedJid: '11111111111111@lid',
				ownJids: ['15550000001@s.whatsapp.net', '11111111111111@lid'],
				executeQuery,
				logger
			})
		).rejects.toBe(failure)
		expect(executeQuery).toHaveBeenCalledTimes(1)
	})

	it('does not retry transport, authentication, or malformed-response failures', async () => {
		const failure = new Boom('Business request unavailable', { statusCode: 503 })
		const executeQuery = jest.fn(async () => Promise.reject(failure))

		await expect(
			fetchMexOrderDetails({
				orderId: 'order-1',
				token: 'token-1',
				requestedJid: '11111111111111@lid',
				ownJids: ['15550000001@s.whatsapp.net', '11111111111111@lid'],
				executeQuery,
				logger
			})
		).rejects.toBe(failure)
		expect(executeQuery).toHaveBeenCalledTimes(1)
	})

	it('rejects malformed order responses with a 502 Boom', () => {
		expect(() => parseMexOrderDetails({ order: {} })).toThrow(Boom)
		try {
			parseMexOrderDetails({ order: {} })
		} catch (error) {
			expect((error as Boom).output.statusCode).toBe(502)
		}
	})

	it('parses the unwrapped MEX data-path payload', () => {
		expect(parseMexOrderDetails(orderResponse)).toEqual({
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
	})

	it.each(['', '   '])('rejects a blank product price %j with a 502 Boom', value => {
		const malformed = structuredClone(orderResponse)
		malformed.order.products[0]!.price = value

		expect(() => parseMexOrderDetails(malformed)).toThrow(Boom)
		try {
			parseMexOrderDetails(malformed)
		} catch (error) {
			expect((error as Boom).output.statusCode).toBe(502)
		}
	})

	it('rejects blank quantity and total values', () => {
		const blankQuantity = structuredClone(orderResponse)
		blankQuantity.order.products[0]!.quantity = ''
		const blankTotal = structuredClone(orderResponse)
		blankTotal.order.price_details.total_amount = ' '

		expect(() => parseMexOrderDetails(blankQuantity)).toThrow(Boom)
		expect(() => parseMexOrderDetails(blankTotal)).toThrow(Boom)
	})
})
