# Class: BizIdentityInfo

Defined in: [WAProto/index.d.ts:3244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3244)

Represents a BizIdentityInfo.

## Implements

- [`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md)

## Constructors

### new BizIdentityInfo()

> **new BizIdentityInfo**(`properties`?): [`BizIdentityInfo`](BizIdentityInfo.md)

Defined in: [WAProto/index.d.ts:3250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3250)

Constructs a new BizIdentityInfo.

#### Parameters

##### properties?

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md)

Properties to set

#### Returns

[`BizIdentityInfo`](BizIdentityInfo.md)

## Properties

### actualActors?

> `optional` **actualActors**: `null` \| [`ActualActorsType`](../namespaces/BizIdentityInfo/enumerations/ActualActorsType.md)

Defined in: [WAProto/index.d.ts:3268](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3268)

BizIdentityInfo actualActors.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`actualActors`](../interfaces/IBizIdentityInfo.md#actualactors)

***

### featureControls?

> `optional` **featureControls**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:3274](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3274)

BizIdentityInfo featureControls.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`featureControls`](../interfaces/IBizIdentityInfo.md#featurecontrols)

***

### hostStorage?

> `optional` **hostStorage**: `null` \| [`HostStorageType`](../namespaces/BizIdentityInfo/enumerations/HostStorageType.md)

Defined in: [WAProto/index.d.ts:3265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3265)

BizIdentityInfo hostStorage.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`hostStorage`](../interfaces/IBizIdentityInfo.md#hoststorage)

***

### privacyModeTs?

> `optional` **privacyModeTs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:3271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3271)

BizIdentityInfo privacyModeTs.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`privacyModeTs`](../interfaces/IBizIdentityInfo.md#privacymodets)

***

### revoked?

> `optional` **revoked**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:3262](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3262)

BizIdentityInfo revoked.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`revoked`](../interfaces/IBizIdentityInfo.md#revoked)

***

### signed?

> `optional` **signed**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:3259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3259)

BizIdentityInfo signed.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`signed`](../interfaces/IBizIdentityInfo.md#signed)

***

### vlevel?

> `optional` **vlevel**: `null` \| [`VerifiedLevelValue`](../namespaces/BizIdentityInfo/enumerations/VerifiedLevelValue.md)

Defined in: [WAProto/index.d.ts:3253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3253)

BizIdentityInfo vlevel.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`vlevel`](../interfaces/IBizIdentityInfo.md#vlevel)

***

### vnameCert?

> `optional` **vnameCert**: `null` \| [`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:3256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3256)

BizIdentityInfo vnameCert.

#### Implementation of

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md).[`vnameCert`](../interfaces/IBizIdentityInfo.md#vnamecert)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3344](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3344)

Converts this BizIdentityInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BizIdentityInfo`](BizIdentityInfo.md)

Defined in: [WAProto/index.d.ts:3281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3281)

Creates a new BizIdentityInfo instance using the specified properties.

#### Parameters

##### properties?

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md)

Properties to set

#### Returns

[`BizIdentityInfo`](BizIdentityInfo.md)

BizIdentityInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BizIdentityInfo`](BizIdentityInfo.md)

Defined in: [WAProto/index.d.ts:3307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3307)

Decodes a BizIdentityInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BizIdentityInfo`](BizIdentityInfo.md)

BizIdentityInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BizIdentityInfo`](BizIdentityInfo.md)

Defined in: [WAProto/index.d.ts:3316](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3316)

Decodes a BizIdentityInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BizIdentityInfo`](BizIdentityInfo.md)

BizIdentityInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3289](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3289)

Encodes the specified BizIdentityInfo message. Does not implicitly [verify](BizIdentityInfo.md#verify) messages.

#### Parameters

##### message

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md)

BizIdentityInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3297](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3297)

Encodes the specified BizIdentityInfo message, length delimited. Does not implicitly [verify](BizIdentityInfo.md#verify) messages.

#### Parameters

##### message

[`IBizIdentityInfo`](../interfaces/IBizIdentityInfo.md)

BizIdentityInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BizIdentityInfo`](BizIdentityInfo.md)

Defined in: [WAProto/index.d.ts:3330](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3330)

Creates a BizIdentityInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BizIdentityInfo`](BizIdentityInfo.md)

BizIdentityInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3351)

Gets the default type url for BizIdentityInfo

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

Defined in: [WAProto/index.d.ts:3338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3338)

Creates a plain object from a BizIdentityInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`BizIdentityInfo`](BizIdentityInfo.md)

BizIdentityInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3323)

Verifies a BizIdentityInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
