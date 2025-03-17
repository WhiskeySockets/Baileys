# Class: ChatRowOpaqueData

Defined in: [WAProto/index.d.ts:6922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6922)

Represents a ChatRowOpaqueData.

## Implements

- [`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md)

## Constructors

### new ChatRowOpaqueData()

> **new ChatRowOpaqueData**(`properties`?): [`ChatRowOpaqueData`](ChatRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:6928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6928)

Constructs a new ChatRowOpaqueData.

#### Parameters

##### properties?

[`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md)

Properties to set

#### Returns

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

## Properties

### draftMessage?

> `optional` **draftMessage**: `null` \| [`IDraftMessage`](../namespaces/ChatRowOpaqueData/interfaces/IDraftMessage.md)

Defined in: [WAProto/index.d.ts:6931](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6931)

ChatRowOpaqueData draftMessage.

#### Implementation of

[`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md).[`draftMessage`](../interfaces/IChatRowOpaqueData.md#draftmessage)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7001](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7001)

Converts this ChatRowOpaqueData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ChatRowOpaqueData`](ChatRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:6938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6938)

Creates a new ChatRowOpaqueData instance using the specified properties.

#### Parameters

##### properties?

[`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md)

Properties to set

#### Returns

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

ChatRowOpaqueData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ChatRowOpaqueData`](ChatRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:6964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6964)

Decodes a ChatRowOpaqueData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

ChatRowOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ChatRowOpaqueData`](ChatRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:6973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6973)

Decodes a ChatRowOpaqueData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

ChatRowOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6946)

Encodes the specified ChatRowOpaqueData message. Does not implicitly [verify](ChatRowOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md)

ChatRowOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6954](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6954)

Encodes the specified ChatRowOpaqueData message, length delimited. Does not implicitly [verify](ChatRowOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IChatRowOpaqueData`](../interfaces/IChatRowOpaqueData.md)

ChatRowOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ChatRowOpaqueData`](ChatRowOpaqueData.md)

Defined in: [WAProto/index.d.ts:6987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6987)

Creates a ChatRowOpaqueData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

ChatRowOpaqueData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7008](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7008)

Gets the default type url for ChatRowOpaqueData

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

Defined in: [WAProto/index.d.ts:6995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6995)

Creates a plain object from a ChatRowOpaqueData message. Also converts values to other types if specified.

#### Parameters

##### message

[`ChatRowOpaqueData`](ChatRowOpaqueData.md)

ChatRowOpaqueData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6980](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6980)

Verifies a ChatRowOpaqueData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
