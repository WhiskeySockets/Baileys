# Class: EncryptedPairingRequest

Defined in: [WAProto/index.d.ts:12721](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12721)

Represents an EncryptedPairingRequest.

## Implements

- [`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md)

## Constructors

### new EncryptedPairingRequest()

> **new EncryptedPairingRequest**(`properties`?): [`EncryptedPairingRequest`](EncryptedPairingRequest.md)

Defined in: [WAProto/index.d.ts:12727](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12727)

Constructs a new EncryptedPairingRequest.

#### Parameters

##### properties?

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md)

Properties to set

#### Returns

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

## Properties

### encryptedPayload?

> `optional` **encryptedPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:12730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12730)

EncryptedPairingRequest encryptedPayload.

#### Implementation of

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md).[`encryptedPayload`](../interfaces/IEncryptedPairingRequest.md#encryptedpayload)

***

### iv?

> `optional` **iv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:12733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12733)

EncryptedPairingRequest iv.

#### Implementation of

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md).[`iv`](../interfaces/IEncryptedPairingRequest.md#iv)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:12803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12803)

Converts this EncryptedPairingRequest to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EncryptedPairingRequest`](EncryptedPairingRequest.md)

Defined in: [WAProto/index.d.ts:12740](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12740)

Creates a new EncryptedPairingRequest instance using the specified properties.

#### Parameters

##### properties?

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md)

Properties to set

#### Returns

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

EncryptedPairingRequest instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EncryptedPairingRequest`](EncryptedPairingRequest.md)

Defined in: [WAProto/index.d.ts:12766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12766)

Decodes an EncryptedPairingRequest message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

EncryptedPairingRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EncryptedPairingRequest`](EncryptedPairingRequest.md)

Defined in: [WAProto/index.d.ts:12775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12775)

Decodes an EncryptedPairingRequest message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

EncryptedPairingRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12748)

Encodes the specified EncryptedPairingRequest message. Does not implicitly [verify](EncryptedPairingRequest.md#verify) messages.

#### Parameters

##### message

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md)

EncryptedPairingRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12756)

Encodes the specified EncryptedPairingRequest message, length delimited. Does not implicitly [verify](EncryptedPairingRequest.md#verify) messages.

#### Parameters

##### message

[`IEncryptedPairingRequest`](../interfaces/IEncryptedPairingRequest.md)

EncryptedPairingRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EncryptedPairingRequest`](EncryptedPairingRequest.md)

Defined in: [WAProto/index.d.ts:12789](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12789)

Creates an EncryptedPairingRequest message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

EncryptedPairingRequest

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:12810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12810)

Gets the default type url for EncryptedPairingRequest

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

Defined in: [WAProto/index.d.ts:12797](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12797)

Creates a plain object from an EncryptedPairingRequest message. Also converts values to other types if specified.

#### Parameters

##### message

[`EncryptedPairingRequest`](EncryptedPairingRequest.md)

EncryptedPairingRequest

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12782](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12782)

Verifies an EncryptedPairingRequest message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
