# Class: ADVSignedDeviceIdentityHMAC

Defined in: [WAProto/index.d.ts:383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L383)

Represents a ADVSignedDeviceIdentityHMAC.

## Implements

- [`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md)

## Constructors

### new ADVSignedDeviceIdentityHMAC()

> **new ADVSignedDeviceIdentityHMAC**(`properties`?): [`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

Defined in: [WAProto/index.d.ts:389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L389)

Constructs a new ADVSignedDeviceIdentityHMAC.

#### Parameters

##### properties?

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md)

Properties to set

#### Returns

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

## Properties

### accountType?

> `optional` **accountType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:398](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L398)

ADVSignedDeviceIdentityHMAC accountType.

#### Implementation of

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md).[`accountType`](../interfaces/IADVSignedDeviceIdentityHMAC.md#accounttype)

***

### details?

> `optional` **details**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:392](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L392)

ADVSignedDeviceIdentityHMAC details.

#### Implementation of

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md).[`details`](../interfaces/IADVSignedDeviceIdentityHMAC.md#details)

***

### hmac?

> `optional` **hmac**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:395](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L395)

ADVSignedDeviceIdentityHMAC hmac.

#### Implementation of

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md).[`hmac`](../interfaces/IADVSignedDeviceIdentityHMAC.md#hmac)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:468](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L468)

Converts this ADVSignedDeviceIdentityHMAC to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

Defined in: [WAProto/index.d.ts:405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L405)

Creates a new ADVSignedDeviceIdentityHMAC instance using the specified properties.

#### Parameters

##### properties?

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md)

Properties to set

#### Returns

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

Defined in: [WAProto/index.d.ts:431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L431)

Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

Defined in: [WAProto/index.d.ts:440](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L440)

Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:413](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L413)

Encodes the specified ADVSignedDeviceIdentityHMAC message. Does not implicitly [verify](ADVSignedDeviceIdentityHMAC.md#verify) messages.

#### Parameters

##### message

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:421](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L421)

Encodes the specified ADVSignedDeviceIdentityHMAC message, length delimited. Does not implicitly [verify](ADVSignedDeviceIdentityHMAC.md#verify) messages.

#### Parameters

##### message

[`IADVSignedDeviceIdentityHMAC`](../interfaces/IADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

Defined in: [WAProto/index.d.ts:454](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L454)

Creates a ADVSignedDeviceIdentityHMAC message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L475)

Gets the default type url for ADVSignedDeviceIdentityHMAC

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

Defined in: [WAProto/index.d.ts:462](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L462)

Creates a plain object from a ADVSignedDeviceIdentityHMAC message. Also converts values to other types if specified.

#### Parameters

##### message

[`ADVSignedDeviceIdentityHMAC`](ADVSignedDeviceIdentityHMAC.md)

ADVSignedDeviceIdentityHMAC

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:447](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L447)

Verifies a ADVSignedDeviceIdentityHMAC message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
