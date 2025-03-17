# Class: PinInChat

Defined in: [WAProto/index.d.ts:36322](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36322)

Represents a PinInChat.

## Implements

- [`IPinInChat`](../interfaces/IPinInChat.md)

## Constructors

### new PinInChat()

> **new PinInChat**(`properties`?): [`PinInChat`](PinInChat.md)

Defined in: [WAProto/index.d.ts:36328](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36328)

Constructs a new PinInChat.

#### Parameters

##### properties?

[`IPinInChat`](../interfaces/IPinInChat.md)

Properties to set

#### Returns

[`PinInChat`](PinInChat.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:36334](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36334)

PinInChat key.

#### Implementation of

[`IPinInChat`](../interfaces/IPinInChat.md).[`key`](../interfaces/IPinInChat.md#key)

***

### messageAddOnContextInfo?

> `optional` **messageAddOnContextInfo**: `null` \| [`IMessageAddOnContextInfo`](../interfaces/IMessageAddOnContextInfo.md)

Defined in: [WAProto/index.d.ts:36343](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36343)

PinInChat messageAddOnContextInfo.

#### Implementation of

[`IPinInChat`](../interfaces/IPinInChat.md).[`messageAddOnContextInfo`](../interfaces/IPinInChat.md#messageaddoncontextinfo)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:36337](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36337)

PinInChat senderTimestampMs.

#### Implementation of

[`IPinInChat`](../interfaces/IPinInChat.md).[`senderTimestampMs`](../interfaces/IPinInChat.md#sendertimestampms)

***

### serverTimestampMs?

> `optional` **serverTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:36340](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36340)

PinInChat serverTimestampMs.

#### Implementation of

[`IPinInChat`](../interfaces/IPinInChat.md).[`serverTimestampMs`](../interfaces/IPinInChat.md#servertimestampms)

***

### type?

> `optional` **type**: `null` \| [`Type`](../namespaces/PinInChat/enumerations/Type.md)

Defined in: [WAProto/index.d.ts:36331](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36331)

PinInChat type.

#### Implementation of

[`IPinInChat`](../interfaces/IPinInChat.md).[`type`](../interfaces/IPinInChat.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36413](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36413)

Converts this PinInChat to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PinInChat`](PinInChat.md)

Defined in: [WAProto/index.d.ts:36350](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36350)

Creates a new PinInChat instance using the specified properties.

#### Parameters

##### properties?

[`IPinInChat`](../interfaces/IPinInChat.md)

Properties to set

#### Returns

[`PinInChat`](PinInChat.md)

PinInChat instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PinInChat`](PinInChat.md)

Defined in: [WAProto/index.d.ts:36376](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36376)

Decodes a PinInChat message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PinInChat`](PinInChat.md)

PinInChat

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PinInChat`](PinInChat.md)

Defined in: [WAProto/index.d.ts:36385](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36385)

Decodes a PinInChat message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PinInChat`](PinInChat.md)

PinInChat

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36358](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36358)

Encodes the specified PinInChat message. Does not implicitly [verify](PinInChat.md#verify) messages.

#### Parameters

##### message

[`IPinInChat`](../interfaces/IPinInChat.md)

PinInChat message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36366)

Encodes the specified PinInChat message, length delimited. Does not implicitly [verify](PinInChat.md#verify) messages.

#### Parameters

##### message

[`IPinInChat`](../interfaces/IPinInChat.md)

PinInChat message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PinInChat`](PinInChat.md)

Defined in: [WAProto/index.d.ts:36399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36399)

Creates a PinInChat message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PinInChat`](PinInChat.md)

PinInChat

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36420](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36420)

Gets the default type url for PinInChat

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

Defined in: [WAProto/index.d.ts:36407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36407)

Creates a plain object from a PinInChat message. Also converts values to other types if specified.

#### Parameters

##### message

[`PinInChat`](PinInChat.md)

PinInChat

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36392](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36392)

Verifies a PinInChat message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
