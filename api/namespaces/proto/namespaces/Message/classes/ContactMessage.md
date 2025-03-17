# Class: ContactMessage

Defined in: [WAProto/index.d.ts:20087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20087)

Represents a ContactMessage.

## Implements

- [`IContactMessage`](../interfaces/IContactMessage.md)

## Constructors

### new ContactMessage()

> **new ContactMessage**(`properties`?): [`ContactMessage`](ContactMessage.md)

Defined in: [WAProto/index.d.ts:20093](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20093)

Constructs a new ContactMessage.

#### Parameters

##### properties?

[`IContactMessage`](../interfaces/IContactMessage.md)

Properties to set

#### Returns

[`ContactMessage`](ContactMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:20102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20102)

ContactMessage contextInfo.

#### Implementation of

[`IContactMessage`](../interfaces/IContactMessage.md).[`contextInfo`](../interfaces/IContactMessage.md#contextinfo)

***

### displayName?

> `optional` **displayName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:20096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20096)

ContactMessage displayName.

#### Implementation of

[`IContactMessage`](../interfaces/IContactMessage.md).[`displayName`](../interfaces/IContactMessage.md#displayname)

***

### vcard?

> `optional` **vcard**: `null` \| `string`

Defined in: [WAProto/index.d.ts:20099](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20099)

ContactMessage vcard.

#### Implementation of

[`IContactMessage`](../interfaces/IContactMessage.md).[`vcard`](../interfaces/IContactMessage.md#vcard)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20172](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20172)

Converts this ContactMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ContactMessage`](ContactMessage.md)

Defined in: [WAProto/index.d.ts:20109](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20109)

Creates a new ContactMessage instance using the specified properties.

#### Parameters

##### properties?

[`IContactMessage`](../interfaces/IContactMessage.md)

Properties to set

#### Returns

[`ContactMessage`](ContactMessage.md)

ContactMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ContactMessage`](ContactMessage.md)

Defined in: [WAProto/index.d.ts:20135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20135)

Decodes a ContactMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ContactMessage`](ContactMessage.md)

ContactMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ContactMessage`](ContactMessage.md)

Defined in: [WAProto/index.d.ts:20144](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20144)

Decodes a ContactMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ContactMessage`](ContactMessage.md)

ContactMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20117)

Encodes the specified ContactMessage message. Does not implicitly [verify](ContactMessage.md#verify) messages.

#### Parameters

##### message

[`IContactMessage`](../interfaces/IContactMessage.md)

ContactMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20125](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20125)

Encodes the specified ContactMessage message, length delimited. Does not implicitly [verify](ContactMessage.md#verify) messages.

#### Parameters

##### message

[`IContactMessage`](../interfaces/IContactMessage.md)

ContactMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ContactMessage`](ContactMessage.md)

Defined in: [WAProto/index.d.ts:20158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20158)

Creates a ContactMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ContactMessage`](ContactMessage.md)

ContactMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20179](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20179)

Gets the default type url for ContactMessage

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

Defined in: [WAProto/index.d.ts:20166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20166)

Creates a plain object from a ContactMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ContactMessage`](ContactMessage.md)

ContactMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20151](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20151)

Verifies a ContactMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
