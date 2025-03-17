# Class: PinInChatMessage

Defined in: [WAProto/index.d.ts:28489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28489)

Represents a PinInChatMessage.

## Implements

- [`IPinInChatMessage`](../interfaces/IPinInChatMessage.md)

## Constructors

### new PinInChatMessage()

> **new PinInChatMessage**(`properties`?): [`PinInChatMessage`](PinInChatMessage.md)

Defined in: [WAProto/index.d.ts:28495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28495)

Constructs a new PinInChatMessage.

#### Parameters

##### properties?

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md)

Properties to set

#### Returns

[`PinInChatMessage`](PinInChatMessage.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:28498](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28498)

PinInChatMessage key.

#### Implementation of

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md).[`key`](../interfaces/IPinInChatMessage.md#key)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:28504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28504)

PinInChatMessage senderTimestampMs.

#### Implementation of

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md).[`senderTimestampMs`](../interfaces/IPinInChatMessage.md#sendertimestampms)

***

### type?

> `optional` **type**: `null` \| [`Type`](../namespaces/PinInChatMessage/enumerations/Type.md)

Defined in: [WAProto/index.d.ts:28501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28501)

PinInChatMessage type.

#### Implementation of

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md).[`type`](../interfaces/IPinInChatMessage.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28574](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28574)

Converts this PinInChatMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PinInChatMessage`](PinInChatMessage.md)

Defined in: [WAProto/index.d.ts:28511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28511)

Creates a new PinInChatMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md)

Properties to set

#### Returns

[`PinInChatMessage`](PinInChatMessage.md)

PinInChatMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PinInChatMessage`](PinInChatMessage.md)

Defined in: [WAProto/index.d.ts:28537](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28537)

Decodes a PinInChatMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PinInChatMessage`](PinInChatMessage.md)

PinInChatMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PinInChatMessage`](PinInChatMessage.md)

Defined in: [WAProto/index.d.ts:28546](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28546)

Decodes a PinInChatMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PinInChatMessage`](PinInChatMessage.md)

PinInChatMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28519](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28519)

Encodes the specified PinInChatMessage message. Does not implicitly [verify](PinInChatMessage.md#verify) messages.

#### Parameters

##### message

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md)

PinInChatMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28527)

Encodes the specified PinInChatMessage message, length delimited. Does not implicitly [verify](PinInChatMessage.md#verify) messages.

#### Parameters

##### message

[`IPinInChatMessage`](../interfaces/IPinInChatMessage.md)

PinInChatMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PinInChatMessage`](PinInChatMessage.md)

Defined in: [WAProto/index.d.ts:28560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28560)

Creates a PinInChatMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PinInChatMessage`](PinInChatMessage.md)

PinInChatMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28581](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28581)

Gets the default type url for PinInChatMessage

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

Defined in: [WAProto/index.d.ts:28568](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28568)

Creates a plain object from a PinInChatMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PinInChatMessage`](PinInChatMessage.md)

PinInChatMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28553](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28553)

Verifies a PinInChatMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
