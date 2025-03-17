# Class: MediaData

Defined in: [WAProto/index.d.ts:35752](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35752)

Represents a MediaData.

## Implements

- [`IMediaData`](../interfaces/IMediaData.md)

## Constructors

### new MediaData()

> **new MediaData**(`properties`?): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:35758](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35758)

Constructs a new MediaData.

#### Parameters

##### properties?

[`IMediaData`](../interfaces/IMediaData.md)

Properties to set

#### Returns

[`MediaData`](MediaData.md)

## Properties

### directPath?

> `optional` **directPath**: `null` \| `string`

Defined in: [WAProto/index.d.ts:35773](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35773)

MediaData directPath.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`directPath`](../interfaces/IMediaData.md#directpath)

***

### fileEncSha256?

> `optional` **fileEncSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35770](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35770)

MediaData fileEncSha256.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`fileEncSha256`](../interfaces/IMediaData.md#fileencsha256)

***

### fileSha256?

> `optional` **fileSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35767](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35767)

MediaData fileSha256.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`fileSha256`](../interfaces/IMediaData.md#filesha256)

***

### mediaKey?

> `optional` **mediaKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35761](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35761)

MediaData mediaKey.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`mediaKey`](../interfaces/IMediaData.md#mediakey)

***

### mediaKeyTimestamp?

> `optional` **mediaKeyTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:35764](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35764)

MediaData mediaKeyTimestamp.

#### Implementation of

[`IMediaData`](../interfaces/IMediaData.md).[`mediaKeyTimestamp`](../interfaces/IMediaData.md#mediakeytimestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:35843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35843)

Converts this MediaData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MediaData`](MediaData.md)

Defined in: [WAProto/index.d.ts:35780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35780)

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

Defined in: [WAProto/index.d.ts:35806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35806)

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

Defined in: [WAProto/index.d.ts:35815](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35815)

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

Defined in: [WAProto/index.d.ts:35788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35788)

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

Defined in: [WAProto/index.d.ts:35796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35796)

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

Defined in: [WAProto/index.d.ts:35829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35829)

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

Defined in: [WAProto/index.d.ts:35850](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35850)

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

Defined in: [WAProto/index.d.ts:35837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35837)

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

Defined in: [WAProto/index.d.ts:35822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35822)

Verifies a MediaData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
