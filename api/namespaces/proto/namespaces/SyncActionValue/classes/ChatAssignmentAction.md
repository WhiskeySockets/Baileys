# Class: ChatAssignmentAction

Defined in: [WAProto/index.d.ts:41444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41444)

Represents a ChatAssignmentAction.

## Implements

- [`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md)

## Constructors

### new ChatAssignmentAction()

> **new ChatAssignmentAction**(`properties`?): [`ChatAssignmentAction`](ChatAssignmentAction.md)

Defined in: [WAProto/index.d.ts:41450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41450)

Constructs a new ChatAssignmentAction.

#### Parameters

##### properties?

[`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md)

Properties to set

#### Returns

[`ChatAssignmentAction`](ChatAssignmentAction.md)

## Properties

### deviceAgentID?

> `optional` **deviceAgentID**: `null` \| `string`

Defined in: [WAProto/index.d.ts:41453](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41453)

ChatAssignmentAction deviceAgentID.

#### Implementation of

[`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md).[`deviceAgentID`](../interfaces/IChatAssignmentAction.md#deviceagentid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41523](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41523)

Converts this ChatAssignmentAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ChatAssignmentAction`](ChatAssignmentAction.md)

Defined in: [WAProto/index.d.ts:41460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41460)

Creates a new ChatAssignmentAction instance using the specified properties.

#### Parameters

##### properties?

[`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md)

Properties to set

#### Returns

[`ChatAssignmentAction`](ChatAssignmentAction.md)

ChatAssignmentAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ChatAssignmentAction`](ChatAssignmentAction.md)

Defined in: [WAProto/index.d.ts:41486](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41486)

Decodes a ChatAssignmentAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ChatAssignmentAction`](ChatAssignmentAction.md)

ChatAssignmentAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ChatAssignmentAction`](ChatAssignmentAction.md)

Defined in: [WAProto/index.d.ts:41495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41495)

Decodes a ChatAssignmentAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ChatAssignmentAction`](ChatAssignmentAction.md)

ChatAssignmentAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41468](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41468)

Encodes the specified ChatAssignmentAction message. Does not implicitly [verify](ChatAssignmentAction.md#verify) messages.

#### Parameters

##### message

[`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md)

ChatAssignmentAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41476)

Encodes the specified ChatAssignmentAction message, length delimited. Does not implicitly [verify](ChatAssignmentAction.md#verify) messages.

#### Parameters

##### message

[`IChatAssignmentAction`](../interfaces/IChatAssignmentAction.md)

ChatAssignmentAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ChatAssignmentAction`](ChatAssignmentAction.md)

Defined in: [WAProto/index.d.ts:41509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41509)

Creates a ChatAssignmentAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ChatAssignmentAction`](ChatAssignmentAction.md)

ChatAssignmentAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41530](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41530)

Gets the default type url for ChatAssignmentAction

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

Defined in: [WAProto/index.d.ts:41517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41517)

Creates a plain object from a ChatAssignmentAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`ChatAssignmentAction`](ChatAssignmentAction.md)

ChatAssignmentAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41502](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41502)

Verifies a ChatAssignmentAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
