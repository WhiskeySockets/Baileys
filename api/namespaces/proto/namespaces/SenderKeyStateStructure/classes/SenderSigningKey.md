# Class: SenderSigningKey

Defined in: [WAProto/index.d.ts:38862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38862)

Represents a SenderSigningKey.

## Implements

- [`ISenderSigningKey`](../interfaces/ISenderSigningKey.md)

## Constructors

### new SenderSigningKey()

> **new SenderSigningKey**(`properties`?): [`SenderSigningKey`](SenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38868)

Constructs a new SenderSigningKey.

#### Parameters

##### properties?

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md)

Properties to set

#### Returns

[`SenderSigningKey`](SenderSigningKey.md)

## Properties

### private?

> `optional` **private**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38874)

SenderSigningKey private.

#### Implementation of

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md).[`private`](../interfaces/ISenderSigningKey.md#private)

***

### public?

> `optional` **public**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38871](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38871)

SenderSigningKey public.

#### Implementation of

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md).[`public`](../interfaces/ISenderSigningKey.md#public)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38944](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38944)

Converts this SenderSigningKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderSigningKey`](SenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38881](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38881)

Creates a new SenderSigningKey instance using the specified properties.

#### Parameters

##### properties?

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md)

Properties to set

#### Returns

[`SenderSigningKey`](SenderSigningKey.md)

SenderSigningKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderSigningKey`](SenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38907](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38907)

Decodes a SenderSigningKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderSigningKey`](SenderSigningKey.md)

SenderSigningKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderSigningKey`](SenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38916)

Decodes a SenderSigningKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderSigningKey`](SenderSigningKey.md)

SenderSigningKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38889)

Encodes the specified SenderSigningKey message. Does not implicitly [verify](SenderSigningKey.md#verify) messages.

#### Parameters

##### message

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md)

SenderSigningKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38897](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38897)

Encodes the specified SenderSigningKey message, length delimited. Does not implicitly [verify](SenderSigningKey.md#verify) messages.

#### Parameters

##### message

[`ISenderSigningKey`](../interfaces/ISenderSigningKey.md)

SenderSigningKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderSigningKey`](SenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38930)

Creates a SenderSigningKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderSigningKey`](SenderSigningKey.md)

SenderSigningKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38951](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38951)

Gets the default type url for SenderSigningKey

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

Defined in: [WAProto/index.d.ts:38938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38938)

Creates a plain object from a SenderSigningKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderSigningKey`](SenderSigningKey.md)

SenderSigningKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38923](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38923)

Verifies a SenderSigningKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
