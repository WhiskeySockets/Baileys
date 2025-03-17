# Class: ProductMessage

Defined in: [WAProto/index.d.ts:29601](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29601)

Represents a ProductMessage.

## Implements

- [`IProductMessage`](../interfaces/IProductMessage.md)

## Constructors

### new ProductMessage()

> **new ProductMessage**(`properties`?): [`ProductMessage`](ProductMessage.md)

Defined in: [WAProto/index.d.ts:29607](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29607)

Constructs a new ProductMessage.

#### Parameters

##### properties?

[`IProductMessage`](../interfaces/IProductMessage.md)

Properties to set

#### Returns

[`ProductMessage`](ProductMessage.md)

## Properties

### body?

> `optional` **body**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29619](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29619)

ProductMessage body.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`body`](../interfaces/IProductMessage.md#body)

***

### businessOwnerJid?

> `optional` **businessOwnerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29613)

ProductMessage businessOwnerJid.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`businessOwnerJid`](../interfaces/IProductMessage.md#businessownerjid)

***

### catalog?

> `optional` **catalog**: `null` \| [`ICatalogSnapshot`](../namespaces/ProductMessage/interfaces/ICatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29616](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29616)

ProductMessage catalog.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`catalog`](../interfaces/IProductMessage.md#catalog)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:29625](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29625)

ProductMessage contextInfo.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`contextInfo`](../interfaces/IProductMessage.md#contextinfo)

***

### footer?

> `optional` **footer**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29622](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29622)

ProductMessage footer.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`footer`](../interfaces/IProductMessage.md#footer)

***

### product?

> `optional` **product**: `null` \| [`IProductSnapshot`](../namespaces/ProductMessage/interfaces/IProductSnapshot.md)

Defined in: [WAProto/index.d.ts:29610](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29610)

ProductMessage product.

#### Implementation of

[`IProductMessage`](../interfaces/IProductMessage.md).[`product`](../interfaces/IProductMessage.md#product)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29695)

Converts this ProductMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProductMessage`](ProductMessage.md)

Defined in: [WAProto/index.d.ts:29632](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29632)

Creates a new ProductMessage instance using the specified properties.

#### Parameters

##### properties?

[`IProductMessage`](../interfaces/IProductMessage.md)

Properties to set

#### Returns

[`ProductMessage`](ProductMessage.md)

ProductMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProductMessage`](ProductMessage.md)

Defined in: [WAProto/index.d.ts:29658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29658)

Decodes a ProductMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProductMessage`](ProductMessage.md)

ProductMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProductMessage`](ProductMessage.md)

Defined in: [WAProto/index.d.ts:29667](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29667)

Decodes a ProductMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProductMessage`](ProductMessage.md)

ProductMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29640)

Encodes the specified ProductMessage message. Does not implicitly [verify](ProductMessage.md#verify) messages.

#### Parameters

##### message

[`IProductMessage`](../interfaces/IProductMessage.md)

ProductMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29648)

Encodes the specified ProductMessage message, length delimited. Does not implicitly [verify](ProductMessage.md#verify) messages.

#### Parameters

##### message

[`IProductMessage`](../interfaces/IProductMessage.md)

ProductMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProductMessage`](ProductMessage.md)

Defined in: [WAProto/index.d.ts:29681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29681)

Creates a ProductMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProductMessage`](ProductMessage.md)

ProductMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29702](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29702)

Gets the default type url for ProductMessage

#### Parameters

##### typeUrlPrefix?

`string`

your custom typeUrlPrefix(default "type.googleapis.com")

#### Returns

`string`

The default type url

***

### toObject()

> `static` **toObject**(`message`, `options`?): `object`

Defined in: [WAProto/index.d.ts:29689](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29689)

Creates a plain object from a ProductMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProductMessage`](ProductMessage.md)

ProductMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29674](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29674)

Verifies a ProductMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
