import { ProductCreate, ProductUpdate, SocketConfig } from '../Types'
import { parseCatalogNode, parseCollectionsNode, parseOrderDetailsNode, parseProductNode, toProductNode, uploadingNecessaryImagesOfProduct } from '../Utils/business'
import { jidNormalizedUser, S_WHATSAPP_NET } from '../WABinary'
import { getBinaryNodeChild } from '../WABinary/generic-utils'
import { makeMessagesRecvSocket } from './messages-recv'

export const makeBusinessSocket = (config: SocketConfig) => {
	const sock = makeMessagesRecvSocket(config)
	const {
		authState,
		query,
		waUploadToServer
	} = sock

	const getCatalog = async(jid?: string, limit = 10) => {
		jid = jid || authState.creds.me?.id
		jid = jidNormalizedUser(jid!)
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
							content: Buffer.from(limit.toString())
						},
						{
							tag: 'width',
							attrs: { },
							content: Buffer.from('100')
						},
						{
							tag: 'height',
							attrs: { },
							content: Buffer.from('100')
						}
					]
				}
			]
		})
		return parseCatalogNode(result)
	}

	const getCollections = async(jid?: string, limit = 51) => {
		jid = jid || authState.creds.me?.id
		jid = jidNormalizedUser(jid!)
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
							content: Buffer.from(limit.toString())
						},
						{
							tag: 'item_limit',
							attrs: { },
							content: Buffer.from(limit.toString())
						},
						{
							tag: 'width',
							attrs: { },
							content: Buffer.from('100')
						},
						{
							tag: 'height',
							attrs: { },
							content: Buffer.from('100')
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
									content: Buffer.from('100')
								},
								{
									tag: 'height',
									attrs: { },
									content: Buffer.from('100')
								}
							]
						},
						{
							tag: 'token',
							attrs: { },
							content: Buffer.from(tokenBase64)
						}
					]
				}
			]
		})

		return parseOrderDetailsNode(result)
	}

	const productUpdate = async(productId: string, update: ProductUpdate) => {
		update = await uploadingNecessaryImagesOfProduct(update, waUploadToServer)
		const editNode = toProductNode(productId, update)

		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'w:biz:catalog'
			},
			content: [
				{
					tag: 'product_catalog_edit',
					attrs: { v: '1' },
					content: [
						editNode,
						{
							tag: 'width',
							attrs: { },
							content: '100'
						},
						{
							tag: 'height',
							attrs: { },
							content: '100'
						}
					]
				}
			]
		})

		const productCatalogEditNode = getBinaryNodeChild(result, 'product_catalog_edit')
		const productNode = getBinaryNodeChild(productCatalogEditNode, 'product')

		return parseProductNode(productNode!)
	}

	const productCreate = async(create: ProductCreate) => {
		// ensure isHidden is defined
		create.isHidden = !!create.isHidden
		create = await uploadingNecessaryImagesOfProduct(create, waUploadToServer)
		const createNode = toProductNode(undefined, create)

		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'w:biz:catalog'
			},
			content: [
				{
					tag: 'product_catalog_add',
					attrs: { v: '1' },
					content: [
						createNode,
						{
							tag: 'width',
							attrs: { },
							content: '100'
						},
						{
							tag: 'height',
							attrs: { },
							content: '100'
						}
					]
				}
			]
		})

		const productCatalogAddNode = getBinaryNodeChild(result, 'product_catalog_add')
		const productNode = getBinaryNodeChild(productCatalogAddNode, 'product')

		return parseProductNode(productNode!)
	}

	const productDelete = async(productIds: string[]) => {
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'w:biz:catalog'
			},
			content: [
				{
					tag: 'product_catalog_delete',
					attrs: { v: '1' },
					content: productIds.map(
						id => ({
							tag: 'product',
							attrs: { },
							content: [
								{
									tag: 'id',
									attrs: { },
									content: Buffer.from(id)
								}
							]
						})
					)
				}
			]
		})

		const productCatalogDelNode = getBinaryNodeChild(result, 'product_catalog_delete')
		return {
			deleted: +(productCatalogDelNode?.attrs.deleted_count || 0)
		}
	}

	return {
		...sock,
		getOrderDetails,
		getCatalog,
		getCollections,
		productCreate,
		productDelete,
		productUpdate
	}
}