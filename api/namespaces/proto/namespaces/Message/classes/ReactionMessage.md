# Class: ReactionMessage

Defined in: [WAProto/index.d.ts:30244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30244)

Represents a ReactionMessage.

## Implements

- [`IReactionMessage`](../interfaces/IReactionMessage.md)

## Constructors

### new ReactionMessage()

> **new ReactionMessage**(`properties`?): [`ReactionMessage`](ReactionMessage.md)

Defined in: [WAProto/index.d.ts:30250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30250)

Constructs a new ReactionMessage.

#### Parameters

##### properties?

[`IReactionMessage`](../interfaces/IReactionMessage.md)

Properties to set

#### Returns

[`ReactionMessage`](ReactionMessage.md)

## Properties

### groupingKey?

> `optional` **groupingKey**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30259)

ReactionMessage groupingKey.

#### Implementation of

[`IReactionMessage`](../interfaces/IReactionMessage.md).[`groupingKey`](../interfaces/IReactionMessage.md#groupingkey)

***

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:30253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30253)

ReactionMessage key.

#### Implementation of

[`IReactionMessage`](../interfaces/IReactionMessage.md).[`key`](../interfaces/IReactionMessage.md#key)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30262](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30262)

ReactionMessage senderTimestampMs.

#### Implementation of

[`IReactionMessage`](../interfaces/IReactionMessage.md).[`senderTimestampMs`](../interfaces/IReactionMessage.md#sendertimestampms)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30256)

ReactionMessage text.

#### Implementation of

[`IReactionMessage`](../interfaces/IReactionMessage.md).[`text`](../interfaces/IReactionMessage.md#text)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30332](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30332)

Converts this ReactionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ReactionMessage`](ReactionMessage.md)

Defined in: [WAProto/index.d.ts:30269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30269)

Creates a new ReactionMessage instance using the specified properties.

#### Parameters

##### properties?

[`IReactionMessage`](../interfaces/IReactionMessage.md)

Properties to set

#### Returns

[`ReactionMessage`](ReactionMessage.md)

ReactionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ReactionMessage`](ReactionMessage.md)

Defined in: [WAProto/index.d.ts:30295](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30295)

Decodes a ReactionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ReactionMessage`](ReactionMessage.md)

ReactionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ReactionMessage`](ReactionMessage.md)

Defined in: [WAProto/index.d.ts:30304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30304)

Decodes a ReactionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ReactionMessage`](ReactionMessage.md)

ReactionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30277)

Encodes the specified ReactionMessage message. Does not implicitly [verify](ReactionMessage.md#verify) messages.

#### Parameters

##### message

[`IReactionMessage`](../interfaces/IReactionMessage.md)

ReactionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30285)

Encodes the specified ReactionMessage message, length delimited. Does not implicitly [verify](ReactionMessage.md#verify) messages.

#### Parameters

##### message

[`IReactionMessage`](../interfaces/IReactionMessage.md)

ReactionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ReactionMessage`](ReactionMessage.md)

Defined in: [WAProto/index.d.ts:30318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30318)

Creates a ReactionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ReactionMessage`](ReactionMessage.md)

ReactionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30339](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30339)

Gets the default type url for ReactionMessage

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

Defined in: [WAProto/index.d.ts:30326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30326)

Creates a plain object from a ReactionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ReactionMessage`](ReactionMessage.md)

ReactionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30311)

Verifies a ReactionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
