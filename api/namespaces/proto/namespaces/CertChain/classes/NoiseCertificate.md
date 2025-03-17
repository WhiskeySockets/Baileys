# Class: NoiseCertificate

Defined in: [WAProto/index.d.ts:6594](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6594)

Represents a NoiseCertificate.

## Implements

- [`INoiseCertificate`](../interfaces/INoiseCertificate.md)

## Constructors

### new NoiseCertificate()

> **new NoiseCertificate**(`properties`?): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6600](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6600)

Constructs a new NoiseCertificate.

#### Parameters

##### properties?

[`INoiseCertificate`](../interfaces/INoiseCertificate.md)

Properties to set

#### Returns

[`NoiseCertificate`](NoiseCertificate.md)

## Properties

### details?

> `optional` **details**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:6603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6603)

NoiseCertificate details.

#### Implementation of

[`INoiseCertificate`](../interfaces/INoiseCertificate.md).[`details`](../interfaces/INoiseCertificate.md#details)

***

### signature?

> `optional` **signature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:6606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6606)

NoiseCertificate signature.

#### Implementation of

[`INoiseCertificate`](../interfaces/INoiseCertificate.md).[`signature`](../interfaces/INoiseCertificate.md#signature)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6676)

Converts this NoiseCertificate to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6613)

Creates a new NoiseCertificate instance using the specified properties.

#### Parameters

##### properties?

[`INoiseCertificate`](../interfaces/INoiseCertificate.md)

Properties to set

#### Returns

[`NoiseCertificate`](NoiseCertificate.md)

NoiseCertificate instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6639)

Decodes a NoiseCertificate message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NoiseCertificate`](NoiseCertificate.md)

NoiseCertificate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6648)

Decodes a NoiseCertificate message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NoiseCertificate`](NoiseCertificate.md)

NoiseCertificate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6621)

Encodes the specified NoiseCertificate message. Does not implicitly [verify](NoiseCertificate.md#verify) messages.

#### Parameters

##### message

[`INoiseCertificate`](../interfaces/INoiseCertificate.md)

NoiseCertificate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6629](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6629)

Encodes the specified NoiseCertificate message, length delimited. Does not implicitly [verify](NoiseCertificate.md#verify) messages.

#### Parameters

##### message

[`INoiseCertificate`](../interfaces/INoiseCertificate.md)

NoiseCertificate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:6662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6662)

Creates a NoiseCertificate message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NoiseCertificate`](NoiseCertificate.md)

NoiseCertificate

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6683](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6683)

Gets the default type url for NoiseCertificate

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

Defined in: [WAProto/index.d.ts:6670](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6670)

Creates a plain object from a NoiseCertificate message. Also converts values to other types if specified.

#### Parameters

##### message

[`NoiseCertificate`](NoiseCertificate.md)

NoiseCertificate

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6655](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6655)

Verifies a NoiseCertificate message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
