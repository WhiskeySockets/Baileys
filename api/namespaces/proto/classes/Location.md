# Class: Location

Defined in: [WAProto/index.d.ts:16327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16327)

Represents a Location.

## Implements

- [`ILocation`](../interfaces/ILocation.md)

## Constructors

### new Location()

> **new Location**(`properties`?): [`Location`](Location.md)

Defined in: [WAProto/index.d.ts:16333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16333)

Constructs a new Location.

#### Parameters

##### properties?

[`ILocation`](../interfaces/ILocation.md)

Properties to set

#### Returns

[`Location`](Location.md)

## Properties

### degreesLatitude?

> `optional` **degreesLatitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:16336](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16336)

Location degreesLatitude.

#### Implementation of

[`ILocation`](../interfaces/ILocation.md).[`degreesLatitude`](../interfaces/ILocation.md#degreeslatitude)

***

### degreesLongitude?

> `optional` **degreesLongitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:16339](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16339)

Location degreesLongitude.

#### Implementation of

[`ILocation`](../interfaces/ILocation.md).[`degreesLongitude`](../interfaces/ILocation.md#degreeslongitude)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16342](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16342)

Location name.

#### Implementation of

[`ILocation`](../interfaces/ILocation.md).[`name`](../interfaces/ILocation.md#name)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16412](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16412)

Converts this Location to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Location`](Location.md)

Defined in: [WAProto/index.d.ts:16349](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16349)

Creates a new Location instance using the specified properties.

#### Parameters

##### properties?

[`ILocation`](../interfaces/ILocation.md)

Properties to set

#### Returns

[`Location`](Location.md)

Location instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Location`](Location.md)

Defined in: [WAProto/index.d.ts:16375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16375)

Decodes a Location message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Location`](Location.md)

Location

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Location`](Location.md)

Defined in: [WAProto/index.d.ts:16384](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16384)

Decodes a Location message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Location`](Location.md)

Location

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16357](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16357)

Encodes the specified Location message. Does not implicitly [verify](Location.md#verify) messages.

#### Parameters

##### message

[`ILocation`](../interfaces/ILocation.md)

Location message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16365](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16365)

Encodes the specified Location message, length delimited. Does not implicitly [verify](Location.md#verify) messages.

#### Parameters

##### message

[`ILocation`](../interfaces/ILocation.md)

Location message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Location`](Location.md)

Defined in: [WAProto/index.d.ts:16398](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16398)

Creates a Location message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Location`](Location.md)

Location

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16419](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16419)

Gets the default type url for Location

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

Defined in: [WAProto/index.d.ts:16406](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16406)

Creates a plain object from a Location message. Also converts values to other types if specified.

#### Parameters

##### message

[`Location`](Location.md)

Location

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16391](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16391)

Verifies a Location message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
