# Class: BotLinkedAccount

Defined in: [WAProto/index.d.ts:3748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3748)

Represents a BotLinkedAccount.

## Implements

- [`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)

## Constructors

### new BotLinkedAccount()

> **new BotLinkedAccount**(`properties`?): [`BotLinkedAccount`](BotLinkedAccount.md)

Defined in: [WAProto/index.d.ts:3754](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3754)

Constructs a new BotLinkedAccount.

#### Parameters

##### properties?

[`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)

Properties to set

#### Returns

[`BotLinkedAccount`](BotLinkedAccount.md)

## Properties

### type?

> `optional` **type**: `null` \| [`BOT_LINKED_ACCOUNT_TYPE_1P`](../namespaces/BotLinkedAccount/enumerations/BotLinkedAccountType.md#bot_linked_account_type_1p)

Defined in: [WAProto/index.d.ts:3757](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3757)

BotLinkedAccount type.

#### Implementation of

[`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md).[`type`](../interfaces/IBotLinkedAccount.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3827)

Converts this BotLinkedAccount to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotLinkedAccount`](BotLinkedAccount.md)

Defined in: [WAProto/index.d.ts:3764](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3764)

Creates a new BotLinkedAccount instance using the specified properties.

#### Parameters

##### properties?

[`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)

Properties to set

#### Returns

[`BotLinkedAccount`](BotLinkedAccount.md)

BotLinkedAccount instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotLinkedAccount`](BotLinkedAccount.md)

Defined in: [WAProto/index.d.ts:3790](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3790)

Decodes a BotLinkedAccount message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotLinkedAccount`](BotLinkedAccount.md)

BotLinkedAccount

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotLinkedAccount`](BotLinkedAccount.md)

Defined in: [WAProto/index.d.ts:3799](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3799)

Decodes a BotLinkedAccount message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotLinkedAccount`](BotLinkedAccount.md)

BotLinkedAccount

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3772)

Encodes the specified BotLinkedAccount message. Does not implicitly [verify](BotLinkedAccount.md#verify) messages.

#### Parameters

##### message

[`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)

BotLinkedAccount message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3780)

Encodes the specified BotLinkedAccount message, length delimited. Does not implicitly [verify](BotLinkedAccount.md#verify) messages.

#### Parameters

##### message

[`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)

BotLinkedAccount message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotLinkedAccount`](BotLinkedAccount.md)

Defined in: [WAProto/index.d.ts:3813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3813)

Creates a BotLinkedAccount message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotLinkedAccount`](BotLinkedAccount.md)

BotLinkedAccount

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3834)

Gets the default type url for BotLinkedAccount

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

Defined in: [WAProto/index.d.ts:3821](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3821)

Creates a plain object from a BotLinkedAccount message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotLinkedAccount`](BotLinkedAccount.md)

BotLinkedAccount

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3806)

Verifies a BotLinkedAccount message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
