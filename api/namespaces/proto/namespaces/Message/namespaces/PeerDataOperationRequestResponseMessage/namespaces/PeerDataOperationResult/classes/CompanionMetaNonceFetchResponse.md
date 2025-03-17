# Class: CompanionMetaNonceFetchResponse

Defined in: [WAProto/index.d.ts:27789](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27789)

Represents a CompanionMetaNonceFetchResponse.

## Implements

- [`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md)

## Constructors

### new CompanionMetaNonceFetchResponse()

> **new CompanionMetaNonceFetchResponse**(`properties`?): [`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:27795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27795)

Constructs a new CompanionMetaNonceFetchResponse.

#### Parameters

##### properties?

[`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md)

Properties to set

#### Returns

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

## Properties

### nonce?

> `optional` **nonce**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27798](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27798)

CompanionMetaNonceFetchResponse nonce.

#### Implementation of

[`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md).[`nonce`](../interfaces/ICompanionMetaNonceFetchResponse.md#nonce)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27868)

Converts this CompanionMetaNonceFetchResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:27805](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27805)

Creates a new CompanionMetaNonceFetchResponse instance using the specified properties.

#### Parameters

##### properties?

[`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md)

Properties to set

#### Returns

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:27831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27831)

Decodes a CompanionMetaNonceFetchResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:27840](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27840)

Decodes a CompanionMetaNonceFetchResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27813)

Encodes the specified CompanionMetaNonceFetchResponse message. Does not implicitly [verify](CompanionMetaNonceFetchResponse.md#verify) messages.

#### Parameters

##### message

[`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27821](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27821)

Encodes the specified CompanionMetaNonceFetchResponse message, length delimited. Does not implicitly [verify](CompanionMetaNonceFetchResponse.md#verify) messages.

#### Parameters

##### message

[`ICompanionMetaNonceFetchResponse`](../interfaces/ICompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:27854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27854)

Creates a CompanionMetaNonceFetchResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27875)

Gets the default type url for CompanionMetaNonceFetchResponse

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

Defined in: [WAProto/index.d.ts:27862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27862)

Creates a plain object from a CompanionMetaNonceFetchResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`CompanionMetaNonceFetchResponse`](CompanionMetaNonceFetchResponse.md)

CompanionMetaNonceFetchResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27847](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27847)

Verifies a CompanionMetaNonceFetchResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
