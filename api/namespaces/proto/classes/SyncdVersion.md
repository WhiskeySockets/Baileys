# Class: SyncdVersion

Defined in: [WAProto/index.d.ts:47550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47550)

Represents a SyncdVersion.

## Implements

- [`ISyncdVersion`](../interfaces/ISyncdVersion.md)

## Constructors

### new SyncdVersion()

> **new SyncdVersion**(`properties`?): [`SyncdVersion`](SyncdVersion.md)

Defined in: [WAProto/index.d.ts:47556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47556)

Constructs a new SyncdVersion.

#### Parameters

##### properties?

[`ISyncdVersion`](../interfaces/ISyncdVersion.md)

Properties to set

#### Returns

[`SyncdVersion`](SyncdVersion.md)

## Properties

### version?

> `optional` **version**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:47559](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47559)

SyncdVersion version.

#### Implementation of

[`ISyncdVersion`](../interfaces/ISyncdVersion.md).[`version`](../interfaces/ISyncdVersion.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47629](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47629)

Converts this SyncdVersion to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdVersion`](SyncdVersion.md)

Defined in: [WAProto/index.d.ts:47566](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47566)

Creates a new SyncdVersion instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdVersion`](../interfaces/ISyncdVersion.md)

Properties to set

#### Returns

[`SyncdVersion`](SyncdVersion.md)

SyncdVersion instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdVersion`](SyncdVersion.md)

Defined in: [WAProto/index.d.ts:47592](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47592)

Decodes a SyncdVersion message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdVersion`](SyncdVersion.md)

SyncdVersion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdVersion`](SyncdVersion.md)

Defined in: [WAProto/index.d.ts:47601](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47601)

Decodes a SyncdVersion message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdVersion`](SyncdVersion.md)

SyncdVersion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47574](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47574)

Encodes the specified SyncdVersion message. Does not implicitly [verify](SyncdVersion.md#verify) messages.

#### Parameters

##### message

[`ISyncdVersion`](../interfaces/ISyncdVersion.md)

SyncdVersion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47582)

Encodes the specified SyncdVersion message, length delimited. Does not implicitly [verify](SyncdVersion.md#verify) messages.

#### Parameters

##### message

[`ISyncdVersion`](../interfaces/ISyncdVersion.md)

SyncdVersion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdVersion`](SyncdVersion.md)

Defined in: [WAProto/index.d.ts:47615](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47615)

Creates a SyncdVersion message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdVersion`](SyncdVersion.md)

SyncdVersion

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47636](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47636)

Gets the default type url for SyncdVersion

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

Defined in: [WAProto/index.d.ts:47623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47623)

Creates a plain object from a SyncdVersion message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdVersion`](SyncdVersion.md)

SyncdVersion

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47608](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47608)

Verifies a SyncdVersion message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
