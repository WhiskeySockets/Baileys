# Class: BotMemoryMetadata

Defined in: [WAProto/index.d.ts:4208](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4208)

Represents a BotMemoryMetadata.

## Implements

- [`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md)

## Constructors

### new BotMemoryMetadata()

> **new BotMemoryMetadata**(`properties`?): [`BotMemoryMetadata`](BotMemoryMetadata.md)

Defined in: [WAProto/index.d.ts:4214](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4214)

Constructs a new BotMemoryMetadata.

#### Parameters

##### properties?

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md)

Properties to set

#### Returns

[`BotMemoryMetadata`](BotMemoryMetadata.md)

## Properties

### addedFacts

> **addedFacts**: [`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)[]

Defined in: [WAProto/index.d.ts:4217](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4217)

BotMemoryMetadata addedFacts.

#### Implementation of

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md).[`addedFacts`](../interfaces/IBotMemoryMetadata.md#addedfacts)

***

### disclaimer?

> `optional` **disclaimer**: `null` \| `string`

Defined in: [WAProto/index.d.ts:4223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4223)

BotMemoryMetadata disclaimer.

#### Implementation of

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md).[`disclaimer`](../interfaces/IBotMemoryMetadata.md#disclaimer)

***

### removedFacts

> **removedFacts**: [`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)[]

Defined in: [WAProto/index.d.ts:4220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4220)

BotMemoryMetadata removedFacts.

#### Implementation of

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md).[`removedFacts`](../interfaces/IBotMemoryMetadata.md#removedfacts)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:4293](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4293)

Converts this BotMemoryMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotMemoryMetadata`](BotMemoryMetadata.md)

Defined in: [WAProto/index.d.ts:4230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4230)

Creates a new BotMemoryMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md)

Properties to set

#### Returns

[`BotMemoryMetadata`](BotMemoryMetadata.md)

BotMemoryMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotMemoryMetadata`](BotMemoryMetadata.md)

Defined in: [WAProto/index.d.ts:4256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4256)

Decodes a BotMemoryMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotMemoryMetadata`](BotMemoryMetadata.md)

BotMemoryMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotMemoryMetadata`](BotMemoryMetadata.md)

Defined in: [WAProto/index.d.ts:4265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4265)

Decodes a BotMemoryMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotMemoryMetadata`](BotMemoryMetadata.md)

BotMemoryMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4238)

Encodes the specified BotMemoryMetadata message. Does not implicitly [verify](BotMemoryMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md)

BotMemoryMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4246)

Encodes the specified BotMemoryMetadata message, length delimited. Does not implicitly [verify](BotMemoryMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotMemoryMetadata`](../interfaces/IBotMemoryMetadata.md)

BotMemoryMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotMemoryMetadata`](BotMemoryMetadata.md)

Defined in: [WAProto/index.d.ts:4279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4279)

Creates a BotMemoryMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotMemoryMetadata`](BotMemoryMetadata.md)

BotMemoryMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:4300](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4300)

Gets the default type url for BotMemoryMetadata

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

Defined in: [WAProto/index.d.ts:4287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4287)

Creates a plain object from a BotMemoryMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotMemoryMetadata`](BotMemoryMetadata.md)

BotMemoryMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:4272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4272)

Verifies a BotMemoryMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
