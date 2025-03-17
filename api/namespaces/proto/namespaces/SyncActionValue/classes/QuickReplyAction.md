# Class: QuickReplyAction

Defined in: [WAProto/index.d.ts:45090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45090)

Represents a QuickReplyAction.

## Implements

- [`IQuickReplyAction`](../interfaces/IQuickReplyAction.md)

## Constructors

### new QuickReplyAction()

> **new QuickReplyAction**(`properties`?): [`QuickReplyAction`](QuickReplyAction.md)

Defined in: [WAProto/index.d.ts:45096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45096)

Constructs a new QuickReplyAction.

#### Parameters

##### properties?

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md)

Properties to set

#### Returns

[`QuickReplyAction`](QuickReplyAction.md)

## Properties

### count?

> `optional` **count**: `null` \| `number`

Defined in: [WAProto/index.d.ts:45108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45108)

QuickReplyAction count.

#### Implementation of

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md).[`count`](../interfaces/IQuickReplyAction.md#count)

***

### deleted?

> `optional` **deleted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:45111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45111)

QuickReplyAction deleted.

#### Implementation of

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md).[`deleted`](../interfaces/IQuickReplyAction.md#deleted)

***

### keywords

> **keywords**: `string`[]

Defined in: [WAProto/index.d.ts:45105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45105)

QuickReplyAction keywords.

#### Implementation of

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md).[`keywords`](../interfaces/IQuickReplyAction.md#keywords)

***

### message?

> `optional` **message**: `null` \| `string`

Defined in: [WAProto/index.d.ts:45102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45102)

QuickReplyAction message.

#### Implementation of

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md).[`message`](../interfaces/IQuickReplyAction.md#message)

***

### shortcut?

> `optional` **shortcut**: `null` \| `string`

Defined in: [WAProto/index.d.ts:45099](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45099)

QuickReplyAction shortcut.

#### Implementation of

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md).[`shortcut`](../interfaces/IQuickReplyAction.md#shortcut)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45181)

Converts this QuickReplyAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`QuickReplyAction`](QuickReplyAction.md)

Defined in: [WAProto/index.d.ts:45118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45118)

Creates a new QuickReplyAction instance using the specified properties.

#### Parameters

##### properties?

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md)

Properties to set

#### Returns

[`QuickReplyAction`](QuickReplyAction.md)

QuickReplyAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`QuickReplyAction`](QuickReplyAction.md)

Defined in: [WAProto/index.d.ts:45144](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45144)

Decodes a QuickReplyAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`QuickReplyAction`](QuickReplyAction.md)

QuickReplyAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`QuickReplyAction`](QuickReplyAction.md)

Defined in: [WAProto/index.d.ts:45153](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45153)

Decodes a QuickReplyAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`QuickReplyAction`](QuickReplyAction.md)

QuickReplyAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45126)

Encodes the specified QuickReplyAction message. Does not implicitly [verify](QuickReplyAction.md#verify) messages.

#### Parameters

##### message

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md)

QuickReplyAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45134](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45134)

Encodes the specified QuickReplyAction message, length delimited. Does not implicitly [verify](QuickReplyAction.md#verify) messages.

#### Parameters

##### message

[`IQuickReplyAction`](../interfaces/IQuickReplyAction.md)

QuickReplyAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`QuickReplyAction`](QuickReplyAction.md)

Defined in: [WAProto/index.d.ts:45167](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45167)

Creates a QuickReplyAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`QuickReplyAction`](QuickReplyAction.md)

QuickReplyAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45188)

Gets the default type url for QuickReplyAction

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

Defined in: [WAProto/index.d.ts:45175](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45175)

Creates a plain object from a QuickReplyAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`QuickReplyAction`](QuickReplyAction.md)

QuickReplyAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45160](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45160)

Verifies a QuickReplyAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
