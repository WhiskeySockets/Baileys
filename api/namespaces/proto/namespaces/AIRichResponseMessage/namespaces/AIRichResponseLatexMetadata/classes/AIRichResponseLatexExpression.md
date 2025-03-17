# Class: AIRichResponseLatexExpression

Defined in: [WAProto/index.d.ts:1928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1928)

Represents a AIRichResponseLatexExpression.

## Implements

- [`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md)

## Constructors

### new AIRichResponseLatexExpression()

> **new AIRichResponseLatexExpression**(`properties`?): [`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

Defined in: [WAProto/index.d.ts:1934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1934)

Constructs a new AIRichResponseLatexExpression.

#### Parameters

##### properties?

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md)

Properties to set

#### Returns

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

## Properties

### fontHeight?

> `optional` **fontHeight**: `null` \| `number`

Defined in: [WAProto/index.d.ts:1949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1949)

AIRichResponseLatexExpression fontHeight.

#### Implementation of

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md).[`fontHeight`](../interfaces/IAIRichResponseLatexExpression.md#fontheight)

***

### height?

> `optional` **height**: `null` \| `number`

Defined in: [WAProto/index.d.ts:1946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1946)

AIRichResponseLatexExpression height.

#### Implementation of

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md).[`height`](../interfaces/IAIRichResponseLatexExpression.md#height)

***

### latexExpression?

> `optional` **latexExpression**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1937](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1937)

AIRichResponseLatexExpression latexExpression.

#### Implementation of

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md).[`latexExpression`](../interfaces/IAIRichResponseLatexExpression.md#latexexpression)

***

### url?

> `optional` **url**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1940)

AIRichResponseLatexExpression url.

#### Implementation of

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md).[`url`](../interfaces/IAIRichResponseLatexExpression.md#url)

***

### width?

> `optional` **width**: `null` \| `number`

Defined in: [WAProto/index.d.ts:1943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1943)

AIRichResponseLatexExpression width.

#### Implementation of

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md).[`width`](../interfaces/IAIRichResponseLatexExpression.md#width)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2019)

Converts this AIRichResponseLatexExpression to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

Defined in: [WAProto/index.d.ts:1956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1956)

Creates a new AIRichResponseLatexExpression instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md)

Properties to set

#### Returns

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

AIRichResponseLatexExpression instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

Defined in: [WAProto/index.d.ts:1982](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1982)

Decodes a AIRichResponseLatexExpression message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

AIRichResponseLatexExpression

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

Defined in: [WAProto/index.d.ts:1991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1991)

Decodes a AIRichResponseLatexExpression message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

AIRichResponseLatexExpression

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1964)

Encodes the specified AIRichResponseLatexExpression message. Does not implicitly [verify](AIRichResponseLatexExpression.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md)

AIRichResponseLatexExpression message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1972)

Encodes the specified AIRichResponseLatexExpression message, length delimited. Does not implicitly [verify](AIRichResponseLatexExpression.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseLatexExpression`](../interfaces/IAIRichResponseLatexExpression.md)

AIRichResponseLatexExpression message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

Defined in: [WAProto/index.d.ts:2005](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2005)

Creates a AIRichResponseLatexExpression message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

AIRichResponseLatexExpression

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2026)

Gets the default type url for AIRichResponseLatexExpression

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

Defined in: [WAProto/index.d.ts:2013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2013)

Creates a plain object from a AIRichResponseLatexExpression message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseLatexExpression`](AIRichResponseLatexExpression.md)

AIRichResponseLatexExpression

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1998)

Verifies a AIRichResponseLatexExpression message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
