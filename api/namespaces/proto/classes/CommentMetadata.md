# Class: CommentMetadata

Defined in: [WAProto/index.d.ts:8985](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8985)

Represents a CommentMetadata.

## Implements

- [`ICommentMetadata`](../interfaces/ICommentMetadata.md)

## Constructors

### new CommentMetadata()

> **new CommentMetadata**(`properties`?): [`CommentMetadata`](CommentMetadata.md)

Defined in: [WAProto/index.d.ts:8991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8991)

Constructs a new CommentMetadata.

#### Parameters

##### properties?

[`ICommentMetadata`](../interfaces/ICommentMetadata.md)

Properties to set

#### Returns

[`CommentMetadata`](CommentMetadata.md)

## Properties

### commentParentKey?

> `optional` **commentParentKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:8994](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8994)

CommentMetadata commentParentKey.

#### Implementation of

[`ICommentMetadata`](../interfaces/ICommentMetadata.md).[`commentParentKey`](../interfaces/ICommentMetadata.md#commentparentkey)

***

### replyCount?

> `optional` **replyCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8997)

CommentMetadata replyCount.

#### Implementation of

[`ICommentMetadata`](../interfaces/ICommentMetadata.md).[`replyCount`](../interfaces/ICommentMetadata.md#replycount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9067](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9067)

Converts this CommentMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CommentMetadata`](CommentMetadata.md)

Defined in: [WAProto/index.d.ts:9004](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9004)

Creates a new CommentMetadata instance using the specified properties.

#### Parameters

##### properties?

[`ICommentMetadata`](../interfaces/ICommentMetadata.md)

Properties to set

#### Returns

[`CommentMetadata`](CommentMetadata.md)

CommentMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CommentMetadata`](CommentMetadata.md)

Defined in: [WAProto/index.d.ts:9030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9030)

Decodes a CommentMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CommentMetadata`](CommentMetadata.md)

CommentMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CommentMetadata`](CommentMetadata.md)

Defined in: [WAProto/index.d.ts:9039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9039)

Decodes a CommentMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CommentMetadata`](CommentMetadata.md)

CommentMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9012)

Encodes the specified CommentMetadata message. Does not implicitly [verify](CommentMetadata.md#verify) messages.

#### Parameters

##### message

[`ICommentMetadata`](../interfaces/ICommentMetadata.md)

CommentMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9020](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9020)

Encodes the specified CommentMetadata message, length delimited. Does not implicitly [verify](CommentMetadata.md#verify) messages.

#### Parameters

##### message

[`ICommentMetadata`](../interfaces/ICommentMetadata.md)

CommentMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CommentMetadata`](CommentMetadata.md)

Defined in: [WAProto/index.d.ts:9053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9053)

Creates a CommentMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CommentMetadata`](CommentMetadata.md)

CommentMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9074)

Gets the default type url for CommentMetadata

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

Defined in: [WAProto/index.d.ts:9061](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9061)

Creates a plain object from a CommentMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`CommentMetadata`](CommentMetadata.md)

CommentMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9046](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9046)

Verifies a CommentMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
