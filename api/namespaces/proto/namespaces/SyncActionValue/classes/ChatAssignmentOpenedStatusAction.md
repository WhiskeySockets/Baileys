# Class: ChatAssignmentOpenedStatusAction

Defined in: [WAProto/index.d.ts:41541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41541)

Represents a ChatAssignmentOpenedStatusAction.

## Implements

- [`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md)

## Constructors

### new ChatAssignmentOpenedStatusAction()

> **new ChatAssignmentOpenedStatusAction**(`properties`?): [`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

Defined in: [WAProto/index.d.ts:41547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41547)

Constructs a new ChatAssignmentOpenedStatusAction.

#### Parameters

##### properties?

[`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md)

Properties to set

#### Returns

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

## Properties

### chatOpened?

> `optional` **chatOpened**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:41550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41550)

ChatAssignmentOpenedStatusAction chatOpened.

#### Implementation of

[`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md).[`chatOpened`](../interfaces/IChatAssignmentOpenedStatusAction.md#chatopened)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41620)

Converts this ChatAssignmentOpenedStatusAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

Defined in: [WAProto/index.d.ts:41557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41557)

Creates a new ChatAssignmentOpenedStatusAction instance using the specified properties.

#### Parameters

##### properties?

[`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md)

Properties to set

#### Returns

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

Defined in: [WAProto/index.d.ts:41583](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41583)

Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

Defined in: [WAProto/index.d.ts:41592](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41592)

Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41565](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41565)

Encodes the specified ChatAssignmentOpenedStatusAction message. Does not implicitly [verify](ChatAssignmentOpenedStatusAction.md#verify) messages.

#### Parameters

##### message

[`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41573](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41573)

Encodes the specified ChatAssignmentOpenedStatusAction message, length delimited. Does not implicitly [verify](ChatAssignmentOpenedStatusAction.md#verify) messages.

#### Parameters

##### message

[`IChatAssignmentOpenedStatusAction`](../interfaces/IChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

Defined in: [WAProto/index.d.ts:41606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41606)

Creates a ChatAssignmentOpenedStatusAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41627)

Gets the default type url for ChatAssignmentOpenedStatusAction

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

Defined in: [WAProto/index.d.ts:41614](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41614)

Creates a plain object from a ChatAssignmentOpenedStatusAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`ChatAssignmentOpenedStatusAction`](ChatAssignmentOpenedStatusAction.md)

ChatAssignmentOpenedStatusAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41599)

Verifies a ChatAssignmentOpenedStatusAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
