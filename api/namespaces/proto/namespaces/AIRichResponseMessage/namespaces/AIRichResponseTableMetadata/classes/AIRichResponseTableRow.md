# Class: AIRichResponseTableRow

Defined in: [WAProto/index.d.ts:2562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2562)

Represents a AIRichResponseTableRow.

## Implements

- [`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md)

## Constructors

### new AIRichResponseTableRow()

> **new AIRichResponseTableRow**(`properties`?): [`AIRichResponseTableRow`](AIRichResponseTableRow.md)

Defined in: [WAProto/index.d.ts:2568](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2568)

Constructs a new AIRichResponseTableRow.

#### Parameters

##### properties?

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md)

Properties to set

#### Returns

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

## Properties

### isHeading?

> `optional` **isHeading**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:2574](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2574)

AIRichResponseTableRow isHeading.

#### Implementation of

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md).[`isHeading`](../interfaces/IAIRichResponseTableRow.md#isheading)

***

### items

> **items**: `string`[]

Defined in: [WAProto/index.d.ts:2571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2571)

AIRichResponseTableRow items.

#### Implementation of

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md).[`items`](../interfaces/IAIRichResponseTableRow.md#items)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2644)

Converts this AIRichResponseTableRow to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseTableRow`](AIRichResponseTableRow.md)

Defined in: [WAProto/index.d.ts:2581](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2581)

Creates a new AIRichResponseTableRow instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md)

Properties to set

#### Returns

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

AIRichResponseTableRow instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseTableRow`](AIRichResponseTableRow.md)

Defined in: [WAProto/index.d.ts:2607](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2607)

Decodes a AIRichResponseTableRow message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

AIRichResponseTableRow

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseTableRow`](AIRichResponseTableRow.md)

Defined in: [WAProto/index.d.ts:2616](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2616)

Decodes a AIRichResponseTableRow message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

AIRichResponseTableRow

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2589](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2589)

Encodes the specified AIRichResponseTableRow message. Does not implicitly [verify](AIRichResponseTableRow.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md)

AIRichResponseTableRow message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2597)

Encodes the specified AIRichResponseTableRow message, length delimited. Does not implicitly [verify](AIRichResponseTableRow.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseTableRow`](../interfaces/IAIRichResponseTableRow.md)

AIRichResponseTableRow message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseTableRow`](AIRichResponseTableRow.md)

Defined in: [WAProto/index.d.ts:2630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2630)

Creates a AIRichResponseTableRow message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

AIRichResponseTableRow

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2651](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2651)

Gets the default type url for AIRichResponseTableRow

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

Defined in: [WAProto/index.d.ts:2638](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2638)

Creates a plain object from a AIRichResponseTableRow message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseTableRow`](AIRichResponseTableRow.md)

AIRichResponseTableRow

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:2623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2623)

Verifies a AIRichResponseTableRow message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
