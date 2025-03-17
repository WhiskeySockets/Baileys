# Class: NativeFlowInfo

Defined in: [WAProto/index.d.ts:19033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19033)

Represents a NativeFlowInfo.

## Implements

- [`INativeFlowInfo`](../interfaces/INativeFlowInfo.md)

## Constructors

### new NativeFlowInfo()

> **new NativeFlowInfo**(`properties`?): [`NativeFlowInfo`](NativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:19039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19039)

Constructs a new NativeFlowInfo.

#### Parameters

##### properties?

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md)

Properties to set

#### Returns

[`NativeFlowInfo`](NativeFlowInfo.md)

## Properties

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19042)

NativeFlowInfo name.

#### Implementation of

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md).[`name`](../interfaces/INativeFlowInfo.md#name)

***

### paramsJson?

> `optional` **paramsJson**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19045)

NativeFlowInfo paramsJson.

#### Implementation of

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md).[`paramsJson`](../interfaces/INativeFlowInfo.md#paramsjson)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19115](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19115)

Converts this NativeFlowInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NativeFlowInfo`](NativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:19052](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19052)

Creates a new NativeFlowInfo instance using the specified properties.

#### Parameters

##### properties?

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md)

Properties to set

#### Returns

[`NativeFlowInfo`](NativeFlowInfo.md)

NativeFlowInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NativeFlowInfo`](NativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:19078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19078)

Decodes a NativeFlowInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NativeFlowInfo`](NativeFlowInfo.md)

NativeFlowInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NativeFlowInfo`](NativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:19087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19087)

Decodes a NativeFlowInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NativeFlowInfo`](NativeFlowInfo.md)

NativeFlowInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19060)

Encodes the specified NativeFlowInfo message. Does not implicitly [verify](NativeFlowInfo.md#verify) messages.

#### Parameters

##### message

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md)

NativeFlowInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19068)

Encodes the specified NativeFlowInfo message, length delimited. Does not implicitly [verify](NativeFlowInfo.md#verify) messages.

#### Parameters

##### message

[`INativeFlowInfo`](../interfaces/INativeFlowInfo.md)

NativeFlowInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NativeFlowInfo`](NativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:19101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19101)

Creates a NativeFlowInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NativeFlowInfo`](NativeFlowInfo.md)

NativeFlowInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19122](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19122)

Gets the default type url for NativeFlowInfo

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

Defined in: [WAProto/index.d.ts:19109](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19109)

Creates a plain object from a NativeFlowInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`NativeFlowInfo`](NativeFlowInfo.md)

NativeFlowInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19094)

Verifies a NativeFlowInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
