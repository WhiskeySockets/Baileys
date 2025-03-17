# Class: EncEventResponseMessage

Defined in: [WAProto/index.d.ts:20837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20837)

Represents an EncEventResponseMessage.

## Implements

- [`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md)

## Constructors

### new EncEventResponseMessage()

> **new EncEventResponseMessage**(`properties`?): [`EncEventResponseMessage`](EncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:20843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20843)

Constructs a new EncEventResponseMessage.

#### Parameters

##### properties?

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md)

Properties to set

#### Returns

[`EncEventResponseMessage`](EncEventResponseMessage.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20852](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20852)

EncEventResponseMessage encIv.

#### Implementation of

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md).[`encIv`](../interfaces/IEncEventResponseMessage.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20849](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20849)

EncEventResponseMessage encPayload.

#### Implementation of

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md).[`encPayload`](../interfaces/IEncEventResponseMessage.md#encpayload)

***

### eventCreationMessageKey?

> `optional` **eventCreationMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:20846](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20846)

EncEventResponseMessage eventCreationMessageKey.

#### Implementation of

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md).[`eventCreationMessageKey`](../interfaces/IEncEventResponseMessage.md#eventcreationmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20922)

Converts this EncEventResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EncEventResponseMessage`](EncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:20859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20859)

Creates a new EncEventResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md)

Properties to set

#### Returns

[`EncEventResponseMessage`](EncEventResponseMessage.md)

EncEventResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EncEventResponseMessage`](EncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:20885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20885)

Decodes an EncEventResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EncEventResponseMessage`](EncEventResponseMessage.md)

EncEventResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EncEventResponseMessage`](EncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:20894](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20894)

Decodes an EncEventResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EncEventResponseMessage`](EncEventResponseMessage.md)

EncEventResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20867](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20867)

Encodes the specified EncEventResponseMessage message. Does not implicitly [verify](EncEventResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md)

EncEventResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20875)

Encodes the specified EncEventResponseMessage message, length delimited. Does not implicitly [verify](EncEventResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IEncEventResponseMessage`](../interfaces/IEncEventResponseMessage.md)

EncEventResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EncEventResponseMessage`](EncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:20908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20908)

Creates an EncEventResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EncEventResponseMessage`](EncEventResponseMessage.md)

EncEventResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20929](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20929)

Gets the default type url for EncEventResponseMessage

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

Defined in: [WAProto/index.d.ts:20916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20916)

Creates a plain object from an EncEventResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EncEventResponseMessage`](EncEventResponseMessage.md)

EncEventResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20901)

Verifies an EncEventResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
