# Class: BotMemoryFact

Defined in: [WAProto/index.d.ts:4102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4102)

Represents a BotMemoryFact.

## Implements

- [`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)

## Constructors

### new BotMemoryFact()

> **new BotMemoryFact**(`properties`?): [`BotMemoryFact`](BotMemoryFact.md)

Defined in: [WAProto/index.d.ts:4108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4108)

Constructs a new BotMemoryFact.

#### Parameters

##### properties?

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)

Properties to set

#### Returns

[`BotMemoryFact`](BotMemoryFact.md)

## Properties

### fact?

> `optional` **fact**: `null` \| `string`

Defined in: [WAProto/index.d.ts:4111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4111)

BotMemoryFact fact.

#### Implementation of

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md).[`fact`](../interfaces/IBotMemoryFact.md#fact)

***

### factId?

> `optional` **factId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:4114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4114)

BotMemoryFact factId.

#### Implementation of

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md).[`factId`](../interfaces/IBotMemoryFact.md#factid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:4184](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4184)

Converts this BotMemoryFact to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotMemoryFact`](BotMemoryFact.md)

Defined in: [WAProto/index.d.ts:4121](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4121)

Creates a new BotMemoryFact instance using the specified properties.

#### Parameters

##### properties?

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)

Properties to set

#### Returns

[`BotMemoryFact`](BotMemoryFact.md)

BotMemoryFact instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotMemoryFact`](BotMemoryFact.md)

Defined in: [WAProto/index.d.ts:4147](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4147)

Decodes a BotMemoryFact message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotMemoryFact`](BotMemoryFact.md)

BotMemoryFact

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotMemoryFact`](BotMemoryFact.md)

Defined in: [WAProto/index.d.ts:4156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4156)

Decodes a BotMemoryFact message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotMemoryFact`](BotMemoryFact.md)

BotMemoryFact

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4129)

Encodes the specified BotMemoryFact message. Does not implicitly [verify](BotMemoryFact.md#verify) messages.

#### Parameters

##### message

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)

BotMemoryFact message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4137](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4137)

Encodes the specified BotMemoryFact message, length delimited. Does not implicitly [verify](BotMemoryFact.md#verify) messages.

#### Parameters

##### message

[`IBotMemoryFact`](../interfaces/IBotMemoryFact.md)

BotMemoryFact message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotMemoryFact`](BotMemoryFact.md)

Defined in: [WAProto/index.d.ts:4170](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4170)

Creates a BotMemoryFact message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotMemoryFact`](BotMemoryFact.md)

BotMemoryFact

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:4191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4191)

Gets the default type url for BotMemoryFact

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

Defined in: [WAProto/index.d.ts:4178](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4178)

Creates a plain object from a BotMemoryFact message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotMemoryFact`](BotMemoryFact.md)

BotMemoryFact

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:4163](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4163)

Verifies a BotMemoryFact message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
