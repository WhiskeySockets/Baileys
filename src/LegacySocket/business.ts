import { LegacySocketConfig, OrderDetails } from '../Types'
import { CatalogResult, Product, ProductCreate, ProductCreateResult, ProductUpdate } from '../Types'
import { uploadingNecessaryImages } from '../Utils/business'
import makeGroupsSocket from './groups'

const makeBusinessSocket = (config: LegacySocketConfig) => {
	const sock = makeGroupsSocket(config)
	const {
		query,
		generateMessageTag,
		waUploadToServer,
		state
	} = sock

	const getCatalog = async(jid?: string, limit = 10) => {
		jid = jid || state.legacy?.user?.id

		const result: CatalogResult = await query({
			expect200: true,
			json: [
				'query',
				'bizCatalog',
				{
					allowShopSource: false,
					catalogWid: jid,
					height: 100,
					width: 100,
					limit,
					stanza_id: generateMessageTag(true),
					type: 'get_product_catalog_reh',
				}
			]
		})

		const products = result.data.data.map<Product>(
			mapProduct
		)

		return {
			beforeCursor: result.data.paging.cursors.before,
			products
		}
	}

	const productCreate = async(product: ProductCreate) => {
		const result: ProductCreateResult = await query({
			expect200: true,
			json: [
				'action',
				'addProduct_reh',
				await mapProductCreate(product)
			]
		})

		return mapProduct(result.data.product)
	}

	const productDelete = async(productIds: string[]) => {
		const result = await query({
			expect200: true,
			json: [
				'action',
				'deleteProduct_reh',
				{
					product_ids: productIds,
					stanza_id: generateMessageTag(true),
				}
			]
		})

		return {
			deleted: result.data.deleted_count
		}
	}

	const productUpdate = async(productId: string, update: ProductUpdate) => {
		const productCreate = await mapProductCreate(
			{ ...update, originCountryCode: undefined },
			false
		)
		const result: ProductCreateResult = await query({
			expect200: true,
			json: [
				'action',
				'editProduct_reh',
				{
					product_id: productId,
					...productCreate
				}
			]
		})

		return mapProduct(result.data.product)
	}

	const getOrderDetails = async(orderId: string, tokenBase64: string) => {
		const result = await query({
			expect200: true,
			json: [
				'query',
				'order',
				{
					id: generateMessageTag(true),
					orderId,
					imageWidth: '80',
					imageHeight: '80',
					token: tokenBase64
				}
			]
		})

		const data = result.data
		const order: OrderDetails = {
			price: {
				currency: data.price.currency,
				total: data.price.total,
			},
			products: data.products.map(
				p => ({
					id: p.id,
					imageUrl: p.image?.url,
					name: p.name,
					quantity: +p.quantity,
					currency: p.currency,
					price: +p.price
				})
			)
		}

		return order
	}

	// maps product create to send to WA
	const mapProductCreate = async(product: ProductCreate, mapCompliance = true) => {
		const imgs = (
			await uploadingNecessaryImages(product.images, waUploadToServer)
		).map(img => img.url)

		const result: any = {
			name: product.name,
			description: product.description,
			image_url: imgs[0],
			url: product.url || '',
			additional_image_urls: imgs.slice(1),
			retailer_id: product.retailerId || '',
			width: '100',
			height: '100',
			stanza_id: generateMessageTag(true),
			price: product.price.toString(),
			currency: product.currency
		}
		if(mapCompliance) {
			Object.assign(result, {
				compliance_category: product.originCountryCode
					? undefined :
					'COUNTRY_ORIGIN_EXEMPT',
				compliance_info: product.originCountryCode
					? { country_code_origin: product.originCountryCode }
					: undefined
			})
		}

		return result
	}

	return {
		...sock,
		getOrderDetails,
		getCatalog,
		productCreate,
		productDelete,
		productUpdate
	}
}

const mapProduct = (item: any): Product => ({
	id: item.id,
	name: item.name,
	retailerId: item.retailer_id,
	price: +item.price,
	description: item.description,
	currency: item.currency,
	imageUrls: item.image_cdn_urls.reduce(
		(dict, { key, value }) => {
			dict[key] = value
			return dict
		}, { }
	),
	reviewStatus: item.capability_to_review_status.reduce(
		(dict, { key, value }) => {
			dict[key] = value
			return dict
		}, { }
	),
	isHidden: item.is_hidden,
	availability: item.availability
})

export default makeBusinessSocket