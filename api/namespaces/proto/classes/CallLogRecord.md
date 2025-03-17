# Class: CallLogRecord

Defined in: [WAProto/index.d.ts:6211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6211)

Represents a CallLogRecord.

## Implements

- [`ICallLogRecord`](../interfaces/ICallLogRecord.md)

## Constructors

### new CallLogRecord()

> **new CallLogRecord**(`properties`?): [`CallLogRecord`](CallLogRecord.md)

Defined in: [WAProto/index.d.ts:6217](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6217)

Constructs a new CallLogRecord.

#### Parameters

##### properties?

[`ICallLogRecord`](../interfaces/ICallLogRecord.md)

Properties to set

#### Returns

[`CallLogRecord`](CallLogRecord.md)

## Properties

### callCreatorJid?

> `optional` **callCreatorJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6253)

CallLogRecord callCreatorJid.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`callCreatorJid`](../interfaces/ICallLogRecord.md#callcreatorjid)

***

### callId?

> `optional` **callId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6250)

CallLogRecord callId.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`callId`](../interfaces/ICallLogRecord.md#callid)

***

### callLinkToken?

> `optional` **callLinkToken**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6244)

CallLogRecord callLinkToken.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`callLinkToken`](../interfaces/ICallLogRecord.md#calllinktoken)

***

### callResult?

> `optional` **callResult**: `null` \| [`CallResult`](../namespaces/CallLogRecord/enumerations/CallResult.md)

Defined in: [WAProto/index.d.ts:6220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6220)

CallLogRecord callResult.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`callResult`](../interfaces/ICallLogRecord.md#callresult)

***

### callType?

> `optional` **callType**: `null` \| [`CallType`](../namespaces/CallLogRecord/enumerations/CallType.md)

Defined in: [WAProto/index.d.ts:6262](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6262)

CallLogRecord callType.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`callType`](../interfaces/ICallLogRecord.md#calltype)

***

### duration?

> `optional` **duration**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:6229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6229)

CallLogRecord duration.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`duration`](../interfaces/ICallLogRecord.md#duration)

***

### groupJid?

> `optional` **groupJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6256)

CallLogRecord groupJid.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`groupJid`](../interfaces/ICallLogRecord.md#groupjid)

***

### isCallLink?

> `optional` **isCallLink**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:6241](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6241)

CallLogRecord isCallLink.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`isCallLink`](../interfaces/ICallLogRecord.md#iscalllink)

***

### isDndMode?

> `optional` **isDndMode**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:6223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6223)

CallLogRecord isDndMode.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`isDndMode`](../interfaces/ICallLogRecord.md#isdndmode)

***

### isIncoming?

> `optional` **isIncoming**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:6235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6235)

CallLogRecord isIncoming.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`isIncoming`](../interfaces/ICallLogRecord.md#isincoming)

***

### isVideo?

> `optional` **isVideo**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:6238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6238)

CallLogRecord isVideo.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`isVideo`](../interfaces/ICallLogRecord.md#isvideo)

***

### participants

> **participants**: [`IParticipantInfo`](../namespaces/CallLogRecord/interfaces/IParticipantInfo.md)[]

Defined in: [WAProto/index.d.ts:6259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6259)

CallLogRecord participants.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`participants`](../interfaces/ICallLogRecord.md#participants)

***

### scheduledCallId?

> `optional` **scheduledCallId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6247](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6247)

CallLogRecord scheduledCallId.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`scheduledCallId`](../interfaces/ICallLogRecord.md#scheduledcallid)

***

### silenceReason?

> `optional` **silenceReason**: `null` \| [`SilenceReason`](../namespaces/CallLogRecord/enumerations/SilenceReason.md)

Defined in: [WAProto/index.d.ts:6226](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6226)

CallLogRecord silenceReason.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`silenceReason`](../interfaces/ICallLogRecord.md#silencereason)

***

### startTime?

> `optional` **startTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:6232](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6232)

CallLogRecord startTime.

#### Implementation of

[`ICallLogRecord`](../interfaces/ICallLogRecord.md).[`startTime`](../interfaces/ICallLogRecord.md#starttime)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6332](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6332)

Converts this CallLogRecord to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CallLogRecord`](CallLogRecord.md)

Defined in: [WAProto/index.d.ts:6269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6269)

Creates a new CallLogRecord instance using the specified properties.

#### Parameters

##### properties?

[`ICallLogRecord`](../interfaces/ICallLogRecord.md)

Properties to set

#### Returns

[`CallLogRecord`](CallLogRecord.md)

CallLogRecord instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CallLogRecord`](CallLogRecord.md)

Defined in: [WAProto/index.d.ts:6295](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6295)

Decodes a CallLogRecord message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CallLogRecord`](CallLogRecord.md)

CallLogRecord

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CallLogRecord`](CallLogRecord.md)

Defined in: [WAProto/index.d.ts:6304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6304)

Decodes a CallLogRecord message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CallLogRecord`](CallLogRecord.md)

CallLogRecord

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6277)

Encodes the specified CallLogRecord message. Does not implicitly [verify](CallLogRecord.md#verify) messages.

#### Parameters

##### message

[`ICallLogRecord`](../interfaces/ICallLogRecord.md)

CallLogRecord message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6285)

Encodes the specified CallLogRecord message, length delimited. Does not implicitly [verify](CallLogRecord.md#verify) messages.

#### Parameters

##### message

[`ICallLogRecord`](../interfaces/ICallLogRecord.md)

CallLogRecord message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CallLogRecord`](CallLogRecord.md)

Defined in: [WAProto/index.d.ts:6318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6318)

Creates a CallLogRecord message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CallLogRecord`](CallLogRecord.md)

CallLogRecord

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6339](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6339)

Gets the default type url for CallLogRecord

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

Defined in: [WAProto/index.d.ts:6326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6326)

Creates a plain object from a CallLogRecord message. Also converts values to other types if specified.

#### Parameters

##### message

[`CallLogRecord`](CallLogRecord.md)

CallLogRecord

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6311)

Verifies a CallLogRecord message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
