# Class: ButtonsMessage

Defined in: [WAProto/index.d.ts:18687](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18687)

Represents a ButtonsMessage.

## Implements

- [`IButtonsMessage`](../interfaces/IButtonsMessage.md)

## Constructors

### new ButtonsMessage()

> **new ButtonsMessage**(`properties`?): [`ButtonsMessage`](ButtonsMessage.md)

Defined in: [WAProto/index.d.ts:18693](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18693)

Constructs a new ButtonsMessage.

#### Parameters

##### properties?

[`IButtonsMessage`](../interfaces/IButtonsMessage.md)

Properties to set

#### Returns

[`ButtonsMessage`](ButtonsMessage.md)

## Properties

### buttons

> **buttons**: [`IButton`](../namespaces/ButtonsMessage/interfaces/IButton.md)[]

Defined in: [WAProto/index.d.ts:18705](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18705)

ButtonsMessage buttons.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`buttons`](../interfaces/IButtonsMessage.md#buttons)

***

### contentText?

> `optional` **contentText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18696)

ButtonsMessage contentText.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`contentText`](../interfaces/IButtonsMessage.md#contenttext)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:18702](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18702)

ButtonsMessage contextInfo.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`contextInfo`](../interfaces/IButtonsMessage.md#contextinfo)

***

### documentMessage?

> `optional` **documentMessage**: `null` \| [`IDocumentMessage`](../interfaces/IDocumentMessage.md)

Defined in: [WAProto/index.d.ts:18714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18714)

ButtonsMessage documentMessage.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`documentMessage`](../interfaces/IButtonsMessage.md#documentmessage)

***

### footerText?

> `optional` **footerText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18699](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18699)

ButtonsMessage footerText.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`footerText`](../interfaces/IButtonsMessage.md#footertext)

***

### header?

> `optional` **header**: `"text"` \| `"imageMessage"` \| `"locationMessage"` \| `"documentMessage"` \| `"videoMessage"`

Defined in: [WAProto/index.d.ts:18726](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18726)

ButtonsMessage header.

***

### headerType?

> `optional` **headerType**: `null` \| [`HeaderType`](../namespaces/ButtonsMessage/enumerations/HeaderType.md)

Defined in: [WAProto/index.d.ts:18708](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18708)

ButtonsMessage headerType.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`headerType`](../interfaces/IButtonsMessage.md#headertype)

***

### imageMessage?

> `optional` **imageMessage**: `null` \| [`IImageMessage`](../interfaces/IImageMessage.md)

Defined in: [WAProto/index.d.ts:18717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18717)

ButtonsMessage imageMessage.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`imageMessage`](../interfaces/IButtonsMessage.md#imagemessage)

***

### locationMessage?

> `optional` **locationMessage**: `null` \| [`ILocationMessage`](../interfaces/ILocationMessage.md)

Defined in: [WAProto/index.d.ts:18723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18723)

ButtonsMessage locationMessage.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`locationMessage`](../interfaces/IButtonsMessage.md#locationmessage)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18711)

ButtonsMessage text.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`text`](../interfaces/IButtonsMessage.md#text)

***

### videoMessage?

> `optional` **videoMessage**: `null` \| [`IVideoMessage`](../interfaces/IVideoMessage.md)

Defined in: [WAProto/index.d.ts:18720](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18720)

ButtonsMessage videoMessage.

#### Implementation of

[`IButtonsMessage`](../interfaces/IButtonsMessage.md).[`videoMessage`](../interfaces/IButtonsMessage.md#videomessage)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18796)

Converts this ButtonsMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ButtonsMessage`](ButtonsMessage.md)

Defined in: [WAProto/index.d.ts:18733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18733)

Creates a new ButtonsMessage instance using the specified properties.

#### Parameters

##### properties?

[`IButtonsMessage`](../interfaces/IButtonsMessage.md)

Properties to set

#### Returns

[`ButtonsMessage`](ButtonsMessage.md)

ButtonsMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ButtonsMessage`](ButtonsMessage.md)

Defined in: [WAProto/index.d.ts:18759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18759)

Decodes a ButtonsMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ButtonsMessage`](ButtonsMessage.md)

ButtonsMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ButtonsMessage`](ButtonsMessage.md)

Defined in: [WAProto/index.d.ts:18768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18768)

Decodes a ButtonsMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ButtonsMessage`](ButtonsMessage.md)

ButtonsMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18741](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18741)

Encodes the specified ButtonsMessage message. Does not implicitly [verify](ButtonsMessage.md#verify) messages.

#### Parameters

##### message

[`IButtonsMessage`](../interfaces/IButtonsMessage.md)

ButtonsMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18749)

Encodes the specified ButtonsMessage message, length delimited. Does not implicitly [verify](ButtonsMessage.md#verify) messages.

#### Parameters

##### message

[`IButtonsMessage`](../interfaces/IButtonsMessage.md)

ButtonsMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ButtonsMessage`](ButtonsMessage.md)

Defined in: [WAProto/index.d.ts:18782](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18782)

Creates a ButtonsMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ButtonsMessage`](ButtonsMessage.md)

ButtonsMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18803)

Gets the default type url for ButtonsMessage

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

Defined in: [WAProto/index.d.ts:18790](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18790)

Creates a plain object from a ButtonsMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ButtonsMessage`](ButtonsMessage.md)

ButtonsMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18775)

Verifies a ButtonsMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
