# Class: LockChatAction

Defined in: [WAProto/index.d.ts:43296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43296)

Represents a LockChatAction.

## Implements

- [`ILockChatAction`](../interfaces/ILockChatAction.md)

## Constructors

### new LockChatAction()

> **new LockChatAction**(`properties`?): [`LockChatAction`](LockChatAction.md)

Defined in: [WAProto/index.d.ts:43302](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43302)

Constructs a new LockChatAction.

#### Parameters

##### properties?

[`ILockChatAction`](../interfaces/ILockChatAction.md)

Properties to set

#### Returns

[`LockChatAction`](LockChatAction.md)

## Properties

### locked?

> `optional` **locked**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43305](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43305)

LockChatAction locked.

#### Implementation of

[`ILockChatAction`](../interfaces/ILockChatAction.md).[`locked`](../interfaces/ILockChatAction.md#locked)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43375)

Converts this LockChatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LockChatAction`](LockChatAction.md)

Defined in: [WAProto/index.d.ts:43312](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43312)

Creates a new LockChatAction instance using the specified properties.

#### Parameters

##### properties?

[`ILockChatAction`](../interfaces/ILockChatAction.md)

Properties to set

#### Returns

[`LockChatAction`](LockChatAction.md)

LockChatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LockChatAction`](LockChatAction.md)

Defined in: [WAProto/index.d.ts:43338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43338)

Decodes a LockChatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LockChatAction`](LockChatAction.md)

LockChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LockChatAction`](LockChatAction.md)

Defined in: [WAProto/index.d.ts:43347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43347)

Decodes a LockChatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LockChatAction`](LockChatAction.md)

LockChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43320)

Encodes the specified LockChatAction message. Does not implicitly [verify](LockChatAction.md#verify) messages.

#### Parameters

##### message

[`ILockChatAction`](../interfaces/ILockChatAction.md)

LockChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43328](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43328)

Encodes the specified LockChatAction message, length delimited. Does not implicitly [verify](LockChatAction.md#verify) messages.

#### Parameters

##### message

[`ILockChatAction`](../interfaces/ILockChatAction.md)

LockChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LockChatAction`](LockChatAction.md)

Defined in: [WAProto/index.d.ts:43361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43361)

Creates a LockChatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LockChatAction`](LockChatAction.md)

LockChatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43382)

Gets the default type url for LockChatAction

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

Defined in: [WAProto/index.d.ts:43369](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43369)

Creates a plain object from a LockChatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`LockChatAction`](LockChatAction.md)

LockChatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43354](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43354)

Verifies a LockChatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
