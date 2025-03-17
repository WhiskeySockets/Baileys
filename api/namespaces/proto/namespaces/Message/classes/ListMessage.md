# Class: ListMessage

Defined in: [WAProto/index.d.ts:24890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24890)

Represents a ListMessage.

## Implements

- [`IListMessage`](../interfaces/IListMessage.md)

## Constructors

### new ListMessage()

> **new ListMessage**(`properties`?): [`ListMessage`](ListMessage.md)

Defined in: [WAProto/index.d.ts:24896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24896)

Constructs a new ListMessage.

#### Parameters

##### properties?

[`IListMessage`](../interfaces/IListMessage.md)

Properties to set

#### Returns

[`ListMessage`](ListMessage.md)

## Properties

### buttonText?

> `optional` **buttonText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24905](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24905)

ListMessage buttonText.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`buttonText`](../interfaces/IListMessage.md#buttontext)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:24920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24920)

ListMessage contextInfo.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`contextInfo`](../interfaces/IListMessage.md#contextinfo)

***

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24902)

ListMessage description.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`description`](../interfaces/IListMessage.md#description)

***

### footerText?

> `optional` **footerText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24917)

ListMessage footerText.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`footerText`](../interfaces/IListMessage.md#footertext)

***

### listType?

> `optional` **listType**: `null` \| [`ListType`](../namespaces/ListMessage/enumerations/ListType.md)

Defined in: [WAProto/index.d.ts:24908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24908)

ListMessage listType.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`listType`](../interfaces/IListMessage.md#listtype)

***

### productListInfo?

> `optional` **productListInfo**: `null` \| [`IProductListInfo`](../namespaces/ListMessage/interfaces/IProductListInfo.md)

Defined in: [WAProto/index.d.ts:24914](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24914)

ListMessage productListInfo.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`productListInfo`](../interfaces/IListMessage.md#productlistinfo)

***

### sections

> **sections**: [`ISection`](../namespaces/ListMessage/interfaces/ISection.md)[]

Defined in: [WAProto/index.d.ts:24911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24911)

ListMessage sections.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`sections`](../interfaces/IListMessage.md#sections)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24899](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24899)

ListMessage title.

#### Implementation of

[`IListMessage`](../interfaces/IListMessage.md).[`title`](../interfaces/IListMessage.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24990](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24990)

Converts this ListMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ListMessage`](ListMessage.md)

Defined in: [WAProto/index.d.ts:24927](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24927)

Creates a new ListMessage instance using the specified properties.

#### Parameters

##### properties?

[`IListMessage`](../interfaces/IListMessage.md)

Properties to set

#### Returns

[`ListMessage`](ListMessage.md)

ListMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ListMessage`](ListMessage.md)

Defined in: [WAProto/index.d.ts:24953](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24953)

Decodes a ListMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ListMessage`](ListMessage.md)

ListMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ListMessage`](ListMessage.md)

Defined in: [WAProto/index.d.ts:24962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24962)

Decodes a ListMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ListMessage`](ListMessage.md)

ListMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24935](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24935)

Encodes the specified ListMessage message. Does not implicitly [verify](ListMessage.md#verify) messages.

#### Parameters

##### message

[`IListMessage`](../interfaces/IListMessage.md)

ListMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24943)

Encodes the specified ListMessage message, length delimited. Does not implicitly [verify](ListMessage.md#verify) messages.

#### Parameters

##### message

[`IListMessage`](../interfaces/IListMessage.md)

ListMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ListMessage`](ListMessage.md)

Defined in: [WAProto/index.d.ts:24976](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24976)

Creates a ListMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ListMessage`](ListMessage.md)

ListMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24997)

Gets the default type url for ListMessage

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

Defined in: [WAProto/index.d.ts:24984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24984)

Creates a plain object from a ListMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ListMessage`](ListMessage.md)

ListMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:24969](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24969)

Verifies a ListMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
