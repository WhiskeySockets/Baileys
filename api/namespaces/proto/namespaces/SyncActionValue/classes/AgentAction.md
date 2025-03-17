# Class: AgentAction

Defined in: [WAProto/index.d.ts:40947](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40947)

Represents an AgentAction.

## Implements

- [`IAgentAction`](../interfaces/IAgentAction.md)

## Constructors

### new AgentAction()

> **new AgentAction**(`properties`?): [`AgentAction`](AgentAction.md)

Defined in: [WAProto/index.d.ts:40953](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40953)

Constructs a new AgentAction.

#### Parameters

##### properties?

[`IAgentAction`](../interfaces/IAgentAction.md)

Properties to set

#### Returns

[`AgentAction`](AgentAction.md)

## Properties

### deviceID?

> `optional` **deviceID**: `null` \| `number`

Defined in: [WAProto/index.d.ts:40959](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40959)

AgentAction deviceID.

#### Implementation of

[`IAgentAction`](../interfaces/IAgentAction.md).[`deviceID`](../interfaces/IAgentAction.md#deviceid)

***

### isDeleted?

> `optional` **isDeleted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:40962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40962)

AgentAction isDeleted.

#### Implementation of

[`IAgentAction`](../interfaces/IAgentAction.md).[`isDeleted`](../interfaces/IAgentAction.md#isdeleted)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:40956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40956)

AgentAction name.

#### Implementation of

[`IAgentAction`](../interfaces/IAgentAction.md).[`name`](../interfaces/IAgentAction.md#name)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41032](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41032)

Converts this AgentAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AgentAction`](AgentAction.md)

Defined in: [WAProto/index.d.ts:40969](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40969)

Creates a new AgentAction instance using the specified properties.

#### Parameters

##### properties?

[`IAgentAction`](../interfaces/IAgentAction.md)

Properties to set

#### Returns

[`AgentAction`](AgentAction.md)

AgentAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AgentAction`](AgentAction.md)

Defined in: [WAProto/index.d.ts:40995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40995)

Decodes an AgentAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AgentAction`](AgentAction.md)

AgentAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AgentAction`](AgentAction.md)

Defined in: [WAProto/index.d.ts:41004](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41004)

Decodes an AgentAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AgentAction`](AgentAction.md)

AgentAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40977](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40977)

Encodes the specified AgentAction message. Does not implicitly [verify](AgentAction.md#verify) messages.

#### Parameters

##### message

[`IAgentAction`](../interfaces/IAgentAction.md)

AgentAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40985](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40985)

Encodes the specified AgentAction message, length delimited. Does not implicitly [verify](AgentAction.md#verify) messages.

#### Parameters

##### message

[`IAgentAction`](../interfaces/IAgentAction.md)

AgentAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AgentAction`](AgentAction.md)

Defined in: [WAProto/index.d.ts:41018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41018)

Creates an AgentAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AgentAction`](AgentAction.md)

AgentAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41039)

Gets the default type url for AgentAction

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

Defined in: [WAProto/index.d.ts:41026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41026)

Creates a plain object from an AgentAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`AgentAction`](AgentAction.md)

AgentAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41011](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41011)

Verifies an AgentAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
