# Class: BotCapabilityMetadata

Defined in: [WAProto/index.d.ts:3505](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3505)

Represents a BotCapabilityMetadata.

## Implements

- [`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md)

## Constructors

### new BotCapabilityMetadata()

> **new BotCapabilityMetadata**(`properties`?): [`BotCapabilityMetadata`](BotCapabilityMetadata.md)

Defined in: [WAProto/index.d.ts:3511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3511)

Constructs a new BotCapabilityMetadata.

#### Parameters

##### properties?

[`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md)

Properties to set

#### Returns

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

## Properties

### capabilities

> **capabilities**: [`BotCapabilityType`](../namespaces/BotCapabilityMetadata/enumerations/BotCapabilityType.md)[]

Defined in: [WAProto/index.d.ts:3514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3514)

BotCapabilityMetadata capabilities.

#### Implementation of

[`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md).[`capabilities`](../interfaces/IBotCapabilityMetadata.md#capabilities)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3584](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3584)

Converts this BotCapabilityMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotCapabilityMetadata`](BotCapabilityMetadata.md)

Defined in: [WAProto/index.d.ts:3521](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3521)

Creates a new BotCapabilityMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md)

Properties to set

#### Returns

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

BotCapabilityMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotCapabilityMetadata`](BotCapabilityMetadata.md)

Defined in: [WAProto/index.d.ts:3547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3547)

Decodes a BotCapabilityMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

BotCapabilityMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotCapabilityMetadata`](BotCapabilityMetadata.md)

Defined in: [WAProto/index.d.ts:3556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3556)

Decodes a BotCapabilityMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

BotCapabilityMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3529](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3529)

Encodes the specified BotCapabilityMetadata message. Does not implicitly [verify](BotCapabilityMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md)

BotCapabilityMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3537](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3537)

Encodes the specified BotCapabilityMetadata message, length delimited. Does not implicitly [verify](BotCapabilityMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotCapabilityMetadata`](../interfaces/IBotCapabilityMetadata.md)

BotCapabilityMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotCapabilityMetadata`](BotCapabilityMetadata.md)

Defined in: [WAProto/index.d.ts:3570](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3570)

Creates a BotCapabilityMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

BotCapabilityMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3591](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3591)

Gets the default type url for BotCapabilityMetadata

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

Defined in: [WAProto/index.d.ts:3578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3578)

Creates a plain object from a BotCapabilityMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotCapabilityMetadata`](BotCapabilityMetadata.md)

BotCapabilityMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3563)

Verifies a BotCapabilityMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
