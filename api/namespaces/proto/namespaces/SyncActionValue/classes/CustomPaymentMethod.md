# Class: CustomPaymentMethod

Defined in: [WAProto/index.d.ts:41859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41859)

Represents a CustomPaymentMethod.

## Implements

- [`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)

## Constructors

### new CustomPaymentMethod()

> **new CustomPaymentMethod**(`properties`?): [`CustomPaymentMethod`](CustomPaymentMethod.md)

Defined in: [WAProto/index.d.ts:41865](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41865)

Constructs a new CustomPaymentMethod.

#### Parameters

##### properties?

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)

Properties to set

#### Returns

[`CustomPaymentMethod`](CustomPaymentMethod.md)

## Properties

### country

> **country**: `string`

Defined in: [WAProto/index.d.ts:41871](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41871)

CustomPaymentMethod country.

#### Implementation of

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md).[`country`](../interfaces/ICustomPaymentMethod.md#country)

***

### credentialId

> **credentialId**: `string`

Defined in: [WAProto/index.d.ts:41868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41868)

CustomPaymentMethod credentialId.

#### Implementation of

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md).[`credentialId`](../interfaces/ICustomPaymentMethod.md#credentialid)

***

### metadata

> **metadata**: [`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)[]

Defined in: [WAProto/index.d.ts:41877](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41877)

CustomPaymentMethod metadata.

#### Implementation of

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md).[`metadata`](../interfaces/ICustomPaymentMethod.md#metadata)

***

### type

> **type**: `string`

Defined in: [WAProto/index.d.ts:41874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41874)

CustomPaymentMethod type.

#### Implementation of

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md).[`type`](../interfaces/ICustomPaymentMethod.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41947](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41947)

Converts this CustomPaymentMethod to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CustomPaymentMethod`](CustomPaymentMethod.md)

Defined in: [WAProto/index.d.ts:41884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41884)

Creates a new CustomPaymentMethod instance using the specified properties.

#### Parameters

##### properties?

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)

Properties to set

#### Returns

[`CustomPaymentMethod`](CustomPaymentMethod.md)

CustomPaymentMethod instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CustomPaymentMethod`](CustomPaymentMethod.md)

Defined in: [WAProto/index.d.ts:41910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41910)

Decodes a CustomPaymentMethod message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CustomPaymentMethod`](CustomPaymentMethod.md)

CustomPaymentMethod

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CustomPaymentMethod`](CustomPaymentMethod.md)

Defined in: [WAProto/index.d.ts:41919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41919)

Decodes a CustomPaymentMethod message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CustomPaymentMethod`](CustomPaymentMethod.md)

CustomPaymentMethod

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41892)

Encodes the specified CustomPaymentMethod message. Does not implicitly [verify](CustomPaymentMethod.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)

CustomPaymentMethod message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41900)

Encodes the specified CustomPaymentMethod message, length delimited. Does not implicitly [verify](CustomPaymentMethod.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethod`](../interfaces/ICustomPaymentMethod.md)

CustomPaymentMethod message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CustomPaymentMethod`](CustomPaymentMethod.md)

Defined in: [WAProto/index.d.ts:41933](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41933)

Creates a CustomPaymentMethod message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CustomPaymentMethod`](CustomPaymentMethod.md)

CustomPaymentMethod

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41954](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41954)

Gets the default type url for CustomPaymentMethod

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

Defined in: [WAProto/index.d.ts:41941](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41941)

Creates a plain object from a CustomPaymentMethod message. Also converts values to other types if specified.

#### Parameters

##### message

[`CustomPaymentMethod`](CustomPaymentMethod.md)

CustomPaymentMethod

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41926](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41926)

Verifies a CustomPaymentMethod message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
