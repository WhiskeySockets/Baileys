# Class: HistorySyncMsg

Defined in: [WAProto/index.d.ts:14551](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14551)

Represents a HistorySyncMsg.

## Implements

- [`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md)

## Constructors

### new HistorySyncMsg()

> **new HistorySyncMsg**(`properties`?): [`HistorySyncMsg`](HistorySyncMsg.md)

Defined in: [WAProto/index.d.ts:14557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14557)

Constructs a new HistorySyncMsg.

#### Parameters

##### properties?

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md)

Properties to set

#### Returns

[`HistorySyncMsg`](HistorySyncMsg.md)

## Properties

### message?

> `optional` **message**: `null` \| [`IWebMessageInfo`](../interfaces/IWebMessageInfo.md)

Defined in: [WAProto/index.d.ts:14560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14560)

HistorySyncMsg message.

#### Implementation of

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md).[`message`](../interfaces/IHistorySyncMsg.md#message)

***

### msgOrderId?

> `optional` **msgOrderId**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:14563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14563)

HistorySyncMsg msgOrderId.

#### Implementation of

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md).[`msgOrderId`](../interfaces/IHistorySyncMsg.md#msgorderid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14633)

Converts this HistorySyncMsg to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HistorySyncMsg`](HistorySyncMsg.md)

Defined in: [WAProto/index.d.ts:14570](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14570)

Creates a new HistorySyncMsg instance using the specified properties.

#### Parameters

##### properties?

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md)

Properties to set

#### Returns

[`HistorySyncMsg`](HistorySyncMsg.md)

HistorySyncMsg instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HistorySyncMsg`](HistorySyncMsg.md)

Defined in: [WAProto/index.d.ts:14596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14596)

Decodes a HistorySyncMsg message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HistorySyncMsg`](HistorySyncMsg.md)

HistorySyncMsg

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HistorySyncMsg`](HistorySyncMsg.md)

Defined in: [WAProto/index.d.ts:14605](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14605)

Decodes a HistorySyncMsg message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HistorySyncMsg`](HistorySyncMsg.md)

HistorySyncMsg

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14578)

Encodes the specified HistorySyncMsg message. Does not implicitly [verify](HistorySyncMsg.md#verify) messages.

#### Parameters

##### message

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md)

HistorySyncMsg message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14586](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14586)

Encodes the specified HistorySyncMsg message, length delimited. Does not implicitly [verify](HistorySyncMsg.md#verify) messages.

#### Parameters

##### message

[`IHistorySyncMsg`](../interfaces/IHistorySyncMsg.md)

HistorySyncMsg message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HistorySyncMsg`](HistorySyncMsg.md)

Defined in: [WAProto/index.d.ts:14619](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14619)

Creates a HistorySyncMsg message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HistorySyncMsg`](HistorySyncMsg.md)

HistorySyncMsg

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14640)

Gets the default type url for HistorySyncMsg

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

Defined in: [WAProto/index.d.ts:14627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14627)

Creates a plain object from a HistorySyncMsg message. Also converts values to other types if specified.

#### Parameters

##### message

[`HistorySyncMsg`](HistorySyncMsg.md)

HistorySyncMsg

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14612)

Verifies a HistorySyncMsg message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
