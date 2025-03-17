# Class: VerifiedNameCertificate

Defined in: [WAProto/index.d.ts:48871](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48871)

Represents a VerifiedNameCertificate.

## Implements

- [`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

## Constructors

### new VerifiedNameCertificate()

> **new VerifiedNameCertificate**(`properties`?): [`VerifiedNameCertificate`](VerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:48877](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48877)

Constructs a new VerifiedNameCertificate.

#### Parameters

##### properties?

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

Properties to set

#### Returns

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

## Properties

### details?

> `optional` **details**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:48880](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48880)

VerifiedNameCertificate details.

#### Implementation of

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md).[`details`](../interfaces/IVerifiedNameCertificate.md#details)

***

### serverSignature?

> `optional` **serverSignature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:48886](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48886)

VerifiedNameCertificate serverSignature.

#### Implementation of

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md).[`serverSignature`](../interfaces/IVerifiedNameCertificate.md#serversignature)

***

### signature?

> `optional` **signature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:48883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48883)

VerifiedNameCertificate signature.

#### Implementation of

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md).[`signature`](../interfaces/IVerifiedNameCertificate.md#signature)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48956)

Converts this VerifiedNameCertificate to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`VerifiedNameCertificate`](VerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:48893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48893)

Creates a new VerifiedNameCertificate instance using the specified properties.

#### Parameters

##### properties?

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

Properties to set

#### Returns

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

VerifiedNameCertificate instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`VerifiedNameCertificate`](VerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:48919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48919)

Decodes a VerifiedNameCertificate message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

VerifiedNameCertificate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`VerifiedNameCertificate`](VerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:48928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48928)

Decodes a VerifiedNameCertificate message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

VerifiedNameCertificate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48901)

Encodes the specified VerifiedNameCertificate message. Does not implicitly [verify](VerifiedNameCertificate.md#verify) messages.

#### Parameters

##### message

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

VerifiedNameCertificate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48909](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48909)

Encodes the specified VerifiedNameCertificate message, length delimited. Does not implicitly [verify](VerifiedNameCertificate.md#verify) messages.

#### Parameters

##### message

[`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

VerifiedNameCertificate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`VerifiedNameCertificate`](VerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:48942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48942)

Creates a VerifiedNameCertificate message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

VerifiedNameCertificate

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48963](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48963)

Gets the default type url for VerifiedNameCertificate

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

Defined in: [WAProto/index.d.ts:48950](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48950)

Creates a plain object from a VerifiedNameCertificate message. Also converts values to other types if specified.

#### Parameters

##### message

[`VerifiedNameCertificate`](VerifiedNameCertificate.md)

VerifiedNameCertificate

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48935](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48935)

Verifies a VerifiedNameCertificate message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
