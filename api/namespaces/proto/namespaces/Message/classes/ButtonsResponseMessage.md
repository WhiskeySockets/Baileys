# Class: ButtonsResponseMessage

Defined in: [WAProto/index.d.ts:19162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19162)

Represents a ButtonsResponseMessage.

## Implements

- [`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md)

## Constructors

### new ButtonsResponseMessage()

> **new ButtonsResponseMessage**(`properties`?): [`ButtonsResponseMessage`](ButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:19168](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19168)

Constructs a new ButtonsResponseMessage.

#### Parameters

##### properties?

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md)

Properties to set

#### Returns

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:19174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19174)

ButtonsResponseMessage contextInfo.

#### Implementation of

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md).[`contextInfo`](../interfaces/IButtonsResponseMessage.md#contextinfo)

***

### response?

> `optional` **response**: `"selectedDisplayText"`

Defined in: [WAProto/index.d.ts:19183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19183)

ButtonsResponseMessage response.

***

### selectedButtonId?

> `optional` **selectedButtonId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19171)

ButtonsResponseMessage selectedButtonId.

#### Implementation of

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md).[`selectedButtonId`](../interfaces/IButtonsResponseMessage.md#selectedbuttonid)

***

### selectedDisplayText?

> `optional` **selectedDisplayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19180](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19180)

ButtonsResponseMessage selectedDisplayText.

#### Implementation of

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md).[`selectedDisplayText`](../interfaces/IButtonsResponseMessage.md#selecteddisplaytext)

***

### type?

> `optional` **type**: `null` \| [`Type`](../namespaces/ButtonsResponseMessage/enumerations/Type.md)

Defined in: [WAProto/index.d.ts:19177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19177)

ButtonsResponseMessage type.

#### Implementation of

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md).[`type`](../interfaces/IButtonsResponseMessage.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19253)

Converts this ButtonsResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ButtonsResponseMessage`](ButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:19190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19190)

Creates a new ButtonsResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md)

Properties to set

#### Returns

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

ButtonsResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ButtonsResponseMessage`](ButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:19216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19216)

Decodes a ButtonsResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

ButtonsResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ButtonsResponseMessage`](ButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:19225](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19225)

Decodes a ButtonsResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

ButtonsResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19198](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19198)

Encodes the specified ButtonsResponseMessage message. Does not implicitly [verify](ButtonsResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md)

ButtonsResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19206)

Encodes the specified ButtonsResponseMessage message, length delimited. Does not implicitly [verify](ButtonsResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IButtonsResponseMessage`](../interfaces/IButtonsResponseMessage.md)

ButtonsResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ButtonsResponseMessage`](ButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:19239](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19239)

Creates a ButtonsResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

ButtonsResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19260](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19260)

Gets the default type url for ButtonsResponseMessage

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

Defined in: [WAProto/index.d.ts:19247](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19247)

Creates a plain object from a ButtonsResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ButtonsResponseMessage`](ButtonsResponseMessage.md)

ButtonsResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19232](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19232)

Verifies a ButtonsResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
