# Class: BotReminderMetadata

Defined in: [WAProto/index.d.ts:5608](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5608)

Represents a BotReminderMetadata.

## Implements

- [`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md)

## Constructors

### new BotReminderMetadata()

> **new BotReminderMetadata**(`properties`?): [`BotReminderMetadata`](BotReminderMetadata.md)

Defined in: [WAProto/index.d.ts:5614](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5614)

Constructs a new BotReminderMetadata.

#### Parameters

##### properties?

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md)

Properties to set

#### Returns

[`BotReminderMetadata`](BotReminderMetadata.md)

## Properties

### action?

> `optional` **action**: `null` \| [`ReminderAction`](../namespaces/BotReminderMetadata/enumerations/ReminderAction.md)

Defined in: [WAProto/index.d.ts:5620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5620)

BotReminderMetadata action.

#### Implementation of

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md).[`action`](../interfaces/IBotReminderMetadata.md#action)

***

### frequency?

> `optional` **frequency**: `null` \| [`ReminderFrequency`](../namespaces/BotReminderMetadata/enumerations/ReminderFrequency.md)

Defined in: [WAProto/index.d.ts:5629](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5629)

BotReminderMetadata frequency.

#### Implementation of

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md).[`frequency`](../interfaces/IBotReminderMetadata.md#frequency)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5623)

BotReminderMetadata name.

#### Implementation of

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md).[`name`](../interfaces/IBotReminderMetadata.md#name)

***

### nextTriggerTimestamp?

> `optional` **nextTriggerTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:5626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5626)

BotReminderMetadata nextTriggerTimestamp.

#### Implementation of

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md).[`nextTriggerTimestamp`](../interfaces/IBotReminderMetadata.md#nexttriggertimestamp)

***

### requestMessageKey?

> `optional` **requestMessageKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:5617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5617)

BotReminderMetadata requestMessageKey.

#### Implementation of

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md).[`requestMessageKey`](../interfaces/IBotReminderMetadata.md#requestmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5699](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5699)

Converts this BotReminderMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotReminderMetadata`](BotReminderMetadata.md)

Defined in: [WAProto/index.d.ts:5636](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5636)

Creates a new BotReminderMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md)

Properties to set

#### Returns

[`BotReminderMetadata`](BotReminderMetadata.md)

BotReminderMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotReminderMetadata`](BotReminderMetadata.md)

Defined in: [WAProto/index.d.ts:5662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5662)

Decodes a BotReminderMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotReminderMetadata`](BotReminderMetadata.md)

BotReminderMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotReminderMetadata`](BotReminderMetadata.md)

Defined in: [WAProto/index.d.ts:5671](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5671)

Decodes a BotReminderMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotReminderMetadata`](BotReminderMetadata.md)

BotReminderMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5644)

Encodes the specified BotReminderMetadata message. Does not implicitly [verify](BotReminderMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md)

BotReminderMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5652](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5652)

Encodes the specified BotReminderMetadata message, length delimited. Does not implicitly [verify](BotReminderMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotReminderMetadata`](../interfaces/IBotReminderMetadata.md)

BotReminderMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotReminderMetadata`](BotReminderMetadata.md)

Defined in: [WAProto/index.d.ts:5685](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5685)

Creates a BotReminderMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotReminderMetadata`](BotReminderMetadata.md)

BotReminderMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5706)

Gets the default type url for BotReminderMetadata

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

Defined in: [WAProto/index.d.ts:5693](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5693)

Creates a plain object from a BotReminderMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotReminderMetadata`](BotReminderMetadata.md)

BotReminderMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5678](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5678)

Verifies a BotReminderMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
