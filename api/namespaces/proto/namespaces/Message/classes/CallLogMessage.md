# Class: CallLogMessage

Defined in: [WAProto/index.d.ts:19419](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19419)

Represents a CallLogMessage.

## Implements

- [`ICallLogMessage`](../interfaces/ICallLogMessage.md)

## Constructors

### new CallLogMessage()

> **new CallLogMessage**(`properties`?): [`CallLogMessage`](CallLogMessage.md)

Defined in: [WAProto/index.d.ts:19425](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19425)

Constructs a new CallLogMessage.

#### Parameters

##### properties?

[`ICallLogMessage`](../interfaces/ICallLogMessage.md)

Properties to set

#### Returns

[`CallLogMessage`](CallLogMessage.md)

## Properties

### callOutcome?

> `optional` **callOutcome**: `null` \| [`CallOutcome`](../namespaces/CallLogMessage/enumerations/CallOutcome.md)

Defined in: [WAProto/index.d.ts:19431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19431)

CallLogMessage callOutcome.

#### Implementation of

[`ICallLogMessage`](../interfaces/ICallLogMessage.md).[`callOutcome`](../interfaces/ICallLogMessage.md#calloutcome)

***

### callType?

> `optional` **callType**: `null` \| [`CallType`](../namespaces/CallLogMessage/enumerations/CallType.md)

Defined in: [WAProto/index.d.ts:19437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19437)

CallLogMessage callType.

#### Implementation of

[`ICallLogMessage`](../interfaces/ICallLogMessage.md).[`callType`](../interfaces/ICallLogMessage.md#calltype)

***

### durationSecs?

> `optional` **durationSecs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:19434](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19434)

CallLogMessage durationSecs.

#### Implementation of

[`ICallLogMessage`](../interfaces/ICallLogMessage.md).[`durationSecs`](../interfaces/ICallLogMessage.md#durationsecs)

***

### isVideo?

> `optional` **isVideo**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:19428](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19428)

CallLogMessage isVideo.

#### Implementation of

[`ICallLogMessage`](../interfaces/ICallLogMessage.md).[`isVideo`](../interfaces/ICallLogMessage.md#isvideo)

***

### participants

> **participants**: [`ICallParticipant`](../namespaces/CallLogMessage/interfaces/ICallParticipant.md)[]

Defined in: [WAProto/index.d.ts:19440](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19440)

CallLogMessage participants.

#### Implementation of

[`ICallLogMessage`](../interfaces/ICallLogMessage.md).[`participants`](../interfaces/ICallLogMessage.md#participants)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19510](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19510)

Converts this CallLogMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CallLogMessage`](CallLogMessage.md)

Defined in: [WAProto/index.d.ts:19447](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19447)

Creates a new CallLogMessage instance using the specified properties.

#### Parameters

##### properties?

[`ICallLogMessage`](../interfaces/ICallLogMessage.md)

Properties to set

#### Returns

[`CallLogMessage`](CallLogMessage.md)

CallLogMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CallLogMessage`](CallLogMessage.md)

Defined in: [WAProto/index.d.ts:19473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19473)

Decodes a CallLogMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CallLogMessage`](CallLogMessage.md)

CallLogMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CallLogMessage`](CallLogMessage.md)

Defined in: [WAProto/index.d.ts:19482](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19482)

Decodes a CallLogMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CallLogMessage`](CallLogMessage.md)

CallLogMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19455](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19455)

Encodes the specified CallLogMessage message. Does not implicitly [verify](CallLogMessage.md#verify) messages.

#### Parameters

##### message

[`ICallLogMessage`](../interfaces/ICallLogMessage.md)

CallLogMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19463](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19463)

Encodes the specified CallLogMessage message, length delimited. Does not implicitly [verify](CallLogMessage.md#verify) messages.

#### Parameters

##### message

[`ICallLogMessage`](../interfaces/ICallLogMessage.md)

CallLogMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CallLogMessage`](CallLogMessage.md)

Defined in: [WAProto/index.d.ts:19496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19496)

Creates a CallLogMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CallLogMessage`](CallLogMessage.md)

CallLogMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19517)

Gets the default type url for CallLogMessage

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

Defined in: [WAProto/index.d.ts:19504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19504)

Creates a plain object from a CallLogMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`CallLogMessage`](CallLogMessage.md)

CallLogMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19489)

Verifies a CallLogMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
