# Class: PnForLidChatAction

Defined in: [WAProto/index.d.ts:44496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44496)

Represents a PnForLidChatAction.

## Implements

- [`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md)

## Constructors

### new PnForLidChatAction()

> **new PnForLidChatAction**(`properties`?): [`PnForLidChatAction`](PnForLidChatAction.md)

Defined in: [WAProto/index.d.ts:44502](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44502)

Constructs a new PnForLidChatAction.

#### Parameters

##### properties?

[`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md)

Properties to set

#### Returns

[`PnForLidChatAction`](PnForLidChatAction.md)

## Properties

### pnJid?

> `optional` **pnJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:44505](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44505)

PnForLidChatAction pnJid.

#### Implementation of

[`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md).[`pnJid`](../interfaces/IPnForLidChatAction.md#pnjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44575](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44575)

Converts this PnForLidChatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PnForLidChatAction`](PnForLidChatAction.md)

Defined in: [WAProto/index.d.ts:44512](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44512)

Creates a new PnForLidChatAction instance using the specified properties.

#### Parameters

##### properties?

[`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md)

Properties to set

#### Returns

[`PnForLidChatAction`](PnForLidChatAction.md)

PnForLidChatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PnForLidChatAction`](PnForLidChatAction.md)

Defined in: [WAProto/index.d.ts:44538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44538)

Decodes a PnForLidChatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PnForLidChatAction`](PnForLidChatAction.md)

PnForLidChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PnForLidChatAction`](PnForLidChatAction.md)

Defined in: [WAProto/index.d.ts:44547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44547)

Decodes a PnForLidChatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PnForLidChatAction`](PnForLidChatAction.md)

PnForLidChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44520)

Encodes the specified PnForLidChatAction message. Does not implicitly [verify](PnForLidChatAction.md#verify) messages.

#### Parameters

##### message

[`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md)

PnForLidChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44528](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44528)

Encodes the specified PnForLidChatAction message, length delimited. Does not implicitly [verify](PnForLidChatAction.md#verify) messages.

#### Parameters

##### message

[`IPnForLidChatAction`](../interfaces/IPnForLidChatAction.md)

PnForLidChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PnForLidChatAction`](PnForLidChatAction.md)

Defined in: [WAProto/index.d.ts:44561](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44561)

Creates a PnForLidChatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PnForLidChatAction`](PnForLidChatAction.md)

PnForLidChatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44582)

Gets the default type url for PnForLidChatAction

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

Defined in: [WAProto/index.d.ts:44569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44569)

Creates a plain object from a PnForLidChatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`PnForLidChatAction`](PnForLidChatAction.md)

PnForLidChatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44554](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44554)

Verifies a PnForLidChatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
