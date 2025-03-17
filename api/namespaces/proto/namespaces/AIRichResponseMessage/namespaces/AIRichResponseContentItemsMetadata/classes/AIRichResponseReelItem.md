# Class: AIRichResponseReelItem

Defined in: [WAProto/index.d.ts:1236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1236)

Represents a AIRichResponseReelItem.

## Implements

- [`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md)

## Constructors

### new AIRichResponseReelItem()

> **new AIRichResponseReelItem**(`properties`?): [`AIRichResponseReelItem`](AIRichResponseReelItem.md)

Defined in: [WAProto/index.d.ts:1242](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1242)

Constructs a new AIRichResponseReelItem.

#### Parameters

##### properties?

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md)

Properties to set

#### Returns

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

## Properties

### profileIconUrl?

> `optional` **profileIconUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1248)

AIRichResponseReelItem profileIconUrl.

#### Implementation of

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md).[`profileIconUrl`](../interfaces/IAIRichResponseReelItem.md#profileiconurl)

***

### thumbnailUrl?

> `optional` **thumbnailUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1251)

AIRichResponseReelItem thumbnailUrl.

#### Implementation of

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md).[`thumbnailUrl`](../interfaces/IAIRichResponseReelItem.md#thumbnailurl)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1245)

AIRichResponseReelItem title.

#### Implementation of

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md).[`title`](../interfaces/IAIRichResponseReelItem.md#title)

***

### videoUrl?

> `optional` **videoUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:1254](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1254)

AIRichResponseReelItem videoUrl.

#### Implementation of

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md).[`videoUrl`](../interfaces/IAIRichResponseReelItem.md#videourl)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:1324](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1324)

Converts this AIRichResponseReelItem to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseReelItem`](AIRichResponseReelItem.md)

Defined in: [WAProto/index.d.ts:1261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1261)

Creates a new AIRichResponseReelItem instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md)

Properties to set

#### Returns

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

AIRichResponseReelItem instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseReelItem`](AIRichResponseReelItem.md)

Defined in: [WAProto/index.d.ts:1287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1287)

Decodes a AIRichResponseReelItem message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

AIRichResponseReelItem

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseReelItem`](AIRichResponseReelItem.md)

Defined in: [WAProto/index.d.ts:1296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1296)

Decodes a AIRichResponseReelItem message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

AIRichResponseReelItem

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1269)

Encodes the specified AIRichResponseReelItem message. Does not implicitly [verify](AIRichResponseReelItem.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md)

AIRichResponseReelItem message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:1277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1277)

Encodes the specified AIRichResponseReelItem message, length delimited. Does not implicitly [verify](AIRichResponseReelItem.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseReelItem`](../interfaces/IAIRichResponseReelItem.md)

AIRichResponseReelItem message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseReelItem`](AIRichResponseReelItem.md)

Defined in: [WAProto/index.d.ts:1310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1310)

Creates a AIRichResponseReelItem message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

AIRichResponseReelItem

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:1331](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1331)

Gets the default type url for AIRichResponseReelItem

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

Defined in: [WAProto/index.d.ts:1318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1318)

Creates a plain object from a AIRichResponseReelItem message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseReelItem`](AIRichResponseReelItem.md)

AIRichResponseReelItem

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:1303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L1303)

Verifies a AIRichResponseReelItem message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
