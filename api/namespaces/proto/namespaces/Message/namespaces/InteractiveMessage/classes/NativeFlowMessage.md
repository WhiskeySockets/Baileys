# Class: NativeFlowMessage

Defined in: [WAProto/index.d.ts:23934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23934)

Represents a NativeFlowMessage.

## Implements

- [`INativeFlowMessage`](../interfaces/INativeFlowMessage.md)

## Constructors

### new NativeFlowMessage()

> **new NativeFlowMessage**(`properties`?): [`NativeFlowMessage`](NativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:23940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23940)

Constructs a new NativeFlowMessage.

#### Parameters

##### properties?

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md)

Properties to set

#### Returns

[`NativeFlowMessage`](NativeFlowMessage.md)

## Properties

### buttons

> **buttons**: [`INativeFlowButton`](../namespaces/NativeFlowMessage/interfaces/INativeFlowButton.md)[]

Defined in: [WAProto/index.d.ts:23943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23943)

NativeFlowMessage buttons.

#### Implementation of

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md).[`buttons`](../interfaces/INativeFlowMessage.md#buttons)

***

### messageParamsJson?

> `optional` **messageParamsJson**: `null` \| `string`

Defined in: [WAProto/index.d.ts:23946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23946)

NativeFlowMessage messageParamsJson.

#### Implementation of

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md).[`messageParamsJson`](../interfaces/INativeFlowMessage.md#messageparamsjson)

***

### messageVersion?

> `optional` **messageVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:23949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23949)

NativeFlowMessage messageVersion.

#### Implementation of

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md).[`messageVersion`](../interfaces/INativeFlowMessage.md#messageversion)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24019)

Converts this NativeFlowMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NativeFlowMessage`](NativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:23956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23956)

Creates a new NativeFlowMessage instance using the specified properties.

#### Parameters

##### properties?

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md)

Properties to set

#### Returns

[`NativeFlowMessage`](NativeFlowMessage.md)

NativeFlowMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NativeFlowMessage`](NativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:23982](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23982)

Decodes a NativeFlowMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NativeFlowMessage`](NativeFlowMessage.md)

NativeFlowMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NativeFlowMessage`](NativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:23991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23991)

Decodes a NativeFlowMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NativeFlowMessage`](NativeFlowMessage.md)

NativeFlowMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23964)

Encodes the specified NativeFlowMessage message. Does not implicitly [verify](NativeFlowMessage.md#verify) messages.

#### Parameters

##### message

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md)

NativeFlowMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23972)

Encodes the specified NativeFlowMessage message, length delimited. Does not implicitly [verify](NativeFlowMessage.md#verify) messages.

#### Parameters

##### message

[`INativeFlowMessage`](../interfaces/INativeFlowMessage.md)

NativeFlowMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NativeFlowMessage`](NativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:24005](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24005)

Creates a NativeFlowMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NativeFlowMessage`](NativeFlowMessage.md)

NativeFlowMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24026)

Gets the default type url for NativeFlowMessage

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

Defined in: [WAProto/index.d.ts:24013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24013)

Creates a plain object from a NativeFlowMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`NativeFlowMessage`](NativeFlowMessage.md)

NativeFlowMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:23998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23998)

Verifies a NativeFlowMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
