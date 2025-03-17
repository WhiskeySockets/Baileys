# Class: UserStatusMuteAction

Defined in: [WAProto/index.d.ts:46372](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46372)

Represents a UserStatusMuteAction.

## Implements

- [`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md)

## Constructors

### new UserStatusMuteAction()

> **new UserStatusMuteAction**(`properties`?): [`UserStatusMuteAction`](UserStatusMuteAction.md)

Defined in: [WAProto/index.d.ts:46378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46378)

Constructs a new UserStatusMuteAction.

#### Parameters

##### properties?

[`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md)

Properties to set

#### Returns

[`UserStatusMuteAction`](UserStatusMuteAction.md)

## Properties

### muted?

> `optional` **muted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:46381](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46381)

UserStatusMuteAction muted.

#### Implementation of

[`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md).[`muted`](../interfaces/IUserStatusMuteAction.md#muted)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46451](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46451)

Converts this UserStatusMuteAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UserStatusMuteAction`](UserStatusMuteAction.md)

Defined in: [WAProto/index.d.ts:46388](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46388)

Creates a new UserStatusMuteAction instance using the specified properties.

#### Parameters

##### properties?

[`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md)

Properties to set

#### Returns

[`UserStatusMuteAction`](UserStatusMuteAction.md)

UserStatusMuteAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UserStatusMuteAction`](UserStatusMuteAction.md)

Defined in: [WAProto/index.d.ts:46414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46414)

Decodes a UserStatusMuteAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UserStatusMuteAction`](UserStatusMuteAction.md)

UserStatusMuteAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UserStatusMuteAction`](UserStatusMuteAction.md)

Defined in: [WAProto/index.d.ts:46423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46423)

Decodes a UserStatusMuteAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UserStatusMuteAction`](UserStatusMuteAction.md)

UserStatusMuteAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46396)

Encodes the specified UserStatusMuteAction message. Does not implicitly [verify](UserStatusMuteAction.md#verify) messages.

#### Parameters

##### message

[`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md)

UserStatusMuteAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46404](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46404)

Encodes the specified UserStatusMuteAction message, length delimited. Does not implicitly [verify](UserStatusMuteAction.md#verify) messages.

#### Parameters

##### message

[`IUserStatusMuteAction`](../interfaces/IUserStatusMuteAction.md)

UserStatusMuteAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UserStatusMuteAction`](UserStatusMuteAction.md)

Defined in: [WAProto/index.d.ts:46437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46437)

Creates a UserStatusMuteAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UserStatusMuteAction`](UserStatusMuteAction.md)

UserStatusMuteAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46458](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46458)

Gets the default type url for UserStatusMuteAction

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

Defined in: [WAProto/index.d.ts:46445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46445)

Creates a plain object from a UserStatusMuteAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`UserStatusMuteAction`](UserStatusMuteAction.md)

UserStatusMuteAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46430](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46430)

Verifies a UserStatusMuteAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
