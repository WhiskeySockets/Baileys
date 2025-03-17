# Class: InteractiveResponseMessage

Defined in: [WAProto/index.d.ts:24270](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24270)

Represents an InteractiveResponseMessage.

## Implements

- [`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md)

## Constructors

### new InteractiveResponseMessage()

> **new InteractiveResponseMessage**(`properties`?): [`InteractiveResponseMessage`](InteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:24276](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24276)

Constructs a new InteractiveResponseMessage.

#### Parameters

##### properties?

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md)

Properties to set

#### Returns

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

## Properties

### body?

> `optional` **body**: `null` \| [`IBody`](../namespaces/InteractiveResponseMessage/interfaces/IBody.md)

Defined in: [WAProto/index.d.ts:24279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24279)

InteractiveResponseMessage body.

#### Implementation of

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md).[`body`](../interfaces/IInteractiveResponseMessage.md#body)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:24282](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24282)

InteractiveResponseMessage contextInfo.

#### Implementation of

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md).[`contextInfo`](../interfaces/IInteractiveResponseMessage.md#contextinfo)

***

### interactiveResponseMessage?

> `optional` **interactiveResponseMessage**: `"nativeFlowResponseMessage"`

Defined in: [WAProto/index.d.ts:24288](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24288)

InteractiveResponseMessage interactiveResponseMessage.

***

### nativeFlowResponseMessage?

> `optional` **nativeFlowResponseMessage**: `null` \| [`INativeFlowResponseMessage`](../namespaces/InteractiveResponseMessage/interfaces/INativeFlowResponseMessage.md)

Defined in: [WAProto/index.d.ts:24285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24285)

InteractiveResponseMessage nativeFlowResponseMessage.

#### Implementation of

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md).[`nativeFlowResponseMessage`](../interfaces/IInteractiveResponseMessage.md#nativeflowresponsemessage)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24358](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24358)

Converts this InteractiveResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`InteractiveResponseMessage`](InteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:24295](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24295)

Creates a new InteractiveResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md)

Properties to set

#### Returns

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

InteractiveResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`InteractiveResponseMessage`](InteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:24321](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24321)

Decodes an InteractiveResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

InteractiveResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`InteractiveResponseMessage`](InteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:24330](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24330)

Decodes an InteractiveResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

InteractiveResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24303)

Encodes the specified InteractiveResponseMessage message. Does not implicitly [verify](InteractiveResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md)

InteractiveResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24311)

Encodes the specified InteractiveResponseMessage message, length delimited. Does not implicitly [verify](InteractiveResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IInteractiveResponseMessage`](../interfaces/IInteractiveResponseMessage.md)

InteractiveResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`InteractiveResponseMessage`](InteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:24344](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24344)

Creates an InteractiveResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

InteractiveResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24365](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24365)

Gets the default type url for InteractiveResponseMessage

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

Defined in: [WAProto/index.d.ts:24352](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24352)

Creates a plain object from an InteractiveResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`InteractiveResponseMessage`](InteractiveResponseMessage.md)

InteractiveResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:24337](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24337)

Verifies an InteractiveResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
