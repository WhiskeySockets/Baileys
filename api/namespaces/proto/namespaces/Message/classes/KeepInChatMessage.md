# Class: KeepInChatMessage

Defined in: [WAProto/index.d.ts:24766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24766)

Represents a KeepInChatMessage.

## Implements

- [`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md)

## Constructors

### new KeepInChatMessage()

> **new KeepInChatMessage**(`properties`?): [`KeepInChatMessage`](KeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:24772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24772)

Constructs a new KeepInChatMessage.

#### Parameters

##### properties?

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md)

Properties to set

#### Returns

[`KeepInChatMessage`](KeepInChatMessage.md)

## Properties

### keepType?

> `optional` **keepType**: `null` \| [`KeepType`](../../../enumerations/KeepType.md)

Defined in: [WAProto/index.d.ts:24778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24778)

KeepInChatMessage keepType.

#### Implementation of

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md).[`keepType`](../interfaces/IKeepInChatMessage.md#keeptype)

***

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:24775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24775)

KeepInChatMessage key.

#### Implementation of

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md).[`key`](../interfaces/IKeepInChatMessage.md#key)

***

### timestampMs?

> `optional` **timestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:24781](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24781)

KeepInChatMessage timestampMs.

#### Implementation of

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md).[`timestampMs`](../interfaces/IKeepInChatMessage.md#timestampms)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:24851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24851)

Converts this KeepInChatMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`KeepInChatMessage`](KeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:24788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24788)

Creates a new KeepInChatMessage instance using the specified properties.

#### Parameters

##### properties?

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md)

Properties to set

#### Returns

[`KeepInChatMessage`](KeepInChatMessage.md)

KeepInChatMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`KeepInChatMessage`](KeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:24814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24814)

Decodes a KeepInChatMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`KeepInChatMessage`](KeepInChatMessage.md)

KeepInChatMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`KeepInChatMessage`](KeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:24823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24823)

Decodes a KeepInChatMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`KeepInChatMessage`](KeepInChatMessage.md)

KeepInChatMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24796)

Encodes the specified KeepInChatMessage message. Does not implicitly [verify](KeepInChatMessage.md#verify) messages.

#### Parameters

##### message

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md)

KeepInChatMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:24804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24804)

Encodes the specified KeepInChatMessage message, length delimited. Does not implicitly [verify](KeepInChatMessage.md#verify) messages.

#### Parameters

##### message

[`IKeepInChatMessage`](../interfaces/IKeepInChatMessage.md)

KeepInChatMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`KeepInChatMessage`](KeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:24837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24837)

Creates a KeepInChatMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`KeepInChatMessage`](KeepInChatMessage.md)

KeepInChatMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:24858](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24858)

Gets the default type url for KeepInChatMessage

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

Defined in: [WAProto/index.d.ts:24845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24845)

Creates a plain object from a KeepInChatMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`KeepInChatMessage`](KeepInChatMessage.md)

KeepInChatMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:24830](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L24830)

Verifies a KeepInChatMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
