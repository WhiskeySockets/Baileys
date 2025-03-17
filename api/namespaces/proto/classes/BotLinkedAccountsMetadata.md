# Class: BotLinkedAccountsMetadata

Defined in: [WAProto/index.d.ts:3856](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3856)

Represents a BotLinkedAccountsMetadata.

## Implements

- [`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md)

## Constructors

### new BotLinkedAccountsMetadata()

> **new BotLinkedAccountsMetadata**(`properties`?): [`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

Defined in: [WAProto/index.d.ts:3862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3862)

Constructs a new BotLinkedAccountsMetadata.

#### Parameters

##### properties?

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md)

Properties to set

#### Returns

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

## Properties

### acAuthTokens?

> `optional` **acAuthTokens**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:3868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3868)

BotLinkedAccountsMetadata acAuthTokens.

#### Implementation of

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md).[`acAuthTokens`](../interfaces/IBotLinkedAccountsMetadata.md#acauthtokens)

***

### accounts

> **accounts**: [`IBotLinkedAccount`](../interfaces/IBotLinkedAccount.md)[]

Defined in: [WAProto/index.d.ts:3865](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3865)

BotLinkedAccountsMetadata accounts.

#### Implementation of

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md).[`accounts`](../interfaces/IBotLinkedAccountsMetadata.md#accounts)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3938)

Converts this BotLinkedAccountsMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

Defined in: [WAProto/index.d.ts:3875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3875)

Creates a new BotLinkedAccountsMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md)

Properties to set

#### Returns

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

Defined in: [WAProto/index.d.ts:3901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3901)

Decodes a BotLinkedAccountsMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

Defined in: [WAProto/index.d.ts:3910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3910)

Decodes a BotLinkedAccountsMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3883)

Encodes the specified BotLinkedAccountsMetadata message. Does not implicitly [verify](BotLinkedAccountsMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3891](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3891)

Encodes the specified BotLinkedAccountsMetadata message, length delimited. Does not implicitly [verify](BotLinkedAccountsMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotLinkedAccountsMetadata`](../interfaces/IBotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

Defined in: [WAProto/index.d.ts:3924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3924)

Creates a BotLinkedAccountsMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3945](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3945)

Gets the default type url for BotLinkedAccountsMetadata

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

Defined in: [WAProto/index.d.ts:3932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3932)

Creates a plain object from a BotLinkedAccountsMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotLinkedAccountsMetadata`](BotLinkedAccountsMetadata.md)

BotLinkedAccountsMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3917)

Verifies a BotLinkedAccountsMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
