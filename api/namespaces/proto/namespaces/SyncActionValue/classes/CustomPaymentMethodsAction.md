# Class: CustomPaymentMethodsAction

Defined in: [WAProto/index.d.ts:42068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42068)

Represents a CustomPaymentMethodsAction.

## Implements

- [`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md)

## Constructors

### new CustomPaymentMethodsAction()

> **new CustomPaymentMethodsAction**(`properties`?): [`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

Defined in: [WAProto/index.d.ts:42074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42074)

Constructs a new CustomPaymentMethodsAction.

#### Parameters

##### properties?

[`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md)

Properties to set

#### Returns

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

## Properties

### customPaymentMethods

> **customPaymentMethods**: [`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)[]

Defined in: [WAProto/index.d.ts:42077](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42077)

CustomPaymentMethodsAction customPaymentMethods.

#### Implementation of

[`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md).[`customPaymentMethods`](../interfaces/ICustomPaymentMethodsAction.md#custompaymentmethods)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42147](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42147)

Converts this CustomPaymentMethodsAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

Defined in: [WAProto/index.d.ts:42084](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42084)

Creates a new CustomPaymentMethodsAction instance using the specified properties.

#### Parameters

##### properties?

[`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md)

Properties to set

#### Returns

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

CustomPaymentMethodsAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

Defined in: [WAProto/index.d.ts:42110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42110)

Decodes a CustomPaymentMethodsAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

CustomPaymentMethodsAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

Defined in: [WAProto/index.d.ts:42119](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42119)

Decodes a CustomPaymentMethodsAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

CustomPaymentMethodsAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42092](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42092)

Encodes the specified CustomPaymentMethodsAction message. Does not implicitly [verify](CustomPaymentMethodsAction.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md)

CustomPaymentMethodsAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42100)

Encodes the specified CustomPaymentMethodsAction message, length delimited. Does not implicitly [verify](CustomPaymentMethodsAction.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethodsAction`](../interfaces/ICustomPaymentMethodsAction.md)

CustomPaymentMethodsAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

Defined in: [WAProto/index.d.ts:42133](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42133)

Creates a CustomPaymentMethodsAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

CustomPaymentMethodsAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42154)

Gets the default type url for CustomPaymentMethodsAction

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

Defined in: [WAProto/index.d.ts:42141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42141)

Creates a plain object from a CustomPaymentMethodsAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`CustomPaymentMethodsAction`](CustomPaymentMethodsAction.md)

CustomPaymentMethodsAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42126)

Verifies a CustomPaymentMethodsAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
