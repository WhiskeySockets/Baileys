# Class: MarketingMessageAction

Defined in: [WAProto/index.d.ts:43514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43514)

Represents a MarketingMessageAction.

## Implements

- [`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md)

## Constructors

### new MarketingMessageAction()

> **new MarketingMessageAction**(`properties`?): [`MarketingMessageAction`](MarketingMessageAction.md)

Defined in: [WAProto/index.d.ts:43520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43520)

Constructs a new MarketingMessageAction.

#### Parameters

##### properties?

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md)

Properties to set

#### Returns

[`MarketingMessageAction`](MarketingMessageAction.md)

## Properties

### createdAt?

> `optional` **createdAt**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:43532](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43532)

MarketingMessageAction createdAt.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`createdAt`](../interfaces/IMarketingMessageAction.md#createdat)

***

### isDeleted?

> `optional` **isDeleted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43538)

MarketingMessageAction isDeleted.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`isDeleted`](../interfaces/IMarketingMessageAction.md#isdeleted)

***

### lastSentAt?

> `optional` **lastSentAt**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:43535](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43535)

MarketingMessageAction lastSentAt.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`lastSentAt`](../interfaces/IMarketingMessageAction.md#lastsentat)

***

### mediaId?

> `optional` **mediaId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43541)

MarketingMessageAction mediaId.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`mediaId`](../interfaces/IMarketingMessageAction.md#mediaid)

***

### message?

> `optional` **message**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43526](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43526)

MarketingMessageAction message.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`message`](../interfaces/IMarketingMessageAction.md#message)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43523](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43523)

MarketingMessageAction name.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`name`](../interfaces/IMarketingMessageAction.md#name)

***

### type?

> `optional` **type**: `null` \| [`PERSONALIZED`](../namespaces/MarketingMessageAction/enumerations/MarketingMessagePrototypeType.md#personalized)

Defined in: [WAProto/index.d.ts:43529](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43529)

MarketingMessageAction type.

#### Implementation of

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md).[`type`](../interfaces/IMarketingMessageAction.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43611](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43611)

Converts this MarketingMessageAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MarketingMessageAction`](MarketingMessageAction.md)

Defined in: [WAProto/index.d.ts:43548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43548)

Creates a new MarketingMessageAction instance using the specified properties.

#### Parameters

##### properties?

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md)

Properties to set

#### Returns

[`MarketingMessageAction`](MarketingMessageAction.md)

MarketingMessageAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MarketingMessageAction`](MarketingMessageAction.md)

Defined in: [WAProto/index.d.ts:43574](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43574)

Decodes a MarketingMessageAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MarketingMessageAction`](MarketingMessageAction.md)

MarketingMessageAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MarketingMessageAction`](MarketingMessageAction.md)

Defined in: [WAProto/index.d.ts:43583](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43583)

Decodes a MarketingMessageAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MarketingMessageAction`](MarketingMessageAction.md)

MarketingMessageAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43556)

Encodes the specified MarketingMessageAction message. Does not implicitly [verify](MarketingMessageAction.md#verify) messages.

#### Parameters

##### message

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md)

MarketingMessageAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43564)

Encodes the specified MarketingMessageAction message, length delimited. Does not implicitly [verify](MarketingMessageAction.md#verify) messages.

#### Parameters

##### message

[`IMarketingMessageAction`](../interfaces/IMarketingMessageAction.md)

MarketingMessageAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MarketingMessageAction`](MarketingMessageAction.md)

Defined in: [WAProto/index.d.ts:43597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43597)

Creates a MarketingMessageAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MarketingMessageAction`](MarketingMessageAction.md)

MarketingMessageAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43618](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43618)

Gets the default type url for MarketingMessageAction

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

Defined in: [WAProto/index.d.ts:43605](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43605)

Creates a plain object from a MarketingMessageAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`MarketingMessageAction`](MarketingMessageAction.md)

MarketingMessageAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43590](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43590)

Verifies a MarketingMessageAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
