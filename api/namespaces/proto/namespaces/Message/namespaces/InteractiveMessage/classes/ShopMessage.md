# Class: ShopMessage

Defined in: [WAProto/index.d.ts:24149](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24149)

Represents a ShopMessage.

## Implements

- [`IShopMessage`](../interfaces/IShopMessage.md)

## Constructors

### new ShopMessage()

> **new ShopMessage**(`properties`?): [`ShopMessage`](ShopMessage.md)

Defined in: [WAProto/index.d.ts:24155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24155)

Constructs a new ShopMessage.

#### Parameters

##### properties?

[`IShopMessage`](../interfaces/IShopMessage.md)

Properties to set

#### Returns

[`ShopMessage`](ShopMessage.md)

## Properties

### id?

> `optional` **id**: `null` \| `string`

Defined in: [WAProto/index.d.ts:24158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24158)

ShopMessage id.

#### Implementation of

[`IShopMessage`](../interfaces/IShopMessage.md).[`id`](../interfaces/IShopMessage.md#id)

***

### messageVersion?

> `optional` **messageVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:24164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24164)

ShopMessage messageVersion.

#### Implementation of

[`IShopMessage`](../interfaces/IShopMessage.md).[`messageVersion`](../interfaces/IShopMessage.md#messageversion)

***

### surface?

> `optional` **surface**: `null` \| [`Surface`](../namespaces/ShopMessage/enumerations/Surface.md)

Defined in: [WAProto/index.d.ts:24161](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24161)

ShopMessage surface.

#### Implementation of

[`IShopMessage`](../interfaces/IShopMessage.md).[`surface`](../interfaces/IShopMessage.md#surface)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24234](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24234)

Converts this ShopMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ShopMessage`](ShopMessage.md)

Defined in: [WAProto/index.d.ts:24171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24171)

Creates a new ShopMessage instance using the specified properties.

#### Parameters

##### properties?

[`IShopMessage`](../interfaces/IShopMessage.md)

Properties to set

#### Returns

[`ShopMessage`](ShopMessage.md)

ShopMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ShopMessage`](ShopMessage.md)

Defined in: [WAProto/index.d.ts:24197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24197)

Decodes a ShopMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ShopMessage`](ShopMessage.md)

ShopMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ShopMessage`](ShopMessage.md)

Defined in: [WAProto/index.d.ts:24206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24206)

Decodes a ShopMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ShopMessage`](ShopMessage.md)

ShopMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24179](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24179)

Encodes the specified ShopMessage message. Does not implicitly [verify](ShopMessage.md#verify) messages.

#### Parameters

##### message

[`IShopMessage`](../interfaces/IShopMessage.md)

ShopMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24187](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24187)

Encodes the specified ShopMessage message, length delimited. Does not implicitly [verify](ShopMessage.md#verify) messages.

#### Parameters

##### message

[`IShopMessage`](../interfaces/IShopMessage.md)

ShopMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ShopMessage`](ShopMessage.md)

Defined in: [WAProto/index.d.ts:24220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24220)

Creates a ShopMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ShopMessage`](ShopMessage.md)

ShopMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24241](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24241)

Gets the default type url for ShopMessage

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

Defined in: [WAProto/index.d.ts:24228](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24228)

Creates a plain object from a ShopMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ShopMessage`](ShopMessage.md)

ShopMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:24213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24213)

Verifies a ShopMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
