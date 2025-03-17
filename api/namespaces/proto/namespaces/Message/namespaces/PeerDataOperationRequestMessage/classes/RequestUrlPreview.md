# Class: RequestUrlPreview

Defined in: [WAProto/index.d.ts:27442](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27442)

Represents a RequestUrlPreview.

## Implements

- [`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md)

## Constructors

### new RequestUrlPreview()

> **new RequestUrlPreview**(`properties`?): [`RequestUrlPreview`](RequestUrlPreview.md)

Defined in: [WAProto/index.d.ts:27448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27448)

Constructs a new RequestUrlPreview.

#### Parameters

##### properties?

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md)

Properties to set

#### Returns

[`RequestUrlPreview`](RequestUrlPreview.md)

## Properties

### includeHqThumbnail?

> `optional` **includeHqThumbnail**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:27454](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27454)

RequestUrlPreview includeHqThumbnail.

#### Implementation of

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md).[`includeHqThumbnail`](../interfaces/IRequestUrlPreview.md#includehqthumbnail)

***

### url?

> `optional` **url**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27451](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27451)

RequestUrlPreview url.

#### Implementation of

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md).[`url`](../interfaces/IRequestUrlPreview.md#url)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27524](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27524)

Converts this RequestUrlPreview to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RequestUrlPreview`](RequestUrlPreview.md)

Defined in: [WAProto/index.d.ts:27461](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27461)

Creates a new RequestUrlPreview instance using the specified properties.

#### Parameters

##### properties?

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md)

Properties to set

#### Returns

[`RequestUrlPreview`](RequestUrlPreview.md)

RequestUrlPreview instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RequestUrlPreview`](RequestUrlPreview.md)

Defined in: [WAProto/index.d.ts:27487](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27487)

Decodes a RequestUrlPreview message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RequestUrlPreview`](RequestUrlPreview.md)

RequestUrlPreview

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RequestUrlPreview`](RequestUrlPreview.md)

Defined in: [WAProto/index.d.ts:27496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27496)

Decodes a RequestUrlPreview message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RequestUrlPreview`](RequestUrlPreview.md)

RequestUrlPreview

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27469)

Encodes the specified RequestUrlPreview message. Does not implicitly [verify](RequestUrlPreview.md#verify) messages.

#### Parameters

##### message

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md)

RequestUrlPreview message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27477](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27477)

Encodes the specified RequestUrlPreview message, length delimited. Does not implicitly [verify](RequestUrlPreview.md#verify) messages.

#### Parameters

##### message

[`IRequestUrlPreview`](../interfaces/IRequestUrlPreview.md)

RequestUrlPreview message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RequestUrlPreview`](RequestUrlPreview.md)

Defined in: [WAProto/index.d.ts:27510](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27510)

Creates a RequestUrlPreview message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RequestUrlPreview`](RequestUrlPreview.md)

RequestUrlPreview

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27531](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27531)

Gets the default type url for RequestUrlPreview

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

Defined in: [WAProto/index.d.ts:27518](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27518)

Creates a plain object from a RequestUrlPreview message. Also converts values to other types if specified.

#### Parameters

##### message

[`RequestUrlPreview`](RequestUrlPreview.md)

RequestUrlPreview

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27503](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27503)

Verifies a RequestUrlPreview message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
