# Class: ForwardedNewsletterMessageInfo

Defined in: [WAProto/index.d.ts:10675](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10675)

Represents a ForwardedNewsletterMessageInfo.

## Implements

- [`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md)

## Constructors

### new ForwardedNewsletterMessageInfo()

> **new ForwardedNewsletterMessageInfo**(`properties`?): [`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:10681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10681)

Constructs a new ForwardedNewsletterMessageInfo.

#### Parameters

##### properties?

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md)

Properties to set

#### Returns

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

## Properties

### accessibilityText?

> `optional` **accessibilityText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10696)

ForwardedNewsletterMessageInfo accessibilityText.

#### Implementation of

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md).[`accessibilityText`](../interfaces/IForwardedNewsletterMessageInfo.md#accessibilitytext)

***

### contentType?

> `optional` **contentType**: `null` \| [`ContentType`](../namespaces/ForwardedNewsletterMessageInfo/enumerations/ContentType.md)

Defined in: [WAProto/index.d.ts:10693](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10693)

ForwardedNewsletterMessageInfo contentType.

#### Implementation of

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md).[`contentType`](../interfaces/IForwardedNewsletterMessageInfo.md#contenttype)

***

### newsletterJid?

> `optional` **newsletterJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10684](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10684)

ForwardedNewsletterMessageInfo newsletterJid.

#### Implementation of

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md).[`newsletterJid`](../interfaces/IForwardedNewsletterMessageInfo.md#newsletterjid)

***

### newsletterName?

> `optional` **newsletterName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10690)

ForwardedNewsletterMessageInfo newsletterName.

#### Implementation of

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md).[`newsletterName`](../interfaces/IForwardedNewsletterMessageInfo.md#newslettername)

***

### serverMessageId?

> `optional` **serverMessageId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:10687](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10687)

ForwardedNewsletterMessageInfo serverMessageId.

#### Implementation of

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md).[`serverMessageId`](../interfaces/IForwardedNewsletterMessageInfo.md#servermessageid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:10766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10766)

Converts this ForwardedNewsletterMessageInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:10703](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10703)

Creates a new ForwardedNewsletterMessageInfo instance using the specified properties.

#### Parameters

##### properties?

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md)

Properties to set

#### Returns

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:10729](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10729)

Decodes a ForwardedNewsletterMessageInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:10738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10738)

Decodes a ForwardedNewsletterMessageInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10711)

Encodes the specified ForwardedNewsletterMessageInfo message. Does not implicitly [verify](ForwardedNewsletterMessageInfo.md#verify) messages.

#### Parameters

##### message

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10719](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10719)

Encodes the specified ForwardedNewsletterMessageInfo message, length delimited. Does not implicitly [verify](ForwardedNewsletterMessageInfo.md#verify) messages.

#### Parameters

##### message

[`IForwardedNewsletterMessageInfo`](../interfaces/IForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:10752](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10752)

Creates a ForwardedNewsletterMessageInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:10773](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10773)

Gets the default type url for ForwardedNewsletterMessageInfo

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

Defined in: [WAProto/index.d.ts:10760](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10760)

Creates a plain object from a ForwardedNewsletterMessageInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ForwardedNewsletterMessageInfo`](ForwardedNewsletterMessageInfo.md)

ForwardedNewsletterMessageInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:10745](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10745)

Verifies a ForwardedNewsletterMessageInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
