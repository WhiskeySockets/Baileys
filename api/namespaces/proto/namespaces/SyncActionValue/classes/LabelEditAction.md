# Class: LabelEditAction

Defined in: [WAProto/index.d.ts:42974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42974)

Represents a LabelEditAction.

## Implements

- [`ILabelEditAction`](../interfaces/ILabelEditAction.md)

## Constructors

### new LabelEditAction()

> **new LabelEditAction**(`properties`?): [`LabelEditAction`](LabelEditAction.md)

Defined in: [WAProto/index.d.ts:42980](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42980)

Constructs a new LabelEditAction.

#### Parameters

##### properties?

[`ILabelEditAction`](../interfaces/ILabelEditAction.md)

Properties to set

#### Returns

[`LabelEditAction`](LabelEditAction.md)

## Properties

### color?

> `optional` **color**: `null` \| `number`

Defined in: [WAProto/index.d.ts:42986](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42986)

LabelEditAction color.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`color`](../interfaces/ILabelEditAction.md#color)

***

### deleted?

> `optional` **deleted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:42992](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42992)

LabelEditAction deleted.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`deleted`](../interfaces/ILabelEditAction.md#deleted)

***

### isActive?

> `optional` **isActive**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:42998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42998)

LabelEditAction isActive.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`isActive`](../interfaces/ILabelEditAction.md#isactive)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:42983](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42983)

LabelEditAction name.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`name`](../interfaces/ILabelEditAction.md#name)

***

### orderIndex?

> `optional` **orderIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:42995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42995)

LabelEditAction orderIndex.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`orderIndex`](../interfaces/ILabelEditAction.md#orderindex)

***

### predefinedId?

> `optional` **predefinedId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:42989](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42989)

LabelEditAction predefinedId.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`predefinedId`](../interfaces/ILabelEditAction.md#predefinedid)

***

### type?

> `optional` **type**: `null` \| [`ListType`](../namespaces/LabelEditAction/enumerations/ListType.md)

Defined in: [WAProto/index.d.ts:43001](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43001)

LabelEditAction type.

#### Implementation of

[`ILabelEditAction`](../interfaces/ILabelEditAction.md).[`type`](../interfaces/ILabelEditAction.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43071](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43071)

Converts this LabelEditAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LabelEditAction`](LabelEditAction.md)

Defined in: [WAProto/index.d.ts:43008](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43008)

Creates a new LabelEditAction instance using the specified properties.

#### Parameters

##### properties?

[`ILabelEditAction`](../interfaces/ILabelEditAction.md)

Properties to set

#### Returns

[`LabelEditAction`](LabelEditAction.md)

LabelEditAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LabelEditAction`](LabelEditAction.md)

Defined in: [WAProto/index.d.ts:43034](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43034)

Decodes a LabelEditAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LabelEditAction`](LabelEditAction.md)

LabelEditAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LabelEditAction`](LabelEditAction.md)

Defined in: [WAProto/index.d.ts:43043](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43043)

Decodes a LabelEditAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LabelEditAction`](LabelEditAction.md)

LabelEditAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43016](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43016)

Encodes the specified LabelEditAction message. Does not implicitly [verify](LabelEditAction.md#verify) messages.

#### Parameters

##### message

[`ILabelEditAction`](../interfaces/ILabelEditAction.md)

LabelEditAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43024](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43024)

Encodes the specified LabelEditAction message, length delimited. Does not implicitly [verify](LabelEditAction.md#verify) messages.

#### Parameters

##### message

[`ILabelEditAction`](../interfaces/ILabelEditAction.md)

LabelEditAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LabelEditAction`](LabelEditAction.md)

Defined in: [WAProto/index.d.ts:43057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43057)

Creates a LabelEditAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LabelEditAction`](LabelEditAction.md)

LabelEditAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43078)

Gets the default type url for LabelEditAction

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

Defined in: [WAProto/index.d.ts:43065](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43065)

Creates a plain object from a LabelEditAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`LabelEditAction`](LabelEditAction.md)

LabelEditAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43050](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43050)

Verifies a LabelEditAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
