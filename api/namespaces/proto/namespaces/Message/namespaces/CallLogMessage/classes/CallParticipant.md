# Class: CallParticipant

Defined in: [WAProto/index.d.ts:19545](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19545)

Represents a CallParticipant.

## Implements

- [`ICallParticipant`](../interfaces/ICallParticipant.md)

## Constructors

### new CallParticipant()

> **new CallParticipant**(`properties`?): [`CallParticipant`](CallParticipant.md)

Defined in: [WAProto/index.d.ts:19551](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19551)

Constructs a new CallParticipant.

#### Parameters

##### properties?

[`ICallParticipant`](../interfaces/ICallParticipant.md)

Properties to set

#### Returns

[`CallParticipant`](CallParticipant.md)

## Properties

### callOutcome?

> `optional` **callOutcome**: `null` \| [`CallOutcome`](../enumerations/CallOutcome.md)

Defined in: [WAProto/index.d.ts:19557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19557)

CallParticipant callOutcome.

#### Implementation of

[`ICallParticipant`](../interfaces/ICallParticipant.md).[`callOutcome`](../interfaces/ICallParticipant.md#calloutcome)

***

### jid?

> `optional` **jid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19554](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19554)

CallParticipant jid.

#### Implementation of

[`ICallParticipant`](../interfaces/ICallParticipant.md).[`jid`](../interfaces/ICallParticipant.md#jid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19627)

Converts this CallParticipant to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CallParticipant`](CallParticipant.md)

Defined in: [WAProto/index.d.ts:19564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19564)

Creates a new CallParticipant instance using the specified properties.

#### Parameters

##### properties?

[`ICallParticipant`](../interfaces/ICallParticipant.md)

Properties to set

#### Returns

[`CallParticipant`](CallParticipant.md)

CallParticipant instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CallParticipant`](CallParticipant.md)

Defined in: [WAProto/index.d.ts:19590](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19590)

Decodes a CallParticipant message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CallParticipant`](CallParticipant.md)

CallParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CallParticipant`](CallParticipant.md)

Defined in: [WAProto/index.d.ts:19599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19599)

Decodes a CallParticipant message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CallParticipant`](CallParticipant.md)

CallParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19572](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19572)

Encodes the specified CallParticipant message. Does not implicitly [verify](CallParticipant.md#verify) messages.

#### Parameters

##### message

[`ICallParticipant`](../interfaces/ICallParticipant.md)

CallParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19580](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19580)

Encodes the specified CallParticipant message, length delimited. Does not implicitly [verify](CallParticipant.md#verify) messages.

#### Parameters

##### message

[`ICallParticipant`](../interfaces/ICallParticipant.md)

CallParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CallParticipant`](CallParticipant.md)

Defined in: [WAProto/index.d.ts:19613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19613)

Creates a CallParticipant message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CallParticipant`](CallParticipant.md)

CallParticipant

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19634](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19634)

Gets the default type url for CallParticipant

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

Defined in: [WAProto/index.d.ts:19621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19621)

Creates a plain object from a CallParticipant message. Also converts values to other types if specified.

#### Parameters

##### message

[`CallParticipant`](CallParticipant.md)

CallParticipant

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19606)

Verifies a CallParticipant message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
