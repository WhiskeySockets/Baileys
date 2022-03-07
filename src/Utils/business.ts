import { CatalogCollection, CatalogStatus, OrderDetails, OrderProduct, Product, ProductCreate, ProductUpdate } from '../Types'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString } from '../WABinary'

export const parseCatalogNode = (node: BinaryNode) => {
	const catalogNode = getBinaryNodeChild(node, 'product_catalog')
	const products = getBinaryNodeChildren(catalogNode, 'product').map(parseProductNode)
	return { products }
}

export const parseCollectionsNode = (node: BinaryNode) => {
	const collectionsNode = getBinaryNodeChild(node, 'collections')
	const collections = getBinaryNodeChildren(collectionsNode, 'collection').map<CatalogCollection>(
		collectionNode => {
			const id = getBinaryNodeChildString(collectionNode, 'id')
			const name = getBinaryNodeChildString(collectionNode, 'name')

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
			const imageNode = getBinaryNodeChild(productNode, 'image')
			return {
				id: getBinaryNodeChildString(productNode, 'id'),
				name: getBinaryNodeChildString(productNode, 'name'),
				imageUrl: getBinaryNodeChildString(imageNode, 'url'),
				price: +getBinaryNodeChildString(productNode, 'price'),
				currency: getBinaryNodeChildString(productNode, 'currency'),
				quantity: +getBinaryNodeChildString(productNode, 'quantity')
			}
		}
	)

	const priceNode = getBinaryNodeChild(orderNode, 'price')

	const orderDetails: OrderDetails = {
		price: {
			total: +getBinaryNodeChildString(priceNode, 'total'),
			currency: getBinaryNodeChildString(priceNode, 'currency'),
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

	if(product.imageUrls.length) {
		content.push({
			tag: 'media',
			attrs: { },
			content: product.imageUrls.map(
				url => ({
					tag: 'image',
					attrs: { },
					content: [
						{
							tag: 'url',
							attrs: { },
							content: Buffer.from(url)
						}
					]
				})
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
			attrs.compliance_category = 'COUNTRY_ORIGIN_EXEMPT'
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
		attrs.is_hidden = product.isHidden.toString()
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
	const id = getBinaryNodeChildString(productNode, 'id')

	const mediaNode = getBinaryNodeChild(productNode, 'media')
	const statusInfoNode = getBinaryNodeChild(productNode, 'status_info')

	const product: Product = {
		id,
		imageUrls: parseImageUrls(mediaNode),
		reviewStatus: {
			whatsapp: getBinaryNodeChildString(statusInfoNode, 'status'),
		},
		availability: 'in stock',
		name: getBinaryNodeChildString(productNode, 'name'),
		retailerId: getBinaryNodeChildString(productNode, 'retailer_id'),
		url: getBinaryNodeChildString(productNode, 'url'),
		description: getBinaryNodeChildString(productNode, 'description'),
		price:  +getBinaryNodeChildString(productNode, 'price'),
		currency: getBinaryNodeChildString(productNode, 'currency'),
		isHidden,
	}

	return product
}

const parseImageUrls = (mediaNode: BinaryNode) => {
	const imgNode = getBinaryNodeChild(mediaNode, 'image')
	return {
		requested: getBinaryNodeChildString(imgNode, 'request_image_url'),
		original: getBinaryNodeChildString(imgNode, 'original_image_url')
	}
}

const parseStatusInfo = (mediaNode: BinaryNode): CatalogStatus => {
	const node = getBinaryNodeChild(mediaNode, 'status_info')
	return {
		status: getBinaryNodeChildString(node, 'status'),
		canAppeal: getBinaryNodeChildString(node, 'can_appeal') === 'true',
	}
}