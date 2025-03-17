# Class: PollVoteSnapshot

Defined in: [WAProto/index.d.ts:34314](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34314)

Represents a PollVoteSnapshot.

## Implements

- [`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)

## Constructors

### new PollVoteSnapshot()

> **new PollVoteSnapshot**(`properties`?): [`PollVoteSnapshot`](PollVoteSnapshot.md)

Defined in: [WAProto/index.d.ts:34320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34320)

Constructs a new PollVoteSnapshot.

#### Parameters

##### properties?

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)

Properties to set

#### Returns

[`PollVoteSnapshot`](PollVoteSnapshot.md)

## Properties

### option?

> `optional` **option**: `null` \| [`IPollOption`](../interfaces/IPollOption.md)

Defined in: [WAProto/index.d.ts:34323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34323)

PollVoteSnapshot option.

#### Implementation of

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md).[`option`](../interfaces/IPollVoteSnapshot.md#option)

***

### optionVoteCount?

> `optional` **optionVoteCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:34326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34326)

PollVoteSnapshot optionVoteCount.

#### Implementation of

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md).[`optionVoteCount`](../interfaces/IPollVoteSnapshot.md#optionvotecount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34396)

Converts this PollVoteSnapshot to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollVoteSnapshot`](PollVoteSnapshot.md)

Defined in: [WAProto/index.d.ts:34333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34333)

Creates a new PollVoteSnapshot instance using the specified properties.

#### Parameters

##### properties?

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)

Properties to set

#### Returns

[`PollVoteSnapshot`](PollVoteSnapshot.md)

PollVoteSnapshot instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollVoteSnapshot`](PollVoteSnapshot.md)

Defined in: [WAProto/index.d.ts:34359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34359)

Decodes a PollVoteSnapshot message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollVoteSnapshot`](PollVoteSnapshot.md)

PollVoteSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollVoteSnapshot`](PollVoteSnapshot.md)

Defined in: [WAProto/index.d.ts:34368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34368)

Decodes a PollVoteSnapshot message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollVoteSnapshot`](PollVoteSnapshot.md)

PollVoteSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34341)

Encodes the specified PollVoteSnapshot message. Does not implicitly [verify](PollVoteSnapshot.md#verify) messages.

#### Parameters

##### message

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)

PollVoteSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34349](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34349)

Encodes the specified PollVoteSnapshot message, length delimited. Does not implicitly [verify](PollVoteSnapshot.md#verify) messages.

#### Parameters

##### message

[`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)

PollVoteSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollVoteSnapshot`](PollVoteSnapshot.md)

Defined in: [WAProto/index.d.ts:34382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34382)

Creates a PollVoteSnapshot message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollVoteSnapshot`](PollVoteSnapshot.md)

PollVoteSnapshot

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34403](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34403)

Gets the default type url for PollVoteSnapshot

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

Defined in: [WAProto/index.d.ts:34390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34390)

Creates a plain object from a PollVoteSnapshot message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollVoteSnapshot`](PollVoteSnapshot.md)

PollVoteSnapshot

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34375)

Verifies a PollVoteSnapshot message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
