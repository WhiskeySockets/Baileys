# Class: Option

Defined in: [WAProto/index.d.ts:28858](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28858)

Represents an Option.

## Implements

- [`IOption`](../interfaces/IOption.md)

## Constructors

### new Option()

> **new Option**(`properties`?): [`Option`](Option.md)

Defined in: [WAProto/index.d.ts:28864](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28864)

Constructs a new Option.

#### Parameters

##### properties?

[`IOption`](../interfaces/IOption.md)

Properties to set

#### Returns

[`Option`](Option.md)

## Properties

### optionHash?

> `optional` **optionHash**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28870](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28870)

Option optionHash.

#### Implementation of

[`IOption`](../interfaces/IOption.md).[`optionHash`](../interfaces/IOption.md#optionhash)

***

### optionName?

> `optional` **optionName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28867](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28867)

Option optionName.

#### Implementation of

[`IOption`](../interfaces/IOption.md).[`optionName`](../interfaces/IOption.md#optionname)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28940)

Converts this Option to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Option`](Option.md)

Defined in: [WAProto/index.d.ts:28877](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28877)

Creates a new Option instance using the specified properties.

#### Parameters

##### properties?

[`IOption`](../interfaces/IOption.md)

Properties to set

#### Returns

[`Option`](Option.md)

Option instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Option`](Option.md)

Defined in: [WAProto/index.d.ts:28903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28903)

Decodes an Option message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Option`](Option.md)

Option

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Option`](Option.md)

Defined in: [WAProto/index.d.ts:28912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28912)

Decodes an Option message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Option`](Option.md)

Option

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28885)

Encodes the specified Option message. Does not implicitly [verify](Option.md#verify) messages.

#### Parameters

##### message

[`IOption`](../interfaces/IOption.md)

Option message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28893)

Encodes the specified Option message, length delimited. Does not implicitly [verify](Option.md#verify) messages.

#### Parameters

##### message

[`IOption`](../interfaces/IOption.md)

Option message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Option`](Option.md)

Defined in: [WAProto/index.d.ts:28926](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28926)

Creates an Option message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Option`](Option.md)

Option

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28947](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28947)

Gets the default type url for Option

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

Defined in: [WAProto/index.d.ts:28934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28934)

Creates a plain object from an Option message. Also converts values to other types if specified.

#### Parameters

##### message

[`Option`](Option.md)

Option

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28919)

Verifies an Option message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
