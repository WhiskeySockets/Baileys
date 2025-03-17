# Class: TemplateMessage

Defined in: [WAProto/index.d.ts:32188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32188)

Represents a TemplateMessage.

## Implements

- [`ITemplateMessage`](../interfaces/ITemplateMessage.md)

## Constructors

### new TemplateMessage()

> **new TemplateMessage**(`properties`?): [`TemplateMessage`](TemplateMessage.md)

Defined in: [WAProto/index.d.ts:32194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32194)

Constructs a new TemplateMessage.

#### Parameters

##### properties?

[`ITemplateMessage`](../interfaces/ITemplateMessage.md)

Properties to set

#### Returns

[`TemplateMessage`](TemplateMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:32197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32197)

TemplateMessage contextInfo.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`contextInfo`](../interfaces/ITemplateMessage.md#contextinfo)

***

### format?

> `optional` **format**: `"hydratedFourRowTemplate"` \| `"fourRowTemplate"` \| `"interactiveMessageTemplate"`

Defined in: [WAProto/index.d.ts:32215](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32215)

TemplateMessage format.

***

### fourRowTemplate?

> `optional` **fourRowTemplate**: `null` \| [`IFourRowTemplate`](../namespaces/TemplateMessage/interfaces/IFourRowTemplate.md)

Defined in: [WAProto/index.d.ts:32206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32206)

TemplateMessage fourRowTemplate.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`fourRowTemplate`](../interfaces/ITemplateMessage.md#fourrowtemplate)

***

### hydratedFourRowTemplate?

> `optional` **hydratedFourRowTemplate**: `null` \| [`IHydratedFourRowTemplate`](../namespaces/TemplateMessage/interfaces/IHydratedFourRowTemplate.md)

Defined in: [WAProto/index.d.ts:32209](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32209)

TemplateMessage hydratedFourRowTemplate.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`hydratedFourRowTemplate`](../interfaces/ITemplateMessage.md#hydratedfourrowtemplate)

***

### hydratedTemplate?

> `optional` **hydratedTemplate**: `null` \| [`IHydratedFourRowTemplate`](../namespaces/TemplateMessage/interfaces/IHydratedFourRowTemplate.md)

Defined in: [WAProto/index.d.ts:32200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32200)

TemplateMessage hydratedTemplate.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`hydratedTemplate`](../interfaces/ITemplateMessage.md#hydratedtemplate)

***

### interactiveMessageTemplate?

> `optional` **interactiveMessageTemplate**: `null` \| [`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

Defined in: [WAProto/index.d.ts:32212](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32212)

TemplateMessage interactiveMessageTemplate.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`interactiveMessageTemplate`](../interfaces/ITemplateMessage.md#interactivemessagetemplate)

***

### templateId?

> `optional` **templateId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:32203](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32203)

TemplateMessage templateId.

#### Implementation of

[`ITemplateMessage`](../interfaces/ITemplateMessage.md).[`templateId`](../interfaces/ITemplateMessage.md#templateid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:32285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32285)

Converts this TemplateMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TemplateMessage`](TemplateMessage.md)

Defined in: [WAProto/index.d.ts:32222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32222)

Creates a new TemplateMessage instance using the specified properties.

#### Parameters

##### properties?

[`ITemplateMessage`](../interfaces/ITemplateMessage.md)

Properties to set

#### Returns

[`TemplateMessage`](TemplateMessage.md)

TemplateMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TemplateMessage`](TemplateMessage.md)

Defined in: [WAProto/index.d.ts:32248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32248)

Decodes a TemplateMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TemplateMessage`](TemplateMessage.md)

TemplateMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TemplateMessage`](TemplateMessage.md)

Defined in: [WAProto/index.d.ts:32257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32257)

Decodes a TemplateMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TemplateMessage`](TemplateMessage.md)

TemplateMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32230)

Encodes the specified TemplateMessage message. Does not implicitly [verify](TemplateMessage.md#verify) messages.

#### Parameters

##### message

[`ITemplateMessage`](../interfaces/ITemplateMessage.md)

TemplateMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32238)

Encodes the specified TemplateMessage message, length delimited. Does not implicitly [verify](TemplateMessage.md#verify) messages.

#### Parameters

##### message

[`ITemplateMessage`](../interfaces/ITemplateMessage.md)

TemplateMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TemplateMessage`](TemplateMessage.md)

Defined in: [WAProto/index.d.ts:32271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32271)

Creates a TemplateMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TemplateMessage`](TemplateMessage.md)

TemplateMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:32292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32292)

Gets the default type url for TemplateMessage

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

Defined in: [WAProto/index.d.ts:32279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32279)

Creates a plain object from a TemplateMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`TemplateMessage`](TemplateMessage.md)

TemplateMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:32264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32264)

Verifies a TemplateMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
