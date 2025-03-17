# Class: CarouselMessage

Defined in: [WAProto/index.d.ts:23474](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23474)

Represents a CarouselMessage.

## Implements

- [`ICarouselMessage`](../interfaces/ICarouselMessage.md)

## Constructors

### new CarouselMessage()

> **new CarouselMessage**(`properties`?): [`CarouselMessage`](CarouselMessage.md)

Defined in: [WAProto/index.d.ts:23480](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23480)

Constructs a new CarouselMessage.

#### Parameters

##### properties?

[`ICarouselMessage`](../interfaces/ICarouselMessage.md)

Properties to set

#### Returns

[`CarouselMessage`](CarouselMessage.md)

## Properties

### cards

> **cards**: [`IInteractiveMessage`](../../../interfaces/IInteractiveMessage.md)[]

Defined in: [WAProto/index.d.ts:23483](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23483)

CarouselMessage cards.

#### Implementation of

[`ICarouselMessage`](../interfaces/ICarouselMessage.md).[`cards`](../interfaces/ICarouselMessage.md#cards)

***

### messageVersion?

> `optional` **messageVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:23486](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23486)

CarouselMessage messageVersion.

#### Implementation of

[`ICarouselMessage`](../interfaces/ICarouselMessage.md).[`messageVersion`](../interfaces/ICarouselMessage.md#messageversion)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:23556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23556)

Converts this CarouselMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CarouselMessage`](CarouselMessage.md)

Defined in: [WAProto/index.d.ts:23493](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23493)

Creates a new CarouselMessage instance using the specified properties.

#### Parameters

##### properties?

[`ICarouselMessage`](../interfaces/ICarouselMessage.md)

Properties to set

#### Returns

[`CarouselMessage`](CarouselMessage.md)

CarouselMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CarouselMessage`](CarouselMessage.md)

Defined in: [WAProto/index.d.ts:23519](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23519)

Decodes a CarouselMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CarouselMessage`](CarouselMessage.md)

CarouselMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CarouselMessage`](CarouselMessage.md)

Defined in: [WAProto/index.d.ts:23528](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23528)

Decodes a CarouselMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CarouselMessage`](CarouselMessage.md)

CarouselMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23501)

Encodes the specified CarouselMessage message. Does not implicitly [verify](CarouselMessage.md#verify) messages.

#### Parameters

##### message

[`ICarouselMessage`](../interfaces/ICarouselMessage.md)

CarouselMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23509)

Encodes the specified CarouselMessage message, length delimited. Does not implicitly [verify](CarouselMessage.md#verify) messages.

#### Parameters

##### message

[`ICarouselMessage`](../interfaces/ICarouselMessage.md)

CarouselMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CarouselMessage`](CarouselMessage.md)

Defined in: [WAProto/index.d.ts:23542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23542)

Creates a CarouselMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CarouselMessage`](CarouselMessage.md)

CarouselMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:23563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23563)

Gets the default type url for CarouselMessage

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

Defined in: [WAProto/index.d.ts:23550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23550)

Creates a plain object from a CarouselMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`CarouselMessage`](CarouselMessage.md)

CarouselMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:23535](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23535)

Verifies a CarouselMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
