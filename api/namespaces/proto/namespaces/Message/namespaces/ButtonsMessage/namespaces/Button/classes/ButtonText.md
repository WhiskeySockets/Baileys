# Class: ButtonText

Defined in: [WAProto/index.d.ts:18933](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18933)

Represents a ButtonText.

## Implements

- [`IButtonText`](../interfaces/IButtonText.md)

## Constructors

### new ButtonText()

> **new ButtonText**(`properties`?): [`ButtonText`](ButtonText.md)

Defined in: [WAProto/index.d.ts:18939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18939)

Constructs a new ButtonText.

#### Parameters

##### properties?

[`IButtonText`](../interfaces/IButtonText.md)

Properties to set

#### Returns

[`ButtonText`](ButtonText.md)

## Properties

### displayText?

> `optional` **displayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18942)

ButtonText displayText.

#### Implementation of

[`IButtonText`](../interfaces/IButtonText.md).[`displayText`](../interfaces/IButtonText.md#displaytext)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19012)

Converts this ButtonText to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ButtonText`](ButtonText.md)

Defined in: [WAProto/index.d.ts:18949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18949)

Creates a new ButtonText instance using the specified properties.

#### Parameters

##### properties?

[`IButtonText`](../interfaces/IButtonText.md)

Properties to set

#### Returns

[`ButtonText`](ButtonText.md)

ButtonText instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ButtonText`](ButtonText.md)

Defined in: [WAProto/index.d.ts:18975](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18975)

Decodes a ButtonText message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ButtonText`](ButtonText.md)

ButtonText

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ButtonText`](ButtonText.md)

Defined in: [WAProto/index.d.ts:18984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18984)

Decodes a ButtonText message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ButtonText`](ButtonText.md)

ButtonText

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18957)

Encodes the specified ButtonText message. Does not implicitly [verify](ButtonText.md#verify) messages.

#### Parameters

##### message

[`IButtonText`](../interfaces/IButtonText.md)

ButtonText message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18965)

Encodes the specified ButtonText message, length delimited. Does not implicitly [verify](ButtonText.md#verify) messages.

#### Parameters

##### message

[`IButtonText`](../interfaces/IButtonText.md)

ButtonText message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ButtonText`](ButtonText.md)

Defined in: [WAProto/index.d.ts:18998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18998)

Creates a ButtonText message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ButtonText`](ButtonText.md)

ButtonText

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19019)

Gets the default type url for ButtonText

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

Defined in: [WAProto/index.d.ts:19006](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19006)

Creates a plain object from a ButtonText message. Also converts values to other types if specified.

#### Parameters

##### message

[`ButtonText`](ButtonText.md)

ButtonText

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18991)

Verifies a ButtonText message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
