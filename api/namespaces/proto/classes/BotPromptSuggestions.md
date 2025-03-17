# Class: BotPromptSuggestions

Defined in: [WAProto/index.d.ts:5499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5499)

Represents a BotPromptSuggestions.

## Implements

- [`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

## Constructors

### new BotPromptSuggestions()

> **new BotPromptSuggestions**(`properties`?): [`BotPromptSuggestions`](BotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:5505](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5505)

Constructs a new BotPromptSuggestions.

#### Parameters

##### properties?

[`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

Properties to set

#### Returns

[`BotPromptSuggestions`](BotPromptSuggestions.md)

## Properties

### suggestions

> **suggestions**: [`IBotPromptSuggestion`](../interfaces/IBotPromptSuggestion.md)[]

Defined in: [WAProto/index.d.ts:5508](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5508)

BotPromptSuggestions suggestions.

#### Implementation of

[`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md).[`suggestions`](../interfaces/IBotPromptSuggestions.md#suggestions)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5578)

Converts this BotPromptSuggestions to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotPromptSuggestions`](BotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:5515](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5515)

Creates a new BotPromptSuggestions instance using the specified properties.

#### Parameters

##### properties?

[`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

Properties to set

#### Returns

[`BotPromptSuggestions`](BotPromptSuggestions.md)

BotPromptSuggestions instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotPromptSuggestions`](BotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:5541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5541)

Decodes a BotPromptSuggestions message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotPromptSuggestions`](BotPromptSuggestions.md)

BotPromptSuggestions

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotPromptSuggestions`](BotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:5550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5550)

Decodes a BotPromptSuggestions message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotPromptSuggestions`](BotPromptSuggestions.md)

BotPromptSuggestions

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5523](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5523)

Encodes the specified BotPromptSuggestions message. Does not implicitly [verify](BotPromptSuggestions.md#verify) messages.

#### Parameters

##### message

[`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

BotPromptSuggestions message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5531](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5531)

Encodes the specified BotPromptSuggestions message, length delimited. Does not implicitly [verify](BotPromptSuggestions.md#verify) messages.

#### Parameters

##### message

[`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

BotPromptSuggestions message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotPromptSuggestions`](BotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:5564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5564)

Creates a BotPromptSuggestions message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotPromptSuggestions`](BotPromptSuggestions.md)

BotPromptSuggestions

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5585](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5585)

Gets the default type url for BotPromptSuggestions

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

Defined in: [WAProto/index.d.ts:5572](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5572)

Creates a plain object from a BotPromptSuggestions message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotPromptSuggestions`](BotPromptSuggestions.md)

BotPromptSuggestions

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5557)

Verifies a BotPromptSuggestions message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
