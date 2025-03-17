# Class: CompanionCommitment

Defined in: [WAProto/index.d.ts:9085](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9085)

Represents a CompanionCommitment.

## Implements

- [`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

## Constructors

### new CompanionCommitment()

> **new CompanionCommitment**(`properties`?): [`CompanionCommitment`](CompanionCommitment.md)

Defined in: [WAProto/index.d.ts:9091](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9091)

Constructs a new CompanionCommitment.

#### Parameters

##### properties?

[`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

Properties to set

#### Returns

[`CompanionCommitment`](CompanionCommitment.md)

## Properties

### hash?

> `optional` **hash**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:9094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9094)

CompanionCommitment hash.

#### Implementation of

[`ICompanionCommitment`](../interfaces/ICompanionCommitment.md).[`hash`](../interfaces/ICompanionCommitment.md#hash)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9164)

Converts this CompanionCommitment to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CompanionCommitment`](CompanionCommitment.md)

Defined in: [WAProto/index.d.ts:9101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9101)

Creates a new CompanionCommitment instance using the specified properties.

#### Parameters

##### properties?

[`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

Properties to set

#### Returns

[`CompanionCommitment`](CompanionCommitment.md)

CompanionCommitment instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CompanionCommitment`](CompanionCommitment.md)

Defined in: [WAProto/index.d.ts:9127](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9127)

Decodes a CompanionCommitment message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CompanionCommitment`](CompanionCommitment.md)

CompanionCommitment

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CompanionCommitment`](CompanionCommitment.md)

Defined in: [WAProto/index.d.ts:9136](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9136)

Decodes a CompanionCommitment message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CompanionCommitment`](CompanionCommitment.md)

CompanionCommitment

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9109](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9109)

Encodes the specified CompanionCommitment message. Does not implicitly [verify](CompanionCommitment.md#verify) messages.

#### Parameters

##### message

[`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

CompanionCommitment message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9117)

Encodes the specified CompanionCommitment message, length delimited. Does not implicitly [verify](CompanionCommitment.md#verify) messages.

#### Parameters

##### message

[`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

CompanionCommitment message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CompanionCommitment`](CompanionCommitment.md)

Defined in: [WAProto/index.d.ts:9150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9150)

Creates a CompanionCommitment message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CompanionCommitment`](CompanionCommitment.md)

CompanionCommitment

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9171)

Gets the default type url for CompanionCommitment

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

Defined in: [WAProto/index.d.ts:9158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9158)

Creates a plain object from a CompanionCommitment message. Also converts values to other types if specified.

#### Parameters

##### message

[`CompanionCommitment`](CompanionCommitment.md)

CompanionCommitment

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9143](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9143)

Verifies a CompanionCommitment message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
