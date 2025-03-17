# Class: CustomPaymentMethodMetadata

Defined in: [WAProto/index.d.ts:41968](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41968)

Represents a CustomPaymentMethodMetadata.

## Implements

- [`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)

## Constructors

### new CustomPaymentMethodMetadata()

> **new CustomPaymentMethodMetadata**(`properties`?): [`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

Defined in: [WAProto/index.d.ts:41974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41974)

Constructs a new CustomPaymentMethodMetadata.

#### Parameters

##### properties?

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)

Properties to set

#### Returns

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

## Properties

### key

> **key**: `string`

Defined in: [WAProto/index.d.ts:41977](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41977)

CustomPaymentMethodMetadata key.

#### Implementation of

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md).[`key`](../interfaces/ICustomPaymentMethodMetadata.md#key)

***

### value

> **value**: `string`

Defined in: [WAProto/index.d.ts:41980](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41980)

CustomPaymentMethodMetadata value.

#### Implementation of

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md).[`value`](../interfaces/ICustomPaymentMethodMetadata.md#value)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42050](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42050)

Converts this CustomPaymentMethodMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

Defined in: [WAProto/index.d.ts:41987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41987)

Creates a new CustomPaymentMethodMetadata instance using the specified properties.

#### Parameters

##### properties?

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)

Properties to set

#### Returns

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

Defined in: [WAProto/index.d.ts:42013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42013)

Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

Defined in: [WAProto/index.d.ts:42022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42022)

Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41995)

Encodes the specified CustomPaymentMethodMetadata message. Does not implicitly [verify](CustomPaymentMethodMetadata.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42003)

Encodes the specified CustomPaymentMethodMetadata message, length delimited. Does not implicitly [verify](CustomPaymentMethodMetadata.md#verify) messages.

#### Parameters

##### message

[`ICustomPaymentMethodMetadata`](../interfaces/ICustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

Defined in: [WAProto/index.d.ts:42036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42036)

Creates a CustomPaymentMethodMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42057)

Gets the default type url for CustomPaymentMethodMetadata

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

Defined in: [WAProto/index.d.ts:42044](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42044)

Creates a plain object from a CustomPaymentMethodMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`CustomPaymentMethodMetadata`](CustomPaymentMethodMetadata.md)

CustomPaymentMethodMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42029](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42029)

Verifies a CustomPaymentMethodMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
