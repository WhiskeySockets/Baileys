import { Boom } from '@hapi/boom'
import { createHash } from 'crypto'
import { CatalogCollection, CatalogStatus, OrderDetails, OrderProduct, Product, ProductCreate, ProductUpdate, WAMediaUpload, WAMediaUploadFunction } from '../Types'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString } from '../WABinary'
import { getStream, getUrlFromDirectPath, toReadable } from './messages-media'

export const parseCatalogNode = (node: BinaryNode) => {
	const catalogNode = getBinaryNodeChild(node, 'product_catalog')
	const products = getBinaryNodeChildren(catalogNode, 'product').map(parseProductNode)
	const paging = getBinaryNodeChild(catalogNode, 'paging')

	return {
		products,
		nextPageCursor: paging
			? getBinaryNodeChildString(paging, 'after')
			: undefined
	}
}

export const parseCollectionsNode = (node: BinaryNode) => {
	const collectionsNode = getBinaryNodeChild(node, 'collections')
	const collections = getBinaryNodeChildren(collectionsNode, 'collection').map<CatalogCollection>(
		collectionNode => {
			const id = getBinaryNodeChildString(collectionNode, 'id')!
			const name = getBinaryNodeChildString(collectionNode, 'name')!

			const products = getBinaryNodeChildren(collectionNode, 'product').map(parseProductNode)
			return {
				id,
				name,
				products,
				status: parseStatusInfo(collectionNode)
			}
		}
	)

	return {
		collections
	}
}

export const parseOrderDetailsNode = (node: BinaryNode) => {
	const orderNode = getBinaryNodeChild(node, 'order')
	const products = getBinaryNodeChildren(orderNode, 'product').map<OrderProduct>(
		productNode => {
			const imageNode = getBinaryNodeChild(productNode, 'image')!
			return {
				id: getBinaryNodeChildString(productNode, 'id')!,
				name: getBinaryNodeChildString(productNode, 'name')!,
				imageUrl: getBinaryNodeChildString(imageNode, 'url')!,
				price: +getBinaryNodeChildString(productNode, 'price')!,
				currency: getBinaryNodeChildString(productNode, 'currency')!,
				quantity: +getBinaryNodeChildString(productNode, 'quantity')!
			}
		}
	)

	const priceNode = getBinaryNodeChild(orderNode, 'price')

	const orderDetails: OrderDetails = {
		price: {
			total: +getBinaryNodeChildString(priceNode, 'total')!,
			currency: getBinaryNodeChildString(priceNode, 'currency')!,
		},
		products
	}

	return orderDetails
}

export const toProductNode = (productId: string | undefined, product: ProductCreate | ProductUpdate) => {
	const attrs: BinaryNode['attrs'] = { }
	const content: BinaryNode[] = [ ]

	if(typeof productId !== 'undefined') {
		content.push({
			tag: 'id',
			attrs: { },
			content: Buffer.from(productId)
		})
	}

	if(typeof product.name !== 'undefined') {
		content.push({
			tag: 'name',
			attrs: { },
			content: Buffer.from(product.name)
		})
	}

	if(typeof product.description !== 'undefined') {
		content.push({
			tag: 'description',
			attrs: { },
			content: Buffer.from(product.description)
		})
	}

	if(typeof product.retailerId !== 'undefined') {
		content.push({
			tag: 'retailer_id',
			attrs: { },
			content: Buffer.from(product.retailerId)
		})
	}

	if(product.images.length) {
		content.push({
			tag: 'media',
			attrs: { },
			content: product.images.map(
				img => {
					if(!('url' in img)) {
						throw new Boom('Expected img for product to already be uploaded', { statusCode: 400 })
					}

					return {
						tag: 'image',
						attrs: { },
						content: [
							{
								tag: 'url',
								attrs: { },
								content: Buffer.from(img.url.toString())
							}
						]
					}
				}
			)
		})
	}

	if(typeof product.price !== 'undefined') {
		content.push({
			tag: 'price',
			attrs: { },
			content: Buffer.from(product.price.toString())
		})
	}

	if(typeof product.currency !== 'undefined') {
		content.push({
			tag: 'currency',
			attrs: { },
			content: Buffer.from(product.currency)
		})
	}

	if('originCountryCode' in product) {
		if(typeof product.originCountryCode === 'undefined') {
			attrs['compliance_category'] = 'COUNTRY_ORIGIN_EXEMPT'
		} else {
			content.push({
				tag: 'compliance_info',
				attrs: { },
				content: [
					{
						tag: 'country_code_origin',
						attrs: { },
						content: Buffer.from(product.originCountryCode)
					}
				]
			})
		}
	}


	if(typeof product.isHidden !== 'undefined') {
		attrs['is_hidden'] = product.isHidden.toString()
	}

	const node: BinaryNode = {
		tag: 'product',
		attrs,
		content
	}
	return node
}

export const parseProductNode = (productNode: BinaryNode) => {
	const isHidden = productNode.attrs.is_hidden === 'true'
	const id = getBinaryNodeChildString(productNode, 'id')!

	const mediaNode = getBinaryNodeChild(productNode, 'media')!
	const statusInfoNode = getBinaryNodeChild(productNode, 'status_info')!

	const product: Product = {
		id,
		imageUrls: parseImageUrls(mediaNode),
		reviewStatus: {
			whatsapp: getBinaryNodeChildString(statusInfoNode, 'status')!,
		},
		availability: 'in stock',
		name: getBinaryNodeChildString(productNode, 'name')!,
		retailerId: getBinaryNodeChildString(productNode, 'retailer_id'),
		url: getBinaryNodeChildString(productNode, 'url'),
		description: getBinaryNodeChildString(productNode, 'description')!,
		price:  +getBinaryNodeChildString(productNode, 'price')!,
		currency: getBinaryNodeChildString(productNode, 'currency')!,
		isHidden,
	}

	return product
}

/**
 * Uploads images not already uploaded to WA's servers
 */
export async function uploadingNecessaryImagesOfProduct<T extends ProductUpdate | ProductCreate>(product: T, waUploadToServer: WAMediaUploadFunction, timeoutMs = 30_000) {
	product = {
		...product,
		images: product.images ? await uploadingNecessaryImages(product.images, waUploadToServer, timeoutMs) : product.images
	}
	return product
}

/**
 * Uploads images not already uploaded to WA's servers
 */
export const uploadingNecessaryImages = async(
	images: WAMediaUpload[],
	waUploadToServer: WAMediaUploadFunction,
	timeoutMs = 30_000
) => {
	const results = await Promise.all(
		images.map<Promise<{ url: string }>>(
			async img => {

				if('url' in img) {
					const url = img.url.toString()
					if(url.includes('.whatsapp.net')) {
						return { url }
					}
				}

				const { stream } = await getStream(img)
				const hasher = createHash('sha256')
				const contentBlocks: Buffer[] = []
				for await (const block of stream) {
					hasher.update(block)
					contentBlocks.push(block)
				}

				const sha = hasher.digest('base64')

				const { directPath } = await waUploadToServer(
					toReadable(Buffer.concat(contentBlocks)),
					{
						mediaType: 'product-catalog-image',
						fileEncSha256B64: sha,
						timeoutMs
					}
				)
				return { url: getUrlFromDirectPath(directPath) }
			}
		)
	)
	return results
}

const parseImageUrls = (mediaNode: BinaryNode) => {
	const imgNode = getBinaryNodeChild(mediaNode, 'image')
	return {
		requested: getBinaryNodeChildString(imgNode, 'request_image_url')!,
		original: getBinaryNodeChildString(imgNode, 'original_image_url')!
	}
}

const parseStatusInfo = (mediaNode: BinaryNode): CatalogStatus => {
	const node = getBinaryNodeChild(mediaNode, 'status_info')
	return {
		status: getBinaryNodeChildString(node, 'status')!,
		canAppeal: getBinaryNodeChildString(node, 'can_appeal') === 'true',
	}
}