# Class: EncCommentMessage

Defined in: [WAProto/index.d.ts:20728](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20728)

Represents an EncCommentMessage.

## Implements

- [`IEncCommentMessage`](../interfaces/IEncCommentMessage.md)

## Constructors

### new EncCommentMessage()

> **new EncCommentMessage**(`properties`?): [`EncCommentMessage`](EncCommentMessage.md)

Defined in: [WAProto/index.d.ts:20734](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20734)

Constructs a new EncCommentMessage.

#### Parameters

##### properties?

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md)

Properties to set

#### Returns

[`EncCommentMessage`](EncCommentMessage.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20743)

EncCommentMessage encIv.

#### Implementation of

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md).[`encIv`](../interfaces/IEncCommentMessage.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20740](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20740)

EncCommentMessage encPayload.

#### Implementation of

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md).[`encPayload`](../interfaces/IEncCommentMessage.md#encpayload)

***

### targetMessageKey?

> `optional` **targetMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:20737](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20737)

EncCommentMessage targetMessageKey.

#### Implementation of

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md).[`targetMessageKey`](../interfaces/IEncCommentMessage.md#targetmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20813)

Converts this EncCommentMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EncCommentMessage`](EncCommentMessage.md)

Defined in: [WAProto/index.d.ts:20750](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20750)

Creates a new EncCommentMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md)

Properties to set

#### Returns

[`EncCommentMessage`](EncCommentMessage.md)

EncCommentMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EncCommentMessage`](EncCommentMessage.md)

Defined in: [WAProto/index.d.ts:20776](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20776)

Decodes an EncCommentMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EncCommentMessage`](EncCommentMessage.md)

EncCommentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EncCommentMessage`](EncCommentMessage.md)

Defined in: [WAProto/index.d.ts:20785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20785)

Decodes an EncCommentMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EncCommentMessage`](EncCommentMessage.md)

EncCommentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20758](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20758)

Encodes the specified EncCommentMessage message. Does not implicitly [verify](EncCommentMessage.md#verify) messages.

#### Parameters

##### message

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md)

EncCommentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20766)

Encodes the specified EncCommentMessage message, length delimited. Does not implicitly [verify](EncCommentMessage.md#verify) messages.

#### Parameters

##### message

[`IEncCommentMessage`](../interfaces/IEncCommentMessage.md)

EncCommentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EncCommentMessage`](EncCommentMessage.md)

Defined in: [WAProto/index.d.ts:20799](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20799)

Creates an EncCommentMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EncCommentMessage`](EncCommentMessage.md)

EncCommentMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20820)

Gets the default type url for EncCommentMessage

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

Defined in: [WAProto/index.d.ts:20807](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20807)

Creates a plain object from an EncCommentMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EncCommentMessage`](EncCommentMessage.md)

EncCommentMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20792](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20792)

Verifies an EncCommentMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
