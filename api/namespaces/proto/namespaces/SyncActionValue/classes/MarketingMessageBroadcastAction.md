# Class: MarketingMessageBroadcastAction

Defined in: [WAProto/index.d.ts:43637](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43637)

Represents a MarketingMessageBroadcastAction.

## Implements

- [`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md)

## Constructors

### new MarketingMessageBroadcastAction()

> **new MarketingMessageBroadcastAction**(`properties`?): [`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

Defined in: [WAProto/index.d.ts:43643](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43643)

Constructs a new MarketingMessageBroadcastAction.

#### Parameters

##### properties?

[`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md)

Properties to set

#### Returns

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

## Properties

### repliedCount?

> `optional` **repliedCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:43646](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43646)

MarketingMessageBroadcastAction repliedCount.

#### Implementation of

[`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md).[`repliedCount`](../interfaces/IMarketingMessageBroadcastAction.md#repliedcount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43716](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43716)

Converts this MarketingMessageBroadcastAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

Defined in: [WAProto/index.d.ts:43653](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43653)

Creates a new MarketingMessageBroadcastAction instance using the specified properties.

#### Parameters

##### properties?

[`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md)

Properties to set

#### Returns

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

Defined in: [WAProto/index.d.ts:43679](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43679)

Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

Defined in: [WAProto/index.d.ts:43688](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43688)

Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43661](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43661)

Encodes the specified MarketingMessageBroadcastAction message. Does not implicitly [verify](MarketingMessageBroadcastAction.md#verify) messages.

#### Parameters

##### message

[`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43669](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43669)

Encodes the specified MarketingMessageBroadcastAction message, length delimited. Does not implicitly [verify](MarketingMessageBroadcastAction.md#verify) messages.

#### Parameters

##### message

[`IMarketingMessageBroadcastAction`](../interfaces/IMarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

Defined in: [WAProto/index.d.ts:43702](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43702)

Creates a MarketingMessageBroadcastAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43723)

Gets the default type url for MarketingMessageBroadcastAction

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

Defined in: [WAProto/index.d.ts:43710](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43710)

Creates a plain object from a MarketingMessageBroadcastAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`MarketingMessageBroadcastAction`](MarketingMessageBroadcastAction.md)

MarketingMessageBroadcastAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43695)

Verifies a MarketingMessageBroadcastAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
