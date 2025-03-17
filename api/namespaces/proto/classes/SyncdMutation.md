# Class: SyncdMutation

Defined in: [WAProto/index.d.ts:46878](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46878)

Represents a SyncdMutation.

## Implements

- [`ISyncdMutation`](../interfaces/ISyncdMutation.md)

## Constructors

### new SyncdMutation()

> **new SyncdMutation**(`properties`?): [`SyncdMutation`](SyncdMutation.md)

Defined in: [WAProto/index.d.ts:46884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46884)

Constructs a new SyncdMutation.

#### Parameters

##### properties?

[`ISyncdMutation`](../interfaces/ISyncdMutation.md)

Properties to set

#### Returns

[`SyncdMutation`](SyncdMutation.md)

## Properties

### operation?

> `optional` **operation**: `null` \| [`SyncdOperation`](../namespaces/SyncdMutation/enumerations/SyncdOperation.md)

Defined in: [WAProto/index.d.ts:46887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46887)

SyncdMutation operation.

#### Implementation of

[`ISyncdMutation`](../interfaces/ISyncdMutation.md).[`operation`](../interfaces/ISyncdMutation.md#operation)

***

### record?

> `optional` **record**: `null` \| [`ISyncdRecord`](../interfaces/ISyncdRecord.md)

Defined in: [WAProto/index.d.ts:46890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46890)

SyncdMutation record.

#### Implementation of

[`ISyncdMutation`](../interfaces/ISyncdMutation.md).[`record`](../interfaces/ISyncdMutation.md#record)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46960](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46960)

Converts this SyncdMutation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdMutation`](SyncdMutation.md)

Defined in: [WAProto/index.d.ts:46897](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46897)

Creates a new SyncdMutation instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdMutation`](../interfaces/ISyncdMutation.md)

Properties to set

#### Returns

[`SyncdMutation`](SyncdMutation.md)

SyncdMutation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdMutation`](SyncdMutation.md)

Defined in: [WAProto/index.d.ts:46923](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46923)

Decodes a SyncdMutation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdMutation`](SyncdMutation.md)

SyncdMutation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdMutation`](SyncdMutation.md)

Defined in: [WAProto/index.d.ts:46932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46932)

Decodes a SyncdMutation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdMutation`](SyncdMutation.md)

SyncdMutation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46905](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46905)

Encodes the specified SyncdMutation message. Does not implicitly [verify](SyncdMutation.md#verify) messages.

#### Parameters

##### message

[`ISyncdMutation`](../interfaces/ISyncdMutation.md)

SyncdMutation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46913)

Encodes the specified SyncdMutation message, length delimited. Does not implicitly [verify](SyncdMutation.md#verify) messages.

#### Parameters

##### message

[`ISyncdMutation`](../interfaces/ISyncdMutation.md)

SyncdMutation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdMutation`](SyncdMutation.md)

Defined in: [WAProto/index.d.ts:46946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46946)

Creates a SyncdMutation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdMutation`](SyncdMutation.md)

SyncdMutation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46967](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46967)

Gets the default type url for SyncdMutation

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

Defined in: [WAProto/index.d.ts:46954](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46954)

Creates a plain object from a SyncdMutation message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdMutation`](SyncdMutation.md)

SyncdMutation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46939)

Verifies a SyncdMutation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
