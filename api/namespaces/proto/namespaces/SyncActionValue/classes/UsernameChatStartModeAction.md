# Class: UsernameChatStartModeAction

Defined in: [WAProto/index.d.ts:46469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46469)

Represents a UsernameChatStartModeAction.

## Implements

- [`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md)

## Constructors

### new UsernameChatStartModeAction()

> **new UsernameChatStartModeAction**(`properties`?): [`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

Defined in: [WAProto/index.d.ts:46475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46475)

Constructs a new UsernameChatStartModeAction.

#### Parameters

##### properties?

[`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md)

Properties to set

#### Returns

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

## Properties

### chatStartMode?

> `optional` **chatStartMode**: `null` \| [`ChatStartMode`](../namespaces/UsernameChatStartModeAction/enumerations/ChatStartMode.md)

Defined in: [WAProto/index.d.ts:46478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46478)

UsernameChatStartModeAction chatStartMode.

#### Implementation of

[`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md).[`chatStartMode`](../interfaces/IUsernameChatStartModeAction.md#chatstartmode)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46548)

Converts this UsernameChatStartModeAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

Defined in: [WAProto/index.d.ts:46485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46485)

Creates a new UsernameChatStartModeAction instance using the specified properties.

#### Parameters

##### properties?

[`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md)

Properties to set

#### Returns

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

UsernameChatStartModeAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

Defined in: [WAProto/index.d.ts:46511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46511)

Decodes a UsernameChatStartModeAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

UsernameChatStartModeAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

Defined in: [WAProto/index.d.ts:46520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46520)

Decodes a UsernameChatStartModeAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

UsernameChatStartModeAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46493](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46493)

Encodes the specified UsernameChatStartModeAction message. Does not implicitly [verify](UsernameChatStartModeAction.md#verify) messages.

#### Parameters

##### message

[`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md)

UsernameChatStartModeAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46501)

Encodes the specified UsernameChatStartModeAction message, length delimited. Does not implicitly [verify](UsernameChatStartModeAction.md#verify) messages.

#### Parameters

##### message

[`IUsernameChatStartModeAction`](../interfaces/IUsernameChatStartModeAction.md)

UsernameChatStartModeAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

Defined in: [WAProto/index.d.ts:46534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46534)

Creates a UsernameChatStartModeAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

UsernameChatStartModeAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46555)

Gets the default type url for UsernameChatStartModeAction

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

Defined in: [WAProto/index.d.ts:46542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46542)

Creates a plain object from a UsernameChatStartModeAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`UsernameChatStartModeAction`](UsernameChatStartModeAction.md)

UsernameChatStartModeAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46527)

Verifies a UsernameChatStartModeAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
