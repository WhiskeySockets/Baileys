# Class: ADVSignedKeyIndexList

Defined in: [WAProto/index.d.ts:492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L492)

Represents a ADVSignedKeyIndexList.

## Implements

- [`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md)

## Constructors

### new ADVSignedKeyIndexList()

> **new ADVSignedKeyIndexList**(`properties`?): [`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

Defined in: [WAProto/index.d.ts:498](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L498)

Constructs a new ADVSignedKeyIndexList.

#### Parameters

##### properties?

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md)

Properties to set

#### Returns

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

## Properties

### accountSignature?

> `optional` **accountSignature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:504](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L504)

ADVSignedKeyIndexList accountSignature.

#### Implementation of

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md).[`accountSignature`](../interfaces/IADVSignedKeyIndexList.md#accountsignature)

***

### accountSignatureKey?

> `optional` **accountSignatureKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:507](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L507)

ADVSignedKeyIndexList accountSignatureKey.

#### Implementation of

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md).[`accountSignatureKey`](../interfaces/IADVSignedKeyIndexList.md#accountsignaturekey)

***

### details?

> `optional` **details**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L501)

ADVSignedKeyIndexList details.

#### Implementation of

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md).[`details`](../interfaces/IADVSignedKeyIndexList.md#details)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:577](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L577)

Converts this ADVSignedKeyIndexList to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

Defined in: [WAProto/index.d.ts:514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L514)

Creates a new ADVSignedKeyIndexList instance using the specified properties.

#### Parameters

##### properties?

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md)

Properties to set

#### Returns

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

ADVSignedKeyIndexList instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

Defined in: [WAProto/index.d.ts:540](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L540)

Decodes a ADVSignedKeyIndexList message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

ADVSignedKeyIndexList

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

Defined in: [WAProto/index.d.ts:549](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L549)

Decodes a ADVSignedKeyIndexList message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

ADVSignedKeyIndexList

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:522](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L522)

Encodes the specified ADVSignedKeyIndexList message. Does not implicitly [verify](ADVSignedKeyIndexList.md#verify) messages.

#### Parameters

##### message

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md)

ADVSignedKeyIndexList message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:530](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L530)

Encodes the specified ADVSignedKeyIndexList message, length delimited. Does not implicitly [verify](ADVSignedKeyIndexList.md#verify) messages.

#### Parameters

##### message

[`IADVSignedKeyIndexList`](../interfaces/IADVSignedKeyIndexList.md)

ADVSignedKeyIndexList message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

Defined in: [WAProto/index.d.ts:563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L563)

Creates a ADVSignedKeyIndexList message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

ADVSignedKeyIndexList

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:584](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L584)

Gets the default type url for ADVSignedKeyIndexList

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

Defined in: [WAProto/index.d.ts:571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L571)

Creates a plain object from a ADVSignedKeyIndexList message. Also converts values to other types if specified.

#### Parameters

##### message

[`ADVSignedKeyIndexList`](ADVSignedKeyIndexList.md)

ADVSignedKeyIndexList

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L556)

Verifies a ADVSignedKeyIndexList message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
