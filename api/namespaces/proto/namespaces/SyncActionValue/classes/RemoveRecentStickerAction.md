# Class: RemoveRecentStickerAction

Defined in: [WAProto/index.d.ts:45296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45296)

Represents a RemoveRecentStickerAction.

## Implements

- [`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md)

## Constructors

### new RemoveRecentStickerAction()

> **new RemoveRecentStickerAction**(`properties`?): [`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

Defined in: [WAProto/index.d.ts:45302](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45302)

Constructs a new RemoveRecentStickerAction.

#### Parameters

##### properties?

[`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md)

Properties to set

#### Returns

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

## Properties

### lastStickerSentTs?

> `optional` **lastStickerSentTs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:45305](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45305)

RemoveRecentStickerAction lastStickerSentTs.

#### Implementation of

[`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md).[`lastStickerSentTs`](../interfaces/IRemoveRecentStickerAction.md#laststickersentts)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45375)

Converts this RemoveRecentStickerAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

Defined in: [WAProto/index.d.ts:45312](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45312)

Creates a new RemoveRecentStickerAction instance using the specified properties.

#### Parameters

##### properties?

[`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md)

Properties to set

#### Returns

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

RemoveRecentStickerAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

Defined in: [WAProto/index.d.ts:45338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45338)

Decodes a RemoveRecentStickerAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

RemoveRecentStickerAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

Defined in: [WAProto/index.d.ts:45347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45347)

Decodes a RemoveRecentStickerAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

RemoveRecentStickerAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45320)

Encodes the specified RemoveRecentStickerAction message. Does not implicitly [verify](RemoveRecentStickerAction.md#verify) messages.

#### Parameters

##### message

[`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md)

RemoveRecentStickerAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45328](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45328)

Encodes the specified RemoveRecentStickerAction message, length delimited. Does not implicitly [verify](RemoveRecentStickerAction.md#verify) messages.

#### Parameters

##### message

[`IRemoveRecentStickerAction`](../interfaces/IRemoveRecentStickerAction.md)

RemoveRecentStickerAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

Defined in: [WAProto/index.d.ts:45361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45361)

Creates a RemoveRecentStickerAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

RemoveRecentStickerAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45382)

Gets the default type url for RemoveRecentStickerAction

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

Defined in: [WAProto/index.d.ts:45369](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45369)

Creates a plain object from a RemoveRecentStickerAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`RemoveRecentStickerAction`](RemoveRecentStickerAction.md)

RemoveRecentStickerAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45354](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45354)

Verifies a RemoveRecentStickerAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
