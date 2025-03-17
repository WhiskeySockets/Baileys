# Class: BusinessMessageForwardInfo

Defined in: [WAProto/index.d.ts:9876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9876)

Represents a BusinessMessageForwardInfo.

## Implements

- [`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md)

## Constructors

### new BusinessMessageForwardInfo()

> **new BusinessMessageForwardInfo**(`properties`?): [`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

Defined in: [WAProto/index.d.ts:9882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9882)

Constructs a new BusinessMessageForwardInfo.

#### Parameters

##### properties?

[`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md)

Properties to set

#### Returns

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

## Properties

### businessOwnerJid?

> `optional` **businessOwnerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:9885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9885)

BusinessMessageForwardInfo businessOwnerJid.

#### Implementation of

[`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md).[`businessOwnerJid`](../interfaces/IBusinessMessageForwardInfo.md#businessownerjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9955)

Converts this BusinessMessageForwardInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

Defined in: [WAProto/index.d.ts:9892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9892)

Creates a new BusinessMessageForwardInfo instance using the specified properties.

#### Parameters

##### properties?

[`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md)

Properties to set

#### Returns

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

BusinessMessageForwardInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

Defined in: [WAProto/index.d.ts:9918](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9918)

Decodes a BusinessMessageForwardInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

BusinessMessageForwardInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

Defined in: [WAProto/index.d.ts:9927](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9927)

Decodes a BusinessMessageForwardInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

BusinessMessageForwardInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9900)

Encodes the specified BusinessMessageForwardInfo message. Does not implicitly [verify](BusinessMessageForwardInfo.md#verify) messages.

#### Parameters

##### message

[`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md)

BusinessMessageForwardInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9908)

Encodes the specified BusinessMessageForwardInfo message, length delimited. Does not implicitly [verify](BusinessMessageForwardInfo.md#verify) messages.

#### Parameters

##### message

[`IBusinessMessageForwardInfo`](../interfaces/IBusinessMessageForwardInfo.md)

BusinessMessageForwardInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

Defined in: [WAProto/index.d.ts:9941](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9941)

Creates a BusinessMessageForwardInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

BusinessMessageForwardInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9962)

Gets the default type url for BusinessMessageForwardInfo

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

Defined in: [WAProto/index.d.ts:9949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9949)

Creates a plain object from a BusinessMessageForwardInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`BusinessMessageForwardInfo`](BusinessMessageForwardInfo.md)

BusinessMessageForwardInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9934)

Verifies a BusinessMessageForwardInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
