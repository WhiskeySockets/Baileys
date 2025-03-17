# Class: EphemeralSetting

Defined in: [WAProto/index.d.ts:12824](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12824)

Represents an EphemeralSetting.

## Implements

- [`IEphemeralSetting`](../interfaces/IEphemeralSetting.md)

## Constructors

### new EphemeralSetting()

> **new EphemeralSetting**(`properties`?): [`EphemeralSetting`](EphemeralSetting.md)

Defined in: [WAProto/index.d.ts:12830](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12830)

Constructs a new EphemeralSetting.

#### Parameters

##### properties?

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md)

Properties to set

#### Returns

[`EphemeralSetting`](EphemeralSetting.md)

## Properties

### duration?

> `optional` **duration**: `null` \| `number`

Defined in: [WAProto/index.d.ts:12833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12833)

EphemeralSetting duration.

#### Implementation of

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md).[`duration`](../interfaces/IEphemeralSetting.md#duration)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:12836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12836)

EphemeralSetting timestamp.

#### Implementation of

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md).[`timestamp`](../interfaces/IEphemeralSetting.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:12906](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12906)

Converts this EphemeralSetting to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EphemeralSetting`](EphemeralSetting.md)

Defined in: [WAProto/index.d.ts:12843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12843)

Creates a new EphemeralSetting instance using the specified properties.

#### Parameters

##### properties?

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md)

Properties to set

#### Returns

[`EphemeralSetting`](EphemeralSetting.md)

EphemeralSetting instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EphemeralSetting`](EphemeralSetting.md)

Defined in: [WAProto/index.d.ts:12869](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12869)

Decodes an EphemeralSetting message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EphemeralSetting`](EphemeralSetting.md)

EphemeralSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EphemeralSetting`](EphemeralSetting.md)

Defined in: [WAProto/index.d.ts:12878](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12878)

Decodes an EphemeralSetting message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EphemeralSetting`](EphemeralSetting.md)

EphemeralSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12851)

Encodes the specified EphemeralSetting message. Does not implicitly [verify](EphemeralSetting.md#verify) messages.

#### Parameters

##### message

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md)

EphemeralSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12859)

Encodes the specified EphemeralSetting message, length delimited. Does not implicitly [verify](EphemeralSetting.md#verify) messages.

#### Parameters

##### message

[`IEphemeralSetting`](../interfaces/IEphemeralSetting.md)

EphemeralSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EphemeralSetting`](EphemeralSetting.md)

Defined in: [WAProto/index.d.ts:12892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12892)

Creates an EphemeralSetting message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EphemeralSetting`](EphemeralSetting.md)

EphemeralSetting

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:12913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12913)

Gets the default type url for EphemeralSetting

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

Defined in: [WAProto/index.d.ts:12900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12900)

Creates a plain object from an EphemeralSetting message. Also converts values to other types if specified.

#### Parameters

##### message

[`EphemeralSetting`](EphemeralSetting.md)

EphemeralSetting

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12885)

Verifies an EphemeralSetting message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
