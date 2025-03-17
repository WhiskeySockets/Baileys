# Class: WallpaperSettings

Defined in: [WAProto/index.d.ts:49101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49101)

Represents a WallpaperSettings.

## Implements

- [`IWallpaperSettings`](../interfaces/IWallpaperSettings.md)

## Constructors

### new WallpaperSettings()

> **new WallpaperSettings**(`properties`?): [`WallpaperSettings`](WallpaperSettings.md)

Defined in: [WAProto/index.d.ts:49107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49107)

Constructs a new WallpaperSettings.

#### Parameters

##### properties?

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md)

Properties to set

#### Returns

[`WallpaperSettings`](WallpaperSettings.md)

## Properties

### filename?

> `optional` **filename**: `null` \| `string`

Defined in: [WAProto/index.d.ts:49110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49110)

WallpaperSettings filename.

#### Implementation of

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md).[`filename`](../interfaces/IWallpaperSettings.md#filename)

***

### opacity?

> `optional` **opacity**: `null` \| `number`

Defined in: [WAProto/index.d.ts:49113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49113)

WallpaperSettings opacity.

#### Implementation of

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md).[`opacity`](../interfaces/IWallpaperSettings.md#opacity)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:49183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49183)

Converts this WallpaperSettings to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WallpaperSettings`](WallpaperSettings.md)

Defined in: [WAProto/index.d.ts:49120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49120)

Creates a new WallpaperSettings instance using the specified properties.

#### Parameters

##### properties?

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md)

Properties to set

#### Returns

[`WallpaperSettings`](WallpaperSettings.md)

WallpaperSettings instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WallpaperSettings`](WallpaperSettings.md)

Defined in: [WAProto/index.d.ts:49146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49146)

Decodes a WallpaperSettings message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WallpaperSettings`](WallpaperSettings.md)

WallpaperSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WallpaperSettings`](WallpaperSettings.md)

Defined in: [WAProto/index.d.ts:49155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49155)

Decodes a WallpaperSettings message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WallpaperSettings`](WallpaperSettings.md)

WallpaperSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:49128](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49128)

Encodes the specified WallpaperSettings message. Does not implicitly [verify](WallpaperSettings.md#verify) messages.

#### Parameters

##### message

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md)

WallpaperSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:49136](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49136)

Encodes the specified WallpaperSettings message, length delimited. Does not implicitly [verify](WallpaperSettings.md#verify) messages.

#### Parameters

##### message

[`IWallpaperSettings`](../interfaces/IWallpaperSettings.md)

WallpaperSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WallpaperSettings`](WallpaperSettings.md)

Defined in: [WAProto/index.d.ts:49169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49169)

Creates a WallpaperSettings message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WallpaperSettings`](WallpaperSettings.md)

WallpaperSettings

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:49190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49190)

Gets the default type url for WallpaperSettings

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

Defined in: [WAProto/index.d.ts:49177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49177)

Creates a plain object from a WallpaperSettings message. Also converts values to other types if specified.

#### Parameters

##### message

[`WallpaperSettings`](WallpaperSettings.md)

WallpaperSettings

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:49162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L49162)

Verifies a WallpaperSettings message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
