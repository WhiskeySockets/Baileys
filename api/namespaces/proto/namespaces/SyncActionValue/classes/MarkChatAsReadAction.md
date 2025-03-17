# Class: MarkChatAsReadAction

Defined in: [WAProto/index.d.ts:43396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43396)

Represents a MarkChatAsReadAction.

## Implements

- [`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md)

## Constructors

### new MarkChatAsReadAction()

> **new MarkChatAsReadAction**(`properties`?): [`MarkChatAsReadAction`](MarkChatAsReadAction.md)

Defined in: [WAProto/index.d.ts:43402](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43402)

Constructs a new MarkChatAsReadAction.

#### Parameters

##### properties?

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md)

Properties to set

#### Returns

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

## Properties

### messageRange?

> `optional` **messageRange**: `null` \| [`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:43408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43408)

MarkChatAsReadAction messageRange.

#### Implementation of

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md).[`messageRange`](../interfaces/IMarkChatAsReadAction.md#messagerange)

***

### read?

> `optional` **read**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43405)

MarkChatAsReadAction read.

#### Implementation of

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md).[`read`](../interfaces/IMarkChatAsReadAction.md#read)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43478)

Converts this MarkChatAsReadAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MarkChatAsReadAction`](MarkChatAsReadAction.md)

Defined in: [WAProto/index.d.ts:43415](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43415)

Creates a new MarkChatAsReadAction instance using the specified properties.

#### Parameters

##### properties?

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md)

Properties to set

#### Returns

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

MarkChatAsReadAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MarkChatAsReadAction`](MarkChatAsReadAction.md)

Defined in: [WAProto/index.d.ts:43441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43441)

Decodes a MarkChatAsReadAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

MarkChatAsReadAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MarkChatAsReadAction`](MarkChatAsReadAction.md)

Defined in: [WAProto/index.d.ts:43450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43450)

Decodes a MarkChatAsReadAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

MarkChatAsReadAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43423)

Encodes the specified MarkChatAsReadAction message. Does not implicitly [verify](MarkChatAsReadAction.md#verify) messages.

#### Parameters

##### message

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md)

MarkChatAsReadAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43431)

Encodes the specified MarkChatAsReadAction message, length delimited. Does not implicitly [verify](MarkChatAsReadAction.md#verify) messages.

#### Parameters

##### message

[`IMarkChatAsReadAction`](../interfaces/IMarkChatAsReadAction.md)

MarkChatAsReadAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MarkChatAsReadAction`](MarkChatAsReadAction.md)

Defined in: [WAProto/index.d.ts:43464](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43464)

Creates a MarkChatAsReadAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

MarkChatAsReadAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43485)

Gets the default type url for MarkChatAsReadAction

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

Defined in: [WAProto/index.d.ts:43472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43472)

Creates a plain object from a MarkChatAsReadAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`MarkChatAsReadAction`](MarkChatAsReadAction.md)

MarkChatAsReadAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43457)

Verifies a MarkChatAsReadAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
