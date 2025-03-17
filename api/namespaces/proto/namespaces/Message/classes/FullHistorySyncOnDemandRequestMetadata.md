# Class: FullHistorySyncOnDemandRequestMetadata

Defined in: [WAProto/index.d.ts:21594](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21594)

Represents a FullHistorySyncOnDemandRequestMetadata.

## Implements

- [`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

## Constructors

### new FullHistorySyncOnDemandRequestMetadata()

> **new FullHistorySyncOnDemandRequestMetadata**(`properties`?): [`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:21600](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21600)

Constructs a new FullHistorySyncOnDemandRequestMetadata.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

## Properties

### requestId?

> `optional` **requestId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21603)

FullHistorySyncOnDemandRequestMetadata requestId.

#### Implementation of

[`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md).[`requestId`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md#requestid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21673](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21673)

Converts this FullHistorySyncOnDemandRequestMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:21610](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21610)

Creates a new FullHistorySyncOnDemandRequestMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:21636](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21636)

Decodes a FullHistorySyncOnDemandRequestMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:21645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21645)

Decodes a FullHistorySyncOnDemandRequestMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21618](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21618)

Encodes the specified FullHistorySyncOnDemandRequestMetadata message. Does not implicitly [verify](FullHistorySyncOnDemandRequestMetadata.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21626)

Encodes the specified FullHistorySyncOnDemandRequestMetadata message, length delimited. Does not implicitly [verify](FullHistorySyncOnDemandRequestMetadata.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:21659](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21659)

Creates a FullHistorySyncOnDemandRequestMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21680](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21680)

Gets the default type url for FullHistorySyncOnDemandRequestMetadata

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

Defined in: [WAProto/index.d.ts:21667](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21667)

Creates a plain object from a FullHistorySyncOnDemandRequestMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`FullHistorySyncOnDemandRequestMetadata`](FullHistorySyncOnDemandRequestMetadata.md)

FullHistorySyncOnDemandRequestMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21652](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21652)

Verifies a FullHistorySyncOnDemandRequestMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
