# Class: PaymentInfoAction

Defined in: [WAProto/index.d.ts:44302](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44302)

Represents a PaymentInfoAction.

## Implements

- [`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md)

## Constructors

### new PaymentInfoAction()

> **new PaymentInfoAction**(`properties`?): [`PaymentInfoAction`](PaymentInfoAction.md)

Defined in: [WAProto/index.d.ts:44308](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44308)

Constructs a new PaymentInfoAction.

#### Parameters

##### properties?

[`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md)

Properties to set

#### Returns

[`PaymentInfoAction`](PaymentInfoAction.md)

## Properties

### cpi?

> `optional` **cpi**: `null` \| `string`

Defined in: [WAProto/index.d.ts:44311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44311)

PaymentInfoAction cpi.

#### Implementation of

[`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md).[`cpi`](../interfaces/IPaymentInfoAction.md#cpi)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44381](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44381)

Converts this PaymentInfoAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PaymentInfoAction`](PaymentInfoAction.md)

Defined in: [WAProto/index.d.ts:44318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44318)

Creates a new PaymentInfoAction instance using the specified properties.

#### Parameters

##### properties?

[`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md)

Properties to set

#### Returns

[`PaymentInfoAction`](PaymentInfoAction.md)

PaymentInfoAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PaymentInfoAction`](PaymentInfoAction.md)

Defined in: [WAProto/index.d.ts:44344](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44344)

Decodes a PaymentInfoAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PaymentInfoAction`](PaymentInfoAction.md)

PaymentInfoAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PaymentInfoAction`](PaymentInfoAction.md)

Defined in: [WAProto/index.d.ts:44353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44353)

Decodes a PaymentInfoAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PaymentInfoAction`](PaymentInfoAction.md)

PaymentInfoAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44326)

Encodes the specified PaymentInfoAction message. Does not implicitly [verify](PaymentInfoAction.md#verify) messages.

#### Parameters

##### message

[`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md)

PaymentInfoAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44334](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44334)

Encodes the specified PaymentInfoAction message, length delimited. Does not implicitly [verify](PaymentInfoAction.md#verify) messages.

#### Parameters

##### message

[`IPaymentInfoAction`](../interfaces/IPaymentInfoAction.md)

PaymentInfoAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PaymentInfoAction`](PaymentInfoAction.md)

Defined in: [WAProto/index.d.ts:44367](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44367)

Creates a PaymentInfoAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PaymentInfoAction`](PaymentInfoAction.md)

PaymentInfoAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44388](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44388)

Gets the default type url for PaymentInfoAction

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

Defined in: [WAProto/index.d.ts:44375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44375)

Creates a plain object from a PaymentInfoAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`PaymentInfoAction`](PaymentInfoAction.md)

PaymentInfoAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44360](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44360)

Verifies a PaymentInfoAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
