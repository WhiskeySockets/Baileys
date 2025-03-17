# Class: SyncActionMessage

Defined in: [WAProto/index.d.ts:45969](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45969)

Represents a SyncActionMessage.

## Implements

- [`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)

## Constructors

### new SyncActionMessage()

> **new SyncActionMessage**(`properties`?): [`SyncActionMessage`](SyncActionMessage.md)

Defined in: [WAProto/index.d.ts:45975](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45975)

Constructs a new SyncActionMessage.

#### Parameters

##### properties?

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)

Properties to set

#### Returns

[`SyncActionMessage`](SyncActionMessage.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:45978](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45978)

SyncActionMessage key.

#### Implementation of

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md).[`key`](../interfaces/ISyncActionMessage.md#key)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:45981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45981)

SyncActionMessage timestamp.

#### Implementation of

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md).[`timestamp`](../interfaces/ISyncActionMessage.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46051](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46051)

Converts this SyncActionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncActionMessage`](SyncActionMessage.md)

Defined in: [WAProto/index.d.ts:45988](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45988)

Creates a new SyncActionMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)

Properties to set

#### Returns

[`SyncActionMessage`](SyncActionMessage.md)

SyncActionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncActionMessage`](SyncActionMessage.md)

Defined in: [WAProto/index.d.ts:46014](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46014)

Decodes a SyncActionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncActionMessage`](SyncActionMessage.md)

SyncActionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncActionMessage`](SyncActionMessage.md)

Defined in: [WAProto/index.d.ts:46023](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46023)

Decodes a SyncActionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncActionMessage`](SyncActionMessage.md)

SyncActionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45996](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45996)

Encodes the specified SyncActionMessage message. Does not implicitly [verify](SyncActionMessage.md#verify) messages.

#### Parameters

##### message

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)

SyncActionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46004](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46004)

Encodes the specified SyncActionMessage message, length delimited. Does not implicitly [verify](SyncActionMessage.md#verify) messages.

#### Parameters

##### message

[`ISyncActionMessage`](../interfaces/ISyncActionMessage.md)

SyncActionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncActionMessage`](SyncActionMessage.md)

Defined in: [WAProto/index.d.ts:46037](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46037)

Creates a SyncActionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncActionMessage`](SyncActionMessage.md)

SyncActionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46058](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46058)

Gets the default type url for SyncActionMessage

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

Defined in: [WAProto/index.d.ts:46045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46045)

Creates a plain object from a SyncActionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncActionMessage`](SyncActionMessage.md)

SyncActionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46030)

Verifies a SyncActionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
