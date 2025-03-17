# Class: CancelPaymentRequestMessage

Defined in: [WAProto/index.d.ts:19653](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19653)

Represents a CancelPaymentRequestMessage.

## Implements

- [`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md)

## Constructors

### new CancelPaymentRequestMessage()

> **new CancelPaymentRequestMessage**(`properties`?): [`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:19659](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19659)

Constructs a new CancelPaymentRequestMessage.

#### Parameters

##### properties?

[`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md)

Properties to set

#### Returns

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:19662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19662)

CancelPaymentRequestMessage key.

#### Implementation of

[`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md).[`key`](../interfaces/ICancelPaymentRequestMessage.md#key)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19732)

Converts this CancelPaymentRequestMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:19669](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19669)

Creates a new CancelPaymentRequestMessage instance using the specified properties.

#### Parameters

##### properties?

[`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md)

Properties to set

#### Returns

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

CancelPaymentRequestMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:19695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19695)

Decodes a CancelPaymentRequestMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

CancelPaymentRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:19704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19704)

Decodes a CancelPaymentRequestMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

CancelPaymentRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19677](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19677)

Encodes the specified CancelPaymentRequestMessage message. Does not implicitly [verify](CancelPaymentRequestMessage.md#verify) messages.

#### Parameters

##### message

[`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md)

CancelPaymentRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19685](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19685)

Encodes the specified CancelPaymentRequestMessage message, length delimited. Does not implicitly [verify](CancelPaymentRequestMessage.md#verify) messages.

#### Parameters

##### message

[`ICancelPaymentRequestMessage`](../interfaces/ICancelPaymentRequestMessage.md)

CancelPaymentRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:19718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19718)

Creates a CancelPaymentRequestMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

CancelPaymentRequestMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19739)

Gets the default type url for CancelPaymentRequestMessage

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

Defined in: [WAProto/index.d.ts:19726](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19726)

Creates a plain object from a CancelPaymentRequestMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`CancelPaymentRequestMessage`](CancelPaymentRequestMessage.md)

CancelPaymentRequestMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19711)

Verifies a CancelPaymentRequestMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
