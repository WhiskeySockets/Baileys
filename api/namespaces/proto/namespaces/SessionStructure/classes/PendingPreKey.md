# Class: PendingPreKey

Defined in: [WAProto/index.d.ts:39706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39706)

Represents a PendingPreKey.

## Implements

- [`IPendingPreKey`](../interfaces/IPendingPreKey.md)

## Constructors

### new PendingPreKey()

> **new PendingPreKey**(`properties`?): [`PendingPreKey`](PendingPreKey.md)

Defined in: [WAProto/index.d.ts:39712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39712)

Constructs a new PendingPreKey.

#### Parameters

##### properties?

[`IPendingPreKey`](../interfaces/IPendingPreKey.md)

Properties to set

#### Returns

[`PendingPreKey`](PendingPreKey.md)

## Properties

### baseKey?

> `optional` **baseKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39721](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39721)

PendingPreKey baseKey.

#### Implementation of

[`IPendingPreKey`](../interfaces/IPendingPreKey.md).[`baseKey`](../interfaces/IPendingPreKey.md#basekey)

***

### preKeyId?

> `optional` **preKeyId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39715](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39715)

PendingPreKey preKeyId.

#### Implementation of

[`IPendingPreKey`](../interfaces/IPendingPreKey.md).[`preKeyId`](../interfaces/IPendingPreKey.md#prekeyid)

***

### signedPreKeyId?

> `optional` **signedPreKeyId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39718)

PendingPreKey signedPreKeyId.

#### Implementation of

[`IPendingPreKey`](../interfaces/IPendingPreKey.md).[`signedPreKeyId`](../interfaces/IPendingPreKey.md#signedprekeyid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39791](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39791)

Converts this PendingPreKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PendingPreKey`](PendingPreKey.md)

Defined in: [WAProto/index.d.ts:39728](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39728)

Creates a new PendingPreKey instance using the specified properties.

#### Parameters

##### properties?

[`IPendingPreKey`](../interfaces/IPendingPreKey.md)

Properties to set

#### Returns

[`PendingPreKey`](PendingPreKey.md)

PendingPreKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PendingPreKey`](PendingPreKey.md)

Defined in: [WAProto/index.d.ts:39754](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39754)

Decodes a PendingPreKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PendingPreKey`](PendingPreKey.md)

PendingPreKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PendingPreKey`](PendingPreKey.md)

Defined in: [WAProto/index.d.ts:39763](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39763)

Decodes a PendingPreKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PendingPreKey`](PendingPreKey.md)

PendingPreKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39736](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39736)

Encodes the specified PendingPreKey message. Does not implicitly [verify](PendingPreKey.md#verify) messages.

#### Parameters

##### message

[`IPendingPreKey`](../interfaces/IPendingPreKey.md)

PendingPreKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39744](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39744)

Encodes the specified PendingPreKey message, length delimited. Does not implicitly [verify](PendingPreKey.md#verify) messages.

#### Parameters

##### message

[`IPendingPreKey`](../interfaces/IPendingPreKey.md)

PendingPreKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PendingPreKey`](PendingPreKey.md)

Defined in: [WAProto/index.d.ts:39777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39777)

Creates a PendingPreKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PendingPreKey`](PendingPreKey.md)

PendingPreKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39798](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39798)

Gets the default type url for PendingPreKey

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

Defined in: [WAProto/index.d.ts:39785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39785)

Creates a plain object from a PendingPreKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`PendingPreKey`](PendingPreKey.md)

PendingPreKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39770](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39770)

Verifies a PendingPreKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
