# Class: BotFeedbackMessage

Defined in: [WAProto/index.d.ts:18505](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18505)

Represents a BotFeedbackMessage.

## Implements

- [`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

## Constructors

### new BotFeedbackMessage()

> **new BotFeedbackMessage**(`properties`?): [`BotFeedbackMessage`](BotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:18511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18511)

Constructs a new BotFeedbackMessage.

#### Parameters

##### properties?

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

Properties to set

#### Returns

[`BotFeedbackMessage`](BotFeedbackMessage.md)

## Properties

### kind?

> `optional` **kind**: `null` \| [`BotFeedbackKind`](../namespaces/BotFeedbackMessage/enumerations/BotFeedbackKind.md)

Defined in: [WAProto/index.d.ts:18517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18517)

BotFeedbackMessage kind.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`kind`](../interfaces/IBotFeedbackMessage.md#kind)

***

### kindNegative?

> `optional` **kindNegative**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:18523](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18523)

BotFeedbackMessage kindNegative.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`kindNegative`](../interfaces/IBotFeedbackMessage.md#kindnegative)

***

### kindPositive?

> `optional` **kindPositive**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:18526](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18526)

BotFeedbackMessage kindPositive.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`kindPositive`](../interfaces/IBotFeedbackMessage.md#kindpositive)

***

### kindReport?

> `optional` **kindReport**: `null` \| [`GENERIC`](../namespaces/BotFeedbackMessage/enumerations/ReportKind.md#generic)

Defined in: [WAProto/index.d.ts:18529](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18529)

BotFeedbackMessage kindReport.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`kindReport`](../interfaces/IBotFeedbackMessage.md#kindreport)

***

### messageKey?

> `optional` **messageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:18514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18514)

BotFeedbackMessage messageKey.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`messageKey`](../interfaces/IBotFeedbackMessage.md#messagekey)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18520)

BotFeedbackMessage text.

#### Implementation of

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md).[`text`](../interfaces/IBotFeedbackMessage.md#text)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18599)

Converts this BotFeedbackMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotFeedbackMessage`](BotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:18536](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18536)

Creates a new BotFeedbackMessage instance using the specified properties.

#### Parameters

##### properties?

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

Properties to set

#### Returns

[`BotFeedbackMessage`](BotFeedbackMessage.md)

BotFeedbackMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotFeedbackMessage`](BotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:18562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18562)

Decodes a BotFeedbackMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotFeedbackMessage`](BotFeedbackMessage.md)

BotFeedbackMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotFeedbackMessage`](BotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:18571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18571)

Decodes a BotFeedbackMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotFeedbackMessage`](BotFeedbackMessage.md)

BotFeedbackMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18544](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18544)

Encodes the specified BotFeedbackMessage message. Does not implicitly [verify](BotFeedbackMessage.md#verify) messages.

#### Parameters

##### message

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

BotFeedbackMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18552](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18552)

Encodes the specified BotFeedbackMessage message, length delimited. Does not implicitly [verify](BotFeedbackMessage.md#verify) messages.

#### Parameters

##### message

[`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

BotFeedbackMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotFeedbackMessage`](BotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:18585](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18585)

Creates a BotFeedbackMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotFeedbackMessage`](BotFeedbackMessage.md)

BotFeedbackMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18606)

Gets the default type url for BotFeedbackMessage

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

Defined in: [WAProto/index.d.ts:18593](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18593)

Creates a plain object from a BotFeedbackMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotFeedbackMessage`](BotFeedbackMessage.md)

BotFeedbackMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18578)

Verifies a BotFeedbackMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
