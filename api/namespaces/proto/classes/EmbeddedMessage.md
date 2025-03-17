# Class: EmbeddedMessage

Defined in: [WAProto/index.d.ts:12461](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12461)

Represents an EmbeddedMessage.

## Implements

- [`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

## Constructors

### new EmbeddedMessage()

> **new EmbeddedMessage**(`properties`?): [`EmbeddedMessage`](EmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12467](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12467)

Constructs a new EmbeddedMessage.

#### Parameters

##### properties?

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

Properties to set

#### Returns

[`EmbeddedMessage`](EmbeddedMessage.md)

## Properties

### message?

> `optional` **message**: `null` \| [`IMessage`](../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:12473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12473)

EmbeddedMessage message.

#### Implementation of

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md).[`message`](../interfaces/IEmbeddedMessage.md#message)

***

### stanzaId?

> `optional` **stanzaId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:12470](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12470)

EmbeddedMessage stanzaId.

#### Implementation of

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md).[`stanzaId`](../interfaces/IEmbeddedMessage.md#stanzaid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:12543](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12543)

Converts this EmbeddedMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EmbeddedMessage`](EmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12480](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12480)

Creates a new EmbeddedMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

Properties to set

#### Returns

[`EmbeddedMessage`](EmbeddedMessage.md)

EmbeddedMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EmbeddedMessage`](EmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12506](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12506)

Decodes an EmbeddedMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EmbeddedMessage`](EmbeddedMessage.md)

EmbeddedMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EmbeddedMessage`](EmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12515](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12515)

Decodes an EmbeddedMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EmbeddedMessage`](EmbeddedMessage.md)

EmbeddedMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12488](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12488)

Encodes the specified EmbeddedMessage message. Does not implicitly [verify](EmbeddedMessage.md#verify) messages.

#### Parameters

##### message

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

EmbeddedMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12496)

Encodes the specified EmbeddedMessage message, length delimited. Does not implicitly [verify](EmbeddedMessage.md#verify) messages.

#### Parameters

##### message

[`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

EmbeddedMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EmbeddedMessage`](EmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12529](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12529)

Creates an EmbeddedMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EmbeddedMessage`](EmbeddedMessage.md)

EmbeddedMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:12550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12550)

Gets the default type url for EmbeddedMessage

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

Defined in: [WAProto/index.d.ts:12537](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12537)

Creates a plain object from an EmbeddedMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EmbeddedMessage`](EmbeddedMessage.md)

EmbeddedMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12522](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12522)

Verifies an EmbeddedMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
