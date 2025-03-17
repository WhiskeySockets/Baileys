# Class: SenderKeyMessage

Defined in: [WAProto/index.d.ts:38336](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38336)

Represents a SenderKeyMessage.

## Implements

- [`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md)

## Constructors

### new SenderKeyMessage()

> **new SenderKeyMessage**(`properties`?): [`SenderKeyMessage`](SenderKeyMessage.md)

Defined in: [WAProto/index.d.ts:38342](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38342)

Constructs a new SenderKeyMessage.

#### Parameters

##### properties?

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md)

Properties to set

#### Returns

[`SenderKeyMessage`](SenderKeyMessage.md)

## Properties

### ciphertext?

> `optional` **ciphertext**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38351)

SenderKeyMessage ciphertext.

#### Implementation of

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md).[`ciphertext`](../interfaces/ISenderKeyMessage.md#ciphertext)

***

### id?

> `optional` **id**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38345](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38345)

SenderKeyMessage id.

#### Implementation of

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md).[`id`](../interfaces/ISenderKeyMessage.md#id)

***

### iteration?

> `optional` **iteration**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38348)

SenderKeyMessage iteration.

#### Implementation of

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md).[`iteration`](../interfaces/ISenderKeyMessage.md#iteration)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38421](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38421)

Converts this SenderKeyMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderKeyMessage`](SenderKeyMessage.md)

Defined in: [WAProto/index.d.ts:38358](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38358)

Creates a new SenderKeyMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md)

Properties to set

#### Returns

[`SenderKeyMessage`](SenderKeyMessage.md)

SenderKeyMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderKeyMessage`](SenderKeyMessage.md)

Defined in: [WAProto/index.d.ts:38384](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38384)

Decodes a SenderKeyMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderKeyMessage`](SenderKeyMessage.md)

SenderKeyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderKeyMessage`](SenderKeyMessage.md)

Defined in: [WAProto/index.d.ts:38393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38393)

Decodes a SenderKeyMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderKeyMessage`](SenderKeyMessage.md)

SenderKeyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38366)

Encodes the specified SenderKeyMessage message. Does not implicitly [verify](SenderKeyMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md)

SenderKeyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38374)

Encodes the specified SenderKeyMessage message, length delimited. Does not implicitly [verify](SenderKeyMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyMessage`](../interfaces/ISenderKeyMessage.md)

SenderKeyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderKeyMessage`](SenderKeyMessage.md)

Defined in: [WAProto/index.d.ts:38407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38407)

Creates a SenderKeyMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderKeyMessage`](SenderKeyMessage.md)

SenderKeyMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38428](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38428)

Gets the default type url for SenderKeyMessage

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

Defined in: [WAProto/index.d.ts:38415](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38415)

Creates a plain object from a SenderKeyMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderKeyMessage`](SenderKeyMessage.md)

SenderKeyMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38400)

Verifies a SenderKeyMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
