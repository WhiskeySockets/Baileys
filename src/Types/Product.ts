
export type CatalogResult = {
	data: { 
		paging: { cursors: { before: string, after: string } }, 
		data: any[] 
	}
}

export type ProductCreateResult = {
	data: { product: any }
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

	imageUrls: string[]
}

export type ProductUpdate = Omit<ProductCreate, 'originCountryCode'>

export type Product = ProductBase & {
	id: string
	imageUrls: { [_: string]: string }
	reviewStatus: { [_: string]: string }
	availability: ProductAvailability
}