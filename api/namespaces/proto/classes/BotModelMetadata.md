# Class: BotModelMetadata

Defined in: [WAProto/index.d.ts:4734](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4734)

Represents a BotModelMetadata.

## Implements

- [`IBotModelMetadata`](../interfaces/IBotModelMetadata.md)

## Constructors

### new BotModelMetadata()

> **new BotModelMetadata**(`properties`?): [`BotModelMetadata`](BotModelMetadata.md)

Defined in: [WAProto/index.d.ts:4740](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4740)

Constructs a new BotModelMetadata.

#### Parameters

##### properties?

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md)

Properties to set

#### Returns

[`BotModelMetadata`](BotModelMetadata.md)

## Properties

### modelType?

> `optional` **modelType**: `null` \| [`ModelType`](../namespaces/BotModelMetadata/enumerations/ModelType.md)

Defined in: [WAProto/index.d.ts:4743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4743)

BotModelMetadata modelType.

#### Implementation of

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md).[`modelType`](../interfaces/IBotModelMetadata.md#modeltype)

***

### premiumModelStatus?

> `optional` **premiumModelStatus**: `null` \| [`PremiumModelStatus`](../namespaces/BotModelMetadata/enumerations/PremiumModelStatus.md)

Defined in: [WAProto/index.d.ts:4746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4746)

BotModelMetadata premiumModelStatus.

#### Implementation of

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md).[`premiumModelStatus`](../interfaces/IBotModelMetadata.md#premiummodelstatus)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:4816](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4816)

Converts this BotModelMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotModelMetadata`](BotModelMetadata.md)

Defined in: [WAProto/index.d.ts:4753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4753)

Creates a new BotModelMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md)

Properties to set

#### Returns

[`BotModelMetadata`](BotModelMetadata.md)

BotModelMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotModelMetadata`](BotModelMetadata.md)

Defined in: [WAProto/index.d.ts:4779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4779)

Decodes a BotModelMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotModelMetadata`](BotModelMetadata.md)

BotModelMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotModelMetadata`](BotModelMetadata.md)

Defined in: [WAProto/index.d.ts:4788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4788)

Decodes a BotModelMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotModelMetadata`](BotModelMetadata.md)

BotModelMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4761](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4761)

Encodes the specified BotModelMetadata message. Does not implicitly [verify](BotModelMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md)

BotModelMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:4769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4769)

Encodes the specified BotModelMetadata message, length delimited. Does not implicitly [verify](BotModelMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotModelMetadata`](../interfaces/IBotModelMetadata.md)

BotModelMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotModelMetadata`](BotModelMetadata.md)

Defined in: [WAProto/index.d.ts:4802](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4802)

Creates a BotModelMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotModelMetadata`](BotModelMetadata.md)

BotModelMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:4823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4823)

Gets the default type url for BotModelMetadata

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

Defined in: [WAProto/index.d.ts:4810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4810)

Creates a plain object from a BotModelMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotModelMetadata`](BotModelMetadata.md)

BotModelMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:4795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L4795)

Verifies a BotModelMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
