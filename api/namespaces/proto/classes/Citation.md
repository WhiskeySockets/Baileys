# Class: Citation

Defined in: [WAProto/index.d.ts:7443](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7443)

Represents a Citation.

## Implements

- [`ICitation`](../interfaces/ICitation.md)

## Constructors

### new Citation()

> **new Citation**(`properties`?): [`Citation`](Citation.md)

Defined in: [WAProto/index.d.ts:7449](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7449)

Constructs a new Citation.

#### Parameters

##### properties?

[`ICitation`](../interfaces/ICitation.md)

Properties to set

#### Returns

[`Citation`](Citation.md)

## Properties

### cmsId

> **cmsId**: `string`

Defined in: [WAProto/index.d.ts:7458](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7458)

Citation cmsId.

#### Implementation of

[`ICitation`](../interfaces/ICitation.md).[`cmsId`](../interfaces/ICitation.md#cmsid)

***

### imageUrl

> **imageUrl**: `string`

Defined in: [WAProto/index.d.ts:7461](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7461)

Citation imageUrl.

#### Implementation of

[`ICitation`](../interfaces/ICitation.md).[`imageUrl`](../interfaces/ICitation.md#imageurl)

***

### subtitle

> **subtitle**: `string`

Defined in: [WAProto/index.d.ts:7455](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7455)

Citation subtitle.

#### Implementation of

[`ICitation`](../interfaces/ICitation.md).[`subtitle`](../interfaces/ICitation.md#subtitle)

***

### title

> **title**: `string`

Defined in: [WAProto/index.d.ts:7452](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7452)

Citation title.

#### Implementation of

[`ICitation`](../interfaces/ICitation.md).[`title`](../interfaces/ICitation.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7531](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7531)

Converts this Citation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Citation`](Citation.md)

Defined in: [WAProto/index.d.ts:7468](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7468)

Creates a new Citation instance using the specified properties.

#### Parameters

##### properties?

[`ICitation`](../interfaces/ICitation.md)

Properties to set

#### Returns

[`Citation`](Citation.md)

Citation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Citation`](Citation.md)

Defined in: [WAProto/index.d.ts:7494](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7494)

Decodes a Citation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Citation`](Citation.md)

Citation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Citation`](Citation.md)

Defined in: [WAProto/index.d.ts:7503](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7503)

Decodes a Citation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Citation`](Citation.md)

Citation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7476)

Encodes the specified Citation message. Does not implicitly [verify](Citation.md#verify) messages.

#### Parameters

##### message

[`ICitation`](../interfaces/ICitation.md)

Citation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7484](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7484)

Encodes the specified Citation message, length delimited. Does not implicitly [verify](Citation.md#verify) messages.

#### Parameters

##### message

[`ICitation`](../interfaces/ICitation.md)

Citation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Citation`](Citation.md)

Defined in: [WAProto/index.d.ts:7517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7517)

Creates a Citation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Citation`](Citation.md)

Citation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7538)

Gets the default type url for Citation

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

Defined in: [WAProto/index.d.ts:7525](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7525)

Creates a plain object from a Citation message. Also converts values to other types if specified.

#### Parameters

##### message

[`Citation`](Citation.md)

Citation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:7510](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7510)

Verifies a Citation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
