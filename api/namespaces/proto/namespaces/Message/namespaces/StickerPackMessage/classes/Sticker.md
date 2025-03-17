# Class: Sticker

Defined in: [WAProto/index.d.ts:31823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31823)

Represents a Sticker.

## Implements

- [`ISticker`](../interfaces/ISticker.md)

## Constructors

### new Sticker()

> **new Sticker**(`properties`?): [`Sticker`](Sticker.md)

Defined in: [WAProto/index.d.ts:31829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31829)

Constructs a new Sticker.

#### Parameters

##### properties?

[`ISticker`](../interfaces/ISticker.md)

Properties to set

#### Returns

[`Sticker`](Sticker.md)

## Properties

### accessibilityLabel?

> `optional` **accessibilityLabel**: `null` \| `string`

Defined in: [WAProto/index.d.ts:31841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31841)

Sticker accessibilityLabel.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`accessibilityLabel`](../interfaces/ISticker.md#accessibilitylabel)

***

### emojis

> **emojis**: `string`[]

Defined in: [WAProto/index.d.ts:31838](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31838)

Sticker emojis.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`emojis`](../interfaces/ISticker.md#emojis)

***

### fileName?

> `optional` **fileName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:31832](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31832)

Sticker fileName.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`fileName`](../interfaces/ISticker.md#filename)

***

### isAnimated?

> `optional` **isAnimated**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:31835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31835)

Sticker isAnimated.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`isAnimated`](../interfaces/ISticker.md#isanimated)

***

### isLottie?

> `optional` **isLottie**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:31844](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31844)

Sticker isLottie.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`isLottie`](../interfaces/ISticker.md#islottie)

***

### mimetype?

> `optional` **mimetype**: `null` \| `string`

Defined in: [WAProto/index.d.ts:31847](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31847)

Sticker mimetype.

#### Implementation of

[`ISticker`](../interfaces/ISticker.md).[`mimetype`](../interfaces/ISticker.md#mimetype)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:31917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31917)

Converts this Sticker to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Sticker`](Sticker.md)

Defined in: [WAProto/index.d.ts:31854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31854)

Creates a new Sticker instance using the specified properties.

#### Parameters

##### properties?

[`ISticker`](../interfaces/ISticker.md)

Properties to set

#### Returns

[`Sticker`](Sticker.md)

Sticker instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Sticker`](Sticker.md)

Defined in: [WAProto/index.d.ts:31880](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31880)

Decodes a Sticker message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Sticker`](Sticker.md)

Sticker

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Sticker`](Sticker.md)

Defined in: [WAProto/index.d.ts:31889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31889)

Decodes a Sticker message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Sticker`](Sticker.md)

Sticker

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31862)

Encodes the specified Sticker message. Does not implicitly [verify](Sticker.md#verify) messages.

#### Parameters

##### message

[`ISticker`](../interfaces/ISticker.md)

Sticker message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31870](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31870)

Encodes the specified Sticker message, length delimited. Does not implicitly [verify](Sticker.md#verify) messages.

#### Parameters

##### message

[`ISticker`](../interfaces/ISticker.md)

Sticker message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Sticker`](Sticker.md)

Defined in: [WAProto/index.d.ts:31903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31903)

Creates a Sticker message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Sticker`](Sticker.md)

Sticker

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:31924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31924)

Gets the default type url for Sticker

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

Defined in: [WAProto/index.d.ts:31911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31911)

Creates a plain object from a Sticker message. Also converts values to other types if specified.

#### Parameters

##### message

[`Sticker`](Sticker.md)

Sticker

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:31896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31896)

Verifies a Sticker message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
