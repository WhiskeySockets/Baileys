# Class: TemplateButtonReplyMessage

Defined in: [WAProto/index.d.ts:32064](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32064)

Represents a TemplateButtonReplyMessage.

## Implements

- [`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md)

## Constructors

### new TemplateButtonReplyMessage()

> **new TemplateButtonReplyMessage**(`properties`?): [`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:32070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32070)

Constructs a new TemplateButtonReplyMessage.

#### Parameters

##### properties?

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md)

Properties to set

#### Returns

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:32079](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32079)

TemplateButtonReplyMessage contextInfo.

#### Implementation of

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md).[`contextInfo`](../interfaces/ITemplateButtonReplyMessage.md#contextinfo)

***

### selectedCarouselCardIndex?

> `optional` **selectedCarouselCardIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:32085](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32085)

TemplateButtonReplyMessage selectedCarouselCardIndex.

#### Implementation of

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md).[`selectedCarouselCardIndex`](../interfaces/ITemplateButtonReplyMessage.md#selectedcarouselcardindex)

***

### selectedDisplayText?

> `optional` **selectedDisplayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:32076](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32076)

TemplateButtonReplyMessage selectedDisplayText.

#### Implementation of

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md).[`selectedDisplayText`](../interfaces/ITemplateButtonReplyMessage.md#selecteddisplaytext)

***

### selectedId?

> `optional` **selectedId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:32073](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32073)

TemplateButtonReplyMessage selectedId.

#### Implementation of

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md).[`selectedId`](../interfaces/ITemplateButtonReplyMessage.md#selectedid)

***

### selectedIndex?

> `optional` **selectedIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:32082](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32082)

TemplateButtonReplyMessage selectedIndex.

#### Implementation of

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md).[`selectedIndex`](../interfaces/ITemplateButtonReplyMessage.md#selectedindex)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:32155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32155)

Converts this TemplateButtonReplyMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:32092](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32092)

Creates a new TemplateButtonReplyMessage instance using the specified properties.

#### Parameters

##### properties?

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md)

Properties to set

#### Returns

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

TemplateButtonReplyMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:32118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32118)

Decodes a TemplateButtonReplyMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

TemplateButtonReplyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:32127](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32127)

Decodes a TemplateButtonReplyMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

TemplateButtonReplyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32100)

Encodes the specified TemplateButtonReplyMessage message. Does not implicitly [verify](TemplateButtonReplyMessage.md#verify) messages.

#### Parameters

##### message

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md)

TemplateButtonReplyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32108)

Encodes the specified TemplateButtonReplyMessage message, length delimited. Does not implicitly [verify](TemplateButtonReplyMessage.md#verify) messages.

#### Parameters

##### message

[`ITemplateButtonReplyMessage`](../interfaces/ITemplateButtonReplyMessage.md)

TemplateButtonReplyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:32141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32141)

Creates a TemplateButtonReplyMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

TemplateButtonReplyMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:32162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32162)

Gets the default type url for TemplateButtonReplyMessage

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

Defined in: [WAProto/index.d.ts:32149](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32149)

Creates a plain object from a TemplateButtonReplyMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`TemplateButtonReplyMessage`](TemplateButtonReplyMessage.md)

TemplateButtonReplyMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:32134](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32134)

Verifies a TemplateButtonReplyMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
