# Class: PaymentInviteMessage

Defined in: [WAProto/index.d.ts:26775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26775)

Represents a PaymentInviteMessage.

## Implements

- [`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md)

## Constructors

### new PaymentInviteMessage()

> **new PaymentInviteMessage**(`properties`?): [`PaymentInviteMessage`](PaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:26781](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26781)

Constructs a new PaymentInviteMessage.

#### Parameters

##### properties?

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md)

Properties to set

#### Returns

[`PaymentInviteMessage`](PaymentInviteMessage.md)

## Properties

### expiryTimestamp?

> `optional` **expiryTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:26787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26787)

PaymentInviteMessage expiryTimestamp.

#### Implementation of

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md).[`expiryTimestamp`](../interfaces/IPaymentInviteMessage.md#expirytimestamp)

***

### serviceType?

> `optional` **serviceType**: `null` \| [`ServiceType`](../namespaces/PaymentInviteMessage/enumerations/ServiceType.md)

Defined in: [WAProto/index.d.ts:26784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26784)

PaymentInviteMessage serviceType.

#### Implementation of

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md).[`serviceType`](../interfaces/IPaymentInviteMessage.md#servicetype)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26857)

Converts this PaymentInviteMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PaymentInviteMessage`](PaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:26794](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26794)

Creates a new PaymentInviteMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md)

Properties to set

#### Returns

[`PaymentInviteMessage`](PaymentInviteMessage.md)

PaymentInviteMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PaymentInviteMessage`](PaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:26820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26820)

Decodes a PaymentInviteMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PaymentInviteMessage`](PaymentInviteMessage.md)

PaymentInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PaymentInviteMessage`](PaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:26829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26829)

Decodes a PaymentInviteMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PaymentInviteMessage`](PaymentInviteMessage.md)

PaymentInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26802](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26802)

Encodes the specified PaymentInviteMessage message. Does not implicitly [verify](PaymentInviteMessage.md#verify) messages.

#### Parameters

##### message

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md)

PaymentInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26810)

Encodes the specified PaymentInviteMessage message, length delimited. Does not implicitly [verify](PaymentInviteMessage.md#verify) messages.

#### Parameters

##### message

[`IPaymentInviteMessage`](../interfaces/IPaymentInviteMessage.md)

PaymentInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PaymentInviteMessage`](PaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:26843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26843)

Creates a PaymentInviteMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PaymentInviteMessage`](PaymentInviteMessage.md)

PaymentInviteMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26864](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26864)

Gets the default type url for PaymentInviteMessage

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

Defined in: [WAProto/index.d.ts:26851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26851)

Creates a plain object from a PaymentInviteMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PaymentInviteMessage`](PaymentInviteMessage.md)

PaymentInviteMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26836)

Verifies a PaymentInviteMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
