# Class: CtwaContextLinkData

Defined in: [WAProto/index.d.ts:7326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7326)

Represents a CtwaContextLinkData.

## Implements

- [`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md)

## Constructors

### new CtwaContextLinkData()

> **new CtwaContextLinkData**(`properties`?): [`CtwaContextLinkData`](CtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7332](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7332)

Constructs a new CtwaContextLinkData.

#### Parameters

##### properties?

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md)

Properties to set

#### Returns

[`CtwaContextLinkData`](CtwaContextLinkData.md)

## Properties

### context?

> `optional` **context**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7335](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7335)

CtwaContextLinkData context.

#### Implementation of

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md).[`context`](../interfaces/ICtwaContextLinkData.md#context)

***

### icebreaker?

> `optional` **icebreaker**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7341)

CtwaContextLinkData icebreaker.

#### Implementation of

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md).[`icebreaker`](../interfaces/ICtwaContextLinkData.md#icebreaker)

***

### phone?

> `optional` **phone**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7344](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7344)

CtwaContextLinkData phone.

#### Implementation of

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md).[`phone`](../interfaces/ICtwaContextLinkData.md#phone)

***

### sourceUrl?

> `optional` **sourceUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7338)

CtwaContextLinkData sourceUrl.

#### Implementation of

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md).[`sourceUrl`](../interfaces/ICtwaContextLinkData.md#sourceurl)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7414)

Converts this CtwaContextLinkData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CtwaContextLinkData`](CtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7351)

Creates a new CtwaContextLinkData instance using the specified properties.

#### Parameters

##### properties?

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md)

Properties to set

#### Returns

[`CtwaContextLinkData`](CtwaContextLinkData.md)

CtwaContextLinkData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CtwaContextLinkData`](CtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7377](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7377)

Decodes a CtwaContextLinkData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CtwaContextLinkData`](CtwaContextLinkData.md)

CtwaContextLinkData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CtwaContextLinkData`](CtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7386)

Decodes a CtwaContextLinkData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CtwaContextLinkData`](CtwaContextLinkData.md)

CtwaContextLinkData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7359)

Encodes the specified CtwaContextLinkData message. Does not implicitly [verify](CtwaContextLinkData.md#verify) messages.

#### Parameters

##### message

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md)

CtwaContextLinkData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7367](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7367)

Encodes the specified CtwaContextLinkData message, length delimited. Does not implicitly [verify](CtwaContextLinkData.md#verify) messages.

#### Parameters

##### message

[`ICtwaContextLinkData`](../interfaces/ICtwaContextLinkData.md)

CtwaContextLinkData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CtwaContextLinkData`](CtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7400)

Creates a CtwaContextLinkData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CtwaContextLinkData`](CtwaContextLinkData.md)

CtwaContextLinkData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7421](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7421)

Gets the default type url for CtwaContextLinkData

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

Defined in: [WAProto/index.d.ts:7408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7408)

Creates a plain object from a CtwaContextLinkData message. Also converts values to other types if specified.

#### Parameters

##### message

[`CtwaContextLinkData`](CtwaContextLinkData.md)

CtwaContextLinkData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:7393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7393)

Verifies a CtwaContextLinkData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
