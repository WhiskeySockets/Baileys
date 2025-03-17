# Class: UnarchiveChatsSetting

Defined in: [WAProto/index.d.ts:46275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46275)

Represents an UnarchiveChatsSetting.

## Implements

- [`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md)

## Constructors

### new UnarchiveChatsSetting()

> **new UnarchiveChatsSetting**(`properties`?): [`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

Defined in: [WAProto/index.d.ts:46281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46281)

Constructs a new UnarchiveChatsSetting.

#### Parameters

##### properties?

[`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md)

Properties to set

#### Returns

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

## Properties

### unarchiveChats?

> `optional` **unarchiveChats**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:46284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46284)

UnarchiveChatsSetting unarchiveChats.

#### Implementation of

[`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md).[`unarchiveChats`](../interfaces/IUnarchiveChatsSetting.md#unarchivechats)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46354](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46354)

Converts this UnarchiveChatsSetting to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

Defined in: [WAProto/index.d.ts:46291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46291)

Creates a new UnarchiveChatsSetting instance using the specified properties.

#### Parameters

##### properties?

[`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md)

Properties to set

#### Returns

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

UnarchiveChatsSetting instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

Defined in: [WAProto/index.d.ts:46317](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46317)

Decodes an UnarchiveChatsSetting message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

UnarchiveChatsSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

Defined in: [WAProto/index.d.ts:46326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46326)

Decodes an UnarchiveChatsSetting message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

UnarchiveChatsSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46299)

Encodes the specified UnarchiveChatsSetting message. Does not implicitly [verify](UnarchiveChatsSetting.md#verify) messages.

#### Parameters

##### message

[`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md)

UnarchiveChatsSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46307)

Encodes the specified UnarchiveChatsSetting message, length delimited. Does not implicitly [verify](UnarchiveChatsSetting.md#verify) messages.

#### Parameters

##### message

[`IUnarchiveChatsSetting`](../interfaces/IUnarchiveChatsSetting.md)

UnarchiveChatsSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

Defined in: [WAProto/index.d.ts:46340](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46340)

Creates an UnarchiveChatsSetting message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

UnarchiveChatsSetting

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46361)

Gets the default type url for UnarchiveChatsSetting

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

Defined in: [WAProto/index.d.ts:46348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46348)

Creates a plain object from an UnarchiveChatsSetting message. Also converts values to other types if specified.

#### Parameters

##### message

[`UnarchiveChatsSetting`](UnarchiveChatsSetting.md)

UnarchiveChatsSetting

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46333)

Verifies an UnarchiveChatsSetting message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
