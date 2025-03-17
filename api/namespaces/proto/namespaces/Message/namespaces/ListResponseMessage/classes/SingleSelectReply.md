# Class: SingleSelectReply

Defined in: [WAProto/index.d.ts:25771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25771)

Represents a SingleSelectReply.

## Implements

- [`ISingleSelectReply`](../interfaces/ISingleSelectReply.md)

## Constructors

### new SingleSelectReply()

> **new SingleSelectReply**(`properties`?): [`SingleSelectReply`](SingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25777)

Constructs a new SingleSelectReply.

#### Parameters

##### properties?

[`ISingleSelectReply`](../interfaces/ISingleSelectReply.md)

Properties to set

#### Returns

[`SingleSelectReply`](SingleSelectReply.md)

## Properties

### selectedRowId?

> `optional` **selectedRowId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25780)

SingleSelectReply selectedRowId.

#### Implementation of

[`ISingleSelectReply`](../interfaces/ISingleSelectReply.md).[`selectedRowId`](../interfaces/ISingleSelectReply.md#selectedrowid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25850](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25850)

Converts this SingleSelectReply to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SingleSelectReply`](SingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25787)

Creates a new SingleSelectReply instance using the specified properties.

#### Parameters

##### properties?

[`ISingleSelectReply`](../interfaces/ISingleSelectReply.md)

Properties to set

#### Returns

[`SingleSelectReply`](SingleSelectReply.md)

SingleSelectReply instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SingleSelectReply`](SingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25813)

Decodes a SingleSelectReply message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SingleSelectReply`](SingleSelectReply.md)

SingleSelectReply

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SingleSelectReply`](SingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25822)

Decodes a SingleSelectReply message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SingleSelectReply`](SingleSelectReply.md)

SingleSelectReply

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25795)

Encodes the specified SingleSelectReply message. Does not implicitly [verify](SingleSelectReply.md#verify) messages.

#### Parameters

##### message

[`ISingleSelectReply`](../interfaces/ISingleSelectReply.md)

SingleSelectReply message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25803)

Encodes the specified SingleSelectReply message, length delimited. Does not implicitly [verify](SingleSelectReply.md#verify) messages.

#### Parameters

##### message

[`ISingleSelectReply`](../interfaces/ISingleSelectReply.md)

SingleSelectReply message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SingleSelectReply`](SingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25836)

Creates a SingleSelectReply message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SingleSelectReply`](SingleSelectReply.md)

SingleSelectReply

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25857)

Gets the default type url for SingleSelectReply

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

Defined in: [WAProto/index.d.ts:25844](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25844)

Creates a plain object from a SingleSelectReply message. Also converts values to other types if specified.

#### Parameters

##### message

[`SingleSelectReply`](SingleSelectReply.md)

SingleSelectReply

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25829)

Verifies a SingleSelectReply message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
