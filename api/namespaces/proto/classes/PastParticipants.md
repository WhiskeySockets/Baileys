# Class: PastParticipants

Defined in: [WAProto/index.d.ts:35314](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35314)

Represents a PastParticipants.

## Implements

- [`IPastParticipants`](../interfaces/IPastParticipants.md)

## Constructors

### new PastParticipants()

> **new PastParticipants**(`properties`?): [`PastParticipants`](PastParticipants.md)

Defined in: [WAProto/index.d.ts:35320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35320)

Constructs a new PastParticipants.

#### Parameters

##### properties?

[`IPastParticipants`](../interfaces/IPastParticipants.md)

Properties to set

#### Returns

[`PastParticipants`](PastParticipants.md)

## Properties

### groupJid?

> `optional` **groupJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:35323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35323)

PastParticipants groupJid.

#### Implementation of

[`IPastParticipants`](../interfaces/IPastParticipants.md).[`groupJid`](../interfaces/IPastParticipants.md#groupjid)

***

### pastParticipants

> **pastParticipants**: [`IPastParticipant`](../interfaces/IPastParticipant.md)[]

Defined in: [WAProto/index.d.ts:35326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35326)

PastParticipants pastParticipants.

#### Implementation of

[`IPastParticipants`](../interfaces/IPastParticipants.md).[`pastParticipants`](../interfaces/IPastParticipants.md#pastparticipants)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:35396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35396)

Converts this PastParticipants to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PastParticipants`](PastParticipants.md)

Defined in: [WAProto/index.d.ts:35333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35333)

Creates a new PastParticipants instance using the specified properties.

#### Parameters

##### properties?

[`IPastParticipants`](../interfaces/IPastParticipants.md)

Properties to set

#### Returns

[`PastParticipants`](PastParticipants.md)

PastParticipants instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PastParticipants`](PastParticipants.md)

Defined in: [WAProto/index.d.ts:35359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35359)

Decodes a PastParticipants message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PastParticipants`](PastParticipants.md)

PastParticipants

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PastParticipants`](PastParticipants.md)

Defined in: [WAProto/index.d.ts:35368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35368)

Decodes a PastParticipants message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PastParticipants`](PastParticipants.md)

PastParticipants

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35341)

Encodes the specified PastParticipants message. Does not implicitly [verify](PastParticipants.md#verify) messages.

#### Parameters

##### message

[`IPastParticipants`](../interfaces/IPastParticipants.md)

PastParticipants message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35349](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35349)

Encodes the specified PastParticipants message, length delimited. Does not implicitly [verify](PastParticipants.md#verify) messages.

#### Parameters

##### message

[`IPastParticipants`](../interfaces/IPastParticipants.md)

PastParticipants message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PastParticipants`](PastParticipants.md)

Defined in: [WAProto/index.d.ts:35382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35382)

Creates a PastParticipants message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PastParticipants`](PastParticipants.md)

PastParticipants

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:35403](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35403)

Gets the default type url for PastParticipants

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

Defined in: [WAProto/index.d.ts:35390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35390)

Creates a plain object from a PastParticipants message. Also converts values to other types if specified.

#### Parameters

##### message

[`PastParticipants`](PastParticipants.md)

PastParticipants

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:35375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35375)

Verifies a PastParticipants message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
