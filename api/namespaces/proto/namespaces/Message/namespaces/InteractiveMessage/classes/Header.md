# Class: Header

Defined in: [WAProto/index.d.ts:23804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23804)

Represents a Header.

## Implements

- [`IHeader`](../interfaces/IHeader.md)

## Constructors

### new Header()

> **new Header**(`properties`?): [`Header`](Header.md)

Defined in: [WAProto/index.d.ts:23810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23810)

Constructs a new Header.

#### Parameters

##### properties?

[`IHeader`](../interfaces/IHeader.md)

Properties to set

#### Returns

[`Header`](Header.md)

## Properties

### documentMessage?

> `optional` **documentMessage**: `null` \| [`IDocumentMessage`](../../../interfaces/IDocumentMessage.md)

Defined in: [WAProto/index.d.ts:23822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23822)

Header documentMessage.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`documentMessage`](../interfaces/IHeader.md#documentmessage)

***

### hasMediaAttachment?

> `optional` **hasMediaAttachment**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:23819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23819)

Header hasMediaAttachment.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`hasMediaAttachment`](../interfaces/IHeader.md#hasmediaattachment)

***

### imageMessage?

> `optional` **imageMessage**: `null` \| [`IImageMessage`](../../../interfaces/IImageMessage.md)

Defined in: [WAProto/index.d.ts:23825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23825)

Header imageMessage.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`imageMessage`](../interfaces/IHeader.md#imagemessage)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:23828](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23828)

Header jpegThumbnail.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`jpegThumbnail`](../interfaces/IHeader.md#jpegthumbnail)

***

### locationMessage?

> `optional` **locationMessage**: `null` \| [`ILocationMessage`](../../../interfaces/ILocationMessage.md)

Defined in: [WAProto/index.d.ts:23834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23834)

Header locationMessage.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`locationMessage`](../interfaces/IHeader.md#locationmessage)

***

### media?

> `optional` **media**: `"imageMessage"` \| `"locationMessage"` \| `"documentMessage"` \| `"videoMessage"` \| `"productMessage"` \| `"jpegThumbnail"`

Defined in: [WAProto/index.d.ts:23840](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23840)

Header media.

***

### productMessage?

> `optional` **productMessage**: `null` \| [`IProductMessage`](../../../interfaces/IProductMessage.md)

Defined in: [WAProto/index.d.ts:23837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23837)

Header productMessage.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`productMessage`](../interfaces/IHeader.md#productmessage)

***

### subtitle?

> `optional` **subtitle**: `null` \| `string`

Defined in: [WAProto/index.d.ts:23816](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23816)

Header subtitle.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`subtitle`](../interfaces/IHeader.md#subtitle)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:23813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23813)

Header title.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`title`](../interfaces/IHeader.md#title)

***

### videoMessage?

> `optional` **videoMessage**: `null` \| [`IVideoMessage`](../../../interfaces/IVideoMessage.md)

Defined in: [WAProto/index.d.ts:23831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23831)

Header videoMessage.

#### Implementation of

[`IHeader`](../interfaces/IHeader.md).[`videoMessage`](../interfaces/IHeader.md#videomessage)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:23910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23910)

Converts this Header to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Header`](Header.md)

Defined in: [WAProto/index.d.ts:23847](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23847)

Creates a new Header instance using the specified properties.

#### Parameters

##### properties?

[`IHeader`](../interfaces/IHeader.md)

Properties to set

#### Returns

[`Header`](Header.md)

Header instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Header`](Header.md)

Defined in: [WAProto/index.d.ts:23873](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23873)

Decodes a Header message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Header`](Header.md)

Header

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Header`](Header.md)

Defined in: [WAProto/index.d.ts:23882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23882)

Decodes a Header message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Header`](Header.md)

Header

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23855](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23855)

Encodes the specified Header message. Does not implicitly [verify](Header.md#verify) messages.

#### Parameters

##### message

[`IHeader`](../interfaces/IHeader.md)

Header message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23863](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23863)

Encodes the specified Header message, length delimited. Does not implicitly [verify](Header.md#verify) messages.

#### Parameters

##### message

[`IHeader`](../interfaces/IHeader.md)

Header message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Header`](Header.md)

Defined in: [WAProto/index.d.ts:23896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23896)

Creates a Header message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Header`](Header.md)

Header

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:23917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23917)

Gets the default type url for Header

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

Defined in: [WAProto/index.d.ts:23904](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23904)

Creates a plain object from a Header message. Also converts values to other types if specified.

#### Parameters

##### message

[`Header`](Header.md)

Header

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:23889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23889)

Verifies a Header message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
