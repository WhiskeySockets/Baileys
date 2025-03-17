# Class: ArchiveChatAction

Defined in: [WAProto/index.d.ts:41150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41150)

Represents an ArchiveChatAction.

## Implements

- [`IArchiveChatAction`](../interfaces/IArchiveChatAction.md)

## Constructors

### new ArchiveChatAction()

> **new ArchiveChatAction**(`properties`?): [`ArchiveChatAction`](ArchiveChatAction.md)

Defined in: [WAProto/index.d.ts:41156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41156)

Constructs a new ArchiveChatAction.

#### Parameters

##### properties?

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md)

Properties to set

#### Returns

[`ArchiveChatAction`](ArchiveChatAction.md)

## Properties

### archived?

> `optional` **archived**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:41159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41159)

ArchiveChatAction archived.

#### Implementation of

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md).[`archived`](../interfaces/IArchiveChatAction.md#archived)

***

### messageRange?

> `optional` **messageRange**: `null` \| [`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:41162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41162)

ArchiveChatAction messageRange.

#### Implementation of

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md).[`messageRange`](../interfaces/IArchiveChatAction.md#messagerange)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41232](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41232)

Converts this ArchiveChatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ArchiveChatAction`](ArchiveChatAction.md)

Defined in: [WAProto/index.d.ts:41169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41169)

Creates a new ArchiveChatAction instance using the specified properties.

#### Parameters

##### properties?

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md)

Properties to set

#### Returns

[`ArchiveChatAction`](ArchiveChatAction.md)

ArchiveChatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ArchiveChatAction`](ArchiveChatAction.md)

Defined in: [WAProto/index.d.ts:41195](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41195)

Decodes an ArchiveChatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ArchiveChatAction`](ArchiveChatAction.md)

ArchiveChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ArchiveChatAction`](ArchiveChatAction.md)

Defined in: [WAProto/index.d.ts:41204](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41204)

Decodes an ArchiveChatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ArchiveChatAction`](ArchiveChatAction.md)

ArchiveChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41177)

Encodes the specified ArchiveChatAction message. Does not implicitly [verify](ArchiveChatAction.md#verify) messages.

#### Parameters

##### message

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md)

ArchiveChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41185](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41185)

Encodes the specified ArchiveChatAction message, length delimited. Does not implicitly [verify](ArchiveChatAction.md#verify) messages.

#### Parameters

##### message

[`IArchiveChatAction`](../interfaces/IArchiveChatAction.md)

ArchiveChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ArchiveChatAction`](ArchiveChatAction.md)

Defined in: [WAProto/index.d.ts:41218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41218)

Creates an ArchiveChatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ArchiveChatAction`](ArchiveChatAction.md)

ArchiveChatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41239](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41239)

Gets the default type url for ArchiveChatAction

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

Defined in: [WAProto/index.d.ts:41226](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41226)

Creates a plain object from an ArchiveChatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`ArchiveChatAction`](ArchiveChatAction.md)

ArchiveChatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41211)

Verifies an ArchiveChatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
