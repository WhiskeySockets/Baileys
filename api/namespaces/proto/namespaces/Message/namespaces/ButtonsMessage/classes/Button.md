# Class: Button

Defined in: [WAProto/index.d.ts:18825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18825)

Represents a Button.

## Implements

- [`IButton`](../interfaces/IButton.md)

## Constructors

### new Button()

> **new Button**(`properties`?): [`Button`](Button.md)

Defined in: [WAProto/index.d.ts:18831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18831)

Constructs a new Button.

#### Parameters

##### properties?

[`IButton`](../interfaces/IButton.md)

Properties to set

#### Returns

[`Button`](Button.md)

## Properties

### buttonId?

> `optional` **buttonId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18834)

Button buttonId.

#### Implementation of

[`IButton`](../interfaces/IButton.md).[`buttonId`](../interfaces/IButton.md#buttonid)

***

### buttonText?

> `optional` **buttonText**: `null` \| [`IButtonText`](../namespaces/Button/interfaces/IButtonText.md)

Defined in: [WAProto/index.d.ts:18837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18837)

Button buttonText.

#### Implementation of

[`IButton`](../interfaces/IButton.md).[`buttonText`](../interfaces/IButton.md#buttontext)

***

### nativeFlowInfo?

> `optional` **nativeFlowInfo**: `null` \| [`INativeFlowInfo`](../namespaces/Button/interfaces/INativeFlowInfo.md)

Defined in: [WAProto/index.d.ts:18843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18843)

Button nativeFlowInfo.

#### Implementation of

[`IButton`](../interfaces/IButton.md).[`nativeFlowInfo`](../interfaces/IButton.md#nativeflowinfo)

***

### type?

> `optional` **type**: `null` \| [`Type`](../namespaces/Button/enumerations/Type.md)

Defined in: [WAProto/index.d.ts:18840](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18840)

Button type.

#### Implementation of

[`IButton`](../interfaces/IButton.md).[`type`](../interfaces/IButton.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18913)

Converts this Button to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Button`](Button.md)

Defined in: [WAProto/index.d.ts:18850](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18850)

Creates a new Button instance using the specified properties.

#### Parameters

##### properties?

[`IButton`](../interfaces/IButton.md)

Properties to set

#### Returns

[`Button`](Button.md)

Button instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Button`](Button.md)

Defined in: [WAProto/index.d.ts:18876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18876)

Decodes a Button message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Button`](Button.md)

Button

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Button`](Button.md)

Defined in: [WAProto/index.d.ts:18885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18885)

Decodes a Button message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Button`](Button.md)

Button

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18858](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18858)

Encodes the specified Button message. Does not implicitly [verify](Button.md#verify) messages.

#### Parameters

##### message

[`IButton`](../interfaces/IButton.md)

Button message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18866)

Encodes the specified Button message, length delimited. Does not implicitly [verify](Button.md#verify) messages.

#### Parameters

##### message

[`IButton`](../interfaces/IButton.md)

Button message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Button`](Button.md)

Defined in: [WAProto/index.d.ts:18899](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18899)

Creates a Button message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Button`](Button.md)

Button

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18920)

Gets the default type url for Button

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

Defined in: [WAProto/index.d.ts:18907](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18907)

Creates a plain object from a Button message. Also converts values to other types if specified.

#### Parameters

##### message

[`Button`](Button.md)

Button

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18892)

Verifies a Button message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
