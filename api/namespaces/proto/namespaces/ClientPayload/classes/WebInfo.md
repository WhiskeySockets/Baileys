# Class: WebInfo

Defined in: [WAProto/index.d.ts:8705](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8705)

Represents a WebInfo.

## Implements

- [`IWebInfo`](../interfaces/IWebInfo.md)

## Constructors

### new WebInfo()

> **new WebInfo**(`properties`?): [`WebInfo`](WebInfo.md)

Defined in: [WAProto/index.d.ts:8711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8711)

Constructs a new WebInfo.

#### Parameters

##### properties?

[`IWebInfo`](../interfaces/IWebInfo.md)

Properties to set

#### Returns

[`WebInfo`](WebInfo.md)

## Properties

### refToken?

> `optional` **refToken**: `null` \| `string`

Defined in: [WAProto/index.d.ts:8714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8714)

WebInfo refToken.

#### Implementation of

[`IWebInfo`](../interfaces/IWebInfo.md).[`refToken`](../interfaces/IWebInfo.md#reftoken)

***

### version?

> `optional` **version**: `null` \| `string`

Defined in: [WAProto/index.d.ts:8717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8717)

WebInfo version.

#### Implementation of

[`IWebInfo`](../interfaces/IWebInfo.md).[`version`](../interfaces/IWebInfo.md#version)

***

### webdPayload?

> `optional` **webdPayload**: `null` \| [`IWebdPayload`](../namespaces/WebInfo/interfaces/IWebdPayload.md)

Defined in: [WAProto/index.d.ts:8720](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8720)

WebInfo webdPayload.

#### Implementation of

[`IWebInfo`](../interfaces/IWebInfo.md).[`webdPayload`](../interfaces/IWebInfo.md#webdpayload)

***

### webSubPlatform?

> `optional` **webSubPlatform**: `null` \| [`WebSubPlatform`](../namespaces/WebInfo/enumerations/WebSubPlatform.md)

Defined in: [WAProto/index.d.ts:8723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8723)

WebInfo webSubPlatform.

#### Implementation of

[`IWebInfo`](../interfaces/IWebInfo.md).[`webSubPlatform`](../interfaces/IWebInfo.md#websubplatform)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:8793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8793)

Converts this WebInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WebInfo`](WebInfo.md)

Defined in: [WAProto/index.d.ts:8730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8730)

Creates a new WebInfo instance using the specified properties.

#### Parameters

##### properties?

[`IWebInfo`](../interfaces/IWebInfo.md)

Properties to set

#### Returns

[`WebInfo`](WebInfo.md)

WebInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WebInfo`](WebInfo.md)

Defined in: [WAProto/index.d.ts:8756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8756)

Decodes a WebInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WebInfo`](WebInfo.md)

WebInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WebInfo`](WebInfo.md)

Defined in: [WAProto/index.d.ts:8765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8765)

Decodes a WebInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WebInfo`](WebInfo.md)

WebInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8738)

Encodes the specified WebInfo message. Does not implicitly [verify](WebInfo.md#verify) messages.

#### Parameters

##### message

[`IWebInfo`](../interfaces/IWebInfo.md)

WebInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8746)

Encodes the specified WebInfo message, length delimited. Does not implicitly [verify](WebInfo.md#verify) messages.

#### Parameters

##### message

[`IWebInfo`](../interfaces/IWebInfo.md)

WebInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WebInfo`](WebInfo.md)

Defined in: [WAProto/index.d.ts:8779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8779)

Creates a WebInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WebInfo`](WebInfo.md)

WebInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:8800](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8800)

Gets the default type url for WebInfo

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

Defined in: [WAProto/index.d.ts:8787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8787)

Creates a plain object from a WebInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`WebInfo`](WebInfo.md)

WebInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:8772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8772)

Verifies a WebInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
