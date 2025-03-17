# Class: PlaceholderMessageResendResponse

Defined in: [WAProto/index.d.ts:28269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28269)

Represents a PlaceholderMessageResendResponse.

## Implements

- [`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md)

## Constructors

### new PlaceholderMessageResendResponse()

> **new PlaceholderMessageResendResponse**(`properties`?): [`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

Defined in: [WAProto/index.d.ts:28275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28275)

Constructs a new PlaceholderMessageResendResponse.

#### Parameters

##### properties?

[`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md)

Properties to set

#### Returns

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

## Properties

### webMessageInfoBytes?

> `optional` **webMessageInfoBytes**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:28278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28278)

PlaceholderMessageResendResponse webMessageInfoBytes.

#### Implementation of

[`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md).[`webMessageInfoBytes`](../interfaces/IPlaceholderMessageResendResponse.md#webmessageinfobytes)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28348)

Converts this PlaceholderMessageResendResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

Defined in: [WAProto/index.d.ts:28285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28285)

Creates a new PlaceholderMessageResendResponse instance using the specified properties.

#### Parameters

##### properties?

[`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md)

Properties to set

#### Returns

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

Defined in: [WAProto/index.d.ts:28311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28311)

Decodes a PlaceholderMessageResendResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

Defined in: [WAProto/index.d.ts:28320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28320)

Decodes a PlaceholderMessageResendResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28293](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28293)

Encodes the specified PlaceholderMessageResendResponse message. Does not implicitly [verify](PlaceholderMessageResendResponse.md#verify) messages.

#### Parameters

##### message

[`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28301)

Encodes the specified PlaceholderMessageResendResponse message, length delimited. Does not implicitly [verify](PlaceholderMessageResendResponse.md#verify) messages.

#### Parameters

##### message

[`IPlaceholderMessageResendResponse`](../interfaces/IPlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

Defined in: [WAProto/index.d.ts:28334](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28334)

Creates a PlaceholderMessageResendResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28355](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28355)

Gets the default type url for PlaceholderMessageResendResponse

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

Defined in: [WAProto/index.d.ts:28342](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28342)

Creates a plain object from a PlaceholderMessageResendResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`PlaceholderMessageResendResponse`](PlaceholderMessageResendResponse.md)

PlaceholderMessageResendResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28327)

Verifies a PlaceholderMessageResendResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
