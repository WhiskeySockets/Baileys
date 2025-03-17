# Class: StickerSyncRMRMessage

Defined in: [WAProto/index.d.ts:31949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31949)

Represents a StickerSyncRMRMessage.

## Implements

- [`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md)

## Constructors

### new StickerSyncRMRMessage()

> **new StickerSyncRMRMessage**(`properties`?): [`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:31955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31955)

Constructs a new StickerSyncRMRMessage.

#### Parameters

##### properties?

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md)

Properties to set

#### Returns

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

## Properties

### filehash

> **filehash**: `string`[]

Defined in: [WAProto/index.d.ts:31958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31958)

StickerSyncRMRMessage filehash.

#### Implementation of

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md).[`filehash`](../interfaces/IStickerSyncRMRMessage.md#filehash)

***

### requestTimestamp?

> `optional` **requestTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:31964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31964)

StickerSyncRMRMessage requestTimestamp.

#### Implementation of

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md).[`requestTimestamp`](../interfaces/IStickerSyncRMRMessage.md#requesttimestamp)

***

### rmrSource?

> `optional` **rmrSource**: `null` \| `string`

Defined in: [WAProto/index.d.ts:31961](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31961)

StickerSyncRMRMessage rmrSource.

#### Implementation of

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md).[`rmrSource`](../interfaces/IStickerSyncRMRMessage.md#rmrsource)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:32034](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32034)

Converts this StickerSyncRMRMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:31971](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31971)

Creates a new StickerSyncRMRMessage instance using the specified properties.

#### Parameters

##### properties?

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md)

Properties to set

#### Returns

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

StickerSyncRMRMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:31997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31997)

Decodes a StickerSyncRMRMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

StickerSyncRMRMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:32006](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32006)

Decodes a StickerSyncRMRMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

StickerSyncRMRMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31979)

Encodes the specified StickerSyncRMRMessage message. Does not implicitly [verify](StickerSyncRMRMessage.md#verify) messages.

#### Parameters

##### message

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md)

StickerSyncRMRMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31987)

Encodes the specified StickerSyncRMRMessage message, length delimited. Does not implicitly [verify](StickerSyncRMRMessage.md#verify) messages.

#### Parameters

##### message

[`IStickerSyncRMRMessage`](../interfaces/IStickerSyncRMRMessage.md)

StickerSyncRMRMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:32020](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32020)

Creates a StickerSyncRMRMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

StickerSyncRMRMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:32041](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32041)

Gets the default type url for StickerSyncRMRMessage

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

Defined in: [WAProto/index.d.ts:32028](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32028)

Creates a plain object from a StickerSyncRMRMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`StickerSyncRMRMessage`](StickerSyncRMRMessage.md)

StickerSyncRMRMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:32013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32013)

Verifies a StickerSyncRMRMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
