# Class: PollVotesSnapshot

Defined in: [WAProto/index.d.ts:34414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34414)

Represents a PollVotesSnapshot.

## Implements

- [`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md)

## Constructors

### new PollVotesSnapshot()

> **new PollVotesSnapshot**(`properties`?): [`PollVotesSnapshot`](PollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:34420](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34420)

Constructs a new PollVotesSnapshot.

#### Parameters

##### properties?

[`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md)

Properties to set

#### Returns

[`PollVotesSnapshot`](PollVotesSnapshot.md)

## Properties

### pollVotes

> **pollVotes**: [`IPollVoteSnapshot`](../interfaces/IPollVoteSnapshot.md)[]

Defined in: [WAProto/index.d.ts:34423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34423)

PollVotesSnapshot pollVotes.

#### Implementation of

[`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md).[`pollVotes`](../interfaces/IPollVotesSnapshot.md#pollvotes)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34493](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34493)

Converts this PollVotesSnapshot to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollVotesSnapshot`](PollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:34430](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34430)

Creates a new PollVotesSnapshot instance using the specified properties.

#### Parameters

##### properties?

[`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md)

Properties to set

#### Returns

[`PollVotesSnapshot`](PollVotesSnapshot.md)

PollVotesSnapshot instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollVotesSnapshot`](PollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:34456](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34456)

Decodes a PollVotesSnapshot message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollVotesSnapshot`](PollVotesSnapshot.md)

PollVotesSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollVotesSnapshot`](PollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:34465](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34465)

Decodes a PollVotesSnapshot message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollVotesSnapshot`](PollVotesSnapshot.md)

PollVotesSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34438](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34438)

Encodes the specified PollVotesSnapshot message. Does not implicitly [verify](PollVotesSnapshot.md#verify) messages.

#### Parameters

##### message

[`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md)

PollVotesSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34446](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34446)

Encodes the specified PollVotesSnapshot message, length delimited. Does not implicitly [verify](PollVotesSnapshot.md#verify) messages.

#### Parameters

##### message

[`IPollVotesSnapshot`](../interfaces/IPollVotesSnapshot.md)

PollVotesSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollVotesSnapshot`](PollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:34479](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34479)

Creates a PollVotesSnapshot message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollVotesSnapshot`](PollVotesSnapshot.md)

PollVotesSnapshot

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34500](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34500)

Gets the default type url for PollVotesSnapshot

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

Defined in: [WAProto/index.d.ts:34487](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34487)

Creates a plain object from a PollVotesSnapshot message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollVotesSnapshot`](PollVotesSnapshot.md)

PollVotesSnapshot

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34472)

Verifies a PollVotesSnapshot message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
