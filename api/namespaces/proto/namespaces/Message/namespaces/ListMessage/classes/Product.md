# Class: Product

Defined in: [WAProto/index.d.ts:25017](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25017)

Represents a Product.

## Implements

- [`IProduct`](../interfaces/IProduct.md)

## Constructors

### new Product()

> **new Product**(`properties`?): [`Product`](Product.md)

Defined in: [WAProto/index.d.ts:25023](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25023)

Constructs a new Product.

#### Parameters

##### properties?

[`IProduct`](../interfaces/IProduct.md)

Properties to set

#### Returns

[`Product`](Product.md)

## Properties

### productId?

> `optional` **productId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25026)

Product productId.

#### Implementation of

[`IProduct`](../interfaces/IProduct.md).[`productId`](../interfaces/IProduct.md#productid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25096)

Converts this Product to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Product`](Product.md)

Defined in: [WAProto/index.d.ts:25033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25033)

Creates a new Product instance using the specified properties.

#### Parameters

##### properties?

[`IProduct`](../interfaces/IProduct.md)

Properties to set

#### Returns

[`Product`](Product.md)

Product instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Product`](Product.md)

Defined in: [WAProto/index.d.ts:25059](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25059)

Decodes a Product message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Product`](Product.md)

Product

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Product`](Product.md)

Defined in: [WAProto/index.d.ts:25068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25068)

Decodes a Product message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Product`](Product.md)

Product

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25041](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25041)

Encodes the specified Product message. Does not implicitly [verify](Product.md#verify) messages.

#### Parameters

##### message

[`IProduct`](../interfaces/IProduct.md)

Product message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25049)

Encodes the specified Product message, length delimited. Does not implicitly [verify](Product.md#verify) messages.

#### Parameters

##### message

[`IProduct`](../interfaces/IProduct.md)

Product message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Product`](Product.md)

Defined in: [WAProto/index.d.ts:25082](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25082)

Creates a Product message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Product`](Product.md)

Product

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25103)

Gets the default type url for Product

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

Defined in: [WAProto/index.d.ts:25090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25090)

Creates a plain object from a Product message. Also converts values to other types if specified.

#### Parameters

##### message

[`Product`](Product.md)

Product

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25075](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25075)

Verifies a Product message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
