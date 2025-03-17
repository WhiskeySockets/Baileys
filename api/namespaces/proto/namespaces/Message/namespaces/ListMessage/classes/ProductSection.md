# Class: ProductSection

Defined in: [WAProto/index.d.ts:25329](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25329)

Represents a ProductSection.

## Implements

- [`IProductSection`](../interfaces/IProductSection.md)

## Constructors

### new ProductSection()

> **new ProductSection**(`properties`?): [`ProductSection`](ProductSection.md)

Defined in: [WAProto/index.d.ts:25335](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25335)

Constructs a new ProductSection.

#### Parameters

##### properties?

[`IProductSection`](../interfaces/IProductSection.md)

Properties to set

#### Returns

[`ProductSection`](ProductSection.md)

## Properties

### products

> **products**: [`IProduct`](../interfaces/IProduct.md)[]

Defined in: [WAProto/index.d.ts:25341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25341)

ProductSection products.

#### Implementation of

[`IProductSection`](../interfaces/IProductSection.md).[`products`](../interfaces/IProductSection.md#products)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25338)

ProductSection title.

#### Implementation of

[`IProductSection`](../interfaces/IProductSection.md).[`title`](../interfaces/IProductSection.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25411](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25411)

Converts this ProductSection to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProductSection`](ProductSection.md)

Defined in: [WAProto/index.d.ts:25348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25348)

Creates a new ProductSection instance using the specified properties.

#### Parameters

##### properties?

[`IProductSection`](../interfaces/IProductSection.md)

Properties to set

#### Returns

[`ProductSection`](ProductSection.md)

ProductSection instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProductSection`](ProductSection.md)

Defined in: [WAProto/index.d.ts:25374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25374)

Decodes a ProductSection message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProductSection`](ProductSection.md)

ProductSection

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProductSection`](ProductSection.md)

Defined in: [WAProto/index.d.ts:25383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25383)

Decodes a ProductSection message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProductSection`](ProductSection.md)

ProductSection

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25356](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25356)

Encodes the specified ProductSection message. Does not implicitly [verify](ProductSection.md#verify) messages.

#### Parameters

##### message

[`IProductSection`](../interfaces/IProductSection.md)

ProductSection message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25364](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25364)

Encodes the specified ProductSection message, length delimited. Does not implicitly [verify](ProductSection.md#verify) messages.

#### Parameters

##### message

[`IProductSection`](../interfaces/IProductSection.md)

ProductSection message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProductSection`](ProductSection.md)

Defined in: [WAProto/index.d.ts:25397](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25397)

Creates a ProductSection message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProductSection`](ProductSection.md)

ProductSection

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25418](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25418)

Gets the default type url for ProductSection

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

Defined in: [WAProto/index.d.ts:25405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25405)

Creates a plain object from a ProductSection message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProductSection`](ProductSection.md)

ProductSection

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25390)

Verifies a ProductSection message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
