import { GetCatalogOptions, ProductCreate, ProductUpdate } from '../Types'
import { parseCatalogNode, parseCollectionsNode, parseOrderDetailsNode, parseProductNode, toProductNode, uploadingNecessaryImagesOfProduct } from '../Utils/business'
import { BinaryNode, jidNormalizedUser, S_WHATSAPP_NET } from '../WABinary'
import { getBinaryNodeChild } from '../WABinary/generic-utils'
import { MessagesReceive } from './messages-recv'

export class Business extends MessagesReceive {
	getCatalog = async({ jid, limit, cursor }: GetCatalogOptions) => {
		jid = jid || this.authState.creds.me?.id
		jid = jidNormalizedUser(jid!)

		const queryParamNodes: BinaryNode[] = [
			<limit>{Buffer.from((limit || 10).toString())}</limit>,
			<width>{Buffer.from('100')}</width>,
			<height>{Buffer.from('100')}</height>,
		]

		if(cursor) {
			queryParamNodes.push(<after>{cursor}</after>)
		}

		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="get" xmlns="w:biz:catalog">
				<product_catalog jid={jid} allow_shop_source="true">
					{queryParamNodes}
				</product_catalog>
			</iq>
		)
		return parseCatalogNode(result)
	}

	getCollections = async(jid?: string, limit = 51) => {
		jid = jid || this.authState.creds.me?.id
		jid = jidNormalizedUser(jid!)
		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="get" xmlns="w:biz:catalog" smax_id="35">
				<collections biz_jid={jid}>
					<collection_limit>{Buffer.from(limit.toString())}</collection_limit>
					<item_limit>{Buffer.from(limit.toString())}</item_limit>
					<width>{Buffer.from('100')}</width>
					<height>{Buffer.from('100')}</height>
				</collections>
			</iq>
		)

		return parseCollectionsNode(result)
	}

	getOrderDetails = async(orderId: string, tokenBase64: string) => {
		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="get" xmlns="fb:thrift_iq" smax_id="5">
				<order op="get" id={orderId}>
					<image_dimensions>
						<width>{Buffer.from('100')}</width>
						<height>{Buffer.from('100')}</height>
					</image_dimensions>
					<token>{Buffer.from(tokenBase64)}</token>
				</order>
			</iq>
		)

		return parseOrderDetailsNode(result)
	}

	productUpdate = async(productId: string, update: ProductUpdate) => {
		update = await uploadingNecessaryImagesOfProduct(update, this.waUploadToServer)
		const editNode = toProductNode(productId, update)

		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="set" xmlns="w:biz:catalog">
				<product_catalog_edit v="1">
					{editNode}
					<width>100</width>
					<height>100</height>
				</product_catalog_edit>
			</iq>
		)
		const productCatalogEditNode = getBinaryNodeChild(result, 'product_catalog_edit')
		const productNode = getBinaryNodeChild(productCatalogEditNode, 'product')

		return parseProductNode(productNode!)
	}

	productCreate = async(create: ProductCreate) => {
		// ensure isHidden is defined
		create.isHidden = !!create.isHidden
		create = await uploadingNecessaryImagesOfProduct(create, this.waUploadToServer)
		const createNode = toProductNode(undefined, create)

		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="set" xmlns="w:biz:catalog">
				<product_catalog_add v="1">
					{createNode}
					<width>100</width>
					<height>100</height>
				</product_catalog_add>
			</iq>
		)

		const productCatalogAddNode = getBinaryNodeChild(result, 'product_catalog_add')
		const productNode = getBinaryNodeChild(productCatalogAddNode, 'product')

		return parseProductNode(productNode!)
	}

	productDelete = async(productIds: string[]) => {
		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="set" xmlns="w:biz:catalog">
				<product_catalog_delete v="1">
					{productIds.map(
						id => (
							<product>
								<id>{Buffer.from(id)}</id>
							</product>
						)
					)}
				</product_catalog_delete>
			</iq>
		)

		const productCatalogDelNode = getBinaryNodeChild(result, 'product_catalog_delete')
		return {
			deleted: +(productCatalogDelNode?.attrs.deleted_count || 0)
		}
	}
}