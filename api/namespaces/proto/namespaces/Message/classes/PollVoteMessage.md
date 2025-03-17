# Class: PollVoteMessage

Defined in: [WAProto/index.d.ts:29489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29489)

Represents a PollVoteMessage.

## Implements

- [`IPollVoteMessage`](../interfaces/IPollVoteMessage.md)

## Constructors

### new PollVoteMessage()

> **new PollVoteMessage**(`properties`?): [`PollVoteMessage`](PollVoteMessage.md)

Defined in: [WAProto/index.d.ts:29495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29495)

Constructs a new PollVoteMessage.

#### Parameters

##### properties?

[`IPollVoteMessage`](../interfaces/IPollVoteMessage.md)

Properties to set

#### Returns

[`PollVoteMessage`](PollVoteMessage.md)

## Properties

### selectedOptions

> **selectedOptions**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [WAProto/index.d.ts:29498](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29498)

PollVoteMessage selectedOptions.

#### Implementation of

[`IPollVoteMessage`](../interfaces/IPollVoteMessage.md).[`selectedOptions`](../interfaces/IPollVoteMessage.md#selectedoptions)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29568](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29568)

Converts this PollVoteMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollVoteMessage`](PollVoteMessage.md)

Defined in: [WAProto/index.d.ts:29505](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29505)

Creates a new PollVoteMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPollVoteMessage`](../interfaces/IPollVoteMessage.md)

Properties to set

#### Returns

[`PollVoteMessage`](PollVoteMessage.md)

PollVoteMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollVoteMessage`](PollVoteMessage.md)

Defined in: [WAProto/index.d.ts:29531](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29531)

Decodes a PollVoteMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollVoteMessage`](PollVoteMessage.md)

PollVoteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollVoteMessage`](PollVoteMessage.md)

Defined in: [WAProto/index.d.ts:29540](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29540)

Decodes a PollVoteMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollVoteMessage`](PollVoteMessage.md)

PollVoteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29513](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29513)

Encodes the specified PollVoteMessage message. Does not implicitly [verify](PollVoteMessage.md#verify) messages.

#### Parameters

##### message

[`IPollVoteMessage`](../interfaces/IPollVoteMessage.md)

PollVoteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29521](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29521)

Encodes the specified PollVoteMessage message, length delimited. Does not implicitly [verify](PollVoteMessage.md#verify) messages.

#### Parameters

##### message

[`IPollVoteMessage`](../interfaces/IPollVoteMessage.md)

PollVoteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollVoteMessage`](PollVoteMessage.md)

Defined in: [WAProto/index.d.ts:29554](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29554)

Creates a PollVoteMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollVoteMessage`](PollVoteMessage.md)

PollVoteMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29575](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29575)

Gets the default type url for PollVoteMessage

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

Defined in: [WAProto/index.d.ts:29562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29562)

Creates a plain object from a PollVoteMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollVoteMessage`](PollVoteMessage.md)

PollVoteMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29547)

Verifies a PollVoteMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
