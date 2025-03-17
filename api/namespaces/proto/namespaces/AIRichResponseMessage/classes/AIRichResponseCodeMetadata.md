# Class: AIRichResponseCodeMetadata

Defined in: [WAProto/index.d.ts:806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L806)

Represents a AIRichResponseCodeMetadata.

## Implements

- [`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md)

## Constructors

### new AIRichResponseCodeMetadata()

> **new AIRichResponseCodeMetadata**(`properties`?): [`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

Defined in: [WAProto/index.d.ts:812](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L812)

Constructs a new AIRichResponseCodeMetadata.

#### Parameters

##### properties?

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md)

Properties to set

#### Returns

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

## Properties

### codeBlocks

> **codeBlocks**: [`IAIRichResponseCodeBlock`](../namespaces/AIRichResponseCodeMetadata/interfaces/IAIRichResponseCodeBlock.md)[]

Defined in: [WAProto/index.d.ts:818](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L818)

AIRichResponseCodeMetadata codeBlocks.

#### Implementation of

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md).[`codeBlocks`](../interfaces/IAIRichResponseCodeMetadata.md#codeblocks)

***

### codeLanguage?

> `optional` **codeLanguage**: `null` \| `string`

Defined in: [WAProto/index.d.ts:815](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L815)

AIRichResponseCodeMetadata codeLanguage.

#### Implementation of

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md).[`codeLanguage`](../interfaces/IAIRichResponseCodeMetadata.md#codelanguage)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:888](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L888)

Converts this AIRichResponseCodeMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

Defined in: [WAProto/index.d.ts:825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L825)

Creates a new AIRichResponseCodeMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md)

Properties to set

#### Returns

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

Defined in: [WAProto/index.d.ts:851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L851)

Decodes a AIRichResponseCodeMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

Defined in: [WAProto/index.d.ts:860](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L860)

Decodes a AIRichResponseCodeMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L833)

Encodes the specified AIRichResponseCodeMetadata message. Does not implicitly [verify](AIRichResponseCodeMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L841)

Encodes the specified AIRichResponseCodeMetadata message, length delimited. Does not implicitly [verify](AIRichResponseCodeMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseCodeMetadata`](../interfaces/IAIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

Defined in: [WAProto/index.d.ts:874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L874)

Creates a AIRichResponseCodeMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:895](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L895)

Gets the default type url for AIRichResponseCodeMetadata

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

Defined in: [WAProto/index.d.ts:882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L882)

Creates a plain object from a AIRichResponseCodeMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseCodeMetadata`](AIRichResponseCodeMetadata.md)

AIRichResponseCodeMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:867](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L867)

Verifies a AIRichResponseCodeMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
