# Class: PollVote

Defined in: [WAProto/index.d.ts:29182](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29182)

Represents a PollVote.

## Implements

- [`IPollVote`](../interfaces/IPollVote.md)

## Constructors

### new PollVote()

> **new PollVote**(`properties`?): [`PollVote`](PollVote.md)

Defined in: [WAProto/index.d.ts:29188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29188)

Constructs a new PollVote.

#### Parameters

##### properties?

[`IPollVote`](../interfaces/IPollVote.md)

Properties to set

#### Returns

[`PollVote`](PollVote.md)

## Properties

### optionName?

> `optional` **optionName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29191)

PollVote optionName.

#### Implementation of

[`IPollVote`](../interfaces/IPollVote.md).[`optionName`](../interfaces/IPollVote.md#optionname)

***

### optionVoteCount?

> `optional` **optionVoteCount**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:29194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29194)

PollVote optionVoteCount.

#### Implementation of

[`IPollVote`](../interfaces/IPollVote.md).[`optionVoteCount`](../interfaces/IPollVote.md#optionvotecount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29264)

Converts this PollVote to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollVote`](PollVote.md)

Defined in: [WAProto/index.d.ts:29201](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29201)

Creates a new PollVote instance using the specified properties.

#### Parameters

##### properties?

[`IPollVote`](../interfaces/IPollVote.md)

Properties to set

#### Returns

[`PollVote`](PollVote.md)

PollVote instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollVote`](PollVote.md)

Defined in: [WAProto/index.d.ts:29227](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29227)

Decodes a PollVote message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollVote`](PollVote.md)

PollVote

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollVote`](PollVote.md)

Defined in: [WAProto/index.d.ts:29236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29236)

Decodes a PollVote message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollVote`](PollVote.md)

PollVote

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29209](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29209)

Encodes the specified PollVote message. Does not implicitly [verify](PollVote.md#verify) messages.

#### Parameters

##### message

[`IPollVote`](../interfaces/IPollVote.md)

PollVote message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29217](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29217)

Encodes the specified PollVote message, length delimited. Does not implicitly [verify](PollVote.md#verify) messages.

#### Parameters

##### message

[`IPollVote`](../interfaces/IPollVote.md)

PollVote message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollVote`](PollVote.md)

Defined in: [WAProto/index.d.ts:29250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29250)

Creates a PollVote message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollVote`](PollVote.md)

PollVote

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29271)

Gets the default type url for PollVote

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

Defined in: [WAProto/index.d.ts:29258](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29258)

Creates a plain object from a PollVote message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollVote`](PollVote.md)

PollVote

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29243)

Verifies a PollVote message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
