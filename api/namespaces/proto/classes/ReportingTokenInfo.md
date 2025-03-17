# Class: ReportingTokenInfo

Defined in: [WAProto/index.d.ts:38118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38118)

Represents a ReportingTokenInfo.

## Implements

- [`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md)

## Constructors

### new ReportingTokenInfo()

> **new ReportingTokenInfo**(`properties`?): [`ReportingTokenInfo`](ReportingTokenInfo.md)

Defined in: [WAProto/index.d.ts:38124](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38124)

Constructs a new ReportingTokenInfo.

#### Parameters

##### properties?

[`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md)

Properties to set

#### Returns

[`ReportingTokenInfo`](ReportingTokenInfo.md)

## Properties

### reportingTag?

> `optional` **reportingTag**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38127](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38127)

ReportingTokenInfo reportingTag.

#### Implementation of

[`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md).[`reportingTag`](../interfaces/IReportingTokenInfo.md#reportingtag)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38197)

Converts this ReportingTokenInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ReportingTokenInfo`](ReportingTokenInfo.md)

Defined in: [WAProto/index.d.ts:38134](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38134)

Creates a new ReportingTokenInfo instance using the specified properties.

#### Parameters

##### properties?

[`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md)

Properties to set

#### Returns

[`ReportingTokenInfo`](ReportingTokenInfo.md)

ReportingTokenInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ReportingTokenInfo`](ReportingTokenInfo.md)

Defined in: [WAProto/index.d.ts:38160](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38160)

Decodes a ReportingTokenInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ReportingTokenInfo`](ReportingTokenInfo.md)

ReportingTokenInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ReportingTokenInfo`](ReportingTokenInfo.md)

Defined in: [WAProto/index.d.ts:38169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38169)

Decodes a ReportingTokenInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ReportingTokenInfo`](ReportingTokenInfo.md)

ReportingTokenInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38142](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38142)

Encodes the specified ReportingTokenInfo message. Does not implicitly [verify](ReportingTokenInfo.md#verify) messages.

#### Parameters

##### message

[`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md)

ReportingTokenInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38150)

Encodes the specified ReportingTokenInfo message, length delimited. Does not implicitly [verify](ReportingTokenInfo.md#verify) messages.

#### Parameters

##### message

[`IReportingTokenInfo`](../interfaces/IReportingTokenInfo.md)

ReportingTokenInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ReportingTokenInfo`](ReportingTokenInfo.md)

Defined in: [WAProto/index.d.ts:38183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38183)

Creates a ReportingTokenInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ReportingTokenInfo`](ReportingTokenInfo.md)

ReportingTokenInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38204](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38204)

Gets the default type url for ReportingTokenInfo

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

Defined in: [WAProto/index.d.ts:38191](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38191)

Creates a plain object from a ReportingTokenInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ReportingTokenInfo`](ReportingTokenInfo.md)

ReportingTokenInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38176](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38176)

Verifies a ReportingTokenInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
