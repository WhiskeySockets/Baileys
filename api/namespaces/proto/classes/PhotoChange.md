# Class: PhotoChange

Defined in: [WAProto/index.d.ts:36207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36207)

Represents a PhotoChange.

## Implements

- [`IPhotoChange`](../interfaces/IPhotoChange.md)

## Constructors

### new PhotoChange()

> **new PhotoChange**(`properties`?): [`PhotoChange`](PhotoChange.md)

Defined in: [WAProto/index.d.ts:36213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36213)

Constructs a new PhotoChange.

#### Parameters

##### properties?

[`IPhotoChange`](../interfaces/IPhotoChange.md)

Properties to set

#### Returns

[`PhotoChange`](PhotoChange.md)

## Properties

### newPhoto?

> `optional` **newPhoto**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:36219](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36219)

PhotoChange newPhoto.

#### Implementation of

[`IPhotoChange`](../interfaces/IPhotoChange.md).[`newPhoto`](../interfaces/IPhotoChange.md#newphoto)

***

### newPhotoId?

> `optional` **newPhotoId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36222)

PhotoChange newPhotoId.

#### Implementation of

[`IPhotoChange`](../interfaces/IPhotoChange.md).[`newPhotoId`](../interfaces/IPhotoChange.md#newphotoid)

***

### oldPhoto?

> `optional` **oldPhoto**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:36216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36216)

PhotoChange oldPhoto.

#### Implementation of

[`IPhotoChange`](../interfaces/IPhotoChange.md).[`oldPhoto`](../interfaces/IPhotoChange.md#oldphoto)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36292)

Converts this PhotoChange to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PhotoChange`](PhotoChange.md)

Defined in: [WAProto/index.d.ts:36229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36229)

Creates a new PhotoChange instance using the specified properties.

#### Parameters

##### properties?

[`IPhotoChange`](../interfaces/IPhotoChange.md)

Properties to set

#### Returns

[`PhotoChange`](PhotoChange.md)

PhotoChange instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PhotoChange`](PhotoChange.md)

Defined in: [WAProto/index.d.ts:36255](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36255)

Decodes a PhotoChange message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PhotoChange`](PhotoChange.md)

PhotoChange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PhotoChange`](PhotoChange.md)

Defined in: [WAProto/index.d.ts:36264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36264)

Decodes a PhotoChange message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PhotoChange`](PhotoChange.md)

PhotoChange

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36237)

Encodes the specified PhotoChange message. Does not implicitly [verify](PhotoChange.md#verify) messages.

#### Parameters

##### message

[`IPhotoChange`](../interfaces/IPhotoChange.md)

PhotoChange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36245)

Encodes the specified PhotoChange message, length delimited. Does not implicitly [verify](PhotoChange.md#verify) messages.

#### Parameters

##### message

[`IPhotoChange`](../interfaces/IPhotoChange.md)

PhotoChange message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PhotoChange`](PhotoChange.md)

Defined in: [WAProto/index.d.ts:36278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36278)

Creates a PhotoChange message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PhotoChange`](PhotoChange.md)

PhotoChange

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36299)

Gets the default type url for PhotoChange

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

Defined in: [WAProto/index.d.ts:36286](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36286)

Creates a plain object from a PhotoChange message. Also converts values to other types if specified.

#### Parameters

##### message

[`PhotoChange`](PhotoChange.md)

PhotoChange

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36271)

Verifies a PhotoChange message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
