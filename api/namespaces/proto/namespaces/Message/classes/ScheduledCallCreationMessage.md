# Class: ScheduledCallCreationMessage

Defined in: [WAProto/index.d.ts:30692](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30692)

Represents a ScheduledCallCreationMessage.

## Implements

- [`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md)

## Constructors

### new ScheduledCallCreationMessage()

> **new ScheduledCallCreationMessage**(`properties`?): [`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:30698](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30698)

Constructs a new ScheduledCallCreationMessage.

#### Parameters

##### properties?

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md)

Properties to set

#### Returns

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

## Properties

### callType?

> `optional` **callType**: `null` \| [`CallType`](../namespaces/ScheduledCallCreationMessage/enumerations/CallType.md)

Defined in: [WAProto/index.d.ts:30704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30704)

ScheduledCallCreationMessage callType.

#### Implementation of

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md).[`callType`](../interfaces/IScheduledCallCreationMessage.md#calltype)

***

### scheduledTimestampMs?

> `optional` **scheduledTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30701](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30701)

ScheduledCallCreationMessage scheduledTimestampMs.

#### Implementation of

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md).[`scheduledTimestampMs`](../interfaces/IScheduledCallCreationMessage.md#scheduledtimestampms)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30707)

ScheduledCallCreationMessage title.

#### Implementation of

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md).[`title`](../interfaces/IScheduledCallCreationMessage.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30777)

Converts this ScheduledCallCreationMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:30714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30714)

Creates a new ScheduledCallCreationMessage instance using the specified properties.

#### Parameters

##### properties?

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md)

Properties to set

#### Returns

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

ScheduledCallCreationMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:30740](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30740)

Decodes a ScheduledCallCreationMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

ScheduledCallCreationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:30749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30749)

Decodes a ScheduledCallCreationMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

ScheduledCallCreationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30722)

Encodes the specified ScheduledCallCreationMessage message. Does not implicitly [verify](ScheduledCallCreationMessage.md#verify) messages.

#### Parameters

##### message

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md)

ScheduledCallCreationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30730)

Encodes the specified ScheduledCallCreationMessage message, length delimited. Does not implicitly [verify](ScheduledCallCreationMessage.md#verify) messages.

#### Parameters

##### message

[`IScheduledCallCreationMessage`](../interfaces/IScheduledCallCreationMessage.md)

ScheduledCallCreationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:30763](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30763)

Creates a ScheduledCallCreationMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

ScheduledCallCreationMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30784)

Gets the default type url for ScheduledCallCreationMessage

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

Defined in: [WAProto/index.d.ts:30771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30771)

Creates a plain object from a ScheduledCallCreationMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ScheduledCallCreationMessage`](ScheduledCallCreationMessage.md)

ScheduledCallCreationMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30756)

Verifies a ScheduledCallCreationMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
