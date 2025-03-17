# Class: LocaleSetting

Defined in: [WAProto/index.d.ts:43199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43199)

Represents a LocaleSetting.

## Implements

- [`ILocaleSetting`](../interfaces/ILocaleSetting.md)

## Constructors

### new LocaleSetting()

> **new LocaleSetting**(`properties`?): [`LocaleSetting`](LocaleSetting.md)

Defined in: [WAProto/index.d.ts:43205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43205)

Constructs a new LocaleSetting.

#### Parameters

##### properties?

[`ILocaleSetting`](../interfaces/ILocaleSetting.md)

Properties to set

#### Returns

[`LocaleSetting`](LocaleSetting.md)

## Properties

### locale?

> `optional` **locale**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43208](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43208)

LocaleSetting locale.

#### Implementation of

[`ILocaleSetting`](../interfaces/ILocaleSetting.md).[`locale`](../interfaces/ILocaleSetting.md#locale)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43278)

Converts this LocaleSetting to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LocaleSetting`](LocaleSetting.md)

Defined in: [WAProto/index.d.ts:43215](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43215)

Creates a new LocaleSetting instance using the specified properties.

#### Parameters

##### properties?

[`ILocaleSetting`](../interfaces/ILocaleSetting.md)

Properties to set

#### Returns

[`LocaleSetting`](LocaleSetting.md)

LocaleSetting instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LocaleSetting`](LocaleSetting.md)

Defined in: [WAProto/index.d.ts:43241](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43241)

Decodes a LocaleSetting message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LocaleSetting`](LocaleSetting.md)

LocaleSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LocaleSetting`](LocaleSetting.md)

Defined in: [WAProto/index.d.ts:43250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43250)

Decodes a LocaleSetting message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LocaleSetting`](LocaleSetting.md)

LocaleSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43223)

Encodes the specified LocaleSetting message. Does not implicitly [verify](LocaleSetting.md#verify) messages.

#### Parameters

##### message

[`ILocaleSetting`](../interfaces/ILocaleSetting.md)

LocaleSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43231](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43231)

Encodes the specified LocaleSetting message, length delimited. Does not implicitly [verify](LocaleSetting.md#verify) messages.

#### Parameters

##### message

[`ILocaleSetting`](../interfaces/ILocaleSetting.md)

LocaleSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LocaleSetting`](LocaleSetting.md)

Defined in: [WAProto/index.d.ts:43264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43264)

Creates a LocaleSetting message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LocaleSetting`](LocaleSetting.md)

LocaleSetting

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43285)

Gets the default type url for LocaleSetting

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

Defined in: [WAProto/index.d.ts:43272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43272)

Creates a plain object from a LocaleSetting message. Also converts values to other types if specified.

#### Parameters

##### message

[`LocaleSetting`](LocaleSetting.md)

LocaleSetting

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43257)

Verifies a LocaleSetting message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
