# Class: Body

Defined in: [WAProto/index.d.ts:24381](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24381)

Represents a Body.

## Implements

- [`IBody`](../interfaces/IBody.md)

## Constructors

### new Body()

> **new Body**(`properties`?): [`Body`](Body.md)

Defined in: [WAProto/index.d.ts:24387](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24387)

Constructs a new Body.

#### Parameters

##### properties?

[`IBody`](../interfaces/IBody.md)

Properties to set

#### Returns

[`Body`](Body.md)

## Properties

### format?

> `optional` **format**: `null` \| [`Format`](../namespaces/Body/enumerations/Format.md)

Defined in: [WAProto/index.d.ts:24393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24393)

Body format.

#### Implementation of

[`IBody`](../interfaces/IBody.md).[`format`](../interfaces/IBody.md#format)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24390)

Body text.

#### Implementation of

[`IBody`](../interfaces/IBody.md).[`text`](../interfaces/IBody.md#text)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24463](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24463)

Converts this Body to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Body`](Body.md)

Defined in: [WAProto/index.d.ts:24400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24400)

Creates a new Body instance using the specified properties.

#### Parameters

##### properties?

[`IBody`](../interfaces/IBody.md)

Properties to set

#### Returns

[`Body`](Body.md)

Body instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Body`](Body.md)

Defined in: [WAProto/index.d.ts:24426](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24426)

Decodes a Body message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Body`](Body.md)

Body

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Body`](Body.md)

Defined in: [WAProto/index.d.ts:24435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24435)

Decodes a Body message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Body`](Body.md)

Body

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24408)

Encodes the specified Body message. Does not implicitly [verify](Body.md#verify) messages.

#### Parameters

##### message

[`IBody`](../interfaces/IBody.md)

Body message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24416](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24416)

Encodes the specified Body message, length delimited. Does not implicitly [verify](Body.md#verify) messages.

#### Parameters

##### message

[`IBody`](../interfaces/IBody.md)

Body message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Body`](Body.md)

Defined in: [WAProto/index.d.ts:24449](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24449)

Creates a Body message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Body`](Body.md)

Body

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24470](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24470)

Gets the default type url for Body

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

Defined in: [WAProto/index.d.ts:24457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24457)

Creates a plain object from a Body message. Also converts values to other types if specified.

#### Parameters

##### message

[`Body`](Body.md)

Body

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:24442](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24442)

Verifies a Body message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
