# Class: StatusPSA

Defined in: [WAProto/index.d.ts:40146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40146)

Represents a StatusPSA.

## Implements

- [`IStatusPSA`](../interfaces/IStatusPSA.md)

## Constructors

### new StatusPSA()

> **new StatusPSA**(`properties`?): [`StatusPSA`](StatusPSA.md)

Defined in: [WAProto/index.d.ts:40152](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40152)

Constructs a new StatusPSA.

#### Parameters

##### properties?

[`IStatusPSA`](../interfaces/IStatusPSA.md)

Properties to set

#### Returns

[`StatusPSA`](StatusPSA.md)

## Properties

### campaignExpirationTimestamp?

> `optional` **campaignExpirationTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:40158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40158)

StatusPSA campaignExpirationTimestamp.

#### Implementation of

[`IStatusPSA`](../interfaces/IStatusPSA.md).[`campaignExpirationTimestamp`](../interfaces/IStatusPSA.md#campaignexpirationtimestamp)

***

### campaignId

> **campaignId**: `number` \| `Long`

Defined in: [WAProto/index.d.ts:40155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40155)

StatusPSA campaignId.

#### Implementation of

[`IStatusPSA`](../interfaces/IStatusPSA.md).[`campaignId`](../interfaces/IStatusPSA.md#campaignid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:40228](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40228)

Converts this StatusPSA to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StatusPSA`](StatusPSA.md)

Defined in: [WAProto/index.d.ts:40165](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40165)

Creates a new StatusPSA instance using the specified properties.

#### Parameters

##### properties?

[`IStatusPSA`](../interfaces/IStatusPSA.md)

Properties to set

#### Returns

[`StatusPSA`](StatusPSA.md)

StatusPSA instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StatusPSA`](StatusPSA.md)

Defined in: [WAProto/index.d.ts:40191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40191)

Decodes a StatusPSA message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StatusPSA`](StatusPSA.md)

StatusPSA

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StatusPSA`](StatusPSA.md)

Defined in: [WAProto/index.d.ts:40200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40200)

Decodes a StatusPSA message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StatusPSA`](StatusPSA.md)

StatusPSA

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40173](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40173)

Encodes the specified StatusPSA message. Does not implicitly [verify](StatusPSA.md#verify) messages.

#### Parameters

##### message

[`IStatusPSA`](../interfaces/IStatusPSA.md)

StatusPSA message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40181)

Encodes the specified StatusPSA message, length delimited. Does not implicitly [verify](StatusPSA.md#verify) messages.

#### Parameters

##### message

[`IStatusPSA`](../interfaces/IStatusPSA.md)

StatusPSA message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StatusPSA`](StatusPSA.md)

Defined in: [WAProto/index.d.ts:40214](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40214)

Creates a StatusPSA message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StatusPSA`](StatusPSA.md)

StatusPSA

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:40235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40235)

Gets the default type url for StatusPSA

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

Defined in: [WAProto/index.d.ts:40222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40222)

Creates a plain object from a StatusPSA message. Also converts values to other types if specified.

#### Parameters

##### message

[`StatusPSA`](StatusPSA.md)

StatusPSA

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:40207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40207)

Verifies a StatusPSA message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
