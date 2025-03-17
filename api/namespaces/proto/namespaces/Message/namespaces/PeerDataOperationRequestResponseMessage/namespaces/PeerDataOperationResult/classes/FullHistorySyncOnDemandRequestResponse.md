# Class: FullHistorySyncOnDemandRequestResponse

Defined in: [WAProto/index.d.ts:27889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27889)

Represents a FullHistorySyncOnDemandRequestResponse.

## Implements

- [`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md)

## Constructors

### new FullHistorySyncOnDemandRequestResponse()

> **new FullHistorySyncOnDemandRequestResponse**(`properties`?): [`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

Defined in: [WAProto/index.d.ts:27895](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27895)

Constructs a new FullHistorySyncOnDemandRequestResponse.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

## Properties

### requestMetadata?

> `optional` **requestMetadata**: `null` \| [`IFullHistorySyncOnDemandRequestMetadata`](../../../../../interfaces/IFullHistorySyncOnDemandRequestMetadata.md)

Defined in: [WAProto/index.d.ts:27898](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27898)

FullHistorySyncOnDemandRequestResponse requestMetadata.

#### Implementation of

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md).[`requestMetadata`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md#requestmetadata)

***

### responseCode?

> `optional` **responseCode**: `null` \| [`FullHistorySyncOnDemandResponseCode`](../enumerations/FullHistorySyncOnDemandResponseCode.md)

Defined in: [WAProto/index.d.ts:27901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27901)

FullHistorySyncOnDemandRequestResponse responseCode.

#### Implementation of

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md).[`responseCode`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md#responsecode)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27971](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27971)

Converts this FullHistorySyncOnDemandRequestResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

Defined in: [WAProto/index.d.ts:27908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27908)

Creates a new FullHistorySyncOnDemandRequestResponse instance using the specified properties.

#### Parameters

##### properties?

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md)

Properties to set

#### Returns

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

Defined in: [WAProto/index.d.ts:27934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27934)

Decodes a FullHistorySyncOnDemandRequestResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

Defined in: [WAProto/index.d.ts:27943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27943)

Decodes a FullHistorySyncOnDemandRequestResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27916)

Encodes the specified FullHistorySyncOnDemandRequestResponse message. Does not implicitly [verify](FullHistorySyncOnDemandRequestResponse.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27924)

Encodes the specified FullHistorySyncOnDemandRequestResponse message, length delimited. Does not implicitly [verify](FullHistorySyncOnDemandRequestResponse.md#verify) messages.

#### Parameters

##### message

[`IFullHistorySyncOnDemandRequestResponse`](../interfaces/IFullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

Defined in: [WAProto/index.d.ts:27957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27957)

Creates a FullHistorySyncOnDemandRequestResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27978](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27978)

Gets the default type url for FullHistorySyncOnDemandRequestResponse

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

Defined in: [WAProto/index.d.ts:27965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27965)

Creates a plain object from a FullHistorySyncOnDemandRequestResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`FullHistorySyncOnDemandRequestResponse`](FullHistorySyncOnDemandRequestResponse.md)

FullHistorySyncOnDemandRequestResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27950](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27950)

Verifies a FullHistorySyncOnDemandRequestResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
