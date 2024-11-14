"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadingNecessaryImages = exports.uploadingNecessaryImagesOfProduct = exports.parseProductNode = exports.toProductNode = exports.parseOrderDetailsNode = exports.parseCollectionsNode = exports.parseCatalogNode = void 0;
const boom_1 = require("@hapi/boom");
const crypto_1 = require("crypto");
const WABinary_1 = require("../WABinary");
const messages_media_1 = require("./messages-media");
const parseCatalogNode = (node) => {
    const catalogNode = (0, WABinary_1.getBinaryNodeChild)(node, 'product_catalog');
    const products = (0, WABinary_1.getBinaryNodeChildren)(catalogNode, 'product').map(exports.parseProductNode);
    const paging = (0, WABinary_1.getBinaryNodeChild)(catalogNode, 'paging');
    return {
        products,
        nextPageCursor: paging
            ? (0, WABinary_1.getBinaryNodeChildString)(paging, 'after')
            : undefined
    };
};
exports.parseCatalogNode = parseCatalogNode;
const parseCollectionsNode = (node) => {
    const collectionsNode = (0, WABinary_1.getBinaryNodeChild)(node, 'collections');
    const collections = (0, WABinary_1.getBinaryNodeChildren)(collectionsNode, 'collection').map(collectionNode => {
        const id = (0, WABinary_1.getBinaryNodeChildString)(collectionNode, 'id');
        const name = (0, WABinary_1.getBinaryNodeChildString)(collectionNode, 'name');
        const products = (0, WABinary_1.getBinaryNodeChildren)(collectionNode, 'product').map(exports.parseProductNode);
        return {
            id,
            name,
            products,
            status: parseStatusInfo(collectionNode)
        };
    });
    return {
        collections
    };
};
exports.parseCollectionsNode = parseCollectionsNode;
const parseOrderDetailsNode = (node) => {
    const orderNode = (0, WABinary_1.getBinaryNodeChild)(node, 'order');
    const products = (0, WABinary_1.getBinaryNodeChildren)(orderNode, 'product').map(productNode => {
        const imageNode = (0, WABinary_1.getBinaryNodeChild)(productNode, 'image');
        return {
            id: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'id'),
            name: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'name'),
            imageUrl: (0, WABinary_1.getBinaryNodeChildString)(imageNode, 'url'),
            price: +(0, WABinary_1.getBinaryNodeChildString)(productNode, 'price'),
            currency: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'currency'),
            quantity: +(0, WABinary_1.getBinaryNodeChildString)(productNode, 'quantity')
        };
    });
    const priceNode = (0, WABinary_1.getBinaryNodeChild)(orderNode, 'price');
    const orderDetails = {
        price: {
            total: +(0, WABinary_1.getBinaryNodeChildString)(priceNode, 'total'),
            currency: (0, WABinary_1.getBinaryNodeChildString)(priceNode, 'currency'),
        },
        products
    };
    return orderDetails;
};
exports.parseOrderDetailsNode = parseOrderDetailsNode;
const toProductNode = (productId, product) => {
    const attrs = {};
    const content = [];
    if (typeof productId !== 'undefined') {
        content.push({
            tag: 'id',
            attrs: {},
            content: Buffer.from(productId)
        });
    }
    if (typeof product.name !== 'undefined') {
        content.push({
            tag: 'name',
            attrs: {},
            content: Buffer.from(product.name)
        });
    }
    if (typeof product.description !== 'undefined') {
        content.push({
            tag: 'description',
            attrs: {},
            content: Buffer.from(product.description)
        });
    }
    if (typeof product.retailerId !== 'undefined') {
        content.push({
            tag: 'retailer_id',
            attrs: {},
            content: Buffer.from(product.retailerId)
        });
    }
    if (product.images.length) {
        content.push({
            tag: 'media',
            attrs: {},
            content: product.images.map(img => {
                if (!('url' in img)) {
                    throw new boom_1.Boom('Expected img for product to already be uploaded', { statusCode: 400 });
                }
                return {
                    tag: 'image',
                    attrs: {},
                    content: [
                        {
                            tag: 'url',
                            attrs: {},
                            content: Buffer.from(img.url.toString())
                        }
                    ]
                };
            })
        });
    }
    if (typeof product.price !== 'undefined') {
        content.push({
            tag: 'price',
            attrs: {},
            content: Buffer.from(product.price.toString())
        });
    }
    if (typeof product.currency !== 'undefined') {
        content.push({
            tag: 'currency',
            attrs: {},
            content: Buffer.from(product.currency)
        });
    }
    if ('originCountryCode' in product) {
        if (typeof product.originCountryCode === 'undefined') {
            attrs['compliance_category'] = 'COUNTRY_ORIGIN_EXEMPT';
        }
        else {
            content.push({
                tag: 'compliance_info',
                attrs: {},
                content: [
                    {
                        tag: 'country_code_origin',
                        attrs: {},
                        content: Buffer.from(product.originCountryCode)
                    }
                ]
            });
        }
    }
    if (typeof product.isHidden !== 'undefined') {
        attrs['is_hidden'] = product.isHidden.toString();
    }
    const node = {
        tag: 'product',
        attrs,
        content
    };
    return node;
};
exports.toProductNode = toProductNode;
const parseProductNode = (productNode) => {
    const isHidden = productNode.attrs.is_hidden === 'true';
    const id = (0, WABinary_1.getBinaryNodeChildString)(productNode, 'id');
    const mediaNode = (0, WABinary_1.getBinaryNodeChild)(productNode, 'media');
    const statusInfoNode = (0, WABinary_1.getBinaryNodeChild)(productNode, 'status_info');
    const product = {
        id,
        imageUrls: parseImageUrls(mediaNode),
        reviewStatus: {
            whatsapp: (0, WABinary_1.getBinaryNodeChildString)(statusInfoNode, 'status'),
        },
        availability: 'in stock',
        name: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'name'),
        retailerId: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'retailer_id'),
        url: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'url'),
        description: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'description'),
        price: +(0, WABinary_1.getBinaryNodeChildString)(productNode, 'price'),
        currency: (0, WABinary_1.getBinaryNodeChildString)(productNode, 'currency'),
        isHidden,
    };
    return product;
};
exports.parseProductNode = parseProductNode;
/**
 * Uploads images not already uploaded to WA's servers
 */
async function uploadingNecessaryImagesOfProduct(product, waUploadToServer, timeoutMs = 30000) {
    product = {
        ...product,
        images: product.images ? await (0, exports.uploadingNecessaryImages)(product.images, waUploadToServer, timeoutMs) : product.images
    };
    return product;
}
exports.uploadingNecessaryImagesOfProduct = uploadingNecessaryImagesOfProduct;
/**
 * Uploads images not already uploaded to WA's servers
 */
const uploadingNecessaryImages = async (images, waUploadToServer, timeoutMs = 30000) => {
    const results = await Promise.all(images.map(async (img) => {
        if ('url' in img) {
            const url = img.url.toString();
            if (url.includes('.whatsapp.net')) {
                return { url };
            }
        }
        const { stream } = await (0, messages_media_1.getStream)(img);
        const hasher = (0, crypto_1.createHash)('sha256');
        const contentBlocks = [];
        for await (const block of stream) {
            hasher.update(block);
            contentBlocks.push(block);
        }
        const sha = hasher.digest('base64');
        const { directPath } = await waUploadToServer((0, messages_media_1.toReadable)(Buffer.concat(contentBlocks)), {
            mediaType: 'product-catalog-image',
            fileEncSha256B64: sha,
            timeoutMs
        });
        return { url: (0, messages_media_1.getUrlFromDirectPath)(directPath) };
    }));
    return results;
};
exports.uploadingNecessaryImages = uploadingNecessaryImages;
const parseImageUrls = (mediaNode) => {
    const imgNode = (0, WABinary_1.getBinaryNodeChild)(mediaNode, 'image');
    return {
        requested: (0, WABinary_1.getBinaryNodeChildString)(imgNode, 'request_image_url'),
        original: (0, WABinary_1.getBinaryNodeChildString)(imgNode, 'original_image_url')
    };
};
const parseStatusInfo = (mediaNode) => {
    const node = (0, WABinary_1.getBinaryNodeChild)(mediaNode, 'status_info');
    return {
        status: (0, WABinary_1.getBinaryNodeChildString)(node, 'status'),
        canAppeal: (0, WABinary_1.getBinaryNodeChildString)(node, 'can_appeal') === 'true',
    };
};
