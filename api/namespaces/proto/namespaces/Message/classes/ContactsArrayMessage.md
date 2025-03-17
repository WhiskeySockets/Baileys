# Class: ContactsArrayMessage

Defined in: [WAProto/index.d.ts:20196](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20196)

Represents a ContactsArrayMessage.

## Implements

- [`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md)

## Constructors

### new ContactsArrayMessage()

> **new ContactsArrayMessage**(`properties`?): [`ContactsArrayMessage`](ContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:20202](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20202)

Constructs a new ContactsArrayMessage.

#### Parameters

##### properties?

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md)

Properties to set

#### Returns

[`ContactsArrayMessage`](ContactsArrayMessage.md)

## Properties

### contacts

> **contacts**: [`IContactMessage`](../interfaces/IContactMessage.md)[]

Defined in: [WAProto/index.d.ts:20208](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20208)

ContactsArrayMessage contacts.

#### Implementation of

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md).[`contacts`](../interfaces/IContactsArrayMessage.md#contacts)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:20211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20211)

ContactsArrayMessage contextInfo.

#### Implementation of

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md).[`contextInfo`](../interfaces/IContactsArrayMessage.md#contextinfo)

***

### displayName?

> `optional` **displayName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:20205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20205)

ContactsArrayMessage displayName.

#### Implementation of

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md).[`displayName`](../interfaces/IContactsArrayMessage.md#displayname)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20281)

Converts this ContactsArrayMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ContactsArrayMessage`](ContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:20218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20218)

Creates a new ContactsArrayMessage instance using the specified properties.

#### Parameters

##### properties?

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md)

Properties to set

#### Returns

[`ContactsArrayMessage`](ContactsArrayMessage.md)

ContactsArrayMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ContactsArrayMessage`](ContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:20244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20244)

Decodes a ContactsArrayMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ContactsArrayMessage`](ContactsArrayMessage.md)

ContactsArrayMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ContactsArrayMessage`](ContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:20253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20253)

Decodes a ContactsArrayMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ContactsArrayMessage`](ContactsArrayMessage.md)

ContactsArrayMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20226](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20226)

Encodes the specified ContactsArrayMessage message. Does not implicitly [verify](ContactsArrayMessage.md#verify) messages.

#### Parameters

##### message

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md)

ContactsArrayMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20234](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20234)

Encodes the specified ContactsArrayMessage message, length delimited. Does not implicitly [verify](ContactsArrayMessage.md#verify) messages.

#### Parameters

##### message

[`IContactsArrayMessage`](../interfaces/IContactsArrayMessage.md)

ContactsArrayMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ContactsArrayMessage`](ContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:20267](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20267)

Creates a ContactsArrayMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ContactsArrayMessage`](ContactsArrayMessage.md)

ContactsArrayMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20288](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20288)

Gets the default type url for ContactsArrayMessage

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

Defined in: [WAProto/index.d.ts:20275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20275)

Creates a plain object from a ContactsArrayMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ContactsArrayMessage`](ContactsArrayMessage.md)

ContactsArrayMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20260](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20260)

Verifies a ContactsArrayMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
