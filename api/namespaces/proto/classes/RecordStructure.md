# Class: RecordStructure

Defined in: [WAProto/index.d.ts:37903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37903)

Represents a RecordStructure.

## Implements

- [`IRecordStructure`](../interfaces/IRecordStructure.md)

## Constructors

### new RecordStructure()

> **new RecordStructure**(`properties`?): [`RecordStructure`](RecordStructure.md)

Defined in: [WAProto/index.d.ts:37909](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37909)

Constructs a new RecordStructure.

#### Parameters

##### properties?

[`IRecordStructure`](../interfaces/IRecordStructure.md)

Properties to set

#### Returns

[`RecordStructure`](RecordStructure.md)

## Properties

### currentSession?

> `optional` **currentSession**: `null` \| [`ISessionStructure`](../interfaces/ISessionStructure.md)

Defined in: [WAProto/index.d.ts:37912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37912)

RecordStructure currentSession.

#### Implementation of

[`IRecordStructure`](../interfaces/IRecordStructure.md).[`currentSession`](../interfaces/IRecordStructure.md#currentsession)

***

### previousSessions

> **previousSessions**: [`ISessionStructure`](../interfaces/ISessionStructure.md)[]

Defined in: [WAProto/index.d.ts:37915](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37915)

RecordStructure previousSessions.

#### Implementation of

[`IRecordStructure`](../interfaces/IRecordStructure.md).[`previousSessions`](../interfaces/IRecordStructure.md#previoussessions)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37985](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37985)

Converts this RecordStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RecordStructure`](RecordStructure.md)

Defined in: [WAProto/index.d.ts:37922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37922)

Creates a new RecordStructure instance using the specified properties.

#### Parameters

##### properties?

[`IRecordStructure`](../interfaces/IRecordStructure.md)

Properties to set

#### Returns

[`RecordStructure`](RecordStructure.md)

RecordStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RecordStructure`](RecordStructure.md)

Defined in: [WAProto/index.d.ts:37948](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37948)

Decodes a RecordStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RecordStructure`](RecordStructure.md)

RecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RecordStructure`](RecordStructure.md)

Defined in: [WAProto/index.d.ts:37957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37957)

Decodes a RecordStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RecordStructure`](RecordStructure.md)

RecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37930)

Encodes the specified RecordStructure message. Does not implicitly [verify](RecordStructure.md#verify) messages.

#### Parameters

##### message

[`IRecordStructure`](../interfaces/IRecordStructure.md)

RecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37938)

Encodes the specified RecordStructure message, length delimited. Does not implicitly [verify](RecordStructure.md#verify) messages.

#### Parameters

##### message

[`IRecordStructure`](../interfaces/IRecordStructure.md)

RecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RecordStructure`](RecordStructure.md)

Defined in: [WAProto/index.d.ts:37971](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37971)

Creates a RecordStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RecordStructure`](RecordStructure.md)

RecordStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37992](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37992)

Gets the default type url for RecordStructure

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

Defined in: [WAProto/index.d.ts:37979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37979)

Creates a plain object from a RecordStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`RecordStructure`](RecordStructure.md)

RecordStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37964)

Verifies a RecordStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
