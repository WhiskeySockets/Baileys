# Class: HSMDateTimeComponent

Defined in: [WAProto/index.d.ts:22426](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22426)

Represents a HSMDateTimeComponent.

## Implements

- [`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md)

## Constructors

### new HSMDateTimeComponent()

> **new HSMDateTimeComponent**(`properties`?): [`HSMDateTimeComponent`](HSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22432](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22432)

Constructs a new HSMDateTimeComponent.

#### Parameters

##### properties?

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md)

Properties to set

#### Returns

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

## Properties

### calendar?

> `optional` **calendar**: `null` \| [`CalendarType`](../namespaces/HSMDateTimeComponent/enumerations/CalendarType.md)

Defined in: [WAProto/index.d.ts:22453](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22453)

HSMDateTimeComponent calendar.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`calendar`](../interfaces/IHSMDateTimeComponent.md#calendar)

***

### dayOfMonth?

> `optional` **dayOfMonth**: `null` \| `number`

Defined in: [WAProto/index.d.ts:22444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22444)

HSMDateTimeComponent dayOfMonth.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`dayOfMonth`](../interfaces/IHSMDateTimeComponent.md#dayofmonth)

***

### dayOfWeek?

> `optional` **dayOfWeek**: `null` \| [`DayOfWeekType`](../namespaces/HSMDateTimeComponent/enumerations/DayOfWeekType.md)

Defined in: [WAProto/index.d.ts:22435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22435)

HSMDateTimeComponent dayOfWeek.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`dayOfWeek`](../interfaces/IHSMDateTimeComponent.md#dayofweek)

***

### hour?

> `optional` **hour**: `null` \| `number`

Defined in: [WAProto/index.d.ts:22447](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22447)

HSMDateTimeComponent hour.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`hour`](../interfaces/IHSMDateTimeComponent.md#hour)

***

### minute?

> `optional` **minute**: `null` \| `number`

Defined in: [WAProto/index.d.ts:22450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22450)

HSMDateTimeComponent minute.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`minute`](../interfaces/IHSMDateTimeComponent.md#minute)

***

### month?

> `optional` **month**: `null` \| `number`

Defined in: [WAProto/index.d.ts:22441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22441)

HSMDateTimeComponent month.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`month`](../interfaces/IHSMDateTimeComponent.md#month)

***

### year?

> `optional` **year**: `null` \| `number`

Defined in: [WAProto/index.d.ts:22438](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22438)

HSMDateTimeComponent year.

#### Implementation of

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md).[`year`](../interfaces/IHSMDateTimeComponent.md#year)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:22523](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22523)

Converts this HSMDateTimeComponent to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HSMDateTimeComponent`](HSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22460)

Creates a new HSMDateTimeComponent instance using the specified properties.

#### Parameters

##### properties?

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md)

Properties to set

#### Returns

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

HSMDateTimeComponent instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HSMDateTimeComponent`](HSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22486](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22486)

Decodes a HSMDateTimeComponent message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

HSMDateTimeComponent

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HSMDateTimeComponent`](HSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22495](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22495)

Decodes a HSMDateTimeComponent message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

HSMDateTimeComponent

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22468](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22468)

Encodes the specified HSMDateTimeComponent message. Does not implicitly [verify](HSMDateTimeComponent.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md)

HSMDateTimeComponent message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22476)

Encodes the specified HSMDateTimeComponent message, length delimited. Does not implicitly [verify](HSMDateTimeComponent.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTimeComponent`](../interfaces/IHSMDateTimeComponent.md)

HSMDateTimeComponent message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HSMDateTimeComponent`](HSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22509)

Creates a HSMDateTimeComponent message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

HSMDateTimeComponent

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:22530](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22530)

Gets the default type url for HSMDateTimeComponent

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

Defined in: [WAProto/index.d.ts:22517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22517)

Creates a plain object from a HSMDateTimeComponent message. Also converts values to other types if specified.

#### Parameters

##### message

[`HSMDateTimeComponent`](HSMDateTimeComponent.md)

HSMDateTimeComponent

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:22502](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22502)

Verifies a HSMDateTimeComponent message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
