# Class: SenderChainKey

Defined in: [WAProto/index.d.ts:38656](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38656)

Represents a SenderChainKey.

## Implements

- [`ISenderChainKey`](../interfaces/ISenderChainKey.md)

## Constructors

### new SenderChainKey()

> **new SenderChainKey**(`properties`?): [`SenderChainKey`](SenderChainKey.md)

Defined in: [WAProto/index.d.ts:38662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38662)

Constructs a new SenderChainKey.

#### Parameters

##### properties?

[`ISenderChainKey`](../interfaces/ISenderChainKey.md)

Properties to set

#### Returns

[`SenderChainKey`](SenderChainKey.md)

## Properties

### iteration?

> `optional` **iteration**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38665](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38665)

SenderChainKey iteration.

#### Implementation of

[`ISenderChainKey`](../interfaces/ISenderChainKey.md).[`iteration`](../interfaces/ISenderChainKey.md#iteration)

***

### seed?

> `optional` **seed**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38668](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38668)

SenderChainKey seed.

#### Implementation of

[`ISenderChainKey`](../interfaces/ISenderChainKey.md).[`seed`](../interfaces/ISenderChainKey.md#seed)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38738)

Converts this SenderChainKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderChainKey`](SenderChainKey.md)

Defined in: [WAProto/index.d.ts:38675](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38675)

Creates a new SenderChainKey instance using the specified properties.

#### Parameters

##### properties?

[`ISenderChainKey`](../interfaces/ISenderChainKey.md)

Properties to set

#### Returns

[`SenderChainKey`](SenderChainKey.md)

SenderChainKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderChainKey`](SenderChainKey.md)

Defined in: [WAProto/index.d.ts:38701](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38701)

Decodes a SenderChainKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderChainKey`](SenderChainKey.md)

SenderChainKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderChainKey`](SenderChainKey.md)

Defined in: [WAProto/index.d.ts:38710](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38710)

Decodes a SenderChainKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderChainKey`](SenderChainKey.md)

SenderChainKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38683](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38683)

Encodes the specified SenderChainKey message. Does not implicitly [verify](SenderChainKey.md#verify) messages.

#### Parameters

##### message

[`ISenderChainKey`](../interfaces/ISenderChainKey.md)

SenderChainKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38691](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38691)

Encodes the specified SenderChainKey message, length delimited. Does not implicitly [verify](SenderChainKey.md#verify) messages.

#### Parameters

##### message

[`ISenderChainKey`](../interfaces/ISenderChainKey.md)

SenderChainKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderChainKey`](SenderChainKey.md)

Defined in: [WAProto/index.d.ts:38724](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38724)

Creates a SenderChainKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderChainKey`](SenderChainKey.md)

SenderChainKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38745](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38745)

Gets the default type url for SenderChainKey

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

Defined in: [WAProto/index.d.ts:38732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38732)

Creates a plain object from a SenderChainKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderChainKey`](SenderChainKey.md)

SenderChainKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38717)

Verifies a SenderChainKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
