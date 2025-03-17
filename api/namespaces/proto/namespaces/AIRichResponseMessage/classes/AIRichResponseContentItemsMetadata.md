# Class: AIRichResponseContentItemsMetadata

Defined in: [WAProto/index.d.ts:1025](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1025)

Represents a AIRichResponseContentItemsMetadata.

## Implements

- [`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md)

## Constructors

### new AIRichResponseContentItemsMetadata()

> **new AIRichResponseContentItemsMetadata**(`properties`?): [`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

Defined in: [WAProto/index.d.ts:1031](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1031)

Constructs a new AIRichResponseContentItemsMetadata.

#### Parameters

##### properties?

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md)

Properties to set

#### Returns

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

## Properties

### contentType?

> `optional` **contentType**: `null` \| [`ContentType`](../namespaces/AIRichResponseContentItemsMetadata/enumerations/ContentType.md)

Defined in: [WAProto/index.d.ts:1037](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1037)

AIRichResponseContentItemsMetadata contentType.

#### Implementation of

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md).[`contentType`](../interfaces/IAIRichResponseContentItemsMetadata.md#contenttype)

***

### itemsMetadata

> **itemsMetadata**: [`IAIRichResponseContentItemMetadata`](../namespaces/AIRichResponseContentItemsMetadata/interfaces/IAIRichResponseContentItemMetadata.md)[]

Defined in: [WAProto/index.d.ts:1034](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1034)

AIRichResponseContentItemsMetadata itemsMetadata.

#### Implementation of

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md).[`itemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md#itemsmetadata)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:1107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1107)

Converts this AIRichResponseContentItemsMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

Defined in: [WAProto/index.d.ts:1044](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1044)

Creates a new AIRichResponseContentItemsMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md)

Properties to set

#### Returns

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

Defined in: [WAProto/index.d.ts:1070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1070)

Decodes a AIRichResponseContentItemsMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

Defined in: [WAProto/index.d.ts:1079](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1079)

Decodes a AIRichResponseContentItemsMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1052](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1052)

Encodes the specified AIRichResponseContentItemsMetadata message. Does not implicitly [verify](AIRichResponseContentItemsMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1060)

Encodes the specified AIRichResponseContentItemsMetadata message, length delimited. Does not implicitly [verify](AIRichResponseContentItemsMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseContentItemsMetadata`](../interfaces/IAIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

Defined in: [WAProto/index.d.ts:1093](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1093)

Creates a AIRichResponseContentItemsMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:1114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1114)

Gets the default type url for AIRichResponseContentItemsMetadata

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

Defined in: [WAProto/index.d.ts:1101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1101)

Creates a plain object from a AIRichResponseContentItemsMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseContentItemsMetadata`](AIRichResponseContentItemsMetadata.md)

AIRichResponseContentItemsMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1086](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1086)

Verifies a AIRichResponseContentItemsMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
