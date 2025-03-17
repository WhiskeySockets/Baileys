# Class: ProductListInfo

Defined in: [WAProto/index.d.ts:25223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25223)

Represents a ProductListInfo.

## Implements

- [`IProductListInfo`](../interfaces/IProductListInfo.md)

## Constructors

### new ProductListInfo()

> **new ProductListInfo**(`properties`?): [`ProductListInfo`](ProductListInfo.md)

Defined in: [WAProto/index.d.ts:25229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25229)

Constructs a new ProductListInfo.

#### Parameters

##### properties?

[`IProductListInfo`](../interfaces/IProductListInfo.md)

Properties to set

#### Returns

[`ProductListInfo`](ProductListInfo.md)

## Properties

### businessOwnerJid?

> `optional` **businessOwnerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25238)

ProductListInfo businessOwnerJid.

#### Implementation of

[`IProductListInfo`](../interfaces/IProductListInfo.md).[`businessOwnerJid`](../interfaces/IProductListInfo.md#businessownerjid)

***

### headerImage?

> `optional` **headerImage**: `null` \| [`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25235)

ProductListInfo headerImage.

#### Implementation of

[`IProductListInfo`](../interfaces/IProductListInfo.md).[`headerImage`](../interfaces/IProductListInfo.md#headerimage)

***

### productSections

> **productSections**: [`IProductSection`](../interfaces/IProductSection.md)[]

Defined in: [WAProto/index.d.ts:25232](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25232)

ProductListInfo productSections.

#### Implementation of

[`IProductListInfo`](../interfaces/IProductListInfo.md).[`productSections`](../interfaces/IProductListInfo.md#productsections)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25308](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25308)

Converts this ProductListInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProductListInfo`](ProductListInfo.md)

Defined in: [WAProto/index.d.ts:25245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25245)

Creates a new ProductListInfo instance using the specified properties.

#### Parameters

##### properties?

[`IProductListInfo`](../interfaces/IProductListInfo.md)

Properties to set

#### Returns

[`ProductListInfo`](ProductListInfo.md)

ProductListInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProductListInfo`](ProductListInfo.md)

Defined in: [WAProto/index.d.ts:25271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25271)

Decodes a ProductListInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProductListInfo`](ProductListInfo.md)

ProductListInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProductListInfo`](ProductListInfo.md)

Defined in: [WAProto/index.d.ts:25280](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25280)

Decodes a ProductListInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProductListInfo`](ProductListInfo.md)

ProductListInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25253)

Encodes the specified ProductListInfo message. Does not implicitly [verify](ProductListInfo.md#verify) messages.

#### Parameters

##### message

[`IProductListInfo`](../interfaces/IProductListInfo.md)

ProductListInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25261)

Encodes the specified ProductListInfo message, length delimited. Does not implicitly [verify](ProductListInfo.md#verify) messages.

#### Parameters

##### message

[`IProductListInfo`](../interfaces/IProductListInfo.md)

ProductListInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProductListInfo`](ProductListInfo.md)

Defined in: [WAProto/index.d.ts:25294](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25294)

Creates a ProductListInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProductListInfo`](ProductListInfo.md)

ProductListInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25315](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25315)

Gets the default type url for ProductListInfo

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

Defined in: [WAProto/index.d.ts:25302](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25302)

Creates a plain object from a ProductListInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProductListInfo`](ProductListInfo.md)

ProductListInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25287)

Verifies a ProductListInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
