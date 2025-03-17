# Class: PollUpdate

Defined in: [WAProto/index.d.ts:36768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36768)

Represents a PollUpdate.

## Implements

- [`IPollUpdate`](../interfaces/IPollUpdate.md)

## Constructors

### new PollUpdate()

> **new PollUpdate**(`properties`?): [`PollUpdate`](PollUpdate.md)

Defined in: [WAProto/index.d.ts:36774](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36774)

Constructs a new PollUpdate.

#### Parameters

##### properties?

[`IPollUpdate`](../interfaces/IPollUpdate.md)

Properties to set

#### Returns

[`PollUpdate`](PollUpdate.md)

## Properties

### pollUpdateMessageKey?

> `optional` **pollUpdateMessageKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:36777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36777)

PollUpdate pollUpdateMessageKey.

#### Implementation of

[`IPollUpdate`](../interfaces/IPollUpdate.md).[`pollUpdateMessageKey`](../interfaces/IPollUpdate.md#pollupdatemessagekey)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:36783](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36783)

PollUpdate senderTimestampMs.

#### Implementation of

[`IPollUpdate`](../interfaces/IPollUpdate.md).[`senderTimestampMs`](../interfaces/IPollUpdate.md#sendertimestampms)

***

### serverTimestampMs?

> `optional` **serverTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:36786](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36786)

PollUpdate serverTimestampMs.

#### Implementation of

[`IPollUpdate`](../interfaces/IPollUpdate.md).[`serverTimestampMs`](../interfaces/IPollUpdate.md#servertimestampms)

***

### unread?

> `optional` **unread**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:36789](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36789)

PollUpdate unread.

#### Implementation of

[`IPollUpdate`](../interfaces/IPollUpdate.md).[`unread`](../interfaces/IPollUpdate.md#unread)

***

### vote?

> `optional` **vote**: `null` \| [`IPollVoteMessage`](../namespaces/Message/interfaces/IPollVoteMessage.md)

Defined in: [WAProto/index.d.ts:36780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36780)

PollUpdate vote.

#### Implementation of

[`IPollUpdate`](../interfaces/IPollUpdate.md).[`vote`](../interfaces/IPollUpdate.md#vote)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36859)

Converts this PollUpdate to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollUpdate`](PollUpdate.md)

Defined in: [WAProto/index.d.ts:36796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36796)

Creates a new PollUpdate instance using the specified properties.

#### Parameters

##### properties?

[`IPollUpdate`](../interfaces/IPollUpdate.md)

Properties to set

#### Returns

[`PollUpdate`](PollUpdate.md)

PollUpdate instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollUpdate`](PollUpdate.md)

Defined in: [WAProto/index.d.ts:36822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36822)

Decodes a PollUpdate message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollUpdate`](PollUpdate.md)

PollUpdate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollUpdate`](PollUpdate.md)

Defined in: [WAProto/index.d.ts:36831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36831)

Decodes a PollUpdate message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollUpdate`](PollUpdate.md)

PollUpdate

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36804)

Encodes the specified PollUpdate message. Does not implicitly [verify](PollUpdate.md#verify) messages.

#### Parameters

##### message

[`IPollUpdate`](../interfaces/IPollUpdate.md)

PollUpdate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36812](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36812)

Encodes the specified PollUpdate message, length delimited. Does not implicitly [verify](PollUpdate.md#verify) messages.

#### Parameters

##### message

[`IPollUpdate`](../interfaces/IPollUpdate.md)

PollUpdate message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollUpdate`](PollUpdate.md)

Defined in: [WAProto/index.d.ts:36845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36845)

Creates a PollUpdate message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollUpdate`](PollUpdate.md)

PollUpdate

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36866)

Gets the default type url for PollUpdate

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

Defined in: [WAProto/index.d.ts:36853](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36853)

Creates a plain object from a PollUpdate message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollUpdate`](PollUpdate.md)

PollUpdate

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36838](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36838)

Verifies a PollUpdate message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
