# Class: SyncdRecord

Defined in: [WAProto/index.d.ts:47235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47235)

Represents a SyncdRecord.

## Implements

- [`ISyncdRecord`](../interfaces/ISyncdRecord.md)

## Constructors

### new SyncdRecord()

> **new SyncdRecord**(`properties`?): [`SyncdRecord`](SyncdRecord.md)

Defined in: [WAProto/index.d.ts:47241](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47241)

Constructs a new SyncdRecord.

#### Parameters

##### properties?

[`ISyncdRecord`](../interfaces/ISyncdRecord.md)

Properties to set

#### Returns

[`SyncdRecord`](SyncdRecord.md)

## Properties

### index?

> `optional` **index**: `null` \| [`ISyncdIndex`](../interfaces/ISyncdIndex.md)

Defined in: [WAProto/index.d.ts:47244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47244)

SyncdRecord index.

#### Implementation of

[`ISyncdRecord`](../interfaces/ISyncdRecord.md).[`index`](../interfaces/ISyncdRecord.md#index)

***

### keyId?

> `optional` **keyId**: `null` \| [`IKeyId`](../interfaces/IKeyId.md)

Defined in: [WAProto/index.d.ts:47250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47250)

SyncdRecord keyId.

#### Implementation of

[`ISyncdRecord`](../interfaces/ISyncdRecord.md).[`keyId`](../interfaces/ISyncdRecord.md#keyid)

***

### value?

> `optional` **value**: `null` \| [`ISyncdValue`](../interfaces/ISyncdValue.md)

Defined in: [WAProto/index.d.ts:47247](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47247)

SyncdRecord value.

#### Implementation of

[`ISyncdRecord`](../interfaces/ISyncdRecord.md).[`value`](../interfaces/ISyncdRecord.md#value)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47320)

Converts this SyncdRecord to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdRecord`](SyncdRecord.md)

Defined in: [WAProto/index.d.ts:47257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47257)

Creates a new SyncdRecord instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdRecord`](../interfaces/ISyncdRecord.md)

Properties to set

#### Returns

[`SyncdRecord`](SyncdRecord.md)

SyncdRecord instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdRecord`](SyncdRecord.md)

Defined in: [WAProto/index.d.ts:47283](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47283)

Decodes a SyncdRecord message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdRecord`](SyncdRecord.md)

SyncdRecord

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdRecord`](SyncdRecord.md)

Defined in: [WAProto/index.d.ts:47292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47292)

Decodes a SyncdRecord message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdRecord`](SyncdRecord.md)

SyncdRecord

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47265)

Encodes the specified SyncdRecord message. Does not implicitly [verify](SyncdRecord.md#verify) messages.

#### Parameters

##### message

[`ISyncdRecord`](../interfaces/ISyncdRecord.md)

SyncdRecord message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47273](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47273)

Encodes the specified SyncdRecord message, length delimited. Does not implicitly [verify](SyncdRecord.md#verify) messages.

#### Parameters

##### message

[`ISyncdRecord`](../interfaces/ISyncdRecord.md)

SyncdRecord message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdRecord`](SyncdRecord.md)

Defined in: [WAProto/index.d.ts:47306](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47306)

Creates a SyncdRecord message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdRecord`](SyncdRecord.md)

SyncdRecord

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47327)

Gets the default type url for SyncdRecord

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

Defined in: [WAProto/index.d.ts:47314](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47314)

Creates a plain object from a SyncdRecord message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdRecord`](SyncdRecord.md)

SyncdRecord

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47299)

Verifies a SyncdRecord message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
