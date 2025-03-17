# Class: ClearChatAction

Defined in: [WAProto/index.d.ts:41638](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41638)

Represents a ClearChatAction.

## Implements

- [`IClearChatAction`](../interfaces/IClearChatAction.md)

## Constructors

### new ClearChatAction()

> **new ClearChatAction**(`properties`?): [`ClearChatAction`](ClearChatAction.md)

Defined in: [WAProto/index.d.ts:41644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41644)

Constructs a new ClearChatAction.

#### Parameters

##### properties?

[`IClearChatAction`](../interfaces/IClearChatAction.md)

Properties to set

#### Returns

[`ClearChatAction`](ClearChatAction.md)

## Properties

### messageRange?

> `optional` **messageRange**: `null` \| [`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:41647](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41647)

ClearChatAction messageRange.

#### Implementation of

[`IClearChatAction`](../interfaces/IClearChatAction.md).[`messageRange`](../interfaces/IClearChatAction.md#messagerange)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41717)

Converts this ClearChatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ClearChatAction`](ClearChatAction.md)

Defined in: [WAProto/index.d.ts:41654](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41654)

Creates a new ClearChatAction instance using the specified properties.

#### Parameters

##### properties?

[`IClearChatAction`](../interfaces/IClearChatAction.md)

Properties to set

#### Returns

[`ClearChatAction`](ClearChatAction.md)

ClearChatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ClearChatAction`](ClearChatAction.md)

Defined in: [WAProto/index.d.ts:41680](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41680)

Decodes a ClearChatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ClearChatAction`](ClearChatAction.md)

ClearChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ClearChatAction`](ClearChatAction.md)

Defined in: [WAProto/index.d.ts:41689](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41689)

Decodes a ClearChatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ClearChatAction`](ClearChatAction.md)

ClearChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41662)

Encodes the specified ClearChatAction message. Does not implicitly [verify](ClearChatAction.md#verify) messages.

#### Parameters

##### message

[`IClearChatAction`](../interfaces/IClearChatAction.md)

ClearChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41670](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41670)

Encodes the specified ClearChatAction message, length delimited. Does not implicitly [verify](ClearChatAction.md#verify) messages.

#### Parameters

##### message

[`IClearChatAction`](../interfaces/IClearChatAction.md)

ClearChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ClearChatAction`](ClearChatAction.md)

Defined in: [WAProto/index.d.ts:41703](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41703)

Creates a ClearChatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ClearChatAction`](ClearChatAction.md)

ClearChatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41724](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41724)

Gets the default type url for ClearChatAction

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

Defined in: [WAProto/index.d.ts:41711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41711)

Creates a plain object from a ClearChatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`ClearChatAction`](ClearChatAction.md)

ClearChatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41696)

Verifies a ClearChatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
