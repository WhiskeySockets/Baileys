# Class: SyncdSnapshot

Defined in: [WAProto/index.d.ts:47347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47347)

Represents a SyncdSnapshot.

## Implements

- [`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md)

## Constructors

### new SyncdSnapshot()

> **new SyncdSnapshot**(`properties`?): [`SyncdSnapshot`](SyncdSnapshot.md)

Defined in: [WAProto/index.d.ts:47353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47353)

Constructs a new SyncdSnapshot.

#### Parameters

##### properties?

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md)

Properties to set

#### Returns

[`SyncdSnapshot`](SyncdSnapshot.md)

## Properties

### keyId?

> `optional` **keyId**: `null` \| [`IKeyId`](../interfaces/IKeyId.md)

Defined in: [WAProto/index.d.ts:47365](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47365)

SyncdSnapshot keyId.

#### Implementation of

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md).[`keyId`](../interfaces/ISyncdSnapshot.md#keyid)

***

### mac?

> `optional` **mac**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:47362](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47362)

SyncdSnapshot mac.

#### Implementation of

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md).[`mac`](../interfaces/ISyncdSnapshot.md#mac)

***

### records

> **records**: [`ISyncdRecord`](../interfaces/ISyncdRecord.md)[]

Defined in: [WAProto/index.d.ts:47359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47359)

SyncdSnapshot records.

#### Implementation of

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md).[`records`](../interfaces/ISyncdSnapshot.md#records)

***

### version?

> `optional` **version**: `null` \| [`ISyncdVersion`](../interfaces/ISyncdVersion.md)

Defined in: [WAProto/index.d.ts:47356](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47356)

SyncdSnapshot version.

#### Implementation of

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md).[`version`](../interfaces/ISyncdSnapshot.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47435)

Converts this SyncdSnapshot to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdSnapshot`](SyncdSnapshot.md)

Defined in: [WAProto/index.d.ts:47372](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47372)

Creates a new SyncdSnapshot instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md)

Properties to set

#### Returns

[`SyncdSnapshot`](SyncdSnapshot.md)

SyncdSnapshot instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdSnapshot`](SyncdSnapshot.md)

Defined in: [WAProto/index.d.ts:47398](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47398)

Decodes a SyncdSnapshot message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdSnapshot`](SyncdSnapshot.md)

SyncdSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdSnapshot`](SyncdSnapshot.md)

Defined in: [WAProto/index.d.ts:47407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47407)

Decodes a SyncdSnapshot message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdSnapshot`](SyncdSnapshot.md)

SyncdSnapshot

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47380](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47380)

Encodes the specified SyncdSnapshot message. Does not implicitly [verify](SyncdSnapshot.md#verify) messages.

#### Parameters

##### message

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md)

SyncdSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47388](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47388)

Encodes the specified SyncdSnapshot message, length delimited. Does not implicitly [verify](SyncdSnapshot.md#verify) messages.

#### Parameters

##### message

[`ISyncdSnapshot`](../interfaces/ISyncdSnapshot.md)

SyncdSnapshot message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdSnapshot`](SyncdSnapshot.md)

Defined in: [WAProto/index.d.ts:47421](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47421)

Creates a SyncdSnapshot message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdSnapshot`](SyncdSnapshot.md)

SyncdSnapshot

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47442](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47442)

Gets the default type url for SyncdSnapshot

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

Defined in: [WAProto/index.d.ts:47429](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47429)

Creates a plain object from a SyncdSnapshot message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdSnapshot`](SyncdSnapshot.md)

SyncdSnapshot

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47414)

Verifies a SyncdSnapshot message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
