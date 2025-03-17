# Class: MsgRowOpaqueData

Defined in: [WAProto/index.d.ts:34515](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34515)

Represents a MsgRowOpaqueData.

## Implements

- [`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md)

## Constructors

### new MsgRowOpaqueData()

> **new MsgRowOpaqueData**(`properties`?): [`MsgRowOpaqueData`](MsgRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:34521](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34521)

Constructs a new MsgRowOpaqueData.

#### Parameters

##### properties?

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md)

Properties to set

#### Returns

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

## Properties

### currentMsg?

> `optional` **currentMsg**: `null` \| [`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:34524](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34524)

MsgRowOpaqueData currentMsg.

#### Implementation of

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md).[`currentMsg`](../interfaces/IMsgRowOpaqueData.md#currentmsg)

***

### quotedMsg?

> `optional` **quotedMsg**: `null` \| [`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:34527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34527)

MsgRowOpaqueData quotedMsg.

#### Implementation of

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md).[`quotedMsg`](../interfaces/IMsgRowOpaqueData.md#quotedmsg)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34597)

Converts this MsgRowOpaqueData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MsgRowOpaqueData`](MsgRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:34534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34534)

Creates a new MsgRowOpaqueData instance using the specified properties.

#### Parameters

##### properties?

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md)

Properties to set

#### Returns

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

MsgRowOpaqueData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MsgRowOpaqueData`](MsgRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:34560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34560)

Decodes a MsgRowOpaqueData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

MsgRowOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MsgRowOpaqueData`](MsgRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:34569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34569)

Decodes a MsgRowOpaqueData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

MsgRowOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34542)

Encodes the specified MsgRowOpaqueData message. Does not implicitly [verify](MsgRowOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md)

MsgRowOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34550)

Encodes the specified MsgRowOpaqueData message, length delimited. Does not implicitly [verify](MsgRowOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IMsgRowOpaqueData`](../interfaces/IMsgRowOpaqueData.md)

MsgRowOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MsgRowOpaqueData`](MsgRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:34583](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34583)

Creates a MsgRowOpaqueData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

MsgRowOpaqueData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34604)

Gets the default type url for MsgRowOpaqueData

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

Defined in: [WAProto/index.d.ts:34591](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34591)

Creates a plain object from a MsgRowOpaqueData message. Also converts values to other types if specified.

#### Parameters

##### message

[`MsgRowOpaqueData`](MsgRowOpaqueData.md)

MsgRowOpaqueData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34576](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34576)

Verifies a MsgRowOpaqueData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
