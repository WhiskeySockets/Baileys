# Class: BotPromptSuggestion

Defined in: [WAProto/index.d.ts:5399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5399)

Represents a BotPromptSuggestion.

## Implements

- [`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)

## Constructors

### new BotPromptSuggestion()

> **new BotPromptSuggestion**(`properties`?): [`BotPromptSuggestion`](BotPromptSuggestion.md)

Defined in: [WAProto/index.d.ts:5405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5405)

Constructs a new BotPromptSuggestion.

#### Parameters

##### properties?

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)

Properties to set

#### Returns

[`BotPromptSuggestion`](BotPromptSuggestion.md)

## Properties

### prompt?

> `optional` **prompt**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5408)

BotPromptSuggestion prompt.

#### Implementation of

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md).[`prompt`](../interfaces/IBotPromptSuggestion.md#prompt)

***

### promptId?

> `optional` **promptId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5411](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5411)

BotPromptSuggestion promptId.

#### Implementation of

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md).[`promptId`](../interfaces/IBotPromptSuggestion.md#promptid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5481](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5481)

Converts this BotPromptSuggestion to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotPromptSuggestion`](BotPromptSuggestion.md)

Defined in: [WAProto/index.d.ts:5418](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5418)

Creates a new BotPromptSuggestion instance using the specified properties.

#### Parameters

##### properties?

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)

Properties to set

#### Returns

[`BotPromptSuggestion`](BotPromptSuggestion.md)

BotPromptSuggestion instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotPromptSuggestion`](BotPromptSuggestion.md)

Defined in: [WAProto/index.d.ts:5444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5444)

Decodes a BotPromptSuggestion message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotPromptSuggestion`](BotPromptSuggestion.md)

BotPromptSuggestion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotPromptSuggestion`](BotPromptSuggestion.md)

Defined in: [WAProto/index.d.ts:5453](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5453)

Decodes a BotPromptSuggestion message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotPromptSuggestion`](BotPromptSuggestion.md)

BotPromptSuggestion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5426](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5426)

Encodes the specified BotPromptSuggestion message. Does not implicitly [verify](BotPromptSuggestion.md#verify) messages.

#### Parameters

##### message

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)

BotPromptSuggestion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5434](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5434)

Encodes the specified BotPromptSuggestion message, length delimited. Does not implicitly [verify](BotPromptSuggestion.md#verify) messages.

#### Parameters

##### message

[`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)

BotPromptSuggestion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotPromptSuggestion`](BotPromptSuggestion.md)

Defined in: [WAProto/index.d.ts:5467](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5467)

Creates a BotPromptSuggestion message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotPromptSuggestion`](BotPromptSuggestion.md)

BotPromptSuggestion

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5488](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5488)

Gets the default type url for BotPromptSuggestion

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

Defined in: [WAProto/index.d.ts:5475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5475)

Creates a plain object from a BotPromptSuggestion message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotPromptSuggestion`](BotPromptSuggestion.md)

BotPromptSuggestion

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5460)

Verifies a BotPromptSuggestion message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
