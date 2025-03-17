# Class: UserReceipt

Defined in: [WAProto/index.d.ts:48753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48753)

Represents a UserReceipt.

## Implements

- [`IUserReceipt`](../interfaces/IUserReceipt.md)

## Constructors

### new UserReceipt()

> **new UserReceipt**(`properties`?): [`UserReceipt`](UserReceipt.md)

Defined in: [WAProto/index.d.ts:48759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48759)

Constructs a new UserReceipt.

#### Parameters

##### properties?

[`IUserReceipt`](../interfaces/IUserReceipt.md)

Properties to set

#### Returns

[`UserReceipt`](UserReceipt.md)

## Properties

### deliveredDeviceJid

> **deliveredDeviceJid**: `string`[]

Defined in: [WAProto/index.d.ts:48777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48777)

UserReceipt deliveredDeviceJid.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`deliveredDeviceJid`](../interfaces/IUserReceipt.md#delivereddevicejid)

***

### pendingDeviceJid

> **pendingDeviceJid**: `string`[]

Defined in: [WAProto/index.d.ts:48774](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48774)

UserReceipt pendingDeviceJid.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`pendingDeviceJid`](../interfaces/IUserReceipt.md#pendingdevicejid)

***

### playedTimestamp?

> `optional` **playedTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:48771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48771)

UserReceipt playedTimestamp.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`playedTimestamp`](../interfaces/IUserReceipt.md#playedtimestamp)

***

### readTimestamp?

> `optional` **readTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:48768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48768)

UserReceipt readTimestamp.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`readTimestamp`](../interfaces/IUserReceipt.md#readtimestamp)

***

### receiptTimestamp?

> `optional` **receiptTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:48765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48765)

UserReceipt receiptTimestamp.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`receiptTimestamp`](../interfaces/IUserReceipt.md#receipttimestamp)

***

### userJid

> **userJid**: `string`

Defined in: [WAProto/index.d.ts:48762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48762)

UserReceipt userJid.

#### Implementation of

[`IUserReceipt`](../interfaces/IUserReceipt.md).[`userJid`](../interfaces/IUserReceipt.md#userjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48847](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48847)

Converts this UserReceipt to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UserReceipt`](UserReceipt.md)

Defined in: [WAProto/index.d.ts:48784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48784)

Creates a new UserReceipt instance using the specified properties.

#### Parameters

##### properties?

[`IUserReceipt`](../interfaces/IUserReceipt.md)

Properties to set

#### Returns

[`UserReceipt`](UserReceipt.md)

UserReceipt instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UserReceipt`](UserReceipt.md)

Defined in: [WAProto/index.d.ts:48810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48810)

Decodes a UserReceipt message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UserReceipt`](UserReceipt.md)

UserReceipt

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UserReceipt`](UserReceipt.md)

Defined in: [WAProto/index.d.ts:48819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48819)

Decodes a UserReceipt message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UserReceipt`](UserReceipt.md)

UserReceipt

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48792](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48792)

Encodes the specified UserReceipt message. Does not implicitly [verify](UserReceipt.md#verify) messages.

#### Parameters

##### message

[`IUserReceipt`](../interfaces/IUserReceipt.md)

UserReceipt message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48800](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48800)

Encodes the specified UserReceipt message, length delimited. Does not implicitly [verify](UserReceipt.md#verify) messages.

#### Parameters

##### message

[`IUserReceipt`](../interfaces/IUserReceipt.md)

UserReceipt message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UserReceipt`](UserReceipt.md)

Defined in: [WAProto/index.d.ts:48833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48833)

Creates a UserReceipt message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UserReceipt`](UserReceipt.md)

UserReceipt

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48854)

Gets the default type url for UserReceipt

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

Defined in: [WAProto/index.d.ts:48841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48841)

Creates a plain object from a UserReceipt message. Also converts values to other types if specified.

#### Parameters

##### message

[`UserReceipt`](UserReceipt.md)

UserReceipt

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48826](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48826)

Verifies a UserReceipt message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
