# Class: SendPaymentMessage

Defined in: [WAProto/index.d.ts:31047](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31047)

Represents a SendPaymentMessage.

## Implements

- [`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md)

## Constructors

### new SendPaymentMessage()

> **new SendPaymentMessage**(`properties`?): [`SendPaymentMessage`](SendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:31053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31053)

Constructs a new SendPaymentMessage.

#### Parameters

##### properties?

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md)

Properties to set

#### Returns

[`SendPaymentMessage`](SendPaymentMessage.md)

## Properties

### background?

> `optional` **background**: `null` \| [`IPaymentBackground`](../../../interfaces/IPaymentBackground.md)

Defined in: [WAProto/index.d.ts:31062](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31062)

SendPaymentMessage background.

#### Implementation of

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md).[`background`](../interfaces/ISendPaymentMessage.md#background)

***

### noteMessage?

> `optional` **noteMessage**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:31056](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31056)

SendPaymentMessage noteMessage.

#### Implementation of

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md).[`noteMessage`](../interfaces/ISendPaymentMessage.md#notemessage)

***

### requestMessageKey?

> `optional` **requestMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:31059](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31059)

SendPaymentMessage requestMessageKey.

#### Implementation of

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md).[`requestMessageKey`](../interfaces/ISendPaymentMessage.md#requestmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:31132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31132)

Converts this SendPaymentMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SendPaymentMessage`](SendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:31069](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31069)

Creates a new SendPaymentMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md)

Properties to set

#### Returns

[`SendPaymentMessage`](SendPaymentMessage.md)

SendPaymentMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SendPaymentMessage`](SendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:31095](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31095)

Decodes a SendPaymentMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SendPaymentMessage`](SendPaymentMessage.md)

SendPaymentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SendPaymentMessage`](SendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:31104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31104)

Decodes a SendPaymentMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SendPaymentMessage`](SendPaymentMessage.md)

SendPaymentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31077](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31077)

Encodes the specified SendPaymentMessage message. Does not implicitly [verify](SendPaymentMessage.md#verify) messages.

#### Parameters

##### message

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md)

SendPaymentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31085](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31085)

Encodes the specified SendPaymentMessage message, length delimited. Does not implicitly [verify](SendPaymentMessage.md#verify) messages.

#### Parameters

##### message

[`ISendPaymentMessage`](../interfaces/ISendPaymentMessage.md)

SendPaymentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SendPaymentMessage`](SendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:31118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31118)

Creates a SendPaymentMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SendPaymentMessage`](SendPaymentMessage.md)

SendPaymentMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:31139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31139)

Gets the default type url for SendPaymentMessage

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

Defined in: [WAProto/index.d.ts:31126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31126)

Creates a plain object from a SendPaymentMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SendPaymentMessage`](SendPaymentMessage.md)

SendPaymentMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:31111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31111)

Verifies a SendPaymentMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
