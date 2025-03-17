# Class: BotRenderingMetadata

Defined in: [WAProto/index.d.ts:5737](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5737)

Represents a BotRenderingMetadata.

## Implements

- [`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md)

## Constructors

### new BotRenderingMetadata()

> **new BotRenderingMetadata**(`properties`?): [`BotRenderingMetadata`](BotRenderingMetadata.md)

Defined in: [WAProto/index.d.ts:5743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5743)

Constructs a new BotRenderingMetadata.

#### Parameters

##### properties?

[`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md)

Properties to set

#### Returns

[`BotRenderingMetadata`](BotRenderingMetadata.md)

## Properties

### keywords

> **keywords**: [`IKeyword`](../namespaces/BotRenderingMetadata/interfaces/IKeyword.md)[]

Defined in: [WAProto/index.d.ts:5746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5746)

BotRenderingMetadata keywords.

#### Implementation of

[`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md).[`keywords`](../interfaces/IBotRenderingMetadata.md#keywords)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5816](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5816)

Converts this BotRenderingMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotRenderingMetadata`](BotRenderingMetadata.md)

Defined in: [WAProto/index.d.ts:5753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5753)

Creates a new BotRenderingMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md)

Properties to set

#### Returns

[`BotRenderingMetadata`](BotRenderingMetadata.md)

BotRenderingMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotRenderingMetadata`](BotRenderingMetadata.md)

Defined in: [WAProto/index.d.ts:5779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5779)

Decodes a BotRenderingMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotRenderingMetadata`](BotRenderingMetadata.md)

BotRenderingMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotRenderingMetadata`](BotRenderingMetadata.md)

Defined in: [WAProto/index.d.ts:5788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5788)

Decodes a BotRenderingMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotRenderingMetadata`](BotRenderingMetadata.md)

BotRenderingMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5761](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5761)

Encodes the specified BotRenderingMetadata message. Does not implicitly [verify](BotRenderingMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md)

BotRenderingMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5769)

Encodes the specified BotRenderingMetadata message, length delimited. Does not implicitly [verify](BotRenderingMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotRenderingMetadata`](../interfaces/IBotRenderingMetadata.md)

BotRenderingMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotRenderingMetadata`](BotRenderingMetadata.md)

Defined in: [WAProto/index.d.ts:5802](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5802)

Creates a BotRenderingMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotRenderingMetadata`](BotRenderingMetadata.md)

BotRenderingMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5823)

Gets the default type url for BotRenderingMetadata

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

Defined in: [WAProto/index.d.ts:5810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5810)

Creates a plain object from a BotRenderingMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotRenderingMetadata`](BotRenderingMetadata.md)

BotRenderingMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5795)

Verifies a BotRenderingMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
