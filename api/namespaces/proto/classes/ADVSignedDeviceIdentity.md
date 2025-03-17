# Class: ADVSignedDeviceIdentity

Defined in: [WAProto/index.d.ts:271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L271)

Represents a ADVSignedDeviceIdentity.

## Implements

- [`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md)

## Constructors

### new ADVSignedDeviceIdentity()

> **new ADVSignedDeviceIdentity**(`properties`?): [`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L277)

Constructs a new ADVSignedDeviceIdentity.

#### Parameters

##### properties?

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md)

Properties to set

#### Returns

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

## Properties

### accountSignature?

> `optional` **accountSignature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:286](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L286)

ADVSignedDeviceIdentity accountSignature.

#### Implementation of

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md).[`accountSignature`](../interfaces/IADVSignedDeviceIdentity.md#accountsignature)

***

### accountSignatureKey?

> `optional` **accountSignatureKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:283](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L283)

ADVSignedDeviceIdentity accountSignatureKey.

#### Implementation of

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md).[`accountSignatureKey`](../interfaces/IADVSignedDeviceIdentity.md#accountsignaturekey)

***

### details?

> `optional` **details**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:280](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L280)

ADVSignedDeviceIdentity details.

#### Implementation of

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md).[`details`](../interfaces/IADVSignedDeviceIdentity.md#details)

***

### deviceSignature?

> `optional` **deviceSignature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:289](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L289)

ADVSignedDeviceIdentity deviceSignature.

#### Implementation of

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md).[`deviceSignature`](../interfaces/IADVSignedDeviceIdentity.md#devicesignature)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L359)

Converts this ADVSignedDeviceIdentity to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L296)

Creates a new ADVSignedDeviceIdentity instance using the specified properties.

#### Parameters

##### properties?

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md)

Properties to set

#### Returns

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:322](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L322)

Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:331](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L331)

Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L304)

Encodes the specified ADVSignedDeviceIdentity message. Does not implicitly [verify](ADVSignedDeviceIdentity.md#verify) messages.

#### Parameters

##### message

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:312](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L312)

Encodes the specified ADVSignedDeviceIdentity message, length delimited. Does not implicitly [verify](ADVSignedDeviceIdentity.md#verify) messages.

#### Parameters

##### message

[`IADVSignedDeviceIdentity`](../interfaces/IADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

Defined in: [WAProto/index.d.ts:345](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L345)

Creates a ADVSignedDeviceIdentity message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L366)

Gets the default type url for ADVSignedDeviceIdentity

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

Defined in: [WAProto/index.d.ts:353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L353)

Creates a plain object from a ADVSignedDeviceIdentity message. Also converts values to other types if specified.

#### Parameters

##### message

[`ADVSignedDeviceIdentity`](ADVSignedDeviceIdentity.md)

ADVSignedDeviceIdentity

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L338)

Verifies a ADVSignedDeviceIdentity message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
