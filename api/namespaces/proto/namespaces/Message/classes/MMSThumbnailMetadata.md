# Class: MMSThumbnailMetadata

Defined in: [WAProto/index.d.ts:26201](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26201)

Represents a MMSThumbnailMetadata.

## Implements

- [`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md)

## Constructors

### new MMSThumbnailMetadata()

> **new MMSThumbnailMetadata**(`properties`?): [`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

Defined in: [WAProto/index.d.ts:26207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26207)

Constructs a new MMSThumbnailMetadata.

#### Parameters

##### properties?

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md)

Properties to set

#### Returns

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

## Properties

### mediaKey?

> `optional` **mediaKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26219](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26219)

MMSThumbnailMetadata mediaKey.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`mediaKey`](../interfaces/IMMSThumbnailMetadata.md#mediakey)

***

### mediaKeyTimestamp?

> `optional` **mediaKeyTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:26222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26222)

MMSThumbnailMetadata mediaKeyTimestamp.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`mediaKeyTimestamp`](../interfaces/IMMSThumbnailMetadata.md#mediakeytimestamp)

***

### thumbnailDirectPath?

> `optional` **thumbnailDirectPath**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26210](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26210)

MMSThumbnailMetadata thumbnailDirectPath.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`thumbnailDirectPath`](../interfaces/IMMSThumbnailMetadata.md#thumbnaildirectpath)

***

### thumbnailEncSha256?

> `optional` **thumbnailEncSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26216)

MMSThumbnailMetadata thumbnailEncSha256.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`thumbnailEncSha256`](../interfaces/IMMSThumbnailMetadata.md#thumbnailencsha256)

***

### thumbnailHeight?

> `optional` **thumbnailHeight**: `null` \| `number`

Defined in: [WAProto/index.d.ts:26225](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26225)

MMSThumbnailMetadata thumbnailHeight.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`thumbnailHeight`](../interfaces/IMMSThumbnailMetadata.md#thumbnailheight)

***

### thumbnailSha256?

> `optional` **thumbnailSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26213)

MMSThumbnailMetadata thumbnailSha256.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`thumbnailSha256`](../interfaces/IMMSThumbnailMetadata.md#thumbnailsha256)

***

### thumbnailWidth?

> `optional` **thumbnailWidth**: `null` \| `number`

Defined in: [WAProto/index.d.ts:26228](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26228)

MMSThumbnailMetadata thumbnailWidth.

#### Implementation of

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md).[`thumbnailWidth`](../interfaces/IMMSThumbnailMetadata.md#thumbnailwidth)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26298](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26298)

Converts this MMSThumbnailMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

Defined in: [WAProto/index.d.ts:26235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26235)

Creates a new MMSThumbnailMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md)

Properties to set

#### Returns

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

MMSThumbnailMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

Defined in: [WAProto/index.d.ts:26261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26261)

Decodes a MMSThumbnailMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

MMSThumbnailMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

Defined in: [WAProto/index.d.ts:26270](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26270)

Decodes a MMSThumbnailMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

MMSThumbnailMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26243)

Encodes the specified MMSThumbnailMetadata message. Does not implicitly [verify](MMSThumbnailMetadata.md#verify) messages.

#### Parameters

##### message

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md)

MMSThumbnailMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26251)

Encodes the specified MMSThumbnailMetadata message, length delimited. Does not implicitly [verify](MMSThumbnailMetadata.md#verify) messages.

#### Parameters

##### message

[`IMMSThumbnailMetadata`](../interfaces/IMMSThumbnailMetadata.md)

MMSThumbnailMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

Defined in: [WAProto/index.d.ts:26284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26284)

Creates a MMSThumbnailMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

MMSThumbnailMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26305](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26305)

Gets the default type url for MMSThumbnailMetadata

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

Defined in: [WAProto/index.d.ts:26292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26292)

Creates a plain object from a MMSThumbnailMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`MMSThumbnailMetadata`](MMSThumbnailMetadata.md)

MMSThumbnailMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26277)

Verifies a MMSThumbnailMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
