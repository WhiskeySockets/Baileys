# Class: SenderKeyRecordStructure

Defined in: [WAProto/index.d.ts:38439](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38439)

Represents a SenderKeyRecordStructure.

## Implements

- [`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md)

## Constructors

### new SenderKeyRecordStructure()

> **new SenderKeyRecordStructure**(`properties`?): [`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:38445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38445)

Constructs a new SenderKeyRecordStructure.

#### Parameters

##### properties?

[`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md)

Properties to set

#### Returns

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

## Properties

### senderKeyStates

> **senderKeyStates**: [`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)[]

Defined in: [WAProto/index.d.ts:38448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38448)

SenderKeyRecordStructure senderKeyStates.

#### Implementation of

[`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md).[`senderKeyStates`](../interfaces/ISenderKeyRecordStructure.md#senderkeystates)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38518](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38518)

Converts this SenderKeyRecordStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:38455](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38455)

Creates a new SenderKeyRecordStructure instance using the specified properties.

#### Parameters

##### properties?

[`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md)

Properties to set

#### Returns

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

SenderKeyRecordStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:38481](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38481)

Decodes a SenderKeyRecordStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

SenderKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:38490](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38490)

Decodes a SenderKeyRecordStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

SenderKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38463](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38463)

Encodes the specified SenderKeyRecordStructure message. Does not implicitly [verify](SenderKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md)

SenderKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38471](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38471)

Encodes the specified SenderKeyRecordStructure message, length delimited. Does not implicitly [verify](SenderKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyRecordStructure`](../interfaces/ISenderKeyRecordStructure.md)

SenderKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:38504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38504)

Creates a SenderKeyRecordStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

SenderKeyRecordStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38525](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38525)

Gets the default type url for SenderKeyRecordStructure

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

Defined in: [WAProto/index.d.ts:38512](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38512)

Creates a plain object from a SenderKeyRecordStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderKeyRecordStructure`](SenderKeyRecordStructure.md)

SenderKeyRecordStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38497](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38497)

Verifies a SenderKeyRecordStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
