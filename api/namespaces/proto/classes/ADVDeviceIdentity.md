# Class: ADVDeviceIdentity

Defined in: [WAProto/index.d.ts:26](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26)

Represents a ADVDeviceIdentity.

## Implements

- [`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md)

## Constructors

### new ADVDeviceIdentity()

> **new ADVDeviceIdentity**(`properties`?): [`ADVDeviceIdentity`](ADVDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:32](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32)

Constructs a new ADVDeviceIdentity.

#### Parameters

##### properties?

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md)

Properties to set

#### Returns

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

## Properties

### accountType?

> `optional` **accountType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:44](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44)

ADVDeviceIdentity accountType.

#### Implementation of

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md).[`accountType`](../interfaces/IADVDeviceIdentity.md#accounttype)

***

### deviceType?

> `optional` **deviceType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:47](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47)

ADVDeviceIdentity deviceType.

#### Implementation of

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md).[`deviceType`](../interfaces/IADVDeviceIdentity.md#devicetype)

***

### keyIndex?

> `optional` **keyIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:41](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41)

ADVDeviceIdentity keyIndex.

#### Implementation of

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md).[`keyIndex`](../interfaces/IADVDeviceIdentity.md#keyindex)

***

### rawId?

> `optional` **rawId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:35](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35)

ADVDeviceIdentity rawId.

#### Implementation of

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md).[`rawId`](../interfaces/IADVDeviceIdentity.md#rawid)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:38](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38)

ADVDeviceIdentity timestamp.

#### Implementation of

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md).[`timestamp`](../interfaces/IADVDeviceIdentity.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L117)

Converts this ADVDeviceIdentity to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ADVDeviceIdentity`](ADVDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:54](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L54)

Creates a new ADVDeviceIdentity instance using the specified properties.

#### Parameters

##### properties?

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md)

Properties to set

#### Returns

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

ADVDeviceIdentity instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ADVDeviceIdentity`](ADVDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:80](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L80)

Decodes a ADVDeviceIdentity message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

ADVDeviceIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ADVDeviceIdentity`](ADVDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:89](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L89)

Decodes a ADVDeviceIdentity message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

ADVDeviceIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:62](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L62)

Encodes the specified ADVDeviceIdentity message. Does not implicitly [verify](ADVDeviceIdentity.md#verify) messages.

#### Parameters

##### message

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md)

ADVDeviceIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:70](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L70)

Encodes the specified ADVDeviceIdentity message, length delimited. Does not implicitly [verify](ADVDeviceIdentity.md#verify) messages.

#### Parameters

##### message

[`IADVDeviceIdentity`](../interfaces/IADVDeviceIdentity.md)

ADVDeviceIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ADVDeviceIdentity`](ADVDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L103)

Creates a ADVDeviceIdentity message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

ADVDeviceIdentity

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:124](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L124)

Gets the default type url for ADVDeviceIdentity

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

Defined in: [WAProto/index.d.ts:111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L111)

Creates a plain object from a ADVDeviceIdentity message. Also converts values to other types if specified.

#### Parameters

##### message

[`ADVDeviceIdentity`](ADVDeviceIdentity.md)

ADVDeviceIdentity

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:96](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L96)

Verifies a ADVDeviceIdentity message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
