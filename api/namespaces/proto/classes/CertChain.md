# Class: CertChain

Defined in: [WAProto/index.d.ts:6489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6489)

Represents a CertChain.

## Implements

- [`ICertChain`](../interfaces/ICertChain.md)

## Constructors

### new CertChain()

> **new CertChain**(`properties`?): [`CertChain`](CertChain.md)

Defined in: [WAProto/index.d.ts:6495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6495)

Constructs a new CertChain.

#### Parameters

##### properties?

[`ICertChain`](../interfaces/ICertChain.md)

Properties to set

#### Returns

[`CertChain`](CertChain.md)

## Properties

### intermediate?

> `optional` **intermediate**: `null` \| [`INoiseCertificate`](../namespaces/CertChain/interfaces/INoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6501)

CertChain intermediate.

#### Implementation of

[`ICertChain`](../interfaces/ICertChain.md).[`intermediate`](../interfaces/ICertChain.md#intermediate)

***

### leaf?

> `optional` **leaf**: `null` \| [`INoiseCertificate`](../namespaces/CertChain/interfaces/INoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6498](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6498)

CertChain leaf.

#### Implementation of

[`ICertChain`](../interfaces/ICertChain.md).[`leaf`](../interfaces/ICertChain.md#leaf)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6571)

Converts this CertChain to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CertChain`](CertChain.md)

Defined in: [WAProto/index.d.ts:6508](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6508)

Creates a new CertChain instance using the specified properties.

#### Parameters

##### properties?

[`ICertChain`](../interfaces/ICertChain.md)

Properties to set

#### Returns

[`CertChain`](CertChain.md)

CertChain instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CertChain`](CertChain.md)

Defined in: [WAProto/index.d.ts:6534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6534)

Decodes a CertChain message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CertChain`](CertChain.md)

CertChain

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CertChain`](CertChain.md)

Defined in: [WAProto/index.d.ts:6543](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6543)

Decodes a CertChain message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CertChain`](CertChain.md)

CertChain

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6516](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6516)

Encodes the specified CertChain message. Does not implicitly [verify](CertChain.md#verify) messages.

#### Parameters

##### message

[`ICertChain`](../interfaces/ICertChain.md)

CertChain message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6524](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6524)

Encodes the specified CertChain message, length delimited. Does not implicitly [verify](CertChain.md#verify) messages.

#### Parameters

##### message

[`ICertChain`](../interfaces/ICertChain.md)

CertChain message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CertChain`](CertChain.md)

Defined in: [WAProto/index.d.ts:6557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6557)

Creates a CertChain message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CertChain`](CertChain.md)

CertChain

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6578)

Gets the default type url for CertChain

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

Defined in: [WAProto/index.d.ts:6565](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6565)

Creates a plain object from a CertChain message. Also converts values to other types if specified.

#### Parameters

##### message

[`CertChain`](CertChain.md)

CertChain

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6550)

Verifies a CertChain message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
