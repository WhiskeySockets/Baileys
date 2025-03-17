# Class: LinkPreviewResponse

Defined in: [WAProto/index.d.ts:28018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28018)

Represents a LinkPreviewResponse.

## Implements

- [`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md)

## Constructors

### new LinkPreviewResponse()

> **new LinkPreviewResponse**(`properties`?): [`LinkPreviewResponse`](LinkPreviewResponse.md)

Defined in: [WAProto/index.d.ts:28024](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28024)

Constructs a new LinkPreviewResponse.

#### Parameters

##### properties?

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md)

Properties to set

#### Returns

[`LinkPreviewResponse`](LinkPreviewResponse.md)

## Properties

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28033)

LinkPreviewResponse description.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`description`](../interfaces/ILinkPreviewResponse.md#description)

***

### hqThumbnail?

> `optional` **hqThumbnail**: `null` \| [`ILinkPreviewHighQualityThumbnail`](../namespaces/LinkPreviewResponse/interfaces/ILinkPreviewHighQualityThumbnail.md)

Defined in: [WAProto/index.d.ts:28045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28045)

LinkPreviewResponse hqThumbnail.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`hqThumbnail`](../interfaces/ILinkPreviewResponse.md#hqthumbnail)

***

### matchText?

> `optional` **matchText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28039)

LinkPreviewResponse matchText.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`matchText`](../interfaces/ILinkPreviewResponse.md#matchtext)

***

### previewType?

> `optional` **previewType**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28042)

LinkPreviewResponse previewType.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`previewType`](../interfaces/ILinkPreviewResponse.md#previewtype)

***

### thumbData?

> `optional` **thumbData**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:28036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28036)

LinkPreviewResponse thumbData.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`thumbData`](../interfaces/ILinkPreviewResponse.md#thumbdata)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28030)

LinkPreviewResponse title.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`title`](../interfaces/ILinkPreviewResponse.md#title)

***

### url?

> `optional` **url**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28027)

LinkPreviewResponse url.

#### Implementation of

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md).[`url`](../interfaces/ILinkPreviewResponse.md#url)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28115](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28115)

Converts this LinkPreviewResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LinkPreviewResponse`](LinkPreviewResponse.md)

Defined in: [WAProto/index.d.ts:28052](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28052)

Creates a new LinkPreviewResponse instance using the specified properties.

#### Parameters

##### properties?

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md)

Properties to set

#### Returns

[`LinkPreviewResponse`](LinkPreviewResponse.md)

LinkPreviewResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LinkPreviewResponse`](LinkPreviewResponse.md)

Defined in: [WAProto/index.d.ts:28078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28078)

Decodes a LinkPreviewResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LinkPreviewResponse`](LinkPreviewResponse.md)

LinkPreviewResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LinkPreviewResponse`](LinkPreviewResponse.md)

Defined in: [WAProto/index.d.ts:28087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28087)

Decodes a LinkPreviewResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LinkPreviewResponse`](LinkPreviewResponse.md)

LinkPreviewResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28060)

Encodes the specified LinkPreviewResponse message. Does not implicitly [verify](LinkPreviewResponse.md#verify) messages.

#### Parameters

##### message

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md)

LinkPreviewResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28068)

Encodes the specified LinkPreviewResponse message, length delimited. Does not implicitly [verify](LinkPreviewResponse.md#verify) messages.

#### Parameters

##### message

[`ILinkPreviewResponse`](../interfaces/ILinkPreviewResponse.md)

LinkPreviewResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LinkPreviewResponse`](LinkPreviewResponse.md)

Defined in: [WAProto/index.d.ts:28101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28101)

Creates a LinkPreviewResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LinkPreviewResponse`](LinkPreviewResponse.md)

LinkPreviewResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28122](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28122)

Gets the default type url for LinkPreviewResponse

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

Defined in: [WAProto/index.d.ts:28109](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28109)

Creates a plain object from a LinkPreviewResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`LinkPreviewResponse`](LinkPreviewResponse.md)

LinkPreviewResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28094)

Verifies a LinkPreviewResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
