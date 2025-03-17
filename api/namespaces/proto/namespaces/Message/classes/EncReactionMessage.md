# Class: EncReactionMessage

Defined in: [WAProto/index.d.ts:20946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20946)

Represents an EncReactionMessage.

## Implements

- [`IEncReactionMessage`](../interfaces/IEncReactionMessage.md)

## Constructors

### new EncReactionMessage()

> **new EncReactionMessage**(`properties`?): [`EncReactionMessage`](EncReactionMessage.md)

Defined in: [WAProto/index.d.ts:20952](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20952)

Constructs a new EncReactionMessage.

#### Parameters

##### properties?

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md)

Properties to set

#### Returns

[`EncReactionMessage`](EncReactionMessage.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20961](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20961)

EncReactionMessage encIv.

#### Implementation of

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md).[`encIv`](../interfaces/IEncReactionMessage.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:20958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20958)

EncReactionMessage encPayload.

#### Implementation of

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md).[`encPayload`](../interfaces/IEncReactionMessage.md#encpayload)

***

### targetMessageKey?

> `optional` **targetMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:20955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20955)

EncReactionMessage targetMessageKey.

#### Implementation of

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md).[`targetMessageKey`](../interfaces/IEncReactionMessage.md#targetmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21031](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21031)

Converts this EncReactionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EncReactionMessage`](EncReactionMessage.md)

Defined in: [WAProto/index.d.ts:20968](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20968)

Creates a new EncReactionMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md)

Properties to set

#### Returns

[`EncReactionMessage`](EncReactionMessage.md)

EncReactionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EncReactionMessage`](EncReactionMessage.md)

Defined in: [WAProto/index.d.ts:20994](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20994)

Decodes an EncReactionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EncReactionMessage`](EncReactionMessage.md)

EncReactionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EncReactionMessage`](EncReactionMessage.md)

Defined in: [WAProto/index.d.ts:21003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21003)

Decodes an EncReactionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EncReactionMessage`](EncReactionMessage.md)

EncReactionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20976](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20976)

Encodes the specified EncReactionMessage message. Does not implicitly [verify](EncReactionMessage.md#verify) messages.

#### Parameters

##### message

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md)

EncReactionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20984)

Encodes the specified EncReactionMessage message, length delimited. Does not implicitly [verify](EncReactionMessage.md#verify) messages.

#### Parameters

##### message

[`IEncReactionMessage`](../interfaces/IEncReactionMessage.md)

EncReactionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EncReactionMessage`](EncReactionMessage.md)

Defined in: [WAProto/index.d.ts:21017](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21017)

Creates an EncReactionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EncReactionMessage`](EncReactionMessage.md)

EncReactionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21038](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21038)

Gets the default type url for EncReactionMessage

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

Defined in: [WAProto/index.d.ts:21025](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21025)

Creates a plain object from an EncReactionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EncReactionMessage`](EncReactionMessage.md)

EncReactionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21010](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21010)

Verifies an EncReactionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
