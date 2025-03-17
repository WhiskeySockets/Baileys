# Class: ForwardedAIBotMessageInfo

Defined in: [WAProto/index.d.ts:10560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10560)

Represents a ForwardedAIBotMessageInfo.

## Implements

- [`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md)

## Constructors

### new ForwardedAIBotMessageInfo()

> **new ForwardedAIBotMessageInfo**(`properties`?): [`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

Defined in: [WAProto/index.d.ts:10566](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10566)

Constructs a new ForwardedAIBotMessageInfo.

#### Parameters

##### properties?

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md)

Properties to set

#### Returns

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

## Properties

### botJid?

> `optional` **botJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10572](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10572)

ForwardedAIBotMessageInfo botJid.

#### Implementation of

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md).[`botJid`](../interfaces/IForwardedAIBotMessageInfo.md#botjid)

***

### botName?

> `optional` **botName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10569)

ForwardedAIBotMessageInfo botName.

#### Implementation of

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md).[`botName`](../interfaces/IForwardedAIBotMessageInfo.md#botname)

***

### creatorName?

> `optional` **creatorName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10575](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10575)

ForwardedAIBotMessageInfo creatorName.

#### Implementation of

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md).[`creatorName`](../interfaces/IForwardedAIBotMessageInfo.md#creatorname)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:10645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10645)

Converts this ForwardedAIBotMessageInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

Defined in: [WAProto/index.d.ts:10582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10582)

Creates a new ForwardedAIBotMessageInfo instance using the specified properties.

#### Parameters

##### properties?

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md)

Properties to set

#### Returns

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

Defined in: [WAProto/index.d.ts:10608](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10608)

Decodes a ForwardedAIBotMessageInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

Defined in: [WAProto/index.d.ts:10617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10617)

Decodes a ForwardedAIBotMessageInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10590](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10590)

Encodes the specified ForwardedAIBotMessageInfo message. Does not implicitly [verify](ForwardedAIBotMessageInfo.md#verify) messages.

#### Parameters

##### message

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10598](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10598)

Encodes the specified ForwardedAIBotMessageInfo message, length delimited. Does not implicitly [verify](ForwardedAIBotMessageInfo.md#verify) messages.

#### Parameters

##### message

[`IForwardedAIBotMessageInfo`](../interfaces/IForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

Defined in: [WAProto/index.d.ts:10631](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10631)

Creates a ForwardedAIBotMessageInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:10652](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10652)

Gets the default type url for ForwardedAIBotMessageInfo

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

Defined in: [WAProto/index.d.ts:10639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10639)

Creates a plain object from a ForwardedAIBotMessageInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ForwardedAIBotMessageInfo`](ForwardedAIBotMessageInfo.md)

ForwardedAIBotMessageInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:10624](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10624)

Verifies a ForwardedAIBotMessageInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
