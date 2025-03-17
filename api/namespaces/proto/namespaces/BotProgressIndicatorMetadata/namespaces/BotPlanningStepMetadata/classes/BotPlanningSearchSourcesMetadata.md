# Class: BotPlanningSearchSourcesMetadata

Defined in: [WAProto/index.d.ts:5272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5272)

Represents a BotPlanningSearchSourcesMetadata.

## Implements

- [`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md)

## Constructors

### new BotPlanningSearchSourcesMetadata()

> **new BotPlanningSearchSourcesMetadata**(`properties`?): [`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

Defined in: [WAProto/index.d.ts:5278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5278)

Constructs a new BotPlanningSearchSourcesMetadata.

#### Parameters

##### properties?

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md)

Properties to set

#### Returns

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

## Properties

### provider?

> `optional` **provider**: `null` \| [`BotPlanningSearchSourceProvider`](../namespaces/BotPlanningSearchSourcesMetadata/enumerations/BotPlanningSearchSourceProvider.md)

Defined in: [WAProto/index.d.ts:5284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5284)

BotPlanningSearchSourcesMetadata provider.

#### Implementation of

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md).[`provider`](../interfaces/IBotPlanningSearchSourcesMetadata.md#provider)

***

### sourceTitle?

> `optional` **sourceTitle**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5281)

BotPlanningSearchSourcesMetadata sourceTitle.

#### Implementation of

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md).[`sourceTitle`](../interfaces/IBotPlanningSearchSourcesMetadata.md#sourcetitle)

***

### sourceUrl?

> `optional` **sourceUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5287)

BotPlanningSearchSourcesMetadata sourceUrl.

#### Implementation of

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md).[`sourceUrl`](../interfaces/IBotPlanningSearchSourcesMetadata.md#sourceurl)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5357](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5357)

Converts this BotPlanningSearchSourcesMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

Defined in: [WAProto/index.d.ts:5294](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5294)

Creates a new BotPlanningSearchSourcesMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md)

Properties to set

#### Returns

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

Defined in: [WAProto/index.d.ts:5320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5320)

Decodes a BotPlanningSearchSourcesMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

Defined in: [WAProto/index.d.ts:5329](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5329)

Decodes a BotPlanningSearchSourcesMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5302](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5302)

Encodes the specified BotPlanningSearchSourcesMetadata message. Does not implicitly [verify](BotPlanningSearchSourcesMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5310)

Encodes the specified BotPlanningSearchSourcesMetadata message, length delimited. Does not implicitly [verify](BotPlanningSearchSourcesMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotPlanningSearchSourcesMetadata`](../interfaces/IBotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

Defined in: [WAProto/index.d.ts:5343](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5343)

Creates a BotPlanningSearchSourcesMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5364](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5364)

Gets the default type url for BotPlanningSearchSourcesMetadata

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

Defined in: [WAProto/index.d.ts:5351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5351)

Creates a plain object from a BotPlanningSearchSourcesMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotPlanningSearchSourcesMetadata`](BotPlanningSearchSourcesMetadata.md)

BotPlanningSearchSourcesMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5336](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5336)

Verifies a BotPlanningSearchSourcesMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
