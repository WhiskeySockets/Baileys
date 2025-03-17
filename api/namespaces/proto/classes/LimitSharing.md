# Class: LimitSharing

Defined in: [WAProto/index.d.ts:16103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16103)

Represents a LimitSharing.

## Implements

- [`ILimitSharing`](../interfaces/ILimitSharing.md)

## Constructors

### new LimitSharing()

> **new LimitSharing**(`properties`?): [`LimitSharing`](LimitSharing.md)

Defined in: [WAProto/index.d.ts:16109](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16109)

Constructs a new LimitSharing.

#### Parameters

##### properties?

[`ILimitSharing`](../interfaces/ILimitSharing.md)

Properties to set

#### Returns

[`LimitSharing`](LimitSharing.md)

## Properties

### sharingLimited?

> `optional` **sharingLimited**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:16112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16112)

LimitSharing sharingLimited.

#### Implementation of

[`ILimitSharing`](../interfaces/ILimitSharing.md).[`sharingLimited`](../interfaces/ILimitSharing.md#sharinglimited)

***

### trigger?

> `optional` **trigger**: `null` \| [`Trigger`](../namespaces/LimitSharing/enumerations/Trigger.md)

Defined in: [WAProto/index.d.ts:16115](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16115)

LimitSharing trigger.

#### Implementation of

[`ILimitSharing`](../interfaces/ILimitSharing.md).[`trigger`](../interfaces/ILimitSharing.md#trigger)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16185](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16185)

Converts this LimitSharing to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LimitSharing`](LimitSharing.md)

Defined in: [WAProto/index.d.ts:16122](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16122)

Creates a new LimitSharing instance using the specified properties.

#### Parameters

##### properties?

[`ILimitSharing`](../interfaces/ILimitSharing.md)

Properties to set

#### Returns

[`LimitSharing`](LimitSharing.md)

LimitSharing instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LimitSharing`](LimitSharing.md)

Defined in: [WAProto/index.d.ts:16148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16148)

Decodes a LimitSharing message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LimitSharing`](LimitSharing.md)

LimitSharing

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LimitSharing`](LimitSharing.md)

Defined in: [WAProto/index.d.ts:16157](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16157)

Decodes a LimitSharing message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LimitSharing`](LimitSharing.md)

LimitSharing

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16130](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16130)

Encodes the specified LimitSharing message. Does not implicitly [verify](LimitSharing.md#verify) messages.

#### Parameters

##### message

[`ILimitSharing`](../interfaces/ILimitSharing.md)

LimitSharing message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16138)

Encodes the specified LimitSharing message, length delimited. Does not implicitly [verify](LimitSharing.md#verify) messages.

#### Parameters

##### message

[`ILimitSharing`](../interfaces/ILimitSharing.md)

LimitSharing message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LimitSharing`](LimitSharing.md)

Defined in: [WAProto/index.d.ts:16171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16171)

Creates a LimitSharing message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LimitSharing`](LimitSharing.md)

LimitSharing

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16192](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16192)

Gets the default type url for LimitSharing

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

Defined in: [WAProto/index.d.ts:16179](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16179)

Creates a plain object from a LimitSharing message. Also converts values to other types if specified.

#### Parameters

##### message

[`LimitSharing`](LimitSharing.md)

LimitSharing

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16164)

Verifies a LimitSharing message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
