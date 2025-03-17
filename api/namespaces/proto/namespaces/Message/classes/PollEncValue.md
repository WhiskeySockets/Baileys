# Class: PollEncValue

Defined in: [WAProto/index.d.ts:28968](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28968)

Represents a PollEncValue.

## Implements

- [`IPollEncValue`](../interfaces/IPollEncValue.md)

## Constructors

### new PollEncValue()

> **new PollEncValue**(`properties`?): [`PollEncValue`](PollEncValue.md)

Defined in: [WAProto/index.d.ts:28974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28974)

Constructs a new PollEncValue.

#### Parameters

##### properties?

[`IPollEncValue`](../interfaces/IPollEncValue.md)

Properties to set

#### Returns

[`PollEncValue`](PollEncValue.md)

## Properties

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:28980](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28980)

PollEncValue encIv.

#### Implementation of

[`IPollEncValue`](../interfaces/IPollEncValue.md).[`encIv`](../interfaces/IPollEncValue.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:28977](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28977)

PollEncValue encPayload.

#### Implementation of

[`IPollEncValue`](../interfaces/IPollEncValue.md).[`encPayload`](../interfaces/IPollEncValue.md#encpayload)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:29050](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29050)

Converts this PollEncValue to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollEncValue`](PollEncValue.md)

Defined in: [WAProto/index.d.ts:28987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28987)

Creates a new PollEncValue instance using the specified properties.

#### Parameters

##### properties?

[`IPollEncValue`](../interfaces/IPollEncValue.md)

Properties to set

#### Returns

[`PollEncValue`](PollEncValue.md)

PollEncValue instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollEncValue`](PollEncValue.md)

Defined in: [WAProto/index.d.ts:29013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29013)

Decodes a PollEncValue message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollEncValue`](PollEncValue.md)

PollEncValue

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollEncValue`](PollEncValue.md)

Defined in: [WAProto/index.d.ts:29022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29022)

Decodes a PollEncValue message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollEncValue`](PollEncValue.md)

PollEncValue

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28995)

Encodes the specified PollEncValue message. Does not implicitly [verify](PollEncValue.md#verify) messages.

#### Parameters

##### message

[`IPollEncValue`](../interfaces/IPollEncValue.md)

PollEncValue message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:29003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29003)

Encodes the specified PollEncValue message, length delimited. Does not implicitly [verify](PollEncValue.md#verify) messages.

#### Parameters

##### message

[`IPollEncValue`](../interfaces/IPollEncValue.md)

PollEncValue message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollEncValue`](PollEncValue.md)

Defined in: [WAProto/index.d.ts:29036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29036)

Creates a PollEncValue message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollEncValue`](PollEncValue.md)

PollEncValue

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:29057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29057)

Gets the default type url for PollEncValue

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

Defined in: [WAProto/index.d.ts:29044](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29044)

Creates a plain object from a PollEncValue message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollEncValue`](PollEncValue.md)

PollEncValue

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:29029](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L29029)

Verifies a PollEncValue message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
