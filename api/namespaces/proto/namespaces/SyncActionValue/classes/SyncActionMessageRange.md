# Class: SyncActionMessageRange

Defined in: [WAProto/index.d.ts:46075](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46075)

Represents a SyncActionMessageRange.

## Implements

- [`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

## Constructors

### new SyncActionMessageRange()

> **new SyncActionMessageRange**(`properties`?): [`SyncActionMessageRange`](SyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:46081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46081)

Constructs a new SyncActionMessageRange.

#### Parameters

##### properties?

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Properties to set

#### Returns

[`SyncActionMessageRange`](SyncActionMessageRange.md)

## Properties

### lastMessageTimestamp?

> `optional` **lastMessageTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:46084](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46084)

SyncActionMessageRange lastMessageTimestamp.

#### Implementation of

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md).[`lastMessageTimestamp`](../interfaces/ISyncActionMessageRange.md#lastmessagetimestamp)

***

### lastSystemMessageTimestamp?

> `optional` **lastSystemMessageTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:46087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46087)

SyncActionMessageRange lastSystemMessageTimestamp.

#### Implementation of

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md).[`lastSystemMessageTimestamp`](../interfaces/ISyncActionMessageRange.md#lastsystemmessagetimestamp)

***

### messages

> **messages**: [`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)[]

Defined in: [WAProto/index.d.ts:46090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46090)

SyncActionMessageRange messages.

#### Implementation of

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md).[`messages`](../interfaces/ISyncActionMessageRange.md#messages)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46160](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46160)

Converts this SyncActionMessageRange to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncActionMessageRange`](SyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:46097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46097)

Creates a new SyncActionMessageRange instance using the specified properties.

#### Parameters

##### properties?

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Properties to set

#### Returns

[`SyncActionMessageRange`](SyncActionMessageRange.md)

SyncActionMessageRange instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncActionMessageRange`](SyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:46123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46123)

Decodes a SyncActionMessageRange message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncActionMessageRange`](SyncActionMessageRange.md)

SyncActionMessageRange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncActionMessageRange`](SyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:46132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46132)

Decodes a SyncActionMessageRange message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncActionMessageRange`](SyncActionMessageRange.md)

SyncActionMessageRange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46105)

Encodes the specified SyncActionMessageRange message. Does not implicitly [verify](SyncActionMessageRange.md#verify) messages.

#### Parameters

##### message

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

SyncActionMessageRange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46113)

Encodes the specified SyncActionMessageRange message, length delimited. Does not implicitly [verify](SyncActionMessageRange.md#verify) messages.

#### Parameters

##### message

[`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

SyncActionMessageRange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncActionMessageRange`](SyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:46146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46146)

Creates a SyncActionMessageRange message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncActionMessageRange`](SyncActionMessageRange.md)

SyncActionMessageRange

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46167](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46167)

Gets the default type url for SyncActionMessageRange

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

Defined in: [WAProto/index.d.ts:46154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46154)

Creates a plain object from a SyncActionMessageRange message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncActionMessageRange`](SyncActionMessageRange.md)

SyncActionMessageRange

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46139)

Verifies a SyncActionMessageRange message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
