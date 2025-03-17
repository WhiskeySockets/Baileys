# Class: Point

Defined in: [WAProto/index.d.ts:36450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36450)

Represents a Point.

## Implements

- [`IPoint`](../interfaces/IPoint.md)

## Constructors

### new Point()

> **new Point**(`properties`?): [`Point`](Point.md)

Defined in: [WAProto/index.d.ts:36456](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36456)

Constructs a new Point.

#### Parameters

##### properties?

[`IPoint`](../interfaces/IPoint.md)

Properties to set

#### Returns

[`Point`](Point.md)

## Properties

### x?

> `optional` **x**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36465](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36465)

Point x.

#### Implementation of

[`IPoint`](../interfaces/IPoint.md).[`x`](../interfaces/IPoint.md#x)

***

### xDeprecated?

> `optional` **xDeprecated**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36459](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36459)

Point xDeprecated.

#### Implementation of

[`IPoint`](../interfaces/IPoint.md).[`xDeprecated`](../interfaces/IPoint.md#xdeprecated)

***

### y?

> `optional` **y**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36468](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36468)

Point y.

#### Implementation of

[`IPoint`](../interfaces/IPoint.md).[`y`](../interfaces/IPoint.md#y)

***

### yDeprecated?

> `optional` **yDeprecated**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36462](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36462)

Point yDeprecated.

#### Implementation of

[`IPoint`](../interfaces/IPoint.md).[`yDeprecated`](../interfaces/IPoint.md#ydeprecated)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36538)

Converts this Point to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Point`](Point.md)

Defined in: [WAProto/index.d.ts:36475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36475)

Creates a new Point instance using the specified properties.

#### Parameters

##### properties?

[`IPoint`](../interfaces/IPoint.md)

Properties to set

#### Returns

[`Point`](Point.md)

Point instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Point`](Point.md)

Defined in: [WAProto/index.d.ts:36501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36501)

Decodes a Point message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Point`](Point.md)

Point

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Point`](Point.md)

Defined in: [WAProto/index.d.ts:36510](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36510)

Decodes a Point message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Point`](Point.md)

Point

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36483](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36483)

Encodes the specified Point message. Does not implicitly [verify](Point.md#verify) messages.

#### Parameters

##### message

[`IPoint`](../interfaces/IPoint.md)

Point message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36491](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36491)

Encodes the specified Point message, length delimited. Does not implicitly [verify](Point.md#verify) messages.

#### Parameters

##### message

[`IPoint`](../interfaces/IPoint.md)

Point message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Point`](Point.md)

Defined in: [WAProto/index.d.ts:36524](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36524)

Creates a Point message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Point`](Point.md)

Point

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36545](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36545)

Gets the default type url for Point

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

Defined in: [WAProto/index.d.ts:36532](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36532)

Creates a plain object from a Point message. Also converts values to other types if specified.

#### Parameters

##### message

[`Point`](Point.md)

Point

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36517](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36517)

Verifies a Point message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
