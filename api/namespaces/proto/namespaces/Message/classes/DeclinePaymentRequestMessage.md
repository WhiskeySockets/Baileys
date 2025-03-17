# Class: DeclinePaymentRequestMessage

Defined in: [WAProto/index.d.ts:20299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20299)

Represents a DeclinePaymentRequestMessage.

## Implements

- [`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md)

## Constructors

### new DeclinePaymentRequestMessage()

> **new DeclinePaymentRequestMessage**(`properties`?): [`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:20305](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20305)

Constructs a new DeclinePaymentRequestMessage.

#### Parameters

##### properties?

[`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md)

Properties to set

#### Returns

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:20308](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20308)

DeclinePaymentRequestMessage key.

#### Implementation of

[`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md).[`key`](../interfaces/IDeclinePaymentRequestMessage.md#key)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20378)

Converts this DeclinePaymentRequestMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:20315](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20315)

Creates a new DeclinePaymentRequestMessage instance using the specified properties.

#### Parameters

##### properties?

[`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md)

Properties to set

#### Returns

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:20341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20341)

Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:20350](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20350)

Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20323)

Encodes the specified DeclinePaymentRequestMessage message. Does not implicitly [verify](DeclinePaymentRequestMessage.md#verify) messages.

#### Parameters

##### message

[`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20331](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20331)

Encodes the specified DeclinePaymentRequestMessage message, length delimited. Does not implicitly [verify](DeclinePaymentRequestMessage.md#verify) messages.

#### Parameters

##### message

[`IDeclinePaymentRequestMessage`](../interfaces/IDeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:20364](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20364)

Creates a DeclinePaymentRequestMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20385](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20385)

Gets the default type url for DeclinePaymentRequestMessage

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

Defined in: [WAProto/index.d.ts:20372](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20372)

Creates a plain object from a DeclinePaymentRequestMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeclinePaymentRequestMessage`](DeclinePaymentRequestMessage.md)

DeclinePaymentRequestMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20357](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20357)

Verifies a DeclinePaymentRequestMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
