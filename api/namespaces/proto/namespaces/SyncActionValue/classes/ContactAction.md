# Class: ContactAction

Defined in: [WAProto/index.d.ts:41744](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41744)

Represents a ContactAction.

## Implements

- [`IContactAction`](../interfaces/IContactAction.md)

## Constructors

### new ContactAction()

> **new ContactAction**(`properties`?): [`ContactAction`](ContactAction.md)

Defined in: [WAProto/index.d.ts:41750](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41750)

Constructs a new ContactAction.

#### Parameters

##### properties?

[`IContactAction`](../interfaces/IContactAction.md)

Properties to set

#### Returns

[`ContactAction`](ContactAction.md)

## Properties

### firstName?

> `optional` **firstName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:41756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41756)

ContactAction firstName.

#### Implementation of

[`IContactAction`](../interfaces/IContactAction.md).[`firstName`](../interfaces/IContactAction.md#firstname)

***

### fullName?

> `optional` **fullName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:41753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41753)

ContactAction fullName.

#### Implementation of

[`IContactAction`](../interfaces/IContactAction.md).[`fullName`](../interfaces/IContactAction.md#fullname)

***

### lidJid?

> `optional` **lidJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:41759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41759)

ContactAction lidJid.

#### Implementation of

[`IContactAction`](../interfaces/IContactAction.md).[`lidJid`](../interfaces/IContactAction.md#lidjid)

***

### saveOnPrimaryAddressbook?

> `optional` **saveOnPrimaryAddressbook**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:41762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41762)

ContactAction saveOnPrimaryAddressbook.

#### Implementation of

[`IContactAction`](../interfaces/IContactAction.md).[`saveOnPrimaryAddressbook`](../interfaces/IContactAction.md#saveonprimaryaddressbook)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41832](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41832)

Converts this ContactAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ContactAction`](ContactAction.md)

Defined in: [WAProto/index.d.ts:41769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41769)

Creates a new ContactAction instance using the specified properties.

#### Parameters

##### properties?

[`IContactAction`](../interfaces/IContactAction.md)

Properties to set

#### Returns

[`ContactAction`](ContactAction.md)

ContactAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ContactAction`](ContactAction.md)

Defined in: [WAProto/index.d.ts:41795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41795)

Decodes a ContactAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ContactAction`](ContactAction.md)

ContactAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ContactAction`](ContactAction.md)

Defined in: [WAProto/index.d.ts:41804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41804)

Decodes a ContactAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ContactAction`](ContactAction.md)

ContactAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41777)

Encodes the specified ContactAction message. Does not implicitly [verify](ContactAction.md#verify) messages.

#### Parameters

##### message

[`IContactAction`](../interfaces/IContactAction.md)

ContactAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41785)

Encodes the specified ContactAction message, length delimited. Does not implicitly [verify](ContactAction.md#verify) messages.

#### Parameters

##### message

[`IContactAction`](../interfaces/IContactAction.md)

ContactAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ContactAction`](ContactAction.md)

Defined in: [WAProto/index.d.ts:41818](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41818)

Creates a ContactAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ContactAction`](ContactAction.md)

ContactAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41839](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41839)

Gets the default type url for ContactAction

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

Defined in: [WAProto/index.d.ts:41826](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41826)

Creates a plain object from a ContactAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`ContactAction`](ContactAction.md)

ContactAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41811](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41811)

Verifies a ContactAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
