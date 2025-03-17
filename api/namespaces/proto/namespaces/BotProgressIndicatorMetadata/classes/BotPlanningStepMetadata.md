# Class: BotPlanningStepMetadata

Defined in: [WAProto/index.d.ts:5152](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5152)

Represents a BotPlanningStepMetadata.

## Implements

- [`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md)

## Constructors

### new BotPlanningStepMetadata()

> **new BotPlanningStepMetadata**(`properties`?): [`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

Defined in: [WAProto/index.d.ts:5158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5158)

Constructs a new BotPlanningStepMetadata.

#### Parameters

##### properties?

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md)

Properties to set

#### Returns

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

## Properties

### isEnhancedSearch?

> `optional` **isEnhancedSearch**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:5176](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5176)

BotPlanningStepMetadata isEnhancedSearch.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`isEnhancedSearch`](../interfaces/IBotPlanningStepMetadata.md#isenhancedsearch)

***

### isReasoning?

> `optional` **isReasoning**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:5173](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5173)

BotPlanningStepMetadata isReasoning.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`isReasoning`](../interfaces/IBotPlanningStepMetadata.md#isreasoning)

***

### sourcesMetadata

> **sourcesMetadata**: [`IBotPlanningSearchSourcesMetadata`](../namespaces/BotPlanningStepMetadata/interfaces/IBotPlanningSearchSourcesMetadata.md)[]

Defined in: [WAProto/index.d.ts:5167](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5167)

BotPlanningStepMetadata sourcesMetadata.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`sourcesMetadata`](../interfaces/IBotPlanningStepMetadata.md#sourcesmetadata)

***

### status?

> `optional` **status**: `null` \| [`PlanningStepStatus`](../namespaces/BotPlanningStepMetadata/enumerations/PlanningStepStatus.md)

Defined in: [WAProto/index.d.ts:5170](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5170)

BotPlanningStepMetadata status.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`status`](../interfaces/IBotPlanningStepMetadata.md#status)

***

### statusBody?

> `optional` **statusBody**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5164)

BotPlanningStepMetadata statusBody.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`statusBody`](../interfaces/IBotPlanningStepMetadata.md#statusbody)

***

### statusTitle?

> `optional` **statusTitle**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5161](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5161)

BotPlanningStepMetadata statusTitle.

#### Implementation of

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md).[`statusTitle`](../interfaces/IBotPlanningStepMetadata.md#statustitle)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5246)

Converts this BotPlanningStepMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

Defined in: [WAProto/index.d.ts:5183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5183)

Creates a new BotPlanningStepMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md)

Properties to set

#### Returns

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

BotPlanningStepMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

Defined in: [WAProto/index.d.ts:5209](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5209)

Decodes a BotPlanningStepMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

BotPlanningStepMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

Defined in: [WAProto/index.d.ts:5218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5218)

Decodes a BotPlanningStepMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

BotPlanningStepMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5191)

Encodes the specified BotPlanningStepMetadata message. Does not implicitly [verify](BotPlanningStepMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md)

BotPlanningStepMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5199)

Encodes the specified BotPlanningStepMetadata message, length delimited. Does not implicitly [verify](BotPlanningStepMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotPlanningStepMetadata`](../interfaces/IBotPlanningStepMetadata.md)

BotPlanningStepMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

Defined in: [WAProto/index.d.ts:5232](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5232)

Creates a BotPlanningStepMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

BotPlanningStepMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5253)

Gets the default type url for BotPlanningStepMetadata

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

Defined in: [WAProto/index.d.ts:5240](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5240)

Creates a plain object from a BotPlanningStepMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotPlanningStepMetadata`](BotPlanningStepMetadata.md)

BotPlanningStepMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5225](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5225)

Verifies a BotPlanningStepMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
