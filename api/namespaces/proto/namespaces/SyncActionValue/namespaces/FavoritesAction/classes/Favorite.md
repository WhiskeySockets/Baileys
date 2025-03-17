# Class: Favorite

Defined in: [WAProto/index.d.ts:42664](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42664)

Represents a Favorite.

## Implements

- [`IFavorite`](../interfaces/IFavorite.md)

## Constructors

### new Favorite()

> **new Favorite**(`properties`?): [`Favorite`](Favorite.md)

Defined in: [WAProto/index.d.ts:42670](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42670)

Constructs a new Favorite.

#### Parameters

##### properties?

[`IFavorite`](../interfaces/IFavorite.md)

Properties to set

#### Returns

[`Favorite`](Favorite.md)

## Properties

### id?

> `optional` **id**: `null` \| `string`

Defined in: [WAProto/index.d.ts:42673](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42673)

Favorite id.

#### Implementation of

[`IFavorite`](../interfaces/IFavorite.md).[`id`](../interfaces/IFavorite.md#id)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42743)

Converts this Favorite to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Favorite`](Favorite.md)

Defined in: [WAProto/index.d.ts:42680](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42680)

Creates a new Favorite instance using the specified properties.

#### Parameters

##### properties?

[`IFavorite`](../interfaces/IFavorite.md)

Properties to set

#### Returns

[`Favorite`](Favorite.md)

Favorite instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Favorite`](Favorite.md)

Defined in: [WAProto/index.d.ts:42706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42706)

Decodes a Favorite message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Favorite`](Favorite.md)

Favorite

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Favorite`](Favorite.md)

Defined in: [WAProto/index.d.ts:42715](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42715)

Decodes a Favorite message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Favorite`](Favorite.md)

Favorite

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42688](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42688)

Encodes the specified Favorite message. Does not implicitly [verify](Favorite.md#verify) messages.

#### Parameters

##### message

[`IFavorite`](../interfaces/IFavorite.md)

Favorite message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42696)

Encodes the specified Favorite message, length delimited. Does not implicitly [verify](Favorite.md#verify) messages.

#### Parameters

##### message

[`IFavorite`](../interfaces/IFavorite.md)

Favorite message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Favorite`](Favorite.md)

Defined in: [WAProto/index.d.ts:42729](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42729)

Creates a Favorite message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Favorite`](Favorite.md)

Favorite

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42750](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42750)

Gets the default type url for Favorite

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

Defined in: [WAProto/index.d.ts:42737](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42737)

Creates a plain object from a Favorite message. Also converts values to other types if specified.

#### Parameters

##### message

[`Favorite`](Favorite.md)

Favorite

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42722)

Verifies a Favorite message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
