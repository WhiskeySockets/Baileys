import { getRawMediaUploadData } from '../Utils/index.js';
import { parseCatalogNode, parseCollectionsNode, parseOrderDetailsNode, parseProductNode, toProductNode, uploadingNecessaryImagesOfProduct } from '../Utils/business.js';
import { jidNormalizedUser, S_WHATSAPP_NET } from '../WABinary/index.js';
import { getBinaryNodeChild } from '../WABinary/generic-utils.js';
import { makeMessagesRecvSocket } from './messages-recv.js';
export const makeBusinessSocket = (config) => {
    const sock = makeMessagesRecvSocket(config);
    const { authState, query, waUploadToServer } = sock;
    const updateBussinesProfile = async (args) => {
        const node = [];
        const simpleFields = ['address', 'email', 'description'];
        node.push(...simpleFields
            .filter(key => args[key])
            .map(key => ({
            tag: key,
            attrs: {},
            content: args[key]
        })));
        if (args.websites) {
            node.push(...args.websites.map(website => ({
                tag: 'website',
                attrs: {},
                content: website
            })));
        }
        if (args.hours) {
            node.push({
                tag: 'business_hours',
                attrs: { timezone: args.hours.timezone },
                content: args.hours.days.map(config => {
                    const base = {
                        tag: 'business_hours_config',
                        attrs: { day_of_week: config.day, mode: config.mode }
                    };
                    if (config.mode === 'specific_hours') {
                        return {
                            ...base,
                            attrs: {
                                ...base.attrs,
                                open_time: config.openTimeInMinutes,
                                close_time: config.closeTimeInMinutes
                            }
                        };
                    }
                    return base;
                })
            });
        }
        const result = await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz'
            },
            content: [
                {
                    tag: 'business_profile',
                    attrs: {
                        v: '3',
                        mutation_type: 'delta'
                    },
                    content: node
                }
            ]
        });
        return result;
    };
    const updateCoverPhoto = async (photo) => {
        const { fileSha256, filePath } = await getRawMediaUploadData(photo, 'biz-cover-photo');
        const fileSha256B64 = fileSha256.toString('base64');
        const { meta_hmac, fbid, ts } = await waUploadToServer(filePath, {
            fileEncSha256B64: fileSha256B64,
            mediaType: 'biz-cover-photo'
        });
        await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz'
            },
            content: [
                {
                    tag: 'business_profile',
                    attrs: {
                        v: '3',
                        mutation_type: 'delta'
                    },
                    content: [
                        {
                            tag: 'cover_photo',
                            attrs: { id: String(fbid), op: 'update', token: meta_hmac, ts: String(ts) }
                        }
                    ]
                }
            ]
        });
        return fbid;
    };
    const removeCoverPhoto = async (id) => {
        return await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz'
            },
            content: [
                {
                    tag: 'business_profile',
                    attrs: {
                        v: '3',
                        mutation_type: 'delta'
                    },
                    content: [
                        {
                            tag: 'cover_photo',
                            attrs: { op: 'delete', id }
                        }
                    ]
                }
            ]
        });
    };
    const getCatalog = async ({ jid, limit, cursor }) => {
        jid = jid || authState.creds.me?.id;
        jid = jidNormalizedUser(jid);
        const queryParamNodes = [
            {
                tag: 'limit',
                attrs: {},
                content: Buffer.from((limit || 10).toString())
            },
            {
                tag: 'width',
                attrs: {},
                content: Buffer.from('100')
            },
            {
                tag: 'height',
                attrs: {},
                content: Buffer.from('100')
            }
        ];
        if (cursor) {
            queryParamNodes.push({
                tag: 'after',
                attrs: {},
                content: cursor
            });
        }
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
                    content: queryParamNodes
                }
            ]
        });
        return parseCatalogNode(result);
    };
    const getCollections = async (jid, limit = 51) => {
        jid = jid || authState.creds.me?.id;
        jid = jidNormalizedUser(jid);
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
                        biz_jid: jid
                    },
                    content: [
                        {
                            tag: 'collection_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'item_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'width',
                            attrs: {},
                            content: Buffer.from('100')
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: Buffer.from('100')
                        }
                    ]
                }
            ]
        });
        return parseCollectionsNode(result);
    };
    const getOrderDetails = async (orderId, tokenBase64) => {
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
                            attrs: {},
                            content: [
                                {
                                    tag: 'width',
                                    attrs: {},
                                    content: Buffer.from('100')
                                },
                                {
                                    tag: 'height',
                                    attrs: {},
                                    content: Buffer.from('100')
                                }
                            ]
                        },
                        {
                            tag: 'token',
                            attrs: {},
                            content: Buffer.from(tokenBase64)
                        }
                    ]
                }
            ]
        });
        return parseOrderDetailsNode(result);
    };
    const productUpdate = async (productId, update) => {
        update = await uploadingNecessaryImagesOfProduct(update, waUploadToServer);
        const editNode = toProductNode(productId, update);
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
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogEditNode = getBinaryNodeChild(result, 'product_catalog_edit');
        const productNode = getBinaryNodeChild(productCatalogEditNode, 'product');
        return parseProductNode(productNode);
    };
    const productCreate = async (create) => {
        // ensure isHidden is defined
        create.isHidden = !!create.isHidden;
        create = await uploadingNecessaryImagesOfProduct(create, waUploadToServer);
        const createNode = toProductNode(undefined, create);
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
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogAddNode = getBinaryNodeChild(result, 'product_catalog_add');
        const productNode = getBinaryNodeChild(productCatalogAddNode, 'product');
        return parseProductNode(productNode);
    };
    const productDelete = async (productIds) => {
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
                    content: productIds.map(id => ({
                        tag: 'product',
                        attrs: {},
                        content: [
                            {
                                tag: 'id',
                                attrs: {},
                                content: Buffer.from(id)
                            }
                        ]
                    }))
                }
            ]
        });
        const productCatalogDelNode = getBinaryNodeChild(result, 'product_catalog_delete');
        return {
            deleted: +(productCatalogDelNode?.attrs.deleted_count || 0)
        };
    };
    return {
        ...sock,
        logger: config.logger,
        getOrderDetails,
        getCatalog,
        getCollections,
        productCreate,
        productDelete,
        productUpdate,
        updateBussinesProfile,
        updateCoverPhoto,
        removeCoverPhoto
    };
};
//# sourceMappingURL=business.js.map