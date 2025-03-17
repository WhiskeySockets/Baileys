# Class: MediaData

Defined in: [WAProto/index.d.ts:16430](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16430)

Represents a MediaData.

## Implements

- [`IMediaData`](../interfaces/IMediaData.md)

## Constructors

### new MediaData()

> **new MediaData**(`properties`?): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:16436](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16436)

Constructs a new MediaData.

#### Parameters

##### properties?

[`IMediaData`](../interfaces/IMediaData.md)

Properties to set

#### Returns

[`MediaData`](MediaData.md)

## Properties

### localPath?

> `optional` **localPath**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16439](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16439)

MediaData localPath.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`localPath`](../interfaces/IMediaData.md#localpath)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16509)

Converts this MediaData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:16446](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16446)

Creates a new MediaData instance using the specified properties.

#### Parameters

##### properties?

[`IMediaData`](../interfaces/IMediaData.md)

Properties to set

#### Returns

[`MediaData`](MediaData.md)

MediaData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:16472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16472)

Decodes a MediaData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MediaData`](MediaData.md)

MediaData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:16481](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16481)

Decodes a MediaData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MediaData`](MediaData.md)

MediaData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16454](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16454)

Encodes the specified MediaData message. Does not implicitly [verify](MediaData.md#verify) messages.

#### Parameters

##### message

[`IMediaData`](../interfaces/IMediaData.md)

MediaData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16462](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16462)

Encodes the specified MediaData message, length delimited. Does not implicitly [verify](MediaData.md#verify) messages.

#### Parameters

##### message

[`IMediaData`](../interfaces/IMediaData.md)

MediaData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:16495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16495)

Creates a MediaData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MediaData`](MediaData.md)

MediaData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16516](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16516)

Gets the default type url for MediaData

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

Defined in: [WAProto/index.d.ts:16503](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16503)

Creates a plain object from a MediaData message. Also converts values to other types if specified.

#### Parameters

##### message

[`MediaData`](MediaData.md)

MediaData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16488](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16488)

Verifies a MediaData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
