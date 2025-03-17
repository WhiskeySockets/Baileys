# Class: SyncdIndex

Defined in: [WAProto/index.d.ts:46778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46778)

Represents a SyncdIndex.

## Implements

- [`ISyncdIndex`](../interfaces/ISyncdIndex.md)

## Constructors

### new SyncdIndex()

> **new SyncdIndex**(`properties`?): [`SyncdIndex`](SyncdIndex.md)

Defined in: [WAProto/index.d.ts:46784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46784)

Constructs a new SyncdIndex.

#### Parameters

##### properties?

[`ISyncdIndex`](../interfaces/ISyncdIndex.md)

Properties to set

#### Returns

[`SyncdIndex`](SyncdIndex.md)

## Properties

### blob?

> `optional` **blob**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:46787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46787)

SyncdIndex blob.

#### Implementation of

[`ISyncdIndex`](../interfaces/ISyncdIndex.md).[`blob`](../interfaces/ISyncdIndex.md#blob)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46857)

Converts this SyncdIndex to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdIndex`](SyncdIndex.md)

Defined in: [WAProto/index.d.ts:46794](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46794)

Creates a new SyncdIndex instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdIndex`](../interfaces/ISyncdIndex.md)

Properties to set

#### Returns

[`SyncdIndex`](SyncdIndex.md)

SyncdIndex instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdIndex`](SyncdIndex.md)

Defined in: [WAProto/index.d.ts:46820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46820)

Decodes a SyncdIndex message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdIndex`](SyncdIndex.md)

SyncdIndex

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdIndex`](SyncdIndex.md)

Defined in: [WAProto/index.d.ts:46829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46829)

Decodes a SyncdIndex message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdIndex`](SyncdIndex.md)

SyncdIndex

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46802](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46802)

Encodes the specified SyncdIndex message. Does not implicitly [verify](SyncdIndex.md#verify) messages.

#### Parameters

##### message

[`ISyncdIndex`](../interfaces/ISyncdIndex.md)

SyncdIndex message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46810)

Encodes the specified SyncdIndex message, length delimited. Does not implicitly [verify](SyncdIndex.md#verify) messages.

#### Parameters

##### message

[`ISyncdIndex`](../interfaces/ISyncdIndex.md)

SyncdIndex message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdIndex`](SyncdIndex.md)

Defined in: [WAProto/index.d.ts:46843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46843)

Creates a SyncdIndex message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdIndex`](SyncdIndex.md)

SyncdIndex

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46864](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46864)

Gets the default type url for SyncdIndex

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

Defined in: [WAProto/index.d.ts:46851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46851)

Creates a plain object from a SyncdIndex message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdIndex`](SyncdIndex.md)

SyncdIndex

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46836)

Verifies a SyncdIndex message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
