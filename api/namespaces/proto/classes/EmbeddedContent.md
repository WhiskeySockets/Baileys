# Class: EmbeddedContent

Defined in: [WAProto/index.d.ts:12355](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12355)

Represents an EmbeddedContent.

## Implements

- [`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

## Constructors

### new EmbeddedContent()

> **new EmbeddedContent**(`properties`?): [`EmbeddedContent`](EmbeddedContent.md)

Defined in: [WAProto/index.d.ts:12361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12361)

Constructs a new EmbeddedContent.

#### Parameters

##### properties?

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

Properties to set

#### Returns

[`EmbeddedContent`](EmbeddedContent.md)

## Properties

### content?

> `optional` **content**: `"embeddedMessage"` \| `"embeddedMusic"`

Defined in: [WAProto/index.d.ts:12370](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12370)

EmbeddedContent content.

***

### embeddedMessage?

> `optional` **embeddedMessage**: `null` \| [`IEmbeddedMessage`](../interfaces/IEmbeddedMessage.md)

Defined in: [WAProto/index.d.ts:12364](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12364)

EmbeddedContent embeddedMessage.

#### Implementation of

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md).[`embeddedMessage`](../interfaces/IEmbeddedContent.md#embeddedmessage)

***

### embeddedMusic?

> `optional` **embeddedMusic**: `null` \| [`IEmbeddedMusic`](../interfaces/IEmbeddedMusic.md)

Defined in: [WAProto/index.d.ts:12367](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12367)

EmbeddedContent embeddedMusic.

#### Implementation of

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md).[`embeddedMusic`](../interfaces/IEmbeddedContent.md#embeddedmusic)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:12440](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12440)

Converts this EmbeddedContent to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EmbeddedContent`](EmbeddedContent.md)

Defined in: [WAProto/index.d.ts:12377](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12377)

Creates a new EmbeddedContent instance using the specified properties.

#### Parameters

##### properties?

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

Properties to set

#### Returns

[`EmbeddedContent`](EmbeddedContent.md)

EmbeddedContent instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EmbeddedContent`](EmbeddedContent.md)

Defined in: [WAProto/index.d.ts:12403](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12403)

Decodes an EmbeddedContent message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EmbeddedContent`](EmbeddedContent.md)

EmbeddedContent

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EmbeddedContent`](EmbeddedContent.md)

Defined in: [WAProto/index.d.ts:12412](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12412)

Decodes an EmbeddedContent message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EmbeddedContent`](EmbeddedContent.md)

EmbeddedContent

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12385](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12385)

Encodes the specified EmbeddedContent message. Does not implicitly [verify](EmbeddedContent.md#verify) messages.

#### Parameters

##### message

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

EmbeddedContent message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12393)

Encodes the specified EmbeddedContent message, length delimited. Does not implicitly [verify](EmbeddedContent.md#verify) messages.

#### Parameters

##### message

[`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

EmbeddedContent message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EmbeddedContent`](EmbeddedContent.md)

Defined in: [WAProto/index.d.ts:12426](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12426)

Creates an EmbeddedContent message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EmbeddedContent`](EmbeddedContent.md)

EmbeddedContent

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:12447](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12447)

Gets the default type url for EmbeddedContent

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

Defined in: [WAProto/index.d.ts:12434](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12434)

Creates a plain object from an EmbeddedContent message. Also converts values to other types if specified.

#### Parameters

##### message

[`EmbeddedContent`](EmbeddedContent.md)

EmbeddedContent

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12419](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12419)

Verifies an EmbeddedContent message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
