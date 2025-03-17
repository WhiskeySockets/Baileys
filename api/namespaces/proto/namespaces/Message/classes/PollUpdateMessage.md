# Class: PollUpdateMessage

Defined in: [WAProto/index.d.ts:29292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29292)

Represents a PollUpdateMessage.

## Implements

- [`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md)

## Constructors

### new PollUpdateMessage()

> **new PollUpdateMessage**(`properties`?): [`PollUpdateMessage`](PollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:29298](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29298)

Constructs a new PollUpdateMessage.

#### Parameters

##### properties?

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md)

Properties to set

#### Returns

[`PollUpdateMessage`](PollUpdateMessage.md)

## Properties

### metadata?

> `optional` **metadata**: `null` \| [`IPollUpdateMessageMetadata`](../interfaces/IPollUpdateMessageMetadata.md)

Defined in: [WAProto/index.d.ts:29307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29307)

PollUpdateMessage metadata.

#### Implementation of

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md).[`metadata`](../interfaces/IPollUpdateMessage.md#metadata)

***

### pollCreationMessageKey?

> `optional` **pollCreationMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:29301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29301)

PollUpdateMessage pollCreationMessageKey.

#### Implementation of

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md).[`pollCreationMessageKey`](../interfaces/IPollUpdateMessage.md#pollcreationmessagekey)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:29310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29310)

PollUpdateMessage senderTimestampMs.

#### Implementation of

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md).[`senderTimestampMs`](../interfaces/IPollUpdateMessage.md#sendertimestampms)

***

### vote?

> `optional` **vote**: `null` \| [`IPollEncValue`](../interfaces/IPollEncValue.md)

Defined in: [WAProto/index.d.ts:29304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29304)

PollUpdateMessage vote.

#### Implementation of

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md).[`vote`](../interfaces/IPollUpdateMessage.md#vote)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29380](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29380)

Converts this PollUpdateMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollUpdateMessage`](PollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:29317](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29317)

Creates a new PollUpdateMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md)

Properties to set

#### Returns

[`PollUpdateMessage`](PollUpdateMessage.md)

PollUpdateMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollUpdateMessage`](PollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:29343](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29343)

Decodes a PollUpdateMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollUpdateMessage`](PollUpdateMessage.md)

PollUpdateMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollUpdateMessage`](PollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:29352](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29352)

Decodes a PollUpdateMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollUpdateMessage`](PollUpdateMessage.md)

PollUpdateMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29325](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29325)

Encodes the specified PollUpdateMessage message. Does not implicitly [verify](PollUpdateMessage.md#verify) messages.

#### Parameters

##### message

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md)

PollUpdateMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29333)

Encodes the specified PollUpdateMessage message, length delimited. Does not implicitly [verify](PollUpdateMessage.md#verify) messages.

#### Parameters

##### message

[`IPollUpdateMessage`](../interfaces/IPollUpdateMessage.md)

PollUpdateMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollUpdateMessage`](PollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:29366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29366)

Creates a PollUpdateMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollUpdateMessage`](PollUpdateMessage.md)

PollUpdateMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29387](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29387)

Gets the default type url for PollUpdateMessage

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

Defined in: [WAProto/index.d.ts:29374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29374)

Creates a plain object from a PollUpdateMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollUpdateMessage`](PollUpdateMessage.md)

PollUpdateMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29359)

Verifies a PollUpdateMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
