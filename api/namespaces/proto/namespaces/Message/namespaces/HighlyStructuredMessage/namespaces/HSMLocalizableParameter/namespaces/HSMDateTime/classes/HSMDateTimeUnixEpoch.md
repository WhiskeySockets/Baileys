# Class: HSMDateTimeUnixEpoch

Defined in: [WAProto/index.d.ts:22561](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22561)

Represents a HSMDateTimeUnixEpoch.

## Implements

- [`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md)

## Constructors

### new HSMDateTimeUnixEpoch()

> **new HSMDateTimeUnixEpoch**(`properties`?): [`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22567](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22567)

Constructs a new HSMDateTimeUnixEpoch.

#### Parameters

##### properties?

[`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md)

Properties to set

#### Returns

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

## Properties

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:22570](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22570)

HSMDateTimeUnixEpoch timestamp.

#### Implementation of

[`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md).[`timestamp`](../interfaces/IHSMDateTimeUnixEpoch.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:22640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22640)

Converts this HSMDateTimeUnixEpoch to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22577](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22577)

Creates a new HSMDateTimeUnixEpoch instance using the specified properties.

#### Parameters

##### properties?

[`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md)

Properties to set

#### Returns

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22603)

Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22612)

Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22585](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22585)

Encodes the specified HSMDateTimeUnixEpoch message. Does not implicitly [verify](HSMDateTimeUnixEpoch.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22593](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22593)

Encodes the specified HSMDateTimeUnixEpoch message, length delimited. Does not implicitly [verify](HSMDateTimeUnixEpoch.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTimeUnixEpoch`](../interfaces/IHSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22626)

Creates a HSMDateTimeUnixEpoch message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:22647](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22647)

Gets the default type url for HSMDateTimeUnixEpoch

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

Defined in: [WAProto/index.d.ts:22634](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22634)

Creates a plain object from a HSMDateTimeUnixEpoch message. Also converts values to other types if specified.

#### Parameters

##### message

[`HSMDateTimeUnixEpoch`](HSMDateTimeUnixEpoch.md)

HSMDateTimeUnixEpoch

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:22619](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22619)

Verifies a HSMDateTimeUnixEpoch message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
