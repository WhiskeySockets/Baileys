# Class: ProductListHeaderImage

Defined in: [WAProto/index.d.ts:25117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25117)

Represents a ProductListHeaderImage.

## Implements

- [`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

## Constructors

### new ProductListHeaderImage()

> **new ProductListHeaderImage**(`properties`?): [`ProductListHeaderImage`](ProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25123)

Constructs a new ProductListHeaderImage.

#### Parameters

##### properties?

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

Properties to set

#### Returns

[`ProductListHeaderImage`](ProductListHeaderImage.md)

## Properties

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:25129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25129)

ProductListHeaderImage jpegThumbnail.

#### Implementation of

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md).[`jpegThumbnail`](../interfaces/IProductListHeaderImage.md#jpegthumbnail)

***

### productId?

> `optional` **productId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25126)

ProductListHeaderImage productId.

#### Implementation of

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md).[`productId`](../interfaces/IProductListHeaderImage.md#productid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25199)

Converts this ProductListHeaderImage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProductListHeaderImage`](ProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25136](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25136)

Creates a new ProductListHeaderImage instance using the specified properties.

#### Parameters

##### properties?

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

Properties to set

#### Returns

[`ProductListHeaderImage`](ProductListHeaderImage.md)

ProductListHeaderImage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProductListHeaderImage`](ProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25162)

Decodes a ProductListHeaderImage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProductListHeaderImage`](ProductListHeaderImage.md)

ProductListHeaderImage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProductListHeaderImage`](ProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25171)

Decodes a ProductListHeaderImage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProductListHeaderImage`](ProductListHeaderImage.md)

ProductListHeaderImage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25144](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25144)

Encodes the specified ProductListHeaderImage message. Does not implicitly [verify](ProductListHeaderImage.md#verify) messages.

#### Parameters

##### message

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

ProductListHeaderImage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25152](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25152)

Encodes the specified ProductListHeaderImage message, length delimited. Does not implicitly [verify](ProductListHeaderImage.md#verify) messages.

#### Parameters

##### message

[`IProductListHeaderImage`](../interfaces/IProductListHeaderImage.md)

ProductListHeaderImage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProductListHeaderImage`](ProductListHeaderImage.md)

Defined in: [WAProto/index.d.ts:25185](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25185)

Creates a ProductListHeaderImage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProductListHeaderImage`](ProductListHeaderImage.md)

ProductListHeaderImage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25206)

Gets the default type url for ProductListHeaderImage

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

Defined in: [WAProto/index.d.ts:25193](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25193)

Creates a plain object from a ProductListHeaderImage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProductListHeaderImage`](ProductListHeaderImage.md)

ProductListHeaderImage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25178](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25178)

Verifies a ProductListHeaderImage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
