# Class: ChainKey

Defined in: [WAProto/index.d.ts:39351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39351)

Represents a ChainKey.

## Implements

- [`IChainKey`](../interfaces/IChainKey.md)

## Constructors

### new ChainKey()

> **new ChainKey**(`properties`?): [`ChainKey`](ChainKey.md)

Defined in: [WAProto/index.d.ts:39357](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39357)

Constructs a new ChainKey.

#### Parameters

##### properties?

[`IChainKey`](../interfaces/IChainKey.md)

Properties to set

#### Returns

[`ChainKey`](ChainKey.md)

## Properties

### index?

> `optional` **index**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39360](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39360)

ChainKey index.

#### Implementation of

[`IChainKey`](../interfaces/IChainKey.md).[`index`](../interfaces/IChainKey.md#index)

***

### key?

> `optional` **key**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39363](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39363)

ChainKey key.

#### Implementation of

[`IChainKey`](../interfaces/IChainKey.md).[`key`](../interfaces/IChainKey.md#key)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39433](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39433)

Converts this ChainKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ChainKey`](ChainKey.md)

Defined in: [WAProto/index.d.ts:39370](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39370)

Creates a new ChainKey instance using the specified properties.

#### Parameters

##### properties?

[`IChainKey`](../interfaces/IChainKey.md)

Properties to set

#### Returns

[`ChainKey`](ChainKey.md)

ChainKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ChainKey`](ChainKey.md)

Defined in: [WAProto/index.d.ts:39396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39396)

Decodes a ChainKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ChainKey`](ChainKey.md)

ChainKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ChainKey`](ChainKey.md)

Defined in: [WAProto/index.d.ts:39405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39405)

Decodes a ChainKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ChainKey`](ChainKey.md)

ChainKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39378)

Encodes the specified ChainKey message. Does not implicitly [verify](ChainKey.md#verify) messages.

#### Parameters

##### message

[`IChainKey`](../interfaces/IChainKey.md)

ChainKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39386)

Encodes the specified ChainKey message, length delimited. Does not implicitly [verify](ChainKey.md#verify) messages.

#### Parameters

##### message

[`IChainKey`](../interfaces/IChainKey.md)

ChainKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ChainKey`](ChainKey.md)

Defined in: [WAProto/index.d.ts:39419](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39419)

Creates a ChainKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ChainKey`](ChainKey.md)

ChainKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39440](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39440)

Gets the default type url for ChainKey

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

Defined in: [WAProto/index.d.ts:39427](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39427)

Creates a plain object from a ChainKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`ChainKey`](ChainKey.md)

ChainKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39412](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39412)

Verifies a ChainKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
