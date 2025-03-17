# Class: BotSessionMetadata

Defined in: [WAProto/index.d.ts:5943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5943)

Represents a BotSessionMetadata.

## Implements

- [`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md)

## Constructors

### new BotSessionMetadata()

> **new BotSessionMetadata**(`properties`?): [`BotSessionMetadata`](BotSessionMetadata.md)

Defined in: [WAProto/index.d.ts:5949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5949)

Constructs a new BotSessionMetadata.

#### Parameters

##### properties?

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md)

Properties to set

#### Returns

[`BotSessionMetadata`](BotSessionMetadata.md)

## Properties

### sessionId?

> `optional` **sessionId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5952](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5952)

BotSessionMetadata sessionId.

#### Implementation of

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md).[`sessionId`](../interfaces/IBotSessionMetadata.md#sessionid)

***

### sessionSource?

> `optional` **sessionSource**: `null` \| [`BotSessionSource`](../enumerations/BotSessionSource.md)

Defined in: [WAProto/index.d.ts:5955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5955)

BotSessionMetadata sessionSource.

#### Implementation of

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md).[`sessionSource`](../interfaces/IBotSessionMetadata.md#sessionsource)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6025](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6025)

Converts this BotSessionMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotSessionMetadata`](BotSessionMetadata.md)

Defined in: [WAProto/index.d.ts:5962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5962)

Creates a new BotSessionMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md)

Properties to set

#### Returns

[`BotSessionMetadata`](BotSessionMetadata.md)

BotSessionMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotSessionMetadata`](BotSessionMetadata.md)

Defined in: [WAProto/index.d.ts:5988](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5988)

Decodes a BotSessionMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotSessionMetadata`](BotSessionMetadata.md)

BotSessionMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotSessionMetadata`](BotSessionMetadata.md)

Defined in: [WAProto/index.d.ts:5997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5997)

Decodes a BotSessionMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotSessionMetadata`](BotSessionMetadata.md)

BotSessionMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5970](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5970)

Encodes the specified BotSessionMetadata message. Does not implicitly [verify](BotSessionMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md)

BotSessionMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5978](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5978)

Encodes the specified BotSessionMetadata message, length delimited. Does not implicitly [verify](BotSessionMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotSessionMetadata`](../interfaces/IBotSessionMetadata.md)

BotSessionMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotSessionMetadata`](BotSessionMetadata.md)

Defined in: [WAProto/index.d.ts:6011](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6011)

Creates a BotSessionMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotSessionMetadata`](BotSessionMetadata.md)

BotSessionMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6032](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6032)

Gets the default type url for BotSessionMetadata

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

Defined in: [WAProto/index.d.ts:6019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6019)

Creates a plain object from a BotSessionMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotSessionMetadata`](BotSessionMetadata.md)

BotSessionMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6004](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6004)

Verifies a BotSessionMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
