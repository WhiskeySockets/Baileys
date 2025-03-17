# Class: AIRichResponseAbstractData

Defined in: [WAProto/index.d.ts:706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L706)

Represents a AIRichResponseAbstractData.

## Implements

- [`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md)

## Constructors

### new AIRichResponseAbstractData()

> **new AIRichResponseAbstractData**(`properties`?): [`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L712)

Constructs a new AIRichResponseAbstractData.

#### Parameters

##### properties?

[`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md)

Properties to set

#### Returns

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

## Properties

### data?

> `optional` **data**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:715](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L715)

AIRichResponseAbstractData data.

#### Implementation of

[`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md).[`data`](../interfaces/IAIRichResponseAbstractData.md#data)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L785)

Converts this AIRichResponseAbstractData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L722)

Creates a new AIRichResponseAbstractData instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md)

Properties to set

#### Returns

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

AIRichResponseAbstractData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L748)

Decodes a AIRichResponseAbstractData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

AIRichResponseAbstractData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:757](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L757)

Decodes a AIRichResponseAbstractData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

AIRichResponseAbstractData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L730)

Encodes the specified AIRichResponseAbstractData message. Does not implicitly [verify](AIRichResponseAbstractData.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md)

AIRichResponseAbstractData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L738)

Encodes the specified AIRichResponseAbstractData message, length delimited. Does not implicitly [verify](AIRichResponseAbstractData.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseAbstractData`](../interfaces/IAIRichResponseAbstractData.md)

AIRichResponseAbstractData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L771)

Creates a AIRichResponseAbstractData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

AIRichResponseAbstractData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:792](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L792)

Gets the default type url for AIRichResponseAbstractData

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

Defined in: [WAProto/index.d.ts:779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L779)

Creates a plain object from a AIRichResponseAbstractData message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseAbstractData`](AIRichResponseAbstractData.md)

AIRichResponseAbstractData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:764](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L764)

Verifies a AIRichResponseAbstractData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
