# Class: LocalizedName

Defined in: [WAProto/index.d.ts:16218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16218)

Represents a LocalizedName.

## Implements

- [`ILocalizedName`](../interfaces/ILocalizedName.md)

## Constructors

### new LocalizedName()

> **new LocalizedName**(`properties`?): [`LocalizedName`](LocalizedName.md)

Defined in: [WAProto/index.d.ts:16224](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16224)

Constructs a new LocalizedName.

#### Parameters

##### properties?

[`ILocalizedName`](../interfaces/ILocalizedName.md)

Properties to set

#### Returns

[`LocalizedName`](LocalizedName.md)

## Properties

### lc?

> `optional` **lc**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16230)

LocalizedName lc.

#### Implementation of

[`ILocalizedName`](../interfaces/ILocalizedName.md).[`lc`](../interfaces/ILocalizedName.md#lc)

***

### lg?

> `optional` **lg**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16227](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16227)

LocalizedName lg.

#### Implementation of

[`ILocalizedName`](../interfaces/ILocalizedName.md).[`lg`](../interfaces/ILocalizedName.md#lg)

***

### verifiedName?

> `optional` **verifiedName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16233](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16233)

LocalizedName verifiedName.

#### Implementation of

[`ILocalizedName`](../interfaces/ILocalizedName.md).[`verifiedName`](../interfaces/ILocalizedName.md#verifiedname)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16303)

Converts this LocalizedName to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LocalizedName`](LocalizedName.md)

Defined in: [WAProto/index.d.ts:16240](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16240)

Creates a new LocalizedName instance using the specified properties.

#### Parameters

##### properties?

[`ILocalizedName`](../interfaces/ILocalizedName.md)

Properties to set

#### Returns

[`LocalizedName`](LocalizedName.md)

LocalizedName instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LocalizedName`](LocalizedName.md)

Defined in: [WAProto/index.d.ts:16266](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16266)

Decodes a LocalizedName message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LocalizedName`](LocalizedName.md)

LocalizedName

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LocalizedName`](LocalizedName.md)

Defined in: [WAProto/index.d.ts:16275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16275)

Decodes a LocalizedName message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LocalizedName`](LocalizedName.md)

LocalizedName

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16248)

Encodes the specified LocalizedName message. Does not implicitly [verify](LocalizedName.md#verify) messages.

#### Parameters

##### message

[`ILocalizedName`](../interfaces/ILocalizedName.md)

LocalizedName message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16256)

Encodes the specified LocalizedName message, length delimited. Does not implicitly [verify](LocalizedName.md#verify) messages.

#### Parameters

##### message

[`ILocalizedName`](../interfaces/ILocalizedName.md)

LocalizedName message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LocalizedName`](LocalizedName.md)

Defined in: [WAProto/index.d.ts:16289](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16289)

Creates a LocalizedName message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LocalizedName`](LocalizedName.md)

LocalizedName

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16310)

Gets the default type url for LocalizedName

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

Defined in: [WAProto/index.d.ts:16297](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16297)

Creates a plain object from a LocalizedName message. Also converts values to other types if specified.

#### Parameters

##### message

[`LocalizedName`](LocalizedName.md)

LocalizedName

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16282](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16282)

Verifies a LocalizedName message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
