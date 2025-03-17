# Class: PendingKeyExchange

Defined in: [WAProto/index.d.ts:39585](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39585)

Represents a PendingKeyExchange.

## Implements

- [`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md)

## Constructors

### new PendingKeyExchange()

> **new PendingKeyExchange**(`properties`?): [`PendingKeyExchange`](PendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39591](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39591)

Constructs a new PendingKeyExchange.

#### Parameters

##### properties?

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md)

Properties to set

#### Returns

[`PendingKeyExchange`](PendingKeyExchange.md)

## Properties

### localBaseKey?

> `optional` **localBaseKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39597)

PendingKeyExchange localBaseKey.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localBaseKey`](../interfaces/IPendingKeyExchange.md#localbasekey)

***

### localBaseKeyPrivate?

> `optional` **localBaseKeyPrivate**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39600](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39600)

PendingKeyExchange localBaseKeyPrivate.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localBaseKeyPrivate`](../interfaces/IPendingKeyExchange.md#localbasekeyprivate)

***

### localIdentityKey?

> `optional` **localIdentityKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39609](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39609)

PendingKeyExchange localIdentityKey.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localIdentityKey`](../interfaces/IPendingKeyExchange.md#localidentitykey)

***

### localIdentityKeyPrivate?

> `optional` **localIdentityKeyPrivate**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39612)

PendingKeyExchange localIdentityKeyPrivate.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localIdentityKeyPrivate`](../interfaces/IPendingKeyExchange.md#localidentitykeyprivate)

***

### localRatchetKey?

> `optional` **localRatchetKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39603)

PendingKeyExchange localRatchetKey.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localRatchetKey`](../interfaces/IPendingKeyExchange.md#localratchetkey)

***

### localRatchetKeyPrivate?

> `optional` **localRatchetKeyPrivate**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39606)

PendingKeyExchange localRatchetKeyPrivate.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`localRatchetKeyPrivate`](../interfaces/IPendingKeyExchange.md#localratchetkeyprivate)

***

### sequence?

> `optional` **sequence**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39594](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39594)

PendingKeyExchange sequence.

#### Implementation of

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md).[`sequence`](../interfaces/IPendingKeyExchange.md#sequence)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39682](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39682)

Converts this PendingKeyExchange to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PendingKeyExchange`](PendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39619](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39619)

Creates a new PendingKeyExchange instance using the specified properties.

#### Parameters

##### properties?

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md)

Properties to set

#### Returns

[`PendingKeyExchange`](PendingKeyExchange.md)

PendingKeyExchange instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PendingKeyExchange`](PendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39645)

Decodes a PendingKeyExchange message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PendingKeyExchange`](PendingKeyExchange.md)

PendingKeyExchange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PendingKeyExchange`](PendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39654](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39654)

Decodes a PendingKeyExchange message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PendingKeyExchange`](PendingKeyExchange.md)

PendingKeyExchange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39627)

Encodes the specified PendingKeyExchange message. Does not implicitly [verify](PendingKeyExchange.md#verify) messages.

#### Parameters

##### message

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md)

PendingKeyExchange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39635](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39635)

Encodes the specified PendingKeyExchange message, length delimited. Does not implicitly [verify](PendingKeyExchange.md#verify) messages.

#### Parameters

##### message

[`IPendingKeyExchange`](../interfaces/IPendingKeyExchange.md)

PendingKeyExchange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PendingKeyExchange`](PendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39668](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39668)

Creates a PendingKeyExchange message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PendingKeyExchange`](PendingKeyExchange.md)

PendingKeyExchange

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39689](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39689)

Gets the default type url for PendingKeyExchange

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

Defined in: [WAProto/index.d.ts:39676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39676)

Creates a plain object from a PendingKeyExchange message. Also converts values to other types if specified.

#### Parameters

##### message

[`PendingKeyExchange`](PendingKeyExchange.md)

PendingKeyExchange

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39661](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39661)

Verifies a PendingKeyExchange message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
