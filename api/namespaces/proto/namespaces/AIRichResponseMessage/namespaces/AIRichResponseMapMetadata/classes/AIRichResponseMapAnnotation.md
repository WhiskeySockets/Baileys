# Class: AIRichResponseMapAnnotation

Defined in: [WAProto/index.d.ts:2179](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2179)

Represents a AIRichResponseMapAnnotation.

## Implements

- [`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md)

## Constructors

### new AIRichResponseMapAnnotation()

> **new AIRichResponseMapAnnotation**(`properties`?): [`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

Defined in: [WAProto/index.d.ts:2185](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2185)

Constructs a new AIRichResponseMapAnnotation.

#### Parameters

##### properties?

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md)

Properties to set

#### Returns

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

## Properties

### annotationNumber?

> `optional` **annotationNumber**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2188)

AIRichResponseMapAnnotation annotationNumber.

#### Implementation of

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md).[`annotationNumber`](../interfaces/IAIRichResponseMapAnnotation.md#annotationnumber)

***

### body?

> `optional` **body**: `null` \| `string`

Defined in: [WAProto/index.d.ts:2200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2200)

AIRichResponseMapAnnotation body.

#### Implementation of

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md).[`body`](../interfaces/IAIRichResponseMapAnnotation.md#body)

***

### latitude?

> `optional` **latitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2191)

AIRichResponseMapAnnotation latitude.

#### Implementation of

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md).[`latitude`](../interfaces/IAIRichResponseMapAnnotation.md#latitude)

***

### longitude?

> `optional` **longitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2194)

AIRichResponseMapAnnotation longitude.

#### Implementation of

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md).[`longitude`](../interfaces/IAIRichResponseMapAnnotation.md#longitude)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:2197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2197)

AIRichResponseMapAnnotation title.

#### Implementation of

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md).[`title`](../interfaces/IAIRichResponseMapAnnotation.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2270](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2270)

Converts this AIRichResponseMapAnnotation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

Defined in: [WAProto/index.d.ts:2207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2207)

Creates a new AIRichResponseMapAnnotation instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md)

Properties to set

#### Returns

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

Defined in: [WAProto/index.d.ts:2233](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2233)

Decodes a AIRichResponseMapAnnotation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

Defined in: [WAProto/index.d.ts:2242](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2242)

Decodes a AIRichResponseMapAnnotation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2215](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2215)

Encodes the specified AIRichResponseMapAnnotation message. Does not implicitly [verify](AIRichResponseMapAnnotation.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2223)

Encodes the specified AIRichResponseMapAnnotation message, length delimited. Does not implicitly [verify](AIRichResponseMapAnnotation.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMapAnnotation`](../interfaces/IAIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

Defined in: [WAProto/index.d.ts:2256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2256)

Creates a AIRichResponseMapAnnotation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2277)

Gets the default type url for AIRichResponseMapAnnotation

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

Defined in: [WAProto/index.d.ts:2264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2264)

Creates a plain object from a AIRichResponseMapAnnotation message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseMapAnnotation`](AIRichResponseMapAnnotation.md)

AIRichResponseMapAnnotation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:2249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2249)

Verifies a AIRichResponseMapAnnotation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
