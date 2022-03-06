import { CatalogCollection, CatalogStatus, OrderDetails, OrderProduct, Product } from '../Types'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildBuffer, getBinaryNodeChildren, getBinaryNodeChildString } from '../WABinary'

export const parseCatalogNode = (node: BinaryNode) => {
	const catalogNode = getBinaryNodeChild(node, 'product_catalog')
	const products = getBinaryNodeChildren(catalogNode, 'product').map(parseProductNode)
	return { products }
}

export const parseCollectionsNode = (node: BinaryNode) => {
	const collectionsNode = getBinaryNodeChild(node, 'collections')
	const collections = getBinaryNodeChildren(collectionsNode, 'collection').map<CatalogCollection>(
		collectionNode => {
			const id = parseCatalogId(collectionNode)
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
				id: parseCatalogId(productNode),
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

const parseProductNode = (productNode: BinaryNode) => {
	const isHidden = productNode.attrs.is_hidden === 'true'
	const id = parseCatalogId(productNode)

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

const parseCatalogId = (node: BinaryNode) => {
	const idNode = getBinaryNodeChildBuffer(node, 'id')
	const id = Buffer.from(idNode).readBigUInt64LE().toString()
	return id
}