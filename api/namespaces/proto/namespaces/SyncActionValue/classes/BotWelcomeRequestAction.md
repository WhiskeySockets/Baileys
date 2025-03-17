# Class: BotWelcomeRequestAction

Defined in: [WAProto/index.d.ts:41250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41250)

Represents a BotWelcomeRequestAction.

## Implements

- [`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md)

## Constructors

### new BotWelcomeRequestAction()

> **new BotWelcomeRequestAction**(`properties`?): [`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

Defined in: [WAProto/index.d.ts:41256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41256)

Constructs a new BotWelcomeRequestAction.

#### Parameters

##### properties?

[`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md)

Properties to set

#### Returns

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

## Properties

### isSent?

> `optional` **isSent**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:41259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41259)

BotWelcomeRequestAction isSent.

#### Implementation of

[`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md).[`isSent`](../interfaces/IBotWelcomeRequestAction.md#issent)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41329](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41329)

Converts this BotWelcomeRequestAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

Defined in: [WAProto/index.d.ts:41266](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41266)

Creates a new BotWelcomeRequestAction instance using the specified properties.

#### Parameters

##### properties?

[`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md)

Properties to set

#### Returns

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

BotWelcomeRequestAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

Defined in: [WAProto/index.d.ts:41292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41292)

Decodes a BotWelcomeRequestAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

BotWelcomeRequestAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

Defined in: [WAProto/index.d.ts:41301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41301)

Decodes a BotWelcomeRequestAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

BotWelcomeRequestAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41274](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41274)

Encodes the specified BotWelcomeRequestAction message. Does not implicitly [verify](BotWelcomeRequestAction.md#verify) messages.

#### Parameters

##### message

[`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md)

BotWelcomeRequestAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41282](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41282)

Encodes the specified BotWelcomeRequestAction message, length delimited. Does not implicitly [verify](BotWelcomeRequestAction.md#verify) messages.

#### Parameters

##### message

[`IBotWelcomeRequestAction`](../interfaces/IBotWelcomeRequestAction.md)

BotWelcomeRequestAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

Defined in: [WAProto/index.d.ts:41315](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41315)

Creates a BotWelcomeRequestAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

BotWelcomeRequestAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41336](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41336)

Gets the default type url for BotWelcomeRequestAction

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

Defined in: [WAProto/index.d.ts:41323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41323)

Creates a plain object from a BotWelcomeRequestAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotWelcomeRequestAction`](BotWelcomeRequestAction.md)

BotWelcomeRequestAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41308](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41308)

Verifies a BotWelcomeRequestAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
