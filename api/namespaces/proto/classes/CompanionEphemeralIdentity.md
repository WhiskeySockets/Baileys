# Class: CompanionEphemeralIdentity

Defined in: [WAProto/index.d.ts:9188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9188)

Represents a CompanionEphemeralIdentity.

## Implements

- [`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md)

## Constructors

### new CompanionEphemeralIdentity()

> **new CompanionEphemeralIdentity**(`properties`?): [`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

Defined in: [WAProto/index.d.ts:9194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9194)

Constructs a new CompanionEphemeralIdentity.

#### Parameters

##### properties?

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md)

Properties to set

#### Returns

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

## Properties

### deviceType?

> `optional` **deviceType**: `null` \| [`PlatformType`](../namespaces/DeviceProps/enumerations/PlatformType.md)

Defined in: [WAProto/index.d.ts:9200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9200)

CompanionEphemeralIdentity deviceType.

#### Implementation of

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md).[`deviceType`](../interfaces/ICompanionEphemeralIdentity.md#devicetype)

***

### publicKey?

> `optional` **publicKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:9197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9197)

CompanionEphemeralIdentity publicKey.

#### Implementation of

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md).[`publicKey`](../interfaces/ICompanionEphemeralIdentity.md#publickey)

***

### ref?

> `optional` **ref**: `null` \| `string`

Defined in: [WAProto/index.d.ts:9203](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9203)

CompanionEphemeralIdentity ref.

#### Implementation of

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md).[`ref`](../interfaces/ICompanionEphemeralIdentity.md#ref)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9273](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9273)

Converts this CompanionEphemeralIdentity to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

Defined in: [WAProto/index.d.ts:9210](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9210)

Creates a new CompanionEphemeralIdentity instance using the specified properties.

#### Parameters

##### properties?

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md)

Properties to set

#### Returns

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

CompanionEphemeralIdentity instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

Defined in: [WAProto/index.d.ts:9236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9236)

Decodes a CompanionEphemeralIdentity message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

CompanionEphemeralIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

Defined in: [WAProto/index.d.ts:9245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9245)

Decodes a CompanionEphemeralIdentity message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

CompanionEphemeralIdentity

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9218)

Encodes the specified CompanionEphemeralIdentity message. Does not implicitly [verify](CompanionEphemeralIdentity.md#verify) messages.

#### Parameters

##### message

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md)

CompanionEphemeralIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9226](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9226)

Encodes the specified CompanionEphemeralIdentity message, length delimited. Does not implicitly [verify](CompanionEphemeralIdentity.md#verify) messages.

#### Parameters

##### message

[`ICompanionEphemeralIdentity`](../interfaces/ICompanionEphemeralIdentity.md)

CompanionEphemeralIdentity message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

Defined in: [WAProto/index.d.ts:9259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9259)

Creates a CompanionEphemeralIdentity message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

CompanionEphemeralIdentity

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9280](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9280)

Gets the default type url for CompanionEphemeralIdentity

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

Defined in: [WAProto/index.d.ts:9267](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9267)

Creates a plain object from a CompanionEphemeralIdentity message. Also converts values to other types if specified.

#### Parameters

##### message

[`CompanionEphemeralIdentity`](CompanionEphemeralIdentity.md)

CompanionEphemeralIdentity

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9252](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9252)

Verifies a CompanionEphemeralIdentity message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
