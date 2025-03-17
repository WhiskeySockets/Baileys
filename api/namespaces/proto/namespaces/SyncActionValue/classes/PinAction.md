# Class: PinAction

Defined in: [WAProto/index.d.ts:44399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44399)

Represents a PinAction.

## Implements

- [`IPinAction`](../interfaces/IPinAction.md)

## Constructors

### new PinAction()

> **new PinAction**(`properties`?): [`PinAction`](PinAction.md)

Defined in: [WAProto/index.d.ts:44405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44405)

Constructs a new PinAction.

#### Parameters

##### properties?

[`IPinAction`](../interfaces/IPinAction.md)

Properties to set

#### Returns

[`PinAction`](PinAction.md)

## Properties

### pinned?

> `optional` **pinned**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:44408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44408)

PinAction pinned.

#### Implementation of

[`IPinAction`](../interfaces/IPinAction.md).[`pinned`](../interfaces/IPinAction.md#pinned)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44478)

Converts this PinAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PinAction`](PinAction.md)

Defined in: [WAProto/index.d.ts:44415](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44415)

Creates a new PinAction instance using the specified properties.

#### Parameters

##### properties?

[`IPinAction`](../interfaces/IPinAction.md)

Properties to set

#### Returns

[`PinAction`](PinAction.md)

PinAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PinAction`](PinAction.md)

Defined in: [WAProto/index.d.ts:44441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44441)

Decodes a PinAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PinAction`](PinAction.md)

PinAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PinAction`](PinAction.md)

Defined in: [WAProto/index.d.ts:44450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44450)

Decodes a PinAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PinAction`](PinAction.md)

PinAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44423)

Encodes the specified PinAction message. Does not implicitly [verify](PinAction.md#verify) messages.

#### Parameters

##### message

[`IPinAction`](../interfaces/IPinAction.md)

PinAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44431)

Encodes the specified PinAction message, length delimited. Does not implicitly [verify](PinAction.md#verify) messages.

#### Parameters

##### message

[`IPinAction`](../interfaces/IPinAction.md)

PinAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PinAction`](PinAction.md)

Defined in: [WAProto/index.d.ts:44464](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44464)

Creates a PinAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PinAction`](PinAction.md)

PinAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44485)

Gets the default type url for PinAction

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

Defined in: [WAProto/index.d.ts:44472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44472)

Creates a plain object from a PinAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`PinAction`](PinAction.md)

PinAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44457)

Verifies a PinAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
