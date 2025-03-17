# Class: FullHistorySyncOnDemandRequest

Defined in: [WAProto/index.d.ts:27018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27018)

Represents a FullHistorySyncOnDemandRequest.

## Implements

- [`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md)

## Constructors

### new FullHistorySyncOnDemandRequest()

> **new FullHistorySyncOnDemandRequest**(`properties`?): [`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27024](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27024)

Constructs a new FullHistorySyncOnDemandRequest.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

## Properties

### historySyncConfig?

> `optional` **historySyncConfig**: `null` \| [`IHistorySyncConfig`](../../../../DeviceProps/interfaces/IHistorySyncConfig.md)

Defined in: [WAProto/index.d.ts:27030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27030)

FullHistorySyncOnDemandRequest historySyncConfig.

#### Implementation of

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md).[`historySyncConfig`](../interfaces/IFullHistorySyncOnDemandRequest.md#historysyncconfig)

***

### requestMetadata?

> `optional` **requestMetadata**: `null` \| [`IFullHistorySyncOnDemandRequestMetadata`](../../../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:27027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27027)

FullHistorySyncOnDemandRequest requestMetadata.

#### Implementation of

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md).[`requestMetadata`](../interfaces/IFullHistorySyncOnDemandRequest.md#requestmetadata)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27100)

Converts this FullHistorySyncOnDemandRequest to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27037](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27037)

Creates a new FullHistorySyncOnDemandRequest instance using the specified properties.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27063)

Decodes a FullHistorySyncOnDemandRequest message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27072](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27072)

Decodes a FullHistorySyncOnDemandRequest message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27045)

Encodes the specified FullHistorySyncOnDemandRequest message. Does not implicitly [verify](FullHistorySyncOnDemandRequest.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27053)

Encodes the specified FullHistorySyncOnDemandRequest message, length delimited. Does not implicitly [verify](FullHistorySyncOnDemandRequest.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequest`](../interfaces/IFullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27086](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27086)

Creates a FullHistorySyncOnDemandRequest message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27107)

Gets the default type url for FullHistorySyncOnDemandRequest

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

Defined in: [WAProto/index.d.ts:27094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27094)

Creates a plain object from a FullHistorySyncOnDemandRequest message. Also converts values to other types if specified.

#### Parameters

##### message

[`FullHistorySyncOnDemandRequest`](FullHistorySyncOnDemandRequest.md)

FullHistorySyncOnDemandRequest

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27079](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27079)

Verifies a FullHistorySyncOnDemandRequest message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
