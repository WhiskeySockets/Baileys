# Class: AIRichResponseGridImageMetadata

Defined in: [WAProto/index.d.ts:1477](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1477)

Represents a AIRichResponseGridImageMetadata.

## Implements

- [`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md)

## Constructors

### new AIRichResponseGridImageMetadata()

> **new AIRichResponseGridImageMetadata**(`properties`?): [`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

Defined in: [WAProto/index.d.ts:1483](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1483)

Constructs a new AIRichResponseGridImageMetadata.

#### Parameters

##### properties?

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md)

Properties to set

#### Returns

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

## Properties

### gridImageUrl?

> `optional` **gridImageUrl**: `null` \| [`IAIRichResponseImageURL`](../interfaces/IAIRichResponseImageURL.md)

Defined in: [WAProto/index.d.ts:1486](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1486)

AIRichResponseGridImageMetadata gridImageUrl.

#### Implementation of

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md).[`gridImageUrl`](../interfaces/IAIRichResponseGridImageMetadata.md#gridimageurl)

***

### imageUrls

> **imageUrls**: [`IAIRichResponseImageURL`](../interfaces/IAIRichResponseImageURL.md)[]

Defined in: [WAProto/index.d.ts:1489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1489)

AIRichResponseGridImageMetadata imageUrls.

#### Implementation of

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md).[`imageUrls`](../interfaces/IAIRichResponseGridImageMetadata.md#imageurls)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:1559](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1559)

Converts this AIRichResponseGridImageMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

Defined in: [WAProto/index.d.ts:1496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1496)

Creates a new AIRichResponseGridImageMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md)

Properties to set

#### Returns

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

Defined in: [WAProto/index.d.ts:1522](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1522)

Decodes a AIRichResponseGridImageMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

Defined in: [WAProto/index.d.ts:1531](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1531)

Decodes a AIRichResponseGridImageMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1504)

Encodes the specified AIRichResponseGridImageMetadata message. Does not implicitly [verify](AIRichResponseGridImageMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1512](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1512)

Encodes the specified AIRichResponseGridImageMetadata message, length delimited. Does not implicitly [verify](AIRichResponseGridImageMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseGridImageMetadata`](../interfaces/IAIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

Defined in: [WAProto/index.d.ts:1545](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1545)

Creates a AIRichResponseGridImageMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:1566](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1566)

Gets the default type url for AIRichResponseGridImageMetadata

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

Defined in: [WAProto/index.d.ts:1553](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1553)

Creates a plain object from a AIRichResponseGridImageMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseGridImageMetadata`](AIRichResponseGridImageMetadata.md)

AIRichResponseGridImageMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1538)

Verifies a AIRichResponseGridImageMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
