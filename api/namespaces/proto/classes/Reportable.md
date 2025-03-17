# Class: Reportable

Defined in: [WAProto/index.d.ts:38012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38012)

Represents a Reportable.

## Implements

- [`IReportable`](../interfaces/IReportable.md)

## Constructors

### new Reportable()

> **new Reportable**(`properties`?): [`Reportable`](Reportable.md)

Defined in: [WAProto/index.d.ts:38018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38018)

Constructs a new Reportable.

#### Parameters

##### properties?

[`IReportable`](../interfaces/IReportable.md)

Properties to set

#### Returns

[`Reportable`](Reportable.md)

## Properties

### maxVersion?

> `optional` **maxVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38024](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38024)

Reportable maxVersion.

#### Implementation of

[`IReportable`](../interfaces/IReportable.md).[`maxVersion`](../interfaces/IReportable.md#maxversion)

***

### minVersion?

> `optional` **minVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38021](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38021)

Reportable minVersion.

#### Implementation of

[`IReportable`](../interfaces/IReportable.md).[`minVersion`](../interfaces/IReportable.md#minversion)

***

### never?

> `optional` **never**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:38030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38030)

Reportable never.

#### Implementation of

[`IReportable`](../interfaces/IReportable.md).[`never`](../interfaces/IReportable.md#never)

***

### notReportableMinVersion?

> `optional` **notReportableMinVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38027)

Reportable notReportableMinVersion.

#### Implementation of

[`IReportable`](../interfaces/IReportable.md).[`notReportableMinVersion`](../interfaces/IReportable.md#notreportableminversion)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38100)

Converts this Reportable to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Reportable`](Reportable.md)

Defined in: [WAProto/index.d.ts:38037](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38037)

Creates a new Reportable instance using the specified properties.

#### Parameters

##### properties?

[`IReportable`](../interfaces/IReportable.md)

Properties to set

#### Returns

[`Reportable`](Reportable.md)

Reportable instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Reportable`](Reportable.md)

Defined in: [WAProto/index.d.ts:38063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38063)

Decodes a Reportable message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Reportable`](Reportable.md)

Reportable

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Reportable`](Reportable.md)

Defined in: [WAProto/index.d.ts:38072](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38072)

Decodes a Reportable message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Reportable`](Reportable.md)

Reportable

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38045)

Encodes the specified Reportable message. Does not implicitly [verify](Reportable.md#verify) messages.

#### Parameters

##### message

[`IReportable`](../interfaces/IReportable.md)

Reportable message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38053)

Encodes the specified Reportable message, length delimited. Does not implicitly [verify](Reportable.md#verify) messages.

#### Parameters

##### message

[`IReportable`](../interfaces/IReportable.md)

Reportable message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Reportable`](Reportable.md)

Defined in: [WAProto/index.d.ts:38086](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38086)

Creates a Reportable message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Reportable`](Reportable.md)

Reportable

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38107)

Gets the default type url for Reportable

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

Defined in: [WAProto/index.d.ts:38094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38094)

Creates a plain object from a Reportable message. Also converts values to other types if specified.

#### Parameters

##### message

[`Reportable`](Reportable.md)

Reportable

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38079](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38079)

Verifies a Reportable message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
