# Class: PrimaryVersionAction

Defined in: [WAProto/index.d.ts:44690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44690)

Represents a PrimaryVersionAction.

## Implements

- [`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md)

## Constructors

### new PrimaryVersionAction()

> **new PrimaryVersionAction**(`properties`?): [`PrimaryVersionAction`](PrimaryVersionAction.md)

Defined in: [WAProto/index.d.ts:44696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44696)

Constructs a new PrimaryVersionAction.

#### Parameters

##### properties?

[`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md)

Properties to set

#### Returns

[`PrimaryVersionAction`](PrimaryVersionAction.md)

## Properties

### version?

> `optional` **version**: `null` \| `string`

Defined in: [WAProto/index.d.ts:44699](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44699)

PrimaryVersionAction version.

#### Implementation of

[`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md).[`version`](../interfaces/IPrimaryVersionAction.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44769)

Converts this PrimaryVersionAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PrimaryVersionAction`](PrimaryVersionAction.md)

Defined in: [WAProto/index.d.ts:44706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44706)

Creates a new PrimaryVersionAction instance using the specified properties.

#### Parameters

##### properties?

[`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md)

Properties to set

#### Returns

[`PrimaryVersionAction`](PrimaryVersionAction.md)

PrimaryVersionAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PrimaryVersionAction`](PrimaryVersionAction.md)

Defined in: [WAProto/index.d.ts:44732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44732)

Decodes a PrimaryVersionAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PrimaryVersionAction`](PrimaryVersionAction.md)

PrimaryVersionAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PrimaryVersionAction`](PrimaryVersionAction.md)

Defined in: [WAProto/index.d.ts:44741](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44741)

Decodes a PrimaryVersionAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PrimaryVersionAction`](PrimaryVersionAction.md)

PrimaryVersionAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44714)

Encodes the specified PrimaryVersionAction message. Does not implicitly [verify](PrimaryVersionAction.md#verify) messages.

#### Parameters

##### message

[`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md)

PrimaryVersionAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44722)

Encodes the specified PrimaryVersionAction message, length delimited. Does not implicitly [verify](PrimaryVersionAction.md#verify) messages.

#### Parameters

##### message

[`IPrimaryVersionAction`](../interfaces/IPrimaryVersionAction.md)

PrimaryVersionAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PrimaryVersionAction`](PrimaryVersionAction.md)

Defined in: [WAProto/index.d.ts:44755](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44755)

Creates a PrimaryVersionAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PrimaryVersionAction`](PrimaryVersionAction.md)

PrimaryVersionAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44776](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44776)

Gets the default type url for PrimaryVersionAction

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

Defined in: [WAProto/index.d.ts:44763](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44763)

Creates a plain object from a PrimaryVersionAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`PrimaryVersionAction`](PrimaryVersionAction.md)

PrimaryVersionAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44748)

Verifies a PrimaryVersionAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
