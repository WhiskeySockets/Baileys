# Class: RequestStickerReupload

Defined in: [WAProto/index.d.ts:27342](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27342)

Represents a RequestStickerReupload.

## Implements

- [`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md)

## Constructors

### new RequestStickerReupload()

> **new RequestStickerReupload**(`properties`?): [`RequestStickerReupload`](RequestStickerReupload.md)

Defined in: [WAProto/index.d.ts:27348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27348)

Constructs a new RequestStickerReupload.

#### Parameters

##### properties?

[`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md)

Properties to set

#### Returns

[`RequestStickerReupload`](RequestStickerReupload.md)

## Properties

### fileSha256?

> `optional` **fileSha256**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27351)

RequestStickerReupload fileSha256.

#### Implementation of

[`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md).[`fileSha256`](../interfaces/IRequestStickerReupload.md#filesha256)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27421](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27421)

Converts this RequestStickerReupload to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RequestStickerReupload`](RequestStickerReupload.md)

Defined in: [WAProto/index.d.ts:27358](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27358)

Creates a new RequestStickerReupload instance using the specified properties.

#### Parameters

##### properties?

[`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md)

Properties to set

#### Returns

[`RequestStickerReupload`](RequestStickerReupload.md)

RequestStickerReupload instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RequestStickerReupload`](RequestStickerReupload.md)

Defined in: [WAProto/index.d.ts:27384](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27384)

Decodes a RequestStickerReupload message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RequestStickerReupload`](RequestStickerReupload.md)

RequestStickerReupload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RequestStickerReupload`](RequestStickerReupload.md)

Defined in: [WAProto/index.d.ts:27393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27393)

Decodes a RequestStickerReupload message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RequestStickerReupload`](RequestStickerReupload.md)

RequestStickerReupload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27366)

Encodes the specified RequestStickerReupload message. Does not implicitly [verify](RequestStickerReupload.md#verify) messages.

#### Parameters

##### message

[`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md)

RequestStickerReupload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27374)

Encodes the specified RequestStickerReupload message, length delimited. Does not implicitly [verify](RequestStickerReupload.md#verify) messages.

#### Parameters

##### message

[`IRequestStickerReupload`](../interfaces/IRequestStickerReupload.md)

RequestStickerReupload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RequestStickerReupload`](RequestStickerReupload.md)

Defined in: [WAProto/index.d.ts:27407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27407)

Creates a RequestStickerReupload message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RequestStickerReupload`](RequestStickerReupload.md)

RequestStickerReupload

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27428](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27428)

Gets the default type url for RequestStickerReupload

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

Defined in: [WAProto/index.d.ts:27415](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27415)

Creates a plain object from a RequestStickerReupload message. Also converts values to other types if specified.

#### Parameters

##### message

[`RequestStickerReupload`](RequestStickerReupload.md)

RequestStickerReupload

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27400)

Verifies a RequestStickerReupload message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
