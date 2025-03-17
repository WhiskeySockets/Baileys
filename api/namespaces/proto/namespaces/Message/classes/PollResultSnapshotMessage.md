# Class: PollResultSnapshotMessage

Defined in: [WAProto/index.d.ts:29074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29074)

Represents a PollResultSnapshotMessage.

## Implements

- [`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md)

## Constructors

### new PollResultSnapshotMessage()

> **new PollResultSnapshotMessage**(`properties`?): [`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:29080](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29080)

Constructs a new PollResultSnapshotMessage.

#### Parameters

##### properties?

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md)

Properties to set

#### Returns

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:29089](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29089)

PollResultSnapshotMessage contextInfo.

#### Implementation of

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md).[`contextInfo`](../interfaces/IPollResultSnapshotMessage.md#contextinfo)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:29083](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29083)

PollResultSnapshotMessage name.

#### Implementation of

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md).[`name`](../interfaces/IPollResultSnapshotMessage.md#name)

***

### pollVotes

> **pollVotes**: [`IPollVote`](../namespaces/PollResultSnapshotMessage/interfaces/IPollVote.md)[]

Defined in: [WAProto/index.d.ts:29086](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29086)

PollResultSnapshotMessage pollVotes.

#### Implementation of

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md).[`pollVotes`](../interfaces/IPollResultSnapshotMessage.md#pollvotes)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29159)

Converts this PollResultSnapshotMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:29096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29096)

Creates a new PollResultSnapshotMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md)

Properties to set

#### Returns

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

PollResultSnapshotMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:29122](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29122)

Decodes a PollResultSnapshotMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

PollResultSnapshotMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:29131](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29131)

Decodes a PollResultSnapshotMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

PollResultSnapshotMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29104)

Encodes the specified PollResultSnapshotMessage message. Does not implicitly [verify](PollResultSnapshotMessage.md#verify) messages.

#### Parameters

##### message

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md)

PollResultSnapshotMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29112)

Encodes the specified PollResultSnapshotMessage message, length delimited. Does not implicitly [verify](PollResultSnapshotMessage.md#verify) messages.

#### Parameters

##### message

[`IPollResultSnapshotMessage`](../interfaces/IPollResultSnapshotMessage.md)

PollResultSnapshotMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:29145](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29145)

Creates a PollResultSnapshotMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

PollResultSnapshotMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29166)

Gets the default type url for PollResultSnapshotMessage

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

Defined in: [WAProto/index.d.ts:29153](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29153)

Creates a plain object from a PollResultSnapshotMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollResultSnapshotMessage`](PollResultSnapshotMessage.md)

PollResultSnapshotMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29138)

Verifies a PollResultSnapshotMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
