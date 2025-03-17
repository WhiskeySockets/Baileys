# Class: RecentEmojiWeight

Defined in: [WAProto/index.d.ts:37800](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37800)

Represents a RecentEmojiWeight.

## Implements

- [`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md)

## Constructors

### new RecentEmojiWeight()

> **new RecentEmojiWeight**(`properties`?): [`RecentEmojiWeight`](RecentEmojiWeight.md)

Defined in: [WAProto/index.d.ts:37806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37806)

Constructs a new RecentEmojiWeight.

#### Parameters

##### properties?

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md)

Properties to set

#### Returns

[`RecentEmojiWeight`](RecentEmojiWeight.md)

## Properties

### emoji?

> `optional` **emoji**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37809](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37809)

RecentEmojiWeight emoji.

#### Implementation of

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md).[`emoji`](../interfaces/IRecentEmojiWeight.md#emoji)

***

### weight?

> `optional` **weight**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37812](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37812)

RecentEmojiWeight weight.

#### Implementation of

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md).[`weight`](../interfaces/IRecentEmojiWeight.md#weight)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37882)

Converts this RecentEmojiWeight to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RecentEmojiWeight`](RecentEmojiWeight.md)

Defined in: [WAProto/index.d.ts:37819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37819)

Creates a new RecentEmojiWeight instance using the specified properties.

#### Parameters

##### properties?

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md)

Properties to set

#### Returns

[`RecentEmojiWeight`](RecentEmojiWeight.md)

RecentEmojiWeight instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RecentEmojiWeight`](RecentEmojiWeight.md)

Defined in: [WAProto/index.d.ts:37845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37845)

Decodes a RecentEmojiWeight message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RecentEmojiWeight`](RecentEmojiWeight.md)

RecentEmojiWeight

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RecentEmojiWeight`](RecentEmojiWeight.md)

Defined in: [WAProto/index.d.ts:37854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37854)

Decodes a RecentEmojiWeight message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RecentEmojiWeight`](RecentEmojiWeight.md)

RecentEmojiWeight

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37827)

Encodes the specified RecentEmojiWeight message. Does not implicitly [verify](RecentEmojiWeight.md#verify) messages.

#### Parameters

##### message

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md)

RecentEmojiWeight message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37835)

Encodes the specified RecentEmojiWeight message, length delimited. Does not implicitly [verify](RecentEmojiWeight.md#verify) messages.

#### Parameters

##### message

[`IRecentEmojiWeight`](../interfaces/IRecentEmojiWeight.md)

RecentEmojiWeight message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RecentEmojiWeight`](RecentEmojiWeight.md)

Defined in: [WAProto/index.d.ts:37868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37868)

Creates a RecentEmojiWeight message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RecentEmojiWeight`](RecentEmojiWeight.md)

RecentEmojiWeight

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37889)

Gets the default type url for RecentEmojiWeight

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

Defined in: [WAProto/index.d.ts:37876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37876)

Creates a plain object from a RecentEmojiWeight message. Also converts values to other types if specified.

#### Parameters

##### message

[`RecentEmojiWeight`](RecentEmojiWeight.md)

RecentEmojiWeight

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37861](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37861)

Verifies a RecentEmojiWeight message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
