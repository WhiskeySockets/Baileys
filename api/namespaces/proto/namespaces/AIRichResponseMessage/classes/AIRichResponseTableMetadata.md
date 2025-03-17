# Class: AIRichResponseTableMetadata

Defined in: [WAProto/index.d.ts:2460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2460)

Represents a AIRichResponseTableMetadata.

## Implements

- [`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md)

## Constructors

### new AIRichResponseTableMetadata()

> **new AIRichResponseTableMetadata**(`properties`?): [`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

Defined in: [WAProto/index.d.ts:2466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2466)

Constructs a new AIRichResponseTableMetadata.

#### Parameters

##### properties?

[`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md)

Properties to set

#### Returns

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

## Properties

### rows

> **rows**: [`IAIRichResponseTableRow`](../namespaces/AIRichResponseTableMetadata/interfaces/IAIRichResponseTableRow.md)[]

Defined in: [WAProto/index.d.ts:2469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2469)

AIRichResponseTableMetadata rows.

#### Implementation of

[`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md).[`rows`](../interfaces/IAIRichResponseTableMetadata.md#rows)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2539](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2539)

Converts this AIRichResponseTableMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

Defined in: [WAProto/index.d.ts:2476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2476)

Creates a new AIRichResponseTableMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md)

Properties to set

#### Returns

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

AIRichResponseTableMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

Defined in: [WAProto/index.d.ts:2502](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2502)

Decodes a AIRichResponseTableMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

AIRichResponseTableMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

Defined in: [WAProto/index.d.ts:2511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2511)

Decodes a AIRichResponseTableMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

AIRichResponseTableMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2484](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2484)

Encodes the specified AIRichResponseTableMetadata message. Does not implicitly [verify](AIRichResponseTableMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md)

AIRichResponseTableMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2492)

Encodes the specified AIRichResponseTableMetadata message, length delimited. Does not implicitly [verify](AIRichResponseTableMetadata.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseTableMetadata`](../interfaces/IAIRichResponseTableMetadata.md)

AIRichResponseTableMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

Defined in: [WAProto/index.d.ts:2525](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2525)

Creates a AIRichResponseTableMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

AIRichResponseTableMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2546](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2546)

Gets the default type url for AIRichResponseTableMetadata

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

Defined in: [WAProto/index.d.ts:2533](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2533)

Creates a plain object from a AIRichResponseTableMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseTableMetadata`](AIRichResponseTableMetadata.md)

AIRichResponseTableMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:2518](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2518)

Verifies a AIRichResponseTableMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
