# Class: AIRichResponseMapMetadata

Defined in: [WAProto/index.d.ts:2053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2053)

Represents a AIRichResponseMapMetadata.

## Implements

- [`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md)

## Constructors

### new AIRichResponseMapMetadata()

> **new AIRichResponseMapMetadata**(`properties`?): [`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

Defined in: [WAProto/index.d.ts:2059](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2059)

Constructs a new AIRichResponseMapMetadata.

#### Parameters

##### properties?

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md)

Properties to set

#### Returns

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

## Properties

### annotations

> **annotations**: [`IAIRichResponseMapAnnotation`](../namespaces/AIRichResponseMapMetadata/interfaces/IAIRichResponseMapAnnotation.md)[]

Defined in: [WAProto/index.d.ts:2074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2074)

AIRichResponseMapMetadata annotations.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`annotations`](../interfaces/IAIRichResponseMapMetadata.md#annotations)

***

### centerLatitude?

> `optional` **centerLatitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2062](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2062)

AIRichResponseMapMetadata centerLatitude.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`centerLatitude`](../interfaces/IAIRichResponseMapMetadata.md#centerlatitude)

***

### centerLongitude?

> `optional` **centerLongitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2065](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2065)

AIRichResponseMapMetadata centerLongitude.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`centerLongitude`](../interfaces/IAIRichResponseMapMetadata.md#centerlongitude)

***

### latitudeDelta?

> `optional` **latitudeDelta**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2068)

AIRichResponseMapMetadata latitudeDelta.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`latitudeDelta`](../interfaces/IAIRichResponseMapMetadata.md#latitudedelta)

***

### longitudeDelta?

> `optional` **longitudeDelta**: `null` \| `number`

Defined in: [WAProto/index.d.ts:2071](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2071)

AIRichResponseMapMetadata longitudeDelta.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`longitudeDelta`](../interfaces/IAIRichResponseMapMetadata.md#longitudedelta)

***

### showInfoList?

> `optional` **showInfoList**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:2077](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2077)

AIRichResponseMapMetadata showInfoList.

#### Implementation of

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md).[`showInfoList`](../interfaces/IAIRichResponseMapMetadata.md#showinfolist)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2147](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2147)

Converts this AIRichResponseMapMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

Defined in: [WAProto/index.d.ts:2084](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2084)

Creates a new AIRichResponseMapMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md)

Properties to set

#### Returns

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

AIRichResponseMapMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

Defined in: [WAProto/index.d.ts:2110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2110)

Decodes a AIRichResponseMapMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

AIRichResponseMapMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

Defined in: [WAProto/index.d.ts:2119](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2119)

Decodes a AIRichResponseMapMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

AIRichResponseMapMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2092](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2092)

Encodes the specified AIRichResponseMapMetadata message. Does not implicitly [verify](AIRichResponseMapMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md)

AIRichResponseMapMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2100)

Encodes the specified AIRichResponseMapMetadata message, length delimited. Does not implicitly [verify](AIRichResponseMapMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMapMetadata`](../interfaces/IAIRichResponseMapMetadata.md)

AIRichResponseMapMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

Defined in: [WAProto/index.d.ts:2133](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2133)

Creates a AIRichResponseMapMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

AIRichResponseMapMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2154)

Gets the default type url for AIRichResponseMapMetadata

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

Defined in: [WAProto/index.d.ts:2141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2141)

Creates a plain object from a AIRichResponseMapMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseMapMetadata`](AIRichResponseMapMetadata.md)

AIRichResponseMapMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:2126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2126)

Verifies a AIRichResponseMapMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
