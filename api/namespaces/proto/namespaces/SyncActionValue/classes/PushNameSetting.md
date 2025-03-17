# Class: PushNameSetting

Defined in: [WAProto/index.d.ts:44981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44981)

Represents a PushNameSetting.

## Implements

- [`IPushNameSetting`](../interfaces/IPushNameSetting.md)

## Constructors

### new PushNameSetting()

> **new PushNameSetting**(`properties`?): [`PushNameSetting`](PushNameSetting.md)

Defined in: [WAProto/index.d.ts:44987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44987)

Constructs a new PushNameSetting.

#### Parameters

##### properties?

[`IPushNameSetting`](../interfaces/IPushNameSetting.md)

Properties to set

#### Returns

[`PushNameSetting`](PushNameSetting.md)

## Properties

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:44990](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44990)

PushNameSetting name.

#### Implementation of

[`IPushNameSetting`](../interfaces/IPushNameSetting.md).[`name`](../interfaces/IPushNameSetting.md#name)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45060)

Converts this PushNameSetting to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PushNameSetting`](PushNameSetting.md)

Defined in: [WAProto/index.d.ts:44997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44997)

Creates a new PushNameSetting instance using the specified properties.

#### Parameters

##### properties?

[`IPushNameSetting`](../interfaces/IPushNameSetting.md)

Properties to set

#### Returns

[`PushNameSetting`](PushNameSetting.md)

PushNameSetting instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PushNameSetting`](PushNameSetting.md)

Defined in: [WAProto/index.d.ts:45023](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45023)

Decodes a PushNameSetting message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PushNameSetting`](PushNameSetting.md)

PushNameSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PushNameSetting`](PushNameSetting.md)

Defined in: [WAProto/index.d.ts:45032](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45032)

Decodes a PushNameSetting message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PushNameSetting`](PushNameSetting.md)

PushNameSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45005](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45005)

Encodes the specified PushNameSetting message. Does not implicitly [verify](PushNameSetting.md#verify) messages.

#### Parameters

##### message

[`IPushNameSetting`](../interfaces/IPushNameSetting.md)

PushNameSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45013)

Encodes the specified PushNameSetting message, length delimited. Does not implicitly [verify](PushNameSetting.md#verify) messages.

#### Parameters

##### message

[`IPushNameSetting`](../interfaces/IPushNameSetting.md)

PushNameSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PushNameSetting`](PushNameSetting.md)

Defined in: [WAProto/index.d.ts:45046](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45046)

Creates a PushNameSetting message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PushNameSetting`](PushNameSetting.md)

PushNameSetting

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45067](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45067)

Gets the default type url for PushNameSetting

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

Defined in: [WAProto/index.d.ts:45054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45054)

Creates a plain object from a PushNameSetting message. Also converts values to other types if specified.

#### Parameters

##### message

[`PushNameSetting`](PushNameSetting.md)

PushNameSetting

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45039)

Verifies a PushNameSetting message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
