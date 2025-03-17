# Class: Section

Defined in: [WAProto/index.d.ts:25541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25541)

Represents a Section.

## Implements

- [`ISection`](../interfaces/ISection.md)

## Constructors

### new Section()

> **new Section**(`properties`?): [`Section`](Section.md)

Defined in: [WAProto/index.d.ts:25547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25547)

Constructs a new Section.

#### Parameters

##### properties?

[`ISection`](../interfaces/ISection.md)

Properties to set

#### Returns

[`Section`](Section.md)

## Properties

### rows

> **rows**: [`IRow`](../interfaces/IRow.md)[]

Defined in: [WAProto/index.d.ts:25553](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25553)

Section rows.

#### Implementation of

[`ISection`](../interfaces/ISection.md).[`rows`](../interfaces/ISection.md#rows)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25550)

Section title.

#### Implementation of

[`ISection`](../interfaces/ISection.md).[`title`](../interfaces/ISection.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25623)

Converts this Section to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Section`](Section.md)

Defined in: [WAProto/index.d.ts:25560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25560)

Creates a new Section instance using the specified properties.

#### Parameters

##### properties?

[`ISection`](../interfaces/ISection.md)

Properties to set

#### Returns

[`Section`](Section.md)

Section instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Section`](Section.md)

Defined in: [WAProto/index.d.ts:25586](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25586)

Decodes a Section message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Section`](Section.md)

Section

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Section`](Section.md)

Defined in: [WAProto/index.d.ts:25595](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25595)

Decodes a Section message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Section`](Section.md)

Section

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25568](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25568)

Encodes the specified Section message. Does not implicitly [verify](Section.md#verify) messages.

#### Parameters

##### message

[`ISection`](../interfaces/ISection.md)

Section message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25576](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25576)

Encodes the specified Section message, length delimited. Does not implicitly [verify](Section.md#verify) messages.

#### Parameters

##### message

[`ISection`](../interfaces/ISection.md)

Section message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Section`](Section.md)

Defined in: [WAProto/index.d.ts:25609](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25609)

Creates a Section message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Section`](Section.md)

Section

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25630)

Gets the default type url for Section

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

Defined in: [WAProto/index.d.ts:25617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25617)

Creates a plain object from a Section message. Also converts values to other types if specified.

#### Parameters

##### message

[`Section`](Section.md)

Section

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25602](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25602)

Verifies a Section message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
