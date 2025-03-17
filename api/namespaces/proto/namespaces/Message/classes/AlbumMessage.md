# Class: AlbumMessage

Defined in: [WAProto/index.d.ts:17360](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17360)

Represents an AlbumMessage.

## Implements

- [`IAlbumMessage`](../interfaces/IAlbumMessage.md)

## Constructors

### new AlbumMessage()

> **new AlbumMessage**(`properties`?): [`AlbumMessage`](AlbumMessage.md)

Defined in: [WAProto/index.d.ts:17366](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17366)

Constructs a new AlbumMessage.

#### Parameters

##### properties?

[`IAlbumMessage`](../interfaces/IAlbumMessage.md)

Properties to set

#### Returns

[`AlbumMessage`](AlbumMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:17375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17375)

AlbumMessage contextInfo.

#### Implementation of

[`IAlbumMessage`](../interfaces/IAlbumMessage.md).[`contextInfo`](../interfaces/IAlbumMessage.md#contextinfo)

***

### expectedImageCount?

> `optional` **expectedImageCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:17369](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17369)

AlbumMessage expectedImageCount.

#### Implementation of

[`IAlbumMessage`](../interfaces/IAlbumMessage.md).[`expectedImageCount`](../interfaces/IAlbumMessage.md#expectedimagecount)

***

### expectedVideoCount?

> `optional` **expectedVideoCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:17372](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17372)

AlbumMessage expectedVideoCount.

#### Implementation of

[`IAlbumMessage`](../interfaces/IAlbumMessage.md).[`expectedVideoCount`](../interfaces/IAlbumMessage.md#expectedvideocount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17445)

Converts this AlbumMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AlbumMessage`](AlbumMessage.md)

Defined in: [WAProto/index.d.ts:17382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17382)

Creates a new AlbumMessage instance using the specified properties.

#### Parameters

##### properties?

[`IAlbumMessage`](../interfaces/IAlbumMessage.md)

Properties to set

#### Returns

[`AlbumMessage`](AlbumMessage.md)

AlbumMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AlbumMessage`](AlbumMessage.md)

Defined in: [WAProto/index.d.ts:17408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17408)

Decodes an AlbumMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AlbumMessage`](AlbumMessage.md)

AlbumMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AlbumMessage`](AlbumMessage.md)

Defined in: [WAProto/index.d.ts:17417](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17417)

Decodes an AlbumMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AlbumMessage`](AlbumMessage.md)

AlbumMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17390)

Encodes the specified AlbumMessage message. Does not implicitly [verify](AlbumMessage.md#verify) messages.

#### Parameters

##### message

[`IAlbumMessage`](../interfaces/IAlbumMessage.md)

AlbumMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17398](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17398)

Encodes the specified AlbumMessage message, length delimited. Does not implicitly [verify](AlbumMessage.md#verify) messages.

#### Parameters

##### message

[`IAlbumMessage`](../interfaces/IAlbumMessage.md)

AlbumMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AlbumMessage`](AlbumMessage.md)

Defined in: [WAProto/index.d.ts:17431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17431)

Creates an AlbumMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AlbumMessage`](AlbumMessage.md)

AlbumMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17452](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17452)

Gets the default type url for AlbumMessage

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

Defined in: [WAProto/index.d.ts:17439](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17439)

Creates a plain object from an AlbumMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`AlbumMessage`](AlbumMessage.md)

AlbumMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17424](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17424)

Verifies an AlbumMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
