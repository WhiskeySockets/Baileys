# Class: BotSuggestedPromptMetadata

Defined in: [WAProto/index.d.ts:6063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6063)

Represents a BotSuggestedPromptMetadata.

## Implements

- [`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md)

## Constructors

### new BotSuggestedPromptMetadata()

> **new BotSuggestedPromptMetadata**(`properties`?): [`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

Defined in: [WAProto/index.d.ts:6069](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6069)

Constructs a new BotSuggestedPromptMetadata.

#### Parameters

##### properties?

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md)

Properties to set

#### Returns

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

## Properties

### promptSuggestions?

> `optional` **promptSuggestions**: `null` \| [`IBotPromptSuggestions`](../interfaces/IBotPromptSuggestions.md)

Defined in: [WAProto/index.d.ts:6078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6078)

BotSuggestedPromptMetadata promptSuggestions.

#### Implementation of

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md).[`promptSuggestions`](../interfaces/IBotSuggestedPromptMetadata.md#promptsuggestions)

***

### selectedPromptId?

> `optional` **selectedPromptId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6081)

BotSuggestedPromptMetadata selectedPromptId.

#### Implementation of

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md).[`selectedPromptId`](../interfaces/IBotSuggestedPromptMetadata.md#selectedpromptid)

***

### selectedPromptIndex?

> `optional` **selectedPromptIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:6075](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6075)

BotSuggestedPromptMetadata selectedPromptIndex.

#### Implementation of

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md).[`selectedPromptIndex`](../interfaces/IBotSuggestedPromptMetadata.md#selectedpromptindex)

***

### suggestedPrompts

> **suggestedPrompts**: `string`[]

Defined in: [WAProto/index.d.ts:6072](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6072)

BotSuggestedPromptMetadata suggestedPrompts.

#### Implementation of

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md).[`suggestedPrompts`](../interfaces/IBotSuggestedPromptMetadata.md#suggestedprompts)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6151](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6151)

Converts this BotSuggestedPromptMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

Defined in: [WAProto/index.d.ts:6088](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6088)

Creates a new BotSuggestedPromptMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md)

Properties to set

#### Returns

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

Defined in: [WAProto/index.d.ts:6114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6114)

Decodes a BotSuggestedPromptMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

Defined in: [WAProto/index.d.ts:6123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6123)

Decodes a BotSuggestedPromptMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6096)

Encodes the specified BotSuggestedPromptMetadata message. Does not implicitly [verify](BotSuggestedPromptMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6104)

Encodes the specified BotSuggestedPromptMetadata message, length delimited. Does not implicitly [verify](BotSuggestedPromptMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotSuggestedPromptMetadata`](../interfaces/IBotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

Defined in: [WAProto/index.d.ts:6137](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6137)

Creates a BotSuggestedPromptMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6158)

Gets the default type url for BotSuggestedPromptMetadata

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

Defined in: [WAProto/index.d.ts:6145](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6145)

Creates a plain object from a BotSuggestedPromptMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotSuggestedPromptMetadata`](BotSuggestedPromptMetadata.md)

BotSuggestedPromptMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6130](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6130)

Verifies a BotSuggestedPromptMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
