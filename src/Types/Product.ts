import { WAMediaUpload } from './Message'

export type CatalogResult = {
	data: {
		paging: { cursors: { before: string, after: string } },
		data: any[]
	}
}

export type ProductCreateResult = {
	data: { product: any }
}

export type CatalogStatus = {
	status: string
	canAppeal: boolean
}

export type CatalogCollection = {
	id: string
	name: string
	products: Product[]

	status: CatalogStatus
}

export type ProductAvailability = 'in stock'

export type ProductBase = {
	name: string
	retailerId?: string
	url?: string
	description: string
	price: number
	currency: string
	isHidden?: boolean
}

export type ProductCreate = ProductBase & {
	/** ISO country code for product origin. Set to undefined for no country */
	originCountryCode: string | undefined
	/** images of the product */
	images: WAMediaUpload[]
}

export type ProductUpdate = Omit<ProductCreate, 'originCountryCode'>

export type Product = ProductBase & {
	id: string
	imageUrls: { [_: string]: string }
	reviewStatus: { [_: string]: string }
	availability: ProductAvailability
}

export type OrderPrice = {
	currency: string
	total: number
}

export type OrderProduct = {
	id: string
	imageUrl: string
	name: string
	quantity: number

	currency: string
	price: number
}

export type OrderDetails = {
	price: OrderPrice
	products: OrderProduct[]
}