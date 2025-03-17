# Class: ChatLockSettings

Defined in: [WAProto/index.d.ts:6822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6822)

Represents a ChatLockSettings.

## Implements

- [`IChatLockSettings`](../interfaces/IChatLockSettings.md)

## Constructors

### new ChatLockSettings()

> **new ChatLockSettings**(`properties`?): [`ChatLockSettings`](ChatLockSettings.md)

Defined in: [WAProto/index.d.ts:6828](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6828)

Constructs a new ChatLockSettings.

#### Parameters

##### properties?

[`IChatLockSettings`](../interfaces/IChatLockSettings.md)

Properties to set

#### Returns

[`ChatLockSettings`](ChatLockSettings.md)

## Properties

### hideLockedChats?

> `optional` **hideLockedChats**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:6831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6831)

ChatLockSettings hideLockedChats.

#### Implementation of

[`IChatLockSettings`](../interfaces/IChatLockSettings.md).[`hideLockedChats`](../interfaces/IChatLockSettings.md#hidelockedchats)

***

### secretCode?

> `optional` **secretCode**: `null` \| [`IUserPassword`](../interfaces/IUserPassword.md)

Defined in: [WAProto/index.d.ts:6834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6834)

ChatLockSettings secretCode.

#### Implementation of

[`IChatLockSettings`](../interfaces/IChatLockSettings.md).[`secretCode`](../interfaces/IChatLockSettings.md#secretcode)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6904](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6904)

Converts this ChatLockSettings to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ChatLockSettings`](ChatLockSettings.md)

Defined in: [WAProto/index.d.ts:6841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6841)

Creates a new ChatLockSettings instance using the specified properties.

#### Parameters

##### properties?

[`IChatLockSettings`](../interfaces/IChatLockSettings.md)

Properties to set

#### Returns

[`ChatLockSettings`](ChatLockSettings.md)

ChatLockSettings instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ChatLockSettings`](ChatLockSettings.md)

Defined in: [WAProto/index.d.ts:6867](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6867)

Decodes a ChatLockSettings message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ChatLockSettings`](ChatLockSettings.md)

ChatLockSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ChatLockSettings`](ChatLockSettings.md)

Defined in: [WAProto/index.d.ts:6876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6876)

Decodes a ChatLockSettings message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ChatLockSettings`](ChatLockSettings.md)

ChatLockSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6849](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6849)

Encodes the specified ChatLockSettings message. Does not implicitly [verify](ChatLockSettings.md#verify) messages.

#### Parameters

##### message

[`IChatLockSettings`](../interfaces/IChatLockSettings.md)

ChatLockSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6857)

Encodes the specified ChatLockSettings message, length delimited. Does not implicitly [verify](ChatLockSettings.md#verify) messages.

#### Parameters

##### message

[`IChatLockSettings`](../interfaces/IChatLockSettings.md)

ChatLockSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ChatLockSettings`](ChatLockSettings.md)

Defined in: [WAProto/index.d.ts:6890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6890)

Creates a ChatLockSettings message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ChatLockSettings`](ChatLockSettings.md)

ChatLockSettings

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6911)

Gets the default type url for ChatLockSettings

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

Defined in: [WAProto/index.d.ts:6898](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6898)

Creates a plain object from a ChatLockSettings message. Also converts values to other types if specified.

#### Parameters

##### message

[`ChatLockSettings`](ChatLockSettings.md)

ChatLockSettings

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6883)

Verifies a ChatLockSettings message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
