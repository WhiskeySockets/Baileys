# Class: CommentMessage

Defined in: [WAProto/index.d.ts:19981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19981)

Represents a CommentMessage.

## Implements

- [`ICommentMessage`](../interfaces/ICommentMessage.md)

## Constructors

### new CommentMessage()

> **new CommentMessage**(`properties`?): [`CommentMessage`](CommentMessage.md)

Defined in: [WAProto/index.d.ts:19987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19987)

Constructs a new CommentMessage.

#### Parameters

##### properties?

[`ICommentMessage`](../interfaces/ICommentMessage.md)

Properties to set

#### Returns

[`CommentMessage`](CommentMessage.md)

## Properties

### message?

> `optional` **message**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:19990](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19990)

CommentMessage message.

#### Implementation of

[`ICommentMessage`](../interfaces/ICommentMessage.md).[`message`](../interfaces/ICommentMessage.md#message)

***

### targetMessageKey?

> `optional` **targetMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:19993](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19993)

CommentMessage targetMessageKey.

#### Implementation of

[`ICommentMessage`](../interfaces/ICommentMessage.md).[`targetMessageKey`](../interfaces/ICommentMessage.md#targetmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20063)

Converts this CommentMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CommentMessage`](CommentMessage.md)

Defined in: [WAProto/index.d.ts:20000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20000)

Creates a new CommentMessage instance using the specified properties.

#### Parameters

##### properties?

[`ICommentMessage`](../interfaces/ICommentMessage.md)

Properties to set

#### Returns

[`CommentMessage`](CommentMessage.md)

CommentMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CommentMessage`](CommentMessage.md)

Defined in: [WAProto/index.d.ts:20026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20026)

Decodes a CommentMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CommentMessage`](CommentMessage.md)

CommentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CommentMessage`](CommentMessage.md)

Defined in: [WAProto/index.d.ts:20035](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20035)

Decodes a CommentMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CommentMessage`](CommentMessage.md)

CommentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20008](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20008)

Encodes the specified CommentMessage message. Does not implicitly [verify](CommentMessage.md#verify) messages.

#### Parameters

##### message

[`ICommentMessage`](../interfaces/ICommentMessage.md)

CommentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20016](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20016)

Encodes the specified CommentMessage message, length delimited. Does not implicitly [verify](CommentMessage.md#verify) messages.

#### Parameters

##### message

[`ICommentMessage`](../interfaces/ICommentMessage.md)

CommentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CommentMessage`](CommentMessage.md)

Defined in: [WAProto/index.d.ts:20049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20049)

Creates a CommentMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CommentMessage`](CommentMessage.md)

CommentMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20070)

Gets the default type url for CommentMessage

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

Defined in: [WAProto/index.d.ts:20057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20057)

Creates a plain object from a CommentMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`CommentMessage`](CommentMessage.md)

CommentMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20042)

Verifies a CommentMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
