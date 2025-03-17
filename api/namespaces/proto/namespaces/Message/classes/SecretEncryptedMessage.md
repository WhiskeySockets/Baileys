# Class: SecretEncryptedMessage

Defined in: [WAProto/index.d.ts:30926](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30926)

Represents a SecretEncryptedMessage.

## Implements

- [`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md)

## Constructors

### new SecretEncryptedMessage()

> **new SecretEncryptedMessage**(`properties`?): [`SecretEncryptedMessage`](SecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:30932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30932)

Constructs a new SecretEncryptedMessage.

#### Parameters

##### properties?

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md)

Properties to set

#### Returns

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:30941](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30941)

SecretEncryptedMessage encIv.

#### Implementation of

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md).[`encIv`](../interfaces/ISecretEncryptedMessage.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:30938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30938)

SecretEncryptedMessage encPayload.

#### Implementation of

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md).[`encPayload`](../interfaces/ISecretEncryptedMessage.md#encpayload)

***

### secretEncType?

> `optional` **secretEncType**: `null` \| [`SecretEncType`](../namespaces/SecretEncryptedMessage/enumerations/SecretEncType.md)

Defined in: [WAProto/index.d.ts:30944](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30944)

SecretEncryptedMessage secretEncType.

#### Implementation of

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md).[`secretEncType`](../interfaces/ISecretEncryptedMessage.md#secretenctype)

***

### targetMessageKey?

> `optional` **targetMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:30935](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30935)

SecretEncryptedMessage targetMessageKey.

#### Implementation of

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md).[`targetMessageKey`](../interfaces/ISecretEncryptedMessage.md#targetmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:31014](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31014)

Converts this SecretEncryptedMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SecretEncryptedMessage`](SecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:30951](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30951)

Creates a new SecretEncryptedMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md)

Properties to set

#### Returns

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

SecretEncryptedMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SecretEncryptedMessage`](SecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:30977](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30977)

Decodes a SecretEncryptedMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

SecretEncryptedMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SecretEncryptedMessage`](SecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:30986](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30986)

Decodes a SecretEncryptedMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

SecretEncryptedMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30959](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30959)

Encodes the specified SecretEncryptedMessage message. Does not implicitly [verify](SecretEncryptedMessage.md#verify) messages.

#### Parameters

##### message

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md)

SecretEncryptedMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30967](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30967)

Encodes the specified SecretEncryptedMessage message, length delimited. Does not implicitly [verify](SecretEncryptedMessage.md#verify) messages.

#### Parameters

##### message

[`ISecretEncryptedMessage`](../interfaces/ISecretEncryptedMessage.md)

SecretEncryptedMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SecretEncryptedMessage`](SecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:31000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31000)

Creates a SecretEncryptedMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

SecretEncryptedMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:31021](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31021)

Gets the default type url for SecretEncryptedMessage

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

Defined in: [WAProto/index.d.ts:31008](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31008)

Creates a plain object from a SecretEncryptedMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SecretEncryptedMessage`](SecretEncryptedMessage.md)

SecretEncryptedMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30993](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30993)

Verifies a SecretEncryptedMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
