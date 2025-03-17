# Class: NewsletterAdminInviteMessage

Defined in: [WAProto/index.d.ts:26470](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26470)

Represents a NewsletterAdminInviteMessage.

## Implements

- [`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md)

## Constructors

### new NewsletterAdminInviteMessage()

> **new NewsletterAdminInviteMessage**(`properties`?): [`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:26476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26476)

Constructs a new NewsletterAdminInviteMessage.

#### Parameters

##### properties?

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md)

Properties to set

#### Returns

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

## Properties

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26488](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26488)

NewsletterAdminInviteMessage caption.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`caption`](../interfaces/INewsletterAdminInviteMessage.md#caption)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:26494](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26494)

NewsletterAdminInviteMessage contextInfo.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`contextInfo`](../interfaces/INewsletterAdminInviteMessage.md#contextinfo)

***

### inviteExpiration?

> `optional` **inviteExpiration**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:26491](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26491)

NewsletterAdminInviteMessage inviteExpiration.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`inviteExpiration`](../interfaces/INewsletterAdminInviteMessage.md#inviteexpiration)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26485)

NewsletterAdminInviteMessage jpegThumbnail.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`jpegThumbnail`](../interfaces/INewsletterAdminInviteMessage.md#jpegthumbnail)

***

### newsletterJid?

> `optional` **newsletterJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26479](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26479)

NewsletterAdminInviteMessage newsletterJid.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`newsletterJid`](../interfaces/INewsletterAdminInviteMessage.md#newsletterjid)

***

### newsletterName?

> `optional` **newsletterName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26482](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26482)

NewsletterAdminInviteMessage newsletterName.

#### Implementation of

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md).[`newsletterName`](../interfaces/INewsletterAdminInviteMessage.md#newslettername)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26564)

Converts this NewsletterAdminInviteMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:26501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26501)

Creates a new NewsletterAdminInviteMessage instance using the specified properties.

#### Parameters

##### properties?

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md)

Properties to set

#### Returns

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:26527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26527)

Decodes a NewsletterAdminInviteMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:26536](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26536)

Decodes a NewsletterAdminInviteMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26509)

Encodes the specified NewsletterAdminInviteMessage message. Does not implicitly [verify](NewsletterAdminInviteMessage.md#verify) messages.

#### Parameters

##### message

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26517)

Encodes the specified NewsletterAdminInviteMessage message, length delimited. Does not implicitly [verify](NewsletterAdminInviteMessage.md#verify) messages.

#### Parameters

##### message

[`INewsletterAdminInviteMessage`](../interfaces/INewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:26550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26550)

Creates a NewsletterAdminInviteMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26571)

Gets the default type url for NewsletterAdminInviteMessage

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

Defined in: [WAProto/index.d.ts:26558](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26558)

Creates a plain object from a NewsletterAdminInviteMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`NewsletterAdminInviteMessage`](NewsletterAdminInviteMessage.md)

NewsletterAdminInviteMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26543](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26543)

Verifies a NewsletterAdminInviteMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
