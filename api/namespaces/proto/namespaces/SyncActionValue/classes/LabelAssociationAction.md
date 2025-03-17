# Class: LabelAssociationAction

Defined in: [WAProto/index.d.ts:42859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42859)

Represents a LabelAssociationAction.

## Implements

- [`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md)

## Constructors

### new LabelAssociationAction()

> **new LabelAssociationAction**(`properties`?): [`LabelAssociationAction`](LabelAssociationAction.md)

Defined in: [WAProto/index.d.ts:42865](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42865)

Constructs a new LabelAssociationAction.

#### Parameters

##### properties?

[`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md)

Properties to set

#### Returns

[`LabelAssociationAction`](LabelAssociationAction.md)

## Properties

### labeled?

> `optional` **labeled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:42868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42868)

LabelAssociationAction labeled.

#### Implementation of

[`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md).[`labeled`](../interfaces/ILabelAssociationAction.md#labeled)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42938)

Converts this LabelAssociationAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LabelAssociationAction`](LabelAssociationAction.md)

Defined in: [WAProto/index.d.ts:42875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42875)

Creates a new LabelAssociationAction instance using the specified properties.

#### Parameters

##### properties?

[`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md)

Properties to set

#### Returns

[`LabelAssociationAction`](LabelAssociationAction.md)

LabelAssociationAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LabelAssociationAction`](LabelAssociationAction.md)

Defined in: [WAProto/index.d.ts:42901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42901)

Decodes a LabelAssociationAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LabelAssociationAction`](LabelAssociationAction.md)

LabelAssociationAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LabelAssociationAction`](LabelAssociationAction.md)

Defined in: [WAProto/index.d.ts:42910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42910)

Decodes a LabelAssociationAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LabelAssociationAction`](LabelAssociationAction.md)

LabelAssociationAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42883)

Encodes the specified LabelAssociationAction message. Does not implicitly [verify](LabelAssociationAction.md#verify) messages.

#### Parameters

##### message

[`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md)

LabelAssociationAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42891](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42891)

Encodes the specified LabelAssociationAction message, length delimited. Does not implicitly [verify](LabelAssociationAction.md#verify) messages.

#### Parameters

##### message

[`ILabelAssociationAction`](../interfaces/ILabelAssociationAction.md)

LabelAssociationAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LabelAssociationAction`](LabelAssociationAction.md)

Defined in: [WAProto/index.d.ts:42924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42924)

Creates a LabelAssociationAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LabelAssociationAction`](LabelAssociationAction.md)

LabelAssociationAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42945](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42945)

Gets the default type url for LabelAssociationAction

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

Defined in: [WAProto/index.d.ts:42932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42932)

Creates a plain object from a LabelAssociationAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`LabelAssociationAction`](LabelAssociationAction.md)

LabelAssociationAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42917)

Verifies a LabelAssociationAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
