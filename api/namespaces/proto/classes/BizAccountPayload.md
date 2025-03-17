# Class: BizAccountPayload

Defined in: [WAProto/index.d.ts:3123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3123)

Represents a BizAccountPayload.

## Implements

- [`IBizAccountPayload`](../interfaces/IBizAccountPayload.md)

## Constructors

### new BizAccountPayload()

> **new BizAccountPayload**(`properties`?): [`BizAccountPayload`](BizAccountPayload.md)

Defined in: [WAProto/index.d.ts:3129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3129)

Constructs a new BizAccountPayload.

#### Parameters

##### properties?

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md)

Properties to set

#### Returns

[`BizAccountPayload`](BizAccountPayload.md)

## Properties

### bizAcctLinkInfo?

> `optional` **bizAcctLinkInfo**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:3135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3135)

BizAccountPayload bizAcctLinkInfo.

#### Implementation of

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md).[`bizAcctLinkInfo`](../interfaces/IBizAccountPayload.md#bizacctlinkinfo)

***

### vnameCert?

> `optional` **vnameCert**: `null` \| [`IVerifiedNameCertificate`](../interfaces/IVerifiedNameCertificate.md)

Defined in: [WAProto/index.d.ts:3132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3132)

BizAccountPayload vnameCert.

#### Implementation of

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md).[`vnameCert`](../interfaces/IBizAccountPayload.md#vnamecert)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3205)

Converts this BizAccountPayload to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BizAccountPayload`](BizAccountPayload.md)

Defined in: [WAProto/index.d.ts:3142](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3142)

Creates a new BizAccountPayload instance using the specified properties.

#### Parameters

##### properties?

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md)

Properties to set

#### Returns

[`BizAccountPayload`](BizAccountPayload.md)

BizAccountPayload instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BizAccountPayload`](BizAccountPayload.md)

Defined in: [WAProto/index.d.ts:3168](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3168)

Decodes a BizAccountPayload message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BizAccountPayload`](BizAccountPayload.md)

BizAccountPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BizAccountPayload`](BizAccountPayload.md)

Defined in: [WAProto/index.d.ts:3177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3177)

Decodes a BizAccountPayload message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BizAccountPayload`](BizAccountPayload.md)

BizAccountPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3150)

Encodes the specified BizAccountPayload message. Does not implicitly [verify](BizAccountPayload.md#verify) messages.

#### Parameters

##### message

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md)

BizAccountPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3158)

Encodes the specified BizAccountPayload message, length delimited. Does not implicitly [verify](BizAccountPayload.md#verify) messages.

#### Parameters

##### message

[`IBizAccountPayload`](../interfaces/IBizAccountPayload.md)

BizAccountPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BizAccountPayload`](BizAccountPayload.md)

Defined in: [WAProto/index.d.ts:3191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3191)

Creates a BizAccountPayload message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BizAccountPayload`](BizAccountPayload.md)

BizAccountPayload

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3212](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3212)

Gets the default type url for BizAccountPayload

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

Defined in: [WAProto/index.d.ts:3199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3199)

Creates a plain object from a BizAccountPayload message. Also converts values to other types if specified.

#### Parameters

##### message

[`BizAccountPayload`](BizAccountPayload.md)

BizAccountPayload

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3184](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3184)

Verifies a BizAccountPayload message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
