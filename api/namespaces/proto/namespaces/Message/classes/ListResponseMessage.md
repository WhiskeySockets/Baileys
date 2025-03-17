# Class: ListResponseMessage

Defined in: [WAProto/index.d.ts:25654](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25654)

Represents a ListResponseMessage.

## Implements

- [`IListResponseMessage`](../interfaces/IListResponseMessage.md)

## Constructors

### new ListResponseMessage()

> **new ListResponseMessage**(`properties`?): [`ListResponseMessage`](ListResponseMessage.md)

Defined in: [WAProto/index.d.ts:25660](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25660)

Constructs a new ListResponseMessage.

#### Parameters

##### properties?

[`IListResponseMessage`](../interfaces/IListResponseMessage.md)

Properties to set

#### Returns

[`ListResponseMessage`](ListResponseMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:25672](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25672)

ListResponseMessage contextInfo.

#### Implementation of

[`IListResponseMessage`](../interfaces/IListResponseMessage.md).[`contextInfo`](../interfaces/IListResponseMessage.md#contextinfo)

***

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25675](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25675)

ListResponseMessage description.

#### Implementation of

[`IListResponseMessage`](../interfaces/IListResponseMessage.md).[`description`](../interfaces/IListResponseMessage.md#description)

***

### listType?

> `optional` **listType**: `null` \| [`ListType`](../namespaces/ListResponseMessage/enumerations/ListType.md)

Defined in: [WAProto/index.d.ts:25666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25666)

ListResponseMessage listType.

#### Implementation of

[`IListResponseMessage`](../interfaces/IListResponseMessage.md).[`listType`](../interfaces/IListResponseMessage.md#listtype)

***

### singleSelectReply?

> `optional` **singleSelectReply**: `null` \| [`ISingleSelectReply`](../namespaces/ListResponseMessage/interfaces/ISingleSelectReply.md)

Defined in: [WAProto/index.d.ts:25669](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25669)

ListResponseMessage singleSelectReply.

#### Implementation of

[`IListResponseMessage`](../interfaces/IListResponseMessage.md).[`singleSelectReply`](../interfaces/IListResponseMessage.md#singleselectreply)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25663](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25663)

ListResponseMessage title.

#### Implementation of

[`IListResponseMessage`](../interfaces/IListResponseMessage.md).[`title`](../interfaces/IListResponseMessage.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:25745](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25745)

Converts this ListResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ListResponseMessage`](ListResponseMessage.md)

Defined in: [WAProto/index.d.ts:25682](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25682)

Creates a new ListResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IListResponseMessage`](../interfaces/IListResponseMessage.md)

Properties to set

#### Returns

[`ListResponseMessage`](ListResponseMessage.md)

ListResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ListResponseMessage`](ListResponseMessage.md)

Defined in: [WAProto/index.d.ts:25708](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25708)

Decodes a ListResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ListResponseMessage`](ListResponseMessage.md)

ListResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ListResponseMessage`](ListResponseMessage.md)

Defined in: [WAProto/index.d.ts:25717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25717)

Decodes a ListResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ListResponseMessage`](ListResponseMessage.md)

ListResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25690)

Encodes the specified ListResponseMessage message. Does not implicitly [verify](ListResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IListResponseMessage`](../interfaces/IListResponseMessage.md)

ListResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25698](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25698)

Encodes the specified ListResponseMessage message, length delimited. Does not implicitly [verify](ListResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IListResponseMessage`](../interfaces/IListResponseMessage.md)

ListResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ListResponseMessage`](ListResponseMessage.md)

Defined in: [WAProto/index.d.ts:25731](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25731)

Creates a ListResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ListResponseMessage`](ListResponseMessage.md)

ListResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:25752](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25752)

Gets the default type url for ListResponseMessage

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

Defined in: [WAProto/index.d.ts:25739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25739)

Creates a plain object from a ListResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ListResponseMessage`](ListResponseMessage.md)

ListResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25724](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25724)

Verifies a ListResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
