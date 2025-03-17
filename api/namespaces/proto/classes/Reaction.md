# Class: Reaction

Defined in: [WAProto/index.d.ts:37688](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37688)

Represents a Reaction.

## Implements

- [`IReaction`](../interfaces/IReaction.md)

## Constructors

### new Reaction()

> **new Reaction**(`properties`?): [`Reaction`](Reaction.md)

Defined in: [WAProto/index.d.ts:37694](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37694)

Constructs a new Reaction.

#### Parameters

##### properties?

[`IReaction`](../interfaces/IReaction.md)

Properties to set

#### Returns

[`Reaction`](Reaction.md)

## Properties

### groupingKey?

> `optional` **groupingKey**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37703](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37703)

Reaction groupingKey.

#### Implementation of

[`IReaction`](../interfaces/IReaction.md).[`groupingKey`](../interfaces/IReaction.md#groupingkey)

***

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:37697](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37697)

Reaction key.

#### Implementation of

[`IReaction`](../interfaces/IReaction.md).[`key`](../interfaces/IReaction.md#key)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:37706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37706)

Reaction senderTimestampMs.

#### Implementation of

[`IReaction`](../interfaces/IReaction.md).[`senderTimestampMs`](../interfaces/IReaction.md#sendertimestampms)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37700](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37700)

Reaction text.

#### Implementation of

[`IReaction`](../interfaces/IReaction.md).[`text`](../interfaces/IReaction.md#text)

***

### unread?

> `optional` **unread**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:37709](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37709)

Reaction unread.

#### Implementation of

[`IReaction`](../interfaces/IReaction.md).[`unread`](../interfaces/IReaction.md#unread)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37779)

Converts this Reaction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Reaction`](Reaction.md)

Defined in: [WAProto/index.d.ts:37716](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37716)

Creates a new Reaction instance using the specified properties.

#### Parameters

##### properties?

[`IReaction`](../interfaces/IReaction.md)

Properties to set

#### Returns

[`Reaction`](Reaction.md)

Reaction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Reaction`](Reaction.md)

Defined in: [WAProto/index.d.ts:37742](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37742)

Decodes a Reaction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Reaction`](Reaction.md)

Reaction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Reaction`](Reaction.md)

Defined in: [WAProto/index.d.ts:37751](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37751)

Decodes a Reaction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Reaction`](Reaction.md)

Reaction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37724](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37724)

Encodes the specified Reaction message. Does not implicitly [verify](Reaction.md#verify) messages.

#### Parameters

##### message

[`IReaction`](../interfaces/IReaction.md)

Reaction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37732)

Encodes the specified Reaction message, length delimited. Does not implicitly [verify](Reaction.md#verify) messages.

#### Parameters

##### message

[`IReaction`](../interfaces/IReaction.md)

Reaction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Reaction`](Reaction.md)

Defined in: [WAProto/index.d.ts:37765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37765)

Creates a Reaction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Reaction`](Reaction.md)

Reaction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37786](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37786)

Gets the default type url for Reaction

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

Defined in: [WAProto/index.d.ts:37773](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37773)

Creates a plain object from a Reaction message. Also converts values to other types if specified.

#### Parameters

##### message

[`Reaction`](Reaction.md)

Reaction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37758](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37758)

Verifies a Reaction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
