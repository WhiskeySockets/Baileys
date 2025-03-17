# Class: TransformerArg

Defined in: [WAProto/index.d.ts:48528](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48528)

Represents a TransformerArg.

## Implements

- [`ITransformerArg`](../interfaces/ITransformerArg.md)

## Constructors

### new TransformerArg()

> **new TransformerArg**(`properties`?): [`TransformerArg`](TransformerArg.md)

Defined in: [WAProto/index.d.ts:48534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48534)

Constructs a new TransformerArg.

#### Parameters

##### properties?

[`ITransformerArg`](../interfaces/ITransformerArg.md)

Properties to set

#### Returns

[`TransformerArg`](TransformerArg.md)

## Properties

### key?

> `optional` **key**: `null` \| `string`

Defined in: [WAProto/index.d.ts:48537](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48537)

TransformerArg key.

#### Implementation of

[`ITransformerArg`](../interfaces/ITransformerArg.md).[`key`](../interfaces/ITransformerArg.md#key)

***

### value?

> `optional` **value**: `null` \| [`IValue`](../namespaces/TransformerArg/interfaces/IValue.md)

Defined in: [WAProto/index.d.ts:48540](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48540)

TransformerArg value.

#### Implementation of

[`ITransformerArg`](../interfaces/ITransformerArg.md).[`value`](../interfaces/ITransformerArg.md#value)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48610](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48610)

Converts this TransformerArg to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TransformerArg`](TransformerArg.md)

Defined in: [WAProto/index.d.ts:48547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48547)

Creates a new TransformerArg instance using the specified properties.

#### Parameters

##### properties?

[`ITransformerArg`](../interfaces/ITransformerArg.md)

Properties to set

#### Returns

[`TransformerArg`](TransformerArg.md)

TransformerArg instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TransformerArg`](TransformerArg.md)

Defined in: [WAProto/index.d.ts:48573](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48573)

Decodes a TransformerArg message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TransformerArg`](TransformerArg.md)

TransformerArg

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TransformerArg`](TransformerArg.md)

Defined in: [WAProto/index.d.ts:48582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48582)

Decodes a TransformerArg message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TransformerArg`](TransformerArg.md)

TransformerArg

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48555)

Encodes the specified TransformerArg message. Does not implicitly [verify](TransformerArg.md#verify) messages.

#### Parameters

##### message

[`ITransformerArg`](../interfaces/ITransformerArg.md)

TransformerArg message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48563)

Encodes the specified TransformerArg message, length delimited. Does not implicitly [verify](TransformerArg.md#verify) messages.

#### Parameters

##### message

[`ITransformerArg`](../interfaces/ITransformerArg.md)

TransformerArg message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TransformerArg`](TransformerArg.md)

Defined in: [WAProto/index.d.ts:48596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48596)

Creates a TransformerArg message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TransformerArg`](TransformerArg.md)

TransformerArg

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48617)

Gets the default type url for TransformerArg

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

Defined in: [WAProto/index.d.ts:48604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48604)

Creates a plain object from a TransformerArg message. Also converts values to other types if specified.

#### Parameters

##### message

[`TransformerArg`](TransformerArg.md)

TransformerArg

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48589](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48589)

Verifies a TransformerArg message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
