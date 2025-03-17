# Class: ADVKeyIndexList

Defined in: [WAProto/index.d.ts:153](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L153)

Represents a ADVKeyIndexList.

## Implements

- [`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md)

## Constructors

### new ADVKeyIndexList()

> **new ADVKeyIndexList**(`properties`?): [`ADVKeyIndexList`](ADVKeyIndexList.md)

Defined in: [WAProto/index.d.ts:159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L159)

Constructs a new ADVKeyIndexList.

#### Parameters

##### properties?

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md)

Properties to set

#### Returns

[`ADVKeyIndexList`](ADVKeyIndexList.md)

## Properties

### accountType?

> `optional` **accountType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L174)

ADVKeyIndexList accountType.

#### Implementation of

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md).[`accountType`](../interfaces/IADVKeyIndexList.md#accounttype)

***

### currentIndex?

> `optional` **currentIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:168](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L168)

ADVKeyIndexList currentIndex.

#### Implementation of

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md).[`currentIndex`](../interfaces/IADVKeyIndexList.md#currentindex)

***

### rawId?

> `optional` **rawId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L162)

ADVKeyIndexList rawId.

#### Implementation of

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md).[`rawId`](../interfaces/IADVKeyIndexList.md#rawid)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:165](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L165)

ADVKeyIndexList timestamp.

#### Implementation of

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md).[`timestamp`](../interfaces/IADVKeyIndexList.md#timestamp)

***

### validIndexes

> **validIndexes**: `number`[]

Defined in: [WAProto/index.d.ts:171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L171)

ADVKeyIndexList validIndexes.

#### Implementation of

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md).[`validIndexes`](../interfaces/IADVKeyIndexList.md#validindexes)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L244)

Converts this ADVKeyIndexList to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ADVKeyIndexList`](ADVKeyIndexList.md)

Defined in: [WAProto/index.d.ts:181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L181)

Creates a new ADVKeyIndexList instance using the specified properties.

#### Parameters

##### properties?

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md)

Properties to set

#### Returns

[`ADVKeyIndexList`](ADVKeyIndexList.md)

ADVKeyIndexList instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ADVKeyIndexList`](ADVKeyIndexList.md)

Defined in: [WAProto/index.d.ts:207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L207)

Decodes a ADVKeyIndexList message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ADVKeyIndexList`](ADVKeyIndexList.md)

ADVKeyIndexList

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ADVKeyIndexList`](ADVKeyIndexList.md)

Defined in: [WAProto/index.d.ts:216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L216)

Decodes a ADVKeyIndexList message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ADVKeyIndexList`](ADVKeyIndexList.md)

ADVKeyIndexList

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:189](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L189)

Encodes the specified ADVKeyIndexList message. Does not implicitly [verify](ADVKeyIndexList.md#verify) messages.

#### Parameters

##### message

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md)

ADVKeyIndexList message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L197)

Encodes the specified ADVKeyIndexList message, length delimited. Does not implicitly [verify](ADVKeyIndexList.md#verify) messages.

#### Parameters

##### message

[`IADVKeyIndexList`](../interfaces/IADVKeyIndexList.md)

ADVKeyIndexList message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ADVKeyIndexList`](ADVKeyIndexList.md)

Defined in: [WAProto/index.d.ts:230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L230)

Creates a ADVKeyIndexList message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ADVKeyIndexList`](ADVKeyIndexList.md)

ADVKeyIndexList

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L251)

Gets the default type url for ADVKeyIndexList

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

Defined in: [WAProto/index.d.ts:238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L238)

Creates a plain object from a ADVKeyIndexList message. Also converts values to other types if specified.

#### Parameters

##### message

[`ADVKeyIndexList`](ADVKeyIndexList.md)

ADVKeyIndexList

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L223)

Verifies a ADVKeyIndexList message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
