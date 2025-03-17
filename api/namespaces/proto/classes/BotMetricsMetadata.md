# Class: BotMetricsMetadata

Defined in: [WAProto/index.d.ts:4631](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4631)

Represents a BotMetricsMetadata.

## Implements

- [`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md)

## Constructors

### new BotMetricsMetadata()

> **new BotMetricsMetadata**(`properties`?): [`BotMetricsMetadata`](BotMetricsMetadata.md)

Defined in: [WAProto/index.d.ts:4637](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4637)

Constructs a new BotMetricsMetadata.

#### Parameters

##### properties?

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md)

Properties to set

#### Returns

[`BotMetricsMetadata`](BotMetricsMetadata.md)

## Properties

### destinationEntryPoint?

> `optional` **destinationEntryPoint**: `null` \| [`BotMetricsEntryPoint`](../enumerations/BotMetricsEntryPoint.md)

Defined in: [WAProto/index.d.ts:4643](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4643)

BotMetricsMetadata destinationEntryPoint.

#### Implementation of

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md).[`destinationEntryPoint`](../interfaces/IBotMetricsMetadata.md#destinationentrypoint)

***

### destinationId?

> `optional` **destinationId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:4640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4640)

BotMetricsMetadata destinationId.

#### Implementation of

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md).[`destinationId`](../interfaces/IBotMetricsMetadata.md#destinationid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:4713](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4713)

Converts this BotMetricsMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotMetricsMetadata`](BotMetricsMetadata.md)

Defined in: [WAProto/index.d.ts:4650](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4650)

Creates a new BotMetricsMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md)

Properties to set

#### Returns

[`BotMetricsMetadata`](BotMetricsMetadata.md)

BotMetricsMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotMetricsMetadata`](BotMetricsMetadata.md)

Defined in: [WAProto/index.d.ts:4676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4676)

Decodes a BotMetricsMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotMetricsMetadata`](BotMetricsMetadata.md)

BotMetricsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotMetricsMetadata`](BotMetricsMetadata.md)

Defined in: [WAProto/index.d.ts:4685](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4685)

Decodes a BotMetricsMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotMetricsMetadata`](BotMetricsMetadata.md)

BotMetricsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4658)

Encodes the specified BotMetricsMetadata message. Does not implicitly [verify](BotMetricsMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md)

BotMetricsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4666)

Encodes the specified BotMetricsMetadata message, length delimited. Does not implicitly [verify](BotMetricsMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMetricsMetadata`](../interfaces/IBotMetricsMetadata.md)

BotMetricsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotMetricsMetadata`](BotMetricsMetadata.md)

Defined in: [WAProto/index.d.ts:4699](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4699)

Creates a BotMetricsMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotMetricsMetadata`](BotMetricsMetadata.md)

BotMetricsMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:4720](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4720)

Gets the default type url for BotMetricsMetadata

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

Defined in: [WAProto/index.d.ts:4707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4707)

Creates a plain object from a BotMetricsMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotMetricsMetadata`](BotMetricsMetadata.md)

BotMetricsMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:4692](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4692)

Verifies a BotMetricsMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
