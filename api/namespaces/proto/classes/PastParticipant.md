# Class: PastParticipant

Defined in: [WAProto/index.d.ts:35199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35199)

Represents a PastParticipant.

## Implements

- [`IPastParticipant`](../interfaces/IPastParticipant.md)

## Constructors

### new PastParticipant()

> **new PastParticipant**(`properties`?): [`PastParticipant`](PastParticipant.md)

Defined in: [WAProto/index.d.ts:35205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35205)

Constructs a new PastParticipant.

#### Parameters

##### properties?

[`IPastParticipant`](../interfaces/IPastParticipant.md)

Properties to set

#### Returns

[`PastParticipant`](PastParticipant.md)

## Properties

### leaveReason?

> `optional` **leaveReason**: `null` \| [`LeaveReason`](../namespaces/PastParticipant/enumerations/LeaveReason.md)

Defined in: [WAProto/index.d.ts:35211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35211)

PastParticipant leaveReason.

#### Implementation of

[`IPastParticipant`](../interfaces/IPastParticipant.md).[`leaveReason`](../interfaces/IPastParticipant.md#leavereason)

***

### leaveTs?

> `optional` **leaveTs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:35214](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35214)

PastParticipant leaveTs.

#### Implementation of

[`IPastParticipant`](../interfaces/IPastParticipant.md).[`leaveTs`](../interfaces/IPastParticipant.md#leavets)

***

### userJid?

> `optional` **userJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:35208](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35208)

PastParticipant userJid.

#### Implementation of

[`IPastParticipant`](../interfaces/IPastParticipant.md).[`userJid`](../interfaces/IPastParticipant.md#userjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:35284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35284)

Converts this PastParticipant to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PastParticipant`](PastParticipant.md)

Defined in: [WAProto/index.d.ts:35221](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35221)

Creates a new PastParticipant instance using the specified properties.

#### Parameters

##### properties?

[`IPastParticipant`](../interfaces/IPastParticipant.md)

Properties to set

#### Returns

[`PastParticipant`](PastParticipant.md)

PastParticipant instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PastParticipant`](PastParticipant.md)

Defined in: [WAProto/index.d.ts:35247](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35247)

Decodes a PastParticipant message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PastParticipant`](PastParticipant.md)

PastParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PastParticipant`](PastParticipant.md)

Defined in: [WAProto/index.d.ts:35256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35256)

Decodes a PastParticipant message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PastParticipant`](PastParticipant.md)

PastParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35229)

Encodes the specified PastParticipant message. Does not implicitly [verify](PastParticipant.md#verify) messages.

#### Parameters

##### message

[`IPastParticipant`](../interfaces/IPastParticipant.md)

PastParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35237)

Encodes the specified PastParticipant message, length delimited. Does not implicitly [verify](PastParticipant.md#verify) messages.

#### Parameters

##### message

[`IPastParticipant`](../interfaces/IPastParticipant.md)

PastParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PastParticipant`](PastParticipant.md)

Defined in: [WAProto/index.d.ts:35270](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35270)

Creates a PastParticipant message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PastParticipant`](PastParticipant.md)

PastParticipant

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:35291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35291)

Gets the default type url for PastParticipant

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

Defined in: [WAProto/index.d.ts:35278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35278)

Creates a plain object from a PastParticipant message. Also converts values to other types if specified.

#### Parameters

##### message

[`PastParticipant`](PastParticipant.md)

PastParticipant

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:35263](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35263)

Verifies a PastParticipant message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
