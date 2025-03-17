# Class: LegacyMessage

Defined in: [WAProto/index.d.ts:16000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16000)

Represents a LegacyMessage.

## Implements

- [`ILegacyMessage`](../interfaces/ILegacyMessage.md)

## Constructors

### new LegacyMessage()

> **new LegacyMessage**(`properties`?): [`LegacyMessage`](LegacyMessage.md)

Defined in: [WAProto/index.d.ts:16006](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16006)

Constructs a new LegacyMessage.

#### Parameters

##### properties?

[`ILegacyMessage`](../interfaces/ILegacyMessage.md)

Properties to set

#### Returns

[`LegacyMessage`](LegacyMessage.md)

## Properties

### eventResponseMessage?

> `optional` **eventResponseMessage**: `null` \| [`IEventResponseMessage`](../namespaces/Message/interfaces/IEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:16009](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16009)

LegacyMessage eventResponseMessage.

#### Implementation of

[`ILegacyMessage`](../interfaces/ILegacyMessage.md).[`eventResponseMessage`](../interfaces/ILegacyMessage.md#eventresponsemessage)

***

### pollVote?

> `optional` **pollVote**: `null` \| [`IPollVoteMessage`](../namespaces/Message/interfaces/IPollVoteMessage.md)

Defined in: [WAProto/index.d.ts:16012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16012)

LegacyMessage pollVote.

#### Implementation of

[`ILegacyMessage`](../interfaces/ILegacyMessage.md).[`pollVote`](../interfaces/ILegacyMessage.md#pollvote)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16082](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16082)

Converts this LegacyMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LegacyMessage`](LegacyMessage.md)

Defined in: [WAProto/index.d.ts:16019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16019)

Creates a new LegacyMessage instance using the specified properties.

#### Parameters

##### properties?

[`ILegacyMessage`](../interfaces/ILegacyMessage.md)

Properties to set

#### Returns

[`LegacyMessage`](LegacyMessage.md)

LegacyMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LegacyMessage`](LegacyMessage.md)

Defined in: [WAProto/index.d.ts:16045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16045)

Decodes a LegacyMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LegacyMessage`](LegacyMessage.md)

LegacyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LegacyMessage`](LegacyMessage.md)

Defined in: [WAProto/index.d.ts:16054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16054)

Decodes a LegacyMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LegacyMessage`](LegacyMessage.md)

LegacyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16027)

Encodes the specified LegacyMessage message. Does not implicitly [verify](LegacyMessage.md#verify) messages.

#### Parameters

##### message

[`ILegacyMessage`](../interfaces/ILegacyMessage.md)

LegacyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16035](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16035)

Encodes the specified LegacyMessage message, length delimited. Does not implicitly [verify](LegacyMessage.md#verify) messages.

#### Parameters

##### message

[`ILegacyMessage`](../interfaces/ILegacyMessage.md)

LegacyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LegacyMessage`](LegacyMessage.md)

Defined in: [WAProto/index.d.ts:16068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16068)

Creates a LegacyMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LegacyMessage`](LegacyMessage.md)

LegacyMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16089](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16089)

Gets the default type url for LegacyMessage

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

Defined in: [WAProto/index.d.ts:16076](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16076)

Creates a plain object from a LegacyMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`LegacyMessage`](LegacyMessage.md)

LegacyMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16061](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16061)

Verifies a LegacyMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
