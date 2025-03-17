# Class: MessageSecretMessage

Defined in: [WAProto/index.d.ts:33541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33541)

Represents a MessageSecretMessage.

## Implements

- [`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md)

## Constructors

### new MessageSecretMessage()

> **new MessageSecretMessage**(`properties`?): [`MessageSecretMessage`](MessageSecretMessage.md)

Defined in: [WAProto/index.d.ts:33547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33547)

Constructs a new MessageSecretMessage.

#### Parameters

##### properties?

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md)

Properties to set

#### Returns

[`MessageSecretMessage`](MessageSecretMessage.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33553](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33553)

MessageSecretMessage encIv.

#### Implementation of

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md).[`encIv`](../interfaces/IMessageSecretMessage.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33556)

MessageSecretMessage encPayload.

#### Implementation of

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md).[`encPayload`](../interfaces/IMessageSecretMessage.md#encpayload)

***

### version?

> `optional` **version**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33550)

MessageSecretMessage version.

#### Implementation of

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md).[`version`](../interfaces/IMessageSecretMessage.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:33626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33626)

Converts this MessageSecretMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MessageSecretMessage`](MessageSecretMessage.md)

Defined in: [WAProto/index.d.ts:33563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33563)

Creates a new MessageSecretMessage instance using the specified properties.

#### Parameters

##### properties?

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md)

Properties to set

#### Returns

[`MessageSecretMessage`](MessageSecretMessage.md)

MessageSecretMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MessageSecretMessage`](MessageSecretMessage.md)

Defined in: [WAProto/index.d.ts:33589](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33589)

Decodes a MessageSecretMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MessageSecretMessage`](MessageSecretMessage.md)

MessageSecretMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MessageSecretMessage`](MessageSecretMessage.md)

Defined in: [WAProto/index.d.ts:33598](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33598)

Decodes a MessageSecretMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MessageSecretMessage`](MessageSecretMessage.md)

MessageSecretMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:33571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33571)

Encodes the specified MessageSecretMessage message. Does not implicitly [verify](MessageSecretMessage.md#verify) messages.

#### Parameters

##### message

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md)

MessageSecretMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:33579](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33579)

Encodes the specified MessageSecretMessage message, length delimited. Does not implicitly [verify](MessageSecretMessage.md#verify) messages.

#### Parameters

##### message

[`IMessageSecretMessage`](../interfaces/IMessageSecretMessage.md)

MessageSecretMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MessageSecretMessage`](MessageSecretMessage.md)

Defined in: [WAProto/index.d.ts:33612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33612)

Creates a MessageSecretMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MessageSecretMessage`](MessageSecretMessage.md)

MessageSecretMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:33633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33633)

Gets the default type url for MessageSecretMessage

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

Defined in: [WAProto/index.d.ts:33620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33620)

Creates a plain object from a MessageSecretMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`MessageSecretMessage`](MessageSecretMessage.md)

MessageSecretMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:33605](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33605)

Verifies a MessageSecretMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
