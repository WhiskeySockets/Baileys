# Class: Keyword

Defined in: [WAProto/index.d.ts:5839](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5839)

Represents a Keyword.

## Implements

- [`IKeyword`](../interfaces/IKeyword.md)

## Constructors

### new Keyword()

> **new Keyword**(`properties`?): [`Keyword`](Keyword.md)

Defined in: [WAProto/index.d.ts:5845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5845)

Constructs a new Keyword.

#### Parameters

##### properties?

[`IKeyword`](../interfaces/IKeyword.md)

Properties to set

#### Returns

[`Keyword`](Keyword.md)

## Properties

### associatedPrompts

> **associatedPrompts**: `string`[]

Defined in: [WAProto/index.d.ts:5851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5851)

Keyword associatedPrompts.

#### Implementation of

[`IKeyword`](../interfaces/IKeyword.md).[`associatedPrompts`](../interfaces/IKeyword.md#associatedprompts)

***

### value?

> `optional` **value**: `null` \| `string`

Defined in: [WAProto/index.d.ts:5848](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5848)

Keyword value.

#### Implementation of

[`IKeyword`](../interfaces/IKeyword.md).[`value`](../interfaces/IKeyword.md#value)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:5921](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5921)

Converts this Keyword to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Keyword`](Keyword.md)

Defined in: [WAProto/index.d.ts:5858](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5858)

Creates a new Keyword instance using the specified properties.

#### Parameters

##### properties?

[`IKeyword`](../interfaces/IKeyword.md)

Properties to set

#### Returns

[`Keyword`](Keyword.md)

Keyword instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Keyword`](Keyword.md)

Defined in: [WAProto/index.d.ts:5884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5884)

Decodes a Keyword message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Keyword`](Keyword.md)

Keyword

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Keyword`](Keyword.md)

Defined in: [WAProto/index.d.ts:5893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5893)

Decodes a Keyword message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Keyword`](Keyword.md)

Keyword

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5866)

Encodes the specified Keyword message. Does not implicitly [verify](Keyword.md#verify) messages.

#### Parameters

##### message

[`IKeyword`](../interfaces/IKeyword.md)

Keyword message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:5874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5874)

Encodes the specified Keyword message, length delimited. Does not implicitly [verify](Keyword.md#verify) messages.

#### Parameters

##### message

[`IKeyword`](../interfaces/IKeyword.md)

Keyword message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Keyword`](Keyword.md)

Defined in: [WAProto/index.d.ts:5907](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5907)

Creates a Keyword message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Keyword`](Keyword.md)

Keyword

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:5928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5928)

Gets the default type url for Keyword

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

Defined in: [WAProto/index.d.ts:5915](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5915)

Creates a plain object from a Keyword message. Also converts values to other types if specified.

#### Parameters

##### message

[`Keyword`](Keyword.md)

Keyword

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:5900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L5900)

Verifies a Keyword message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
