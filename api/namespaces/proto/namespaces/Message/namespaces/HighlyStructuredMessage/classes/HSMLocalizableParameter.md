# Class: HSMLocalizableParameter

Defined in: [WAProto/index.d.ts:22089](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22089)

Represents a HSMLocalizableParameter.

## Implements

- [`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md)

## Constructors

### new HSMLocalizableParameter()

> **new HSMLocalizableParameter**(`properties`?): [`HSMLocalizableParameter`](HSMLocalizableParameter.md)

Defined in: [WAProto/index.d.ts:22095](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22095)

Constructs a new HSMLocalizableParameter.

#### Parameters

##### properties?

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md)

Properties to set

#### Returns

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

## Properties

### currency?

> `optional` **currency**: `null` \| [`IHSMCurrency`](../namespaces/HSMLocalizableParameter/interfaces/IHSMCurrency.md)

Defined in: [WAProto/index.d.ts:22101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22101)

HSMLocalizableParameter currency.

#### Implementation of

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md).[`currency`](../interfaces/IHSMLocalizableParameter.md#currency)

***

### dateTime?

> `optional` **dateTime**: `null` \| [`IHSMDateTime`](../namespaces/HSMLocalizableParameter/interfaces/IHSMDateTime.md)

Defined in: [WAProto/index.d.ts:22104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22104)

HSMLocalizableParameter dateTime.

#### Implementation of

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md).[`dateTime`](../interfaces/IHSMLocalizableParameter.md#datetime)

***

### default?

> `optional` **default**: `null` \| `string`

Defined in: [WAProto/index.d.ts:22098](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22098)

HSMLocalizableParameter default.

#### Implementation of

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md).[`default`](../interfaces/IHSMLocalizableParameter.md#default)

***

### paramOneof?

> `optional` **paramOneof**: `"currency"` \| `"dateTime"`

Defined in: [WAProto/index.d.ts:22107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22107)

HSMLocalizableParameter paramOneof.

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:22177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22177)

Converts this HSMLocalizableParameter to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HSMLocalizableParameter`](HSMLocalizableParameter.md)

Defined in: [WAProto/index.d.ts:22114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22114)

Creates a new HSMLocalizableParameter instance using the specified properties.

#### Parameters

##### properties?

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md)

Properties to set

#### Returns

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

HSMLocalizableParameter instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HSMLocalizableParameter`](HSMLocalizableParameter.md)

Defined in: [WAProto/index.d.ts:22140](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22140)

Decodes a HSMLocalizableParameter message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

HSMLocalizableParameter

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HSMLocalizableParameter`](HSMLocalizableParameter.md)

Defined in: [WAProto/index.d.ts:22149](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22149)

Decodes a HSMLocalizableParameter message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

HSMLocalizableParameter

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22122](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22122)

Encodes the specified HSMLocalizableParameter message. Does not implicitly [verify](HSMLocalizableParameter.md#verify) messages.

#### Parameters

##### message

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md)

HSMLocalizableParameter message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22130](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22130)

Encodes the specified HSMLocalizableParameter message, length delimited. Does not implicitly [verify](HSMLocalizableParameter.md#verify) messages.

#### Parameters

##### message

[`IHSMLocalizableParameter`](../interfaces/IHSMLocalizableParameter.md)

HSMLocalizableParameter message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HSMLocalizableParameter`](HSMLocalizableParameter.md)

Defined in: [WAProto/index.d.ts:22163](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22163)

Creates a HSMLocalizableParameter message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

HSMLocalizableParameter

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:22184](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22184)

Gets the default type url for HSMLocalizableParameter

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

Defined in: [WAProto/index.d.ts:22171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22171)

Creates a plain object from a HSMLocalizableParameter message. Also converts values to other types if specified.

#### Parameters

##### message

[`HSMLocalizableParameter`](HSMLocalizableParameter.md)

HSMLocalizableParameter

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:22156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22156)

Verifies a HSMLocalizableParameter message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
