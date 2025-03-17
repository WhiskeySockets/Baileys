# Class: AdReplyInfo

Defined in: [WAProto/index.d.ts:9760](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9760)

Represents an AdReplyInfo.

## Implements

- [`IAdReplyInfo`](../interfaces/IAdReplyInfo.md)

## Constructors

### new AdReplyInfo()

> **new AdReplyInfo**(`properties`?): [`AdReplyInfo`](AdReplyInfo.md)

Defined in: [WAProto/index.d.ts:9766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9766)

Constructs a new AdReplyInfo.

#### Parameters

##### properties?

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md)

Properties to set

#### Returns

[`AdReplyInfo`](AdReplyInfo.md)

## Properties

### advertiserName?

> `optional` **advertiserName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:9769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9769)

AdReplyInfo advertiserName.

#### Implementation of

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md).[`advertiserName`](../interfaces/IAdReplyInfo.md#advertisername)

***

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:9778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9778)

AdReplyInfo caption.

#### Implementation of

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md).[`caption`](../interfaces/IAdReplyInfo.md#caption)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:9775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9775)

AdReplyInfo jpegThumbnail.

#### Implementation of

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md).[`jpegThumbnail`](../interfaces/IAdReplyInfo.md#jpegthumbnail)

***

### mediaType?

> `optional` **mediaType**: `null` \| [`MediaType`](../namespaces/AdReplyInfo/enumerations/MediaType.md)

Defined in: [WAProto/index.d.ts:9772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9772)

AdReplyInfo mediaType.

#### Implementation of

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md).[`mediaType`](../interfaces/IAdReplyInfo.md#mediatype)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9848](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9848)

Converts this AdReplyInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AdReplyInfo`](AdReplyInfo.md)

Defined in: [WAProto/index.d.ts:9785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9785)

Creates a new AdReplyInfo instance using the specified properties.

#### Parameters

##### properties?

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md)

Properties to set

#### Returns

[`AdReplyInfo`](AdReplyInfo.md)

AdReplyInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AdReplyInfo`](AdReplyInfo.md)

Defined in: [WAProto/index.d.ts:9811](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9811)

Decodes an AdReplyInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AdReplyInfo`](AdReplyInfo.md)

AdReplyInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AdReplyInfo`](AdReplyInfo.md)

Defined in: [WAProto/index.d.ts:9820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9820)

Decodes an AdReplyInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AdReplyInfo`](AdReplyInfo.md)

AdReplyInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9793)

Encodes the specified AdReplyInfo message. Does not implicitly [verify](AdReplyInfo.md#verify) messages.

#### Parameters

##### message

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md)

AdReplyInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9801](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9801)

Encodes the specified AdReplyInfo message, length delimited. Does not implicitly [verify](AdReplyInfo.md#verify) messages.

#### Parameters

##### message

[`IAdReplyInfo`](../interfaces/IAdReplyInfo.md)

AdReplyInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AdReplyInfo`](AdReplyInfo.md)

Defined in: [WAProto/index.d.ts:9834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9834)

Creates an AdReplyInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AdReplyInfo`](AdReplyInfo.md)

AdReplyInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9855](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9855)

Gets the default type url for AdReplyInfo

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

Defined in: [WAProto/index.d.ts:9842](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9842)

Creates a plain object from an AdReplyInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`AdReplyInfo`](AdReplyInfo.md)

AdReplyInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9827)

Verifies an AdReplyInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
