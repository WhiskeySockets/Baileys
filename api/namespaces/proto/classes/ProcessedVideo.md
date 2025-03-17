# Class: ProcessedVideo

Defined in: [WAProto/index.d.ts:37341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37341)

Represents a ProcessedVideo.

## Implements

- [`IProcessedVideo`](../interfaces/IProcessedVideo.md)

## Constructors

### new ProcessedVideo()

> **new ProcessedVideo**(`properties`?): [`ProcessedVideo`](ProcessedVideo.md)

Defined in: [WAProto/index.d.ts:37347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37347)

Constructs a new ProcessedVideo.

#### Parameters

##### properties?

[`IProcessedVideo`](../interfaces/IProcessedVideo.md)

Properties to set

#### Returns

[`ProcessedVideo`](ProcessedVideo.md)

## Properties

### bitrate?

> `optional` **bitrate**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37365](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37365)

ProcessedVideo bitrate.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`bitrate`](../interfaces/IProcessedVideo.md#bitrate)

***

### capabilities

> **capabilities**: `string`[]

Defined in: [WAProto/index.d.ts:37371](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37371)

ProcessedVideo capabilities.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`capabilities`](../interfaces/IProcessedVideo.md#capabilities)

***

### directPath?

> `optional` **directPath**: `null` \| `string`

Defined in: [WAProto/index.d.ts:37350](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37350)

ProcessedVideo directPath.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`directPath`](../interfaces/IProcessedVideo.md#directpath)

***

### fileLength?

> `optional` **fileLength**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:37362](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37362)

ProcessedVideo fileLength.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`fileLength`](../interfaces/IProcessedVideo.md#filelength)

***

### fileSha256?

> `optional` **fileSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:37353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37353)

ProcessedVideo fileSha256.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`fileSha256`](../interfaces/IProcessedVideo.md#filesha256)

***

### height?

> `optional` **height**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37356](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37356)

ProcessedVideo height.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`height`](../interfaces/IProcessedVideo.md#height)

***

### quality?

> `optional` **quality**: `null` \| [`VideoQuality`](../namespaces/ProcessedVideo/enumerations/VideoQuality.md)

Defined in: [WAProto/index.d.ts:37368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37368)

ProcessedVideo quality.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`quality`](../interfaces/IProcessedVideo.md#quality)

***

### width?

> `optional` **width**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37359](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37359)

ProcessedVideo width.

#### Implementation of

[`IProcessedVideo`](../interfaces/IProcessedVideo.md).[`width`](../interfaces/IProcessedVideo.md#width)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37441)

Converts this ProcessedVideo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProcessedVideo`](ProcessedVideo.md)

Defined in: [WAProto/index.d.ts:37378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37378)

Creates a new ProcessedVideo instance using the specified properties.

#### Parameters

##### properties?

[`IProcessedVideo`](../interfaces/IProcessedVideo.md)

Properties to set

#### Returns

[`ProcessedVideo`](ProcessedVideo.md)

ProcessedVideo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProcessedVideo`](ProcessedVideo.md)

Defined in: [WAProto/index.d.ts:37404](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37404)

Decodes a ProcessedVideo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProcessedVideo`](ProcessedVideo.md)

ProcessedVideo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProcessedVideo`](ProcessedVideo.md)

Defined in: [WAProto/index.d.ts:37413](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37413)

Decodes a ProcessedVideo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProcessedVideo`](ProcessedVideo.md)

ProcessedVideo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37386)

Encodes the specified ProcessedVideo message. Does not implicitly [verify](ProcessedVideo.md#verify) messages.

#### Parameters

##### message

[`IProcessedVideo`](../interfaces/IProcessedVideo.md)

ProcessedVideo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37394](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37394)

Encodes the specified ProcessedVideo message, length delimited. Does not implicitly [verify](ProcessedVideo.md#verify) messages.

#### Parameters

##### message

[`IProcessedVideo`](../interfaces/IProcessedVideo.md)

ProcessedVideo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProcessedVideo`](ProcessedVideo.md)

Defined in: [WAProto/index.d.ts:37427](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37427)

Creates a ProcessedVideo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProcessedVideo`](ProcessedVideo.md)

ProcessedVideo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37448)

Gets the default type url for ProcessedVideo

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

Defined in: [WAProto/index.d.ts:37435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37435)

Creates a plain object from a ProcessedVideo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProcessedVideo`](ProcessedVideo.md)

ProcessedVideo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37420](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37420)

Verifies a ProcessedVideo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
