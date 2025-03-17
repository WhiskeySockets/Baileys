# Class: CatalogSnapshot

Defined in: [WAProto/index.d.ts:29721](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29721)

Represents a CatalogSnapshot.

## Implements

- [`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md)

## Constructors

### new CatalogSnapshot()

> **new CatalogSnapshot**(`properties`?): [`CatalogSnapshot`](CatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29727](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29727)

Constructs a new CatalogSnapshot.

#### Parameters

##### properties?

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md)

Properties to set

#### Returns

[`CatalogSnapshot`](CatalogSnapshot.md)

## Properties

### catalogImage?

> `optional` **catalogImage**: `null` \| [`IImageMessage`](../../../interfaces/IImageMessage.md)

Defined in: [WAProto/index.d.ts:29730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29730)

CatalogSnapshot catalogImage.

#### Implementation of

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md).[`catalogImage`](../interfaces/ICatalogSnapshot.md#catalogimage)

***

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29736](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29736)

CatalogSnapshot description.

#### Implementation of

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md).[`description`](../interfaces/ICatalogSnapshot.md#description)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29733)

CatalogSnapshot title.

#### Implementation of

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md).[`title`](../interfaces/ICatalogSnapshot.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29806)

Converts this CatalogSnapshot to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CatalogSnapshot`](CatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29743)

Creates a new CatalogSnapshot instance using the specified properties.

#### Parameters

##### properties?

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md)

Properties to set

#### Returns

[`CatalogSnapshot`](CatalogSnapshot.md)

CatalogSnapshot instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CatalogSnapshot`](CatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29769)

Decodes a CatalogSnapshot message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CatalogSnapshot`](CatalogSnapshot.md)

CatalogSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CatalogSnapshot`](CatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29778)

Decodes a CatalogSnapshot message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CatalogSnapshot`](CatalogSnapshot.md)

CatalogSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29751](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29751)

Encodes the specified CatalogSnapshot message. Does not implicitly [verify](CatalogSnapshot.md#verify) messages.

#### Parameters

##### message

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md)

CatalogSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29759)

Encodes the specified CatalogSnapshot message, length delimited. Does not implicitly [verify](CatalogSnapshot.md#verify) messages.

#### Parameters

##### message

[`ICatalogSnapshot`](../interfaces/ICatalogSnapshot.md)

CatalogSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CatalogSnapshot`](CatalogSnapshot.md)

Defined in: [WAProto/index.d.ts:29792](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29792)

Creates a CatalogSnapshot message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CatalogSnapshot`](CatalogSnapshot.md)

CatalogSnapshot

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29813)

Gets the default type url for CatalogSnapshot

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

Defined in: [WAProto/index.d.ts:29800](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29800)

Creates a plain object from a CatalogSnapshot message. Also converts values to other types if specified.

#### Parameters

##### message

[`CatalogSnapshot`](CatalogSnapshot.md)

CatalogSnapshot

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29785)

Verifies a CatalogSnapshot message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
