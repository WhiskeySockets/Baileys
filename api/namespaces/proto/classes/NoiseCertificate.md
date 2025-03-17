# Class: NoiseCertificate

Defined in: [WAProto/index.d.ts:34618](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34618)

Represents a NoiseCertificate.

## Implements

- [`INoiseCertificate`](../interfaces/INoiseCertificate.md)

## Constructors

### new NoiseCertificate()

> **new NoiseCertificate**(`properties`?): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:34624](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34624)

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

Defined in: [WAProto/index.d.ts:34627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34627)

NoiseCertificate details.

#### Implementation of

[`INoiseCertificate`](../interfaces/INoiseCertificate.md).[`details`](../interfaces/INoiseCertificate.md#details)

***

### signature?

> `optional` **signature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:34630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34630)

NoiseCertificate signature.

#### Implementation of

[`INoiseCertificate`](../interfaces/INoiseCertificate.md).[`signature`](../interfaces/INoiseCertificate.md#signature)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34700](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34700)

Converts this NoiseCertificate to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NoiseCertificate`](NoiseCertificate.md)

Defined in: [WAProto/index.d.ts:34637](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34637)

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

Defined in: [WAProto/index.d.ts:34663](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34663)

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

Defined in: [WAProto/index.d.ts:34672](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34672)

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

Defined in: [WAProto/index.d.ts:34645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34645)

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

Defined in: [WAProto/index.d.ts:34653](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34653)

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

Defined in: [WAProto/index.d.ts:34686](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34686)

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

Defined in: [WAProto/index.d.ts:34707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34707)

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

Defined in: [WAProto/index.d.ts:34694](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34694)

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

Defined in: [WAProto/index.d.ts:34679](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34679)

Verifies a NoiseCertificate message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
