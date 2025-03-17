# Class: HSMCurrency

Defined in: [WAProto/index.d.ts:22200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22200)

Represents a HSMCurrency.

## Implements

- [`IHSMCurrency`](../interfaces/IHSMCurrency.md)

## Constructors

### new HSMCurrency()

> **new HSMCurrency**(`properties`?): [`HSMCurrency`](HSMCurrency.md)

Defined in: [WAProto/index.d.ts:22206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22206)

Constructs a new HSMCurrency.

#### Parameters

##### properties?

[`IHSMCurrency`](../interfaces/IHSMCurrency.md)

Properties to set

#### Returns

[`HSMCurrency`](HSMCurrency.md)

## Properties

### amount1000?

> `optional` **amount1000**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:22212](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22212)

HSMCurrency amount1000.

#### Implementation of

[`IHSMCurrency`](../interfaces/IHSMCurrency.md).[`amount1000`](../interfaces/IHSMCurrency.md#amount1000)

***

### currencyCode?

> `optional` **currencyCode**: `null` \| `string`

Defined in: [WAProto/index.d.ts:22209](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22209)

HSMCurrency currencyCode.

#### Implementation of

[`IHSMCurrency`](../interfaces/IHSMCurrency.md).[`currencyCode`](../interfaces/IHSMCurrency.md#currencycode)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:22282](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22282)

Converts this HSMCurrency to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HSMCurrency`](HSMCurrency.md)

Defined in: [WAProto/index.d.ts:22219](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22219)

Creates a new HSMCurrency instance using the specified properties.

#### Parameters

##### properties?

[`IHSMCurrency`](../interfaces/IHSMCurrency.md)

Properties to set

#### Returns

[`HSMCurrency`](HSMCurrency.md)

HSMCurrency instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HSMCurrency`](HSMCurrency.md)

Defined in: [WAProto/index.d.ts:22245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22245)

Decodes a HSMCurrency message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HSMCurrency`](HSMCurrency.md)

HSMCurrency

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HSMCurrency`](HSMCurrency.md)

Defined in: [WAProto/index.d.ts:22254](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22254)

Decodes a HSMCurrency message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HSMCurrency`](HSMCurrency.md)

HSMCurrency

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22227](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22227)

Encodes the specified HSMCurrency message. Does not implicitly [verify](HSMCurrency.md#verify) messages.

#### Parameters

##### message

[`IHSMCurrency`](../interfaces/IHSMCurrency.md)

HSMCurrency message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22235)

Encodes the specified HSMCurrency message, length delimited. Does not implicitly [verify](HSMCurrency.md#verify) messages.

#### Parameters

##### message

[`IHSMCurrency`](../interfaces/IHSMCurrency.md)

HSMCurrency message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HSMCurrency`](HSMCurrency.md)

Defined in: [WAProto/index.d.ts:22268](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22268)

Creates a HSMCurrency message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HSMCurrency`](HSMCurrency.md)

HSMCurrency

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:22289](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22289)

Gets the default type url for HSMCurrency

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

Defined in: [WAProto/index.d.ts:22276](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22276)

Creates a plain object from a HSMCurrency message. Also converts values to other types if specified.

#### Parameters

##### message

[`HSMCurrency`](HSMCurrency.md)

HSMCurrency

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:22261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22261)

Verifies a HSMCurrency message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
