# Class: AvatarUserSettings

Defined in: [WAProto/index.d.ts:2885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2885)

Represents an AvatarUserSettings.

## Implements

- [`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md)

## Constructors

### new AvatarUserSettings()

> **new AvatarUserSettings**(`properties`?): [`AvatarUserSettings`](AvatarUserSettings.md)

Defined in: [WAProto/index.d.ts:2891](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2891)

Constructs a new AvatarUserSettings.

#### Parameters

##### properties?

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md)

Properties to set

#### Returns

[`AvatarUserSettings`](AvatarUserSettings.md)

## Properties

### fbid?

> `optional` **fbid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:2894](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2894)

AvatarUserSettings fbid.

#### Implementation of

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md).[`fbid`](../interfaces/IAvatarUserSettings.md#fbid)

***

### password?

> `optional` **password**: `null` \| `string`

Defined in: [WAProto/index.d.ts:2897](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2897)

AvatarUserSettings password.

#### Implementation of

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md).[`password`](../interfaces/IAvatarUserSettings.md#password)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:2967](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2967)

Converts this AvatarUserSettings to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AvatarUserSettings`](AvatarUserSettings.md)

Defined in: [WAProto/index.d.ts:2904](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2904)

Creates a new AvatarUserSettings instance using the specified properties.

#### Parameters

##### properties?

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md)

Properties to set

#### Returns

[`AvatarUserSettings`](AvatarUserSettings.md)

AvatarUserSettings instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AvatarUserSettings`](AvatarUserSettings.md)

Defined in: [WAProto/index.d.ts:2930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2930)

Decodes an AvatarUserSettings message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AvatarUserSettings`](AvatarUserSettings.md)

AvatarUserSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AvatarUserSettings`](AvatarUserSettings.md)

Defined in: [WAProto/index.d.ts:2939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2939)

Decodes an AvatarUserSettings message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AvatarUserSettings`](AvatarUserSettings.md)

AvatarUserSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2912)

Encodes the specified AvatarUserSettings message. Does not implicitly [verify](AvatarUserSettings.md#verify) messages.

#### Parameters

##### message

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md)

AvatarUserSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:2920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2920)

Encodes the specified AvatarUserSettings message, length delimited. Does not implicitly [verify](AvatarUserSettings.md#verify) messages.

#### Parameters

##### message

[`IAvatarUserSettings`](../interfaces/IAvatarUserSettings.md)

AvatarUserSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AvatarUserSettings`](AvatarUserSettings.md)

Defined in: [WAProto/index.d.ts:2953](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2953)

Creates an AvatarUserSettings message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AvatarUserSettings`](AvatarUserSettings.md)

AvatarUserSettings

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:2974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2974)

Gets the default type url for AvatarUserSettings

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

Defined in: [WAProto/index.d.ts:2961](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2961)

Creates a plain object from an AvatarUserSettings message. Also converts values to other types if specified.

#### Parameters

##### message

[`AvatarUserSettings`](AvatarUserSettings.md)

AvatarUserSettings

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:2946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2946)

Verifies an AvatarUserSettings message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
