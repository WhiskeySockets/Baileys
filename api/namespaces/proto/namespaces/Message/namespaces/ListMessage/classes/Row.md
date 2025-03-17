# Class: Row

Defined in: [WAProto/index.d.ts:25435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25435)

Represents a Row.

## Implements

- [`IRow`](../interfaces/IRow.md)

## Constructors

### new Row()

> **new Row**(`properties`?): [`Row`](Row.md)

Defined in: [WAProto/index.d.ts:25441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25441)

Constructs a new Row.

#### Parameters

##### properties?

[`IRow`](../interfaces/IRow.md)

Properties to set

#### Returns

[`Row`](Row.md)

## Properties

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25447](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25447)

Row description.

#### Implementation of

[`IRow`](../interfaces/IRow.md).[`description`](../interfaces/IRow.md#description)

***

### rowId?

> `optional` **rowId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25450)

Row rowId.

#### Implementation of

[`IRow`](../interfaces/IRow.md).[`rowId`](../interfaces/IRow.md#rowid)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25444)

Row title.

#### Implementation of

[`IRow`](../interfaces/IRow.md).[`title`](../interfaces/IRow.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25520)

Converts this Row to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Row`](Row.md)

Defined in: [WAProto/index.d.ts:25457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25457)

Creates a new Row instance using the specified properties.

#### Parameters

##### properties?

[`IRow`](../interfaces/IRow.md)

Properties to set

#### Returns

[`Row`](Row.md)

Row instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Row`](Row.md)

Defined in: [WAProto/index.d.ts:25483](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25483)

Decodes a Row message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Row`](Row.md)

Row

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Row`](Row.md)

Defined in: [WAProto/index.d.ts:25492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25492)

Decodes a Row message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Row`](Row.md)

Row

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25465](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25465)

Encodes the specified Row message. Does not implicitly [verify](Row.md#verify) messages.

#### Parameters

##### message

[`IRow`](../interfaces/IRow.md)

Row message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25473)

Encodes the specified Row message, length delimited. Does not implicitly [verify](Row.md#verify) messages.

#### Parameters

##### message

[`IRow`](../interfaces/IRow.md)

Row message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Row`](Row.md)

Defined in: [WAProto/index.d.ts:25506](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25506)

Creates a Row message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Row`](Row.md)

Row

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25527)

Gets the default type url for Row

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

Defined in: [WAProto/index.d.ts:25514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25514)

Creates a plain object from a Row message. Also converts values to other types if specified.

#### Parameters

##### message

[`Row`](Row.md)

Row

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25499)

Verifies a Row message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
