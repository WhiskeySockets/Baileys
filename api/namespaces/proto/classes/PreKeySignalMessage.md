# Class: PreKeySignalMessage

Defined in: [WAProto/index.d.ts:37001](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37001)

Represents a PreKeySignalMessage.

## Implements

- [`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md)

## Constructors

### new PreKeySignalMessage()

> **new PreKeySignalMessage**(`properties`?): [`PreKeySignalMessage`](PreKeySignalMessage.md)

Defined in: [WAProto/index.d.ts:37007](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37007)

Constructs a new PreKeySignalMessage.

#### Parameters

##### properties?

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md)

Properties to set

#### Returns

[`PreKeySignalMessage`](PreKeySignalMessage.md)

## Properties

### baseKey?

> `optional` **baseKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:37019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37019)

PreKeySignalMessage baseKey.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`baseKey`](../interfaces/IPreKeySignalMessage.md#basekey)

***

### identityKey?

> `optional` **identityKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:37022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37022)

PreKeySignalMessage identityKey.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`identityKey`](../interfaces/IPreKeySignalMessage.md#identitykey)

***

### message?

> `optional` **message**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:37025](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37025)

PreKeySignalMessage message.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`message`](../interfaces/IPreKeySignalMessage.md#message)

***

### preKeyId?

> `optional` **preKeyId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37013)

PreKeySignalMessage preKeyId.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`preKeyId`](../interfaces/IPreKeySignalMessage.md#prekeyid)

***

### registrationId?

> `optional` **registrationId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37010](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37010)

PreKeySignalMessage registrationId.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`registrationId`](../interfaces/IPreKeySignalMessage.md#registrationid)

***

### signedPreKeyId?

> `optional` **signedPreKeyId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:37016](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37016)

PreKeySignalMessage signedPreKeyId.

#### Implementation of

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md).[`signedPreKeyId`](../interfaces/IPreKeySignalMessage.md#signedprekeyid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37095](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37095)

Converts this PreKeySignalMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PreKeySignalMessage`](PreKeySignalMessage.md)

Defined in: [WAProto/index.d.ts:37032](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37032)

Creates a new PreKeySignalMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md)

Properties to set

#### Returns

[`PreKeySignalMessage`](PreKeySignalMessage.md)

PreKeySignalMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PreKeySignalMessage`](PreKeySignalMessage.md)

Defined in: [WAProto/index.d.ts:37058](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37058)

Decodes a PreKeySignalMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PreKeySignalMessage`](PreKeySignalMessage.md)

PreKeySignalMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PreKeySignalMessage`](PreKeySignalMessage.md)

Defined in: [WAProto/index.d.ts:37067](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37067)

Decodes a PreKeySignalMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PreKeySignalMessage`](PreKeySignalMessage.md)

PreKeySignalMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37040](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37040)

Encodes the specified PreKeySignalMessage message. Does not implicitly [verify](PreKeySignalMessage.md#verify) messages.

#### Parameters

##### message

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md)

PreKeySignalMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37048)

Encodes the specified PreKeySignalMessage message, length delimited. Does not implicitly [verify](PreKeySignalMessage.md#verify) messages.

#### Parameters

##### message

[`IPreKeySignalMessage`](../interfaces/IPreKeySignalMessage.md)

PreKeySignalMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PreKeySignalMessage`](PreKeySignalMessage.md)

Defined in: [WAProto/index.d.ts:37081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37081)

Creates a PreKeySignalMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PreKeySignalMessage`](PreKeySignalMessage.md)

PreKeySignalMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37102)

Gets the default type url for PreKeySignalMessage

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

Defined in: [WAProto/index.d.ts:37089](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37089)

Creates a plain object from a PreKeySignalMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PreKeySignalMessage`](PreKeySignalMessage.md)

PreKeySignalMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37074)

Verifies a PreKeySignalMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
