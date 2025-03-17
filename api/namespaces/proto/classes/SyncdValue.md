# Class: SyncdValue

Defined in: [WAProto/index.d.ts:47453](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47453)

Represents a SyncdValue.

## Implements

- [`ISyncdValue`](../interfaces/ISyncdValue.md)

## Constructors

### new SyncdValue()

> **new SyncdValue**(`properties`?): [`SyncdValue`](SyncdValue.md)

Defined in: [WAProto/index.d.ts:47459](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47459)

Constructs a new SyncdValue.

#### Parameters

##### properties?

[`ISyncdValue`](../interfaces/ISyncdValue.md)

Properties to set

#### Returns

[`SyncdValue`](SyncdValue.md)

## Properties

### blob?

> `optional` **blob**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:47462](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47462)

SyncdValue blob.

#### Implementation of

[`ISyncdValue`](../interfaces/ISyncdValue.md).[`blob`](../interfaces/ISyncdValue.md#blob)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47532](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47532)

Converts this SyncdValue to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdValue`](SyncdValue.md)

Defined in: [WAProto/index.d.ts:47469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47469)

Creates a new SyncdValue instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdValue`](../interfaces/ISyncdValue.md)

Properties to set

#### Returns

[`SyncdValue`](SyncdValue.md)

SyncdValue instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdValue`](SyncdValue.md)

Defined in: [WAProto/index.d.ts:47495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47495)

Decodes a SyncdValue message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdValue`](SyncdValue.md)

SyncdValue

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdValue`](SyncdValue.md)

Defined in: [WAProto/index.d.ts:47504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47504)

Decodes a SyncdValue message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdValue`](SyncdValue.md)

SyncdValue

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47477](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47477)

Encodes the specified SyncdValue message. Does not implicitly [verify](SyncdValue.md#verify) messages.

#### Parameters

##### message

[`ISyncdValue`](../interfaces/ISyncdValue.md)

SyncdValue message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47485)

Encodes the specified SyncdValue message, length delimited. Does not implicitly [verify](SyncdValue.md#verify) messages.

#### Parameters

##### message

[`ISyncdValue`](../interfaces/ISyncdValue.md)

SyncdValue message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdValue`](SyncdValue.md)

Defined in: [WAProto/index.d.ts:47518](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47518)

Creates a SyncdValue message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdValue`](SyncdValue.md)

SyncdValue

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47539](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47539)

Gets the default type url for SyncdValue

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

Defined in: [WAProto/index.d.ts:47526](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47526)

Creates a plain object from a SyncdValue message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdValue`](SyncdValue.md)

SyncdValue

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47511)

Verifies a SyncdValue message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
