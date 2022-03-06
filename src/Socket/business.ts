import { SocketConfig } from '../Types'
import { parseCatalogNode, parseCollectionsNode, parseOrderDetailsNode } from '../Utils/business'
import { jidNormalizedUser, S_WHATSAPP_NET } from '../WABinary'
import { makeMessagesRecvSocket } from './messages-recv'

export const makeBusinessSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeMessagesRecvSocket(config)
	const {
		authState,
		query
	} = sock

	const getCatalog = async(jid?: string, limit = 10) => {
		jid = jidNormalizedUser(jid || authState.creds.me?.id)
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'get',
				xmlns: 'w:biz:catalog'
			},
			content: [
				{
					tag: 'product_catalog',
					attrs: {
						jid,
						allow_shop_source: 'true'
					},
					content: [
						{
							tag: 'limit',
							attrs: { },
							content: Buffer.from([ 49, 48 ])
						},
						{
							tag: 'width',
							attrs: { },
							content: Buffer.from([ 49, 48, 48 ])
						},
						{
							tag: 'height',
							attrs: { },
							content: Buffer.from([ 49, 48, 48 ])
						}
					]
				}
			]
		})
		return parseCatalogNode(result)
	}

	const getCollections = async(jid?: string, limit = 51) => {
		jid = jidNormalizedUser(jid || authState.creds.me?.id)
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'get',
				xmlns: 'w:biz:catalog',
				smax_id: '35'
			},
			content: [
				{
					tag: 'collections',
					attrs: {
						biz_jid: jid,
					},
					content: [
						{
							tag: 'collection_limit',
							attrs: { },
							content: Buffer.from([ 49, 48 ])
						},
						{
							tag: 'item_limit',
							attrs: { },
							content: Buffer.from([ limit ])
						},
						{
							tag: 'width',
							attrs: { },
							content: Buffer.from([ 49, 48, 48 ])
						},
						{
							tag: 'height',
							attrs: { },
							content: Buffer.from([ 49, 48, 48 ])
						}
					]
				}
			]
		})

		return parseCollectionsNode(result)
	}

	const getOrderDetails = async(orderId: string, tokenBase64: string) => {
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'get',
				xmlns: 'fb:thrift_iq',
				smax_id: '5'
			},
			content: [
				{
					tag: 'order',
					attrs: {
						op: 'get',
						id: orderId
					},
					content: [
						{
							tag: 'image_dimensions',
							attrs: { },
							content: [
								{
									tag: 'width',
									attrs: { },
									content: Buffer.from([ 49, 48, 48 ])
								},
								{
									tag: 'height',
									attrs: { },
									content: Buffer.from([ 49, 48, 48 ])
								}
							]
						},
						{
							tag: 'token',
							attrs: { },
							content: Buffer.from(tokenBase64, 'base64')
						}
					]
				}
			]
		})

		return parseOrderDetailsNode(result)
	}

	return {
		...sock,
		getCatalog,
		getCollections,
		getOrderDetails,
	}
}