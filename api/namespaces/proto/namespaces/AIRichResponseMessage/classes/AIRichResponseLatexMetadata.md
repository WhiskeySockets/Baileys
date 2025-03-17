# Class: AIRichResponseLatexMetadata

Defined in: [WAProto/index.d.ts:1814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1814)

Represents a AIRichResponseLatexMetadata.

## Implements

- [`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md)

## Constructors

### new AIRichResponseLatexMetadata()

> **new AIRichResponseLatexMetadata**(`properties`?): [`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

Defined in: [WAProto/index.d.ts:1820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1820)

Constructs a new AIRichResponseLatexMetadata.

#### Parameters

##### properties?

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md)

Properties to set

#### Returns

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

## Properties

### expressions

> **expressions**: [`IAIRichResponseLatexExpression`](../namespaces/AIRichResponseLatexMetadata/interfaces/IAIRichResponseLatexExpression.md)[]

Defined in: [WAProto/index.d.ts:1826](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1826)

AIRichResponseLatexMetadata expressions.

#### Implementation of

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md).[`expressions`](../interfaces/IAIRichResponseLatexMetadata.md#expressions)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1823)

AIRichResponseLatexMetadata text.

#### Implementation of

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md).[`text`](../interfaces/IAIRichResponseLatexMetadata.md#text)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:1896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1896)

Converts this AIRichResponseLatexMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

Defined in: [WAProto/index.d.ts:1833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1833)

Creates a new AIRichResponseLatexMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md)

Properties to set

#### Returns

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

Defined in: [WAProto/index.d.ts:1859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1859)

Decodes a AIRichResponseLatexMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

Defined in: [WAProto/index.d.ts:1868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1868)

Decodes a AIRichResponseLatexMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1841)

Encodes the specified AIRichResponseLatexMetadata message. Does not implicitly [verify](AIRichResponseLatexMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1849](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1849)

Encodes the specified AIRichResponseLatexMetadata message, length delimited. Does not implicitly [verify](AIRichResponseLatexMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseLatexMetadata`](../interfaces/IAIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

Defined in: [WAProto/index.d.ts:1882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1882)

Creates a AIRichResponseLatexMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:1903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1903)

Gets the default type url for AIRichResponseLatexMetadata

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

Defined in: [WAProto/index.d.ts:1890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1890)

Creates a plain object from a AIRichResponseLatexMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseLatexMetadata`](AIRichResponseLatexMetadata.md)

AIRichResponseLatexMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1875)

Verifies a AIRichResponseLatexMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
