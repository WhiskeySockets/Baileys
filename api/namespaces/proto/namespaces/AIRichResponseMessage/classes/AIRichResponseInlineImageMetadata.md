# Class: AIRichResponseInlineImageMetadata

Defined in: [WAProto/index.d.ts:1695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1695)

Represents a AIRichResponseInlineImageMetadata.

## Implements

- [`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md)

## Constructors

### new AIRichResponseInlineImageMetadata()

> **new AIRichResponseInlineImageMetadata**(`properties`?): [`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

Defined in: [WAProto/index.d.ts:1701](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1701)

Constructs a new AIRichResponseInlineImageMetadata.

#### Parameters

##### properties?

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md)

Properties to set

#### Returns

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

## Properties

### alignment?

> `optional` **alignment**: `null` \| [`AIRichResponseImageAlignment`](../namespaces/AIRichResponseInlineImageMetadata/enumerations/AIRichResponseImageAlignment.md)

Defined in: [WAProto/index.d.ts:1710](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1710)

AIRichResponseInlineImageMetadata alignment.

#### Implementation of

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md).[`alignment`](../interfaces/IAIRichResponseInlineImageMetadata.md#alignment)

***

### imageText?

> `optional` **imageText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1707)

AIRichResponseInlineImageMetadata imageText.

#### Implementation of

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md).[`imageText`](../interfaces/IAIRichResponseInlineImageMetadata.md#imagetext)

***

### imageUrl?

> `optional` **imageUrl**: `null` \| [`IAIRichResponseImageURL`](../interfaces/IAIRichResponseImageURL.md)

Defined in: [WAProto/index.d.ts:1704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1704)

AIRichResponseInlineImageMetadata imageUrl.

#### Implementation of

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md).[`imageUrl`](../interfaces/IAIRichResponseInlineImageMetadata.md#imageurl)

***

### tapLinkUrl?

> `optional` **tapLinkUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1713](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1713)

AIRichResponseInlineImageMetadata tapLinkUrl.

#### Implementation of

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md).[`tapLinkUrl`](../interfaces/IAIRichResponseInlineImageMetadata.md#taplinkurl)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:1783](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1783)

Converts this AIRichResponseInlineImageMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

Defined in: [WAProto/index.d.ts:1720](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1720)

Creates a new AIRichResponseInlineImageMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md)

Properties to set

#### Returns

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

Defined in: [WAProto/index.d.ts:1746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1746)

Decodes a AIRichResponseInlineImageMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

Defined in: [WAProto/index.d.ts:1755](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1755)

Decodes a AIRichResponseInlineImageMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1728](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1728)

Encodes the specified AIRichResponseInlineImageMetadata message. Does not implicitly [verify](AIRichResponseInlineImageMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1736](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1736)

Encodes the specified AIRichResponseInlineImageMetadata message, length delimited. Does not implicitly [verify](AIRichResponseInlineImageMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseInlineImageMetadata`](../interfaces/IAIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

Defined in: [WAProto/index.d.ts:1769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1769)

Creates a AIRichResponseInlineImageMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:1790](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1790)

Gets the default type url for AIRichResponseInlineImageMetadata

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

Defined in: [WAProto/index.d.ts:1777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1777)

Creates a plain object from a AIRichResponseInlineImageMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseInlineImageMetadata`](AIRichResponseInlineImageMetadata.md)

AIRichResponseInlineImageMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1762)

Verifies a AIRichResponseInlineImageMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
