# Class: EventLocation

Defined in: [WAProto/index.d.ts:34089](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34089)

Represents an EventLocation.

## Implements

- [`IEventLocation`](../interfaces/IEventLocation.md)

## Constructors

### new EventLocation()

> **new EventLocation**(`properties`?): [`EventLocation`](EventLocation.md)

Defined in: [WAProto/index.d.ts:34095](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34095)

Constructs a new EventLocation.

#### Parameters

##### properties?

[`IEventLocation`](../interfaces/IEventLocation.md)

Properties to set

#### Returns

[`EventLocation`](EventLocation.md)

## Properties

### address?

> `optional` **address**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34107)

EventLocation address.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`address`](../interfaces/IEventLocation.md#address)

***

### degreesLatitude?

> `optional` **degreesLatitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:34098](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34098)

EventLocation degreesLatitude.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`degreesLatitude`](../interfaces/IEventLocation.md#degreeslatitude)

***

### degreesLongitude?

> `optional` **degreesLongitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:34101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34101)

EventLocation degreesLongitude.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`degreesLongitude`](../interfaces/IEventLocation.md#degreeslongitude)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:34113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34113)

EventLocation jpegThumbnail.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`jpegThumbnail`](../interfaces/IEventLocation.md#jpegthumbnail)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34104)

EventLocation name.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`name`](../interfaces/IEventLocation.md#name)

***

### url?

> `optional` **url**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34110)

EventLocation url.

#### Implementation of

[`IEventLocation`](../interfaces/IEventLocation.md).[`url`](../interfaces/IEventLocation.md#url)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34183)

Converts this EventLocation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EventLocation`](EventLocation.md)

Defined in: [WAProto/index.d.ts:34120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34120)

Creates a new EventLocation instance using the specified properties.

#### Parameters

##### properties?

[`IEventLocation`](../interfaces/IEventLocation.md)

Properties to set

#### Returns

[`EventLocation`](EventLocation.md)

EventLocation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EventLocation`](EventLocation.md)

Defined in: [WAProto/index.d.ts:34146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34146)

Decodes an EventLocation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EventLocation`](EventLocation.md)

EventLocation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EventLocation`](EventLocation.md)

Defined in: [WAProto/index.d.ts:34155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34155)

Decodes an EventLocation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EventLocation`](EventLocation.md)

EventLocation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34128](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34128)

Encodes the specified EventLocation message. Does not implicitly [verify](EventLocation.md#verify) messages.

#### Parameters

##### message

[`IEventLocation`](../interfaces/IEventLocation.md)

EventLocation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34136](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34136)

Encodes the specified EventLocation message, length delimited. Does not implicitly [verify](EventLocation.md#verify) messages.

#### Parameters

##### message

[`IEventLocation`](../interfaces/IEventLocation.md)

EventLocation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EventLocation`](EventLocation.md)

Defined in: [WAProto/index.d.ts:34169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34169)

Creates an EventLocation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EventLocation`](EventLocation.md)

EventLocation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34190)

Gets the default type url for EventLocation

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

Defined in: [WAProto/index.d.ts:34177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34177)

Creates a plain object from an EventLocation message. Also converts values to other types if specified.

#### Parameters

##### message

[`EventLocation`](EventLocation.md)

EventLocation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34162)

Verifies an EventLocation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
