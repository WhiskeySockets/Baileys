# Class: Chat

Defined in: [WAProto/index.d.ts:19753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19753)

Represents a Chat.

## Implements

- [`IChat`](../interfaces/IChat.md)

## Constructors

### new Chat()

> **new Chat**(`properties`?): [`Chat`](Chat.md)

Defined in: [WAProto/index.d.ts:19759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19759)

Constructs a new Chat.

#### Parameters

##### properties?

[`IChat`](../interfaces/IChat.md)

Properties to set

#### Returns

[`Chat`](Chat.md)

## Properties

### displayName?

> `optional` **displayName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19762)

Chat displayName.

#### Implementation of

[`IChat`](../interfaces/IChat.md).[`displayName`](../interfaces/IChat.md#displayname)

***

### id?

> `optional` **id**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19765)

Chat id.

#### Implementation of

[`IChat`](../interfaces/IChat.md).[`id`](../interfaces/IChat.md#id)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19835)

Converts this Chat to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Chat`](Chat.md)

Defined in: [WAProto/index.d.ts:19772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19772)

Creates a new Chat instance using the specified properties.

#### Parameters

##### properties?

[`IChat`](../interfaces/IChat.md)

Properties to set

#### Returns

[`Chat`](Chat.md)

Chat instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Chat`](Chat.md)

Defined in: [WAProto/index.d.ts:19798](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19798)

Decodes a Chat message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Chat`](Chat.md)

Chat

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Chat`](Chat.md)

Defined in: [WAProto/index.d.ts:19807](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19807)

Decodes a Chat message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Chat`](Chat.md)

Chat

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19780)

Encodes the specified Chat message. Does not implicitly [verify](Chat.md#verify) messages.

#### Parameters

##### message

[`IChat`](../interfaces/IChat.md)

Chat message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19788)

Encodes the specified Chat message, length delimited. Does not implicitly [verify](Chat.md#verify) messages.

#### Parameters

##### message

[`IChat`](../interfaces/IChat.md)

Chat message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Chat`](Chat.md)

Defined in: [WAProto/index.d.ts:19821](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19821)

Creates a Chat message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Chat`](Chat.md)

Chat

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19842](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19842)

Gets the default type url for Chat

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

Defined in: [WAProto/index.d.ts:19829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19829)

Creates a plain object from a Chat message. Also converts values to other types if specified.

#### Parameters

##### message

[`Chat`](Chat.md)

Chat

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19814)

Verifies a Chat message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
