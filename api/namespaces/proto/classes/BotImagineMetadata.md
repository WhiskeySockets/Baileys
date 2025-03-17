# Class: BotImagineMetadata

Defined in: [WAProto/index.d.ts:3639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3639)

Represents a BotImagineMetadata.

## Implements

- [`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md)

## Constructors

### new BotImagineMetadata()

> **new BotImagineMetadata**(`properties`?): [`BotImagineMetadata`](BotImagineMetadata.md)

Defined in: [WAProto/index.d.ts:3645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3645)

Constructs a new BotImagineMetadata.

#### Parameters

##### properties?

[`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md)

Properties to set

#### Returns

[`BotImagineMetadata`](BotImagineMetadata.md)

## Properties

### imagineType?

> `optional` **imagineType**: `null` \| [`ImagineType`](../namespaces/BotImagineMetadata/enumerations/ImagineType.md)

Defined in: [WAProto/index.d.ts:3648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3648)

BotImagineMetadata imagineType.

#### Implementation of

[`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md).[`imagineType`](../interfaces/IBotImagineMetadata.md#imaginetype)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3718)

Converts this BotImagineMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BotImagineMetadata`](BotImagineMetadata.md)

Defined in: [WAProto/index.d.ts:3655](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3655)

Creates a new BotImagineMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md)

Properties to set

#### Returns

[`BotImagineMetadata`](BotImagineMetadata.md)

BotImagineMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BotImagineMetadata`](BotImagineMetadata.md)

Defined in: [WAProto/index.d.ts:3681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3681)

Decodes a BotImagineMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BotImagineMetadata`](BotImagineMetadata.md)

BotImagineMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BotImagineMetadata`](BotImagineMetadata.md)

Defined in: [WAProto/index.d.ts:3690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3690)

Decodes a BotImagineMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BotImagineMetadata`](BotImagineMetadata.md)

BotImagineMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3663](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3663)

Encodes the specified BotImagineMetadata message. Does not implicitly [verify](BotImagineMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md)

BotImagineMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3671](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3671)

Encodes the specified BotImagineMetadata message, length delimited. Does not implicitly [verify](BotImagineMetadata.md#verify) messages.

#### Parameters

##### message

[`IBotImagineMetadata`](../interfaces/IBotImagineMetadata.md)

BotImagineMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BotImagineMetadata`](BotImagineMetadata.md)

Defined in: [WAProto/index.d.ts:3704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3704)

Creates a BotImagineMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BotImagineMetadata`](BotImagineMetadata.md)

BotImagineMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3725](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3725)

Gets the default type url for BotImagineMetadata

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

Defined in: [WAProto/index.d.ts:3712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3712)

Creates a plain object from a BotImagineMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`BotImagineMetadata`](BotImagineMetadata.md)

BotImagineMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3697](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3697)

Verifies a BotImagineMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
