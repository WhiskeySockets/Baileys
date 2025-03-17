# Class: Pushname

Defined in: [WAProto/index.d.ts:37576](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37576)

Represents a Pushname.

## Implements

- [`IPushname`](../interfaces/IPushname.md)

## Constructors

### new Pushname()

> **new Pushname**(`properties`?): [`Pushname`](Pushname.md)

Defined in: [WAProto/index.d.ts:37582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37582)

Constructs a new Pushname.

#### Parameters

##### properties?

[`IPushname`](../interfaces/IPushname.md)

Properties to set

#### Returns

[`Pushname`](Pushname.md)

## Properties

### id?

> `optional` **id**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37585](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37585)

Pushname id.

#### Implementation of

[`IPushname`](../interfaces/IPushname.md).[`id`](../interfaces/IPushname.md#id)

***

### pushname?

> `optional` **pushname**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37588](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37588)

Pushname pushname.

#### Implementation of

[`IPushname`](../interfaces/IPushname.md).[`pushname`](../interfaces/IPushname.md#pushname)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37658)

Converts this Pushname to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Pushname`](Pushname.md)

Defined in: [WAProto/index.d.ts:37595](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37595)

Creates a new Pushname instance using the specified properties.

#### Parameters

##### properties?

[`IPushname`](../interfaces/IPushname.md)

Properties to set

#### Returns

[`Pushname`](Pushname.md)

Pushname instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Pushname`](Pushname.md)

Defined in: [WAProto/index.d.ts:37621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37621)

Decodes a Pushname message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Pushname`](Pushname.md)

Pushname

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Pushname`](Pushname.md)

Defined in: [WAProto/index.d.ts:37630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37630)

Decodes a Pushname message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Pushname`](Pushname.md)

Pushname

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37603)

Encodes the specified Pushname message. Does not implicitly [verify](Pushname.md#verify) messages.

#### Parameters

##### message

[`IPushname`](../interfaces/IPushname.md)

Pushname message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37611](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37611)

Encodes the specified Pushname message, length delimited. Does not implicitly [verify](Pushname.md#verify) messages.

#### Parameters

##### message

[`IPushname`](../interfaces/IPushname.md)

Pushname message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Pushname`](Pushname.md)

Defined in: [WAProto/index.d.ts:37644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37644)

Creates a Pushname message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Pushname`](Pushname.md)

Pushname

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37665](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37665)

Gets the default type url for Pushname

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

Defined in: [WAProto/index.d.ts:37652](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37652)

Creates a plain object from a Pushname message. Also converts values to other types if specified.

#### Parameters

##### message

[`Pushname`](Pushname.md)

Pushname

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37637](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37637)

Verifies a Pushname message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
