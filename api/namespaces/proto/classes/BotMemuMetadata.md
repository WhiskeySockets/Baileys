# Class: BotMemuMetadata

Defined in: [WAProto/index.d.ts:4311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4311)

Represents a BotMemuMetadata.

## Implements

- [`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md)

## Constructors

### new BotMemuMetadata()

> **new BotMemuMetadata**(`properties`?): [`BotMemuMetadata`](BotMemuMetadata.md)

Defined in: [WAProto/index.d.ts:4317](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4317)

Constructs a new BotMemuMetadata.

#### Parameters

##### properties?

[`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md)

Properties to set

#### Returns

[`BotMemuMetadata`](BotMemuMetadata.md)

## Properties

### faceImages

> **faceImages**: [`IBotMediaMetadata`](../interfaces/IBotMediaMetadata.md)[]

Defined in: [WAProto/index.d.ts:4320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4320)

BotMemuMetadata faceImages.

#### Implementation of

[`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md).[`faceImages`](../interfaces/IBotMemuMetadata.md#faceimages)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:4390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4390)

Converts this BotMemuMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotMemuMetadata`](BotMemuMetadata.md)

Defined in: [WAProto/index.d.ts:4327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4327)

Creates a new BotMemuMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md)

Properties to set

#### Returns

[`BotMemuMetadata`](BotMemuMetadata.md)

BotMemuMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotMemuMetadata`](BotMemuMetadata.md)

Defined in: [WAProto/index.d.ts:4353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4353)

Decodes a BotMemuMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotMemuMetadata`](BotMemuMetadata.md)

BotMemuMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotMemuMetadata`](BotMemuMetadata.md)

Defined in: [WAProto/index.d.ts:4362](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4362)

Decodes a BotMemuMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotMemuMetadata`](BotMemuMetadata.md)

BotMemuMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4335](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4335)

Encodes the specified BotMemuMetadata message. Does not implicitly [verify](BotMemuMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md)

BotMemuMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4343](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4343)

Encodes the specified BotMemuMetadata message, length delimited. Does not implicitly [verify](BotMemuMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMemuMetadata`](../interfaces/IBotMemuMetadata.md)

BotMemuMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotMemuMetadata`](BotMemuMetadata.md)

Defined in: [WAProto/index.d.ts:4376](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4376)

Creates a BotMemuMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotMemuMetadata`](BotMemuMetadata.md)

BotMemuMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:4397](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4397)

Gets the default type url for BotMemuMetadata

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

Defined in: [WAProto/index.d.ts:4384](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4384)

Creates a plain object from a BotMemuMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotMemuMetadata`](BotMemuMetadata.md)

BotMemuMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:4369](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4369)

Verifies a BotMemuMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
