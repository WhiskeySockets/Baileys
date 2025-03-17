# Class: ParticipantInfo

Defined in: [WAProto/index.d.ts:6377](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6377)

Represents a ParticipantInfo.

## Implements

- [`IParticipantInfo`](../interfaces/IParticipantInfo.md)

## Constructors

### new ParticipantInfo()

> **new ParticipantInfo**(`properties`?): [`ParticipantInfo`](ParticipantInfo.md)

Defined in: [WAProto/index.d.ts:6383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6383)

Constructs a new ParticipantInfo.

#### Parameters

##### properties?

[`IParticipantInfo`](../interfaces/IParticipantInfo.md)

Properties to set

#### Returns

[`ParticipantInfo`](ParticipantInfo.md)

## Properties

### callResult?

> `optional` **callResult**: `null` \| [`CallResult`](../enumerations/CallResult.md)

Defined in: [WAProto/index.d.ts:6389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6389)

ParticipantInfo callResult.

#### Implementation of

[`IParticipantInfo`](../interfaces/IParticipantInfo.md).[`callResult`](../interfaces/IParticipantInfo.md#callresult)

***

### userJid?

> `optional` **userJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:6386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6386)

ParticipantInfo userJid.

#### Implementation of

[`IParticipantInfo`](../interfaces/IParticipantInfo.md).[`userJid`](../interfaces/IParticipantInfo.md#userjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6459](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6459)

Converts this ParticipantInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ParticipantInfo`](ParticipantInfo.md)

Defined in: [WAProto/index.d.ts:6396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6396)

Creates a new ParticipantInfo instance using the specified properties.

#### Parameters

##### properties?

[`IParticipantInfo`](../interfaces/IParticipantInfo.md)

Properties to set

#### Returns

[`ParticipantInfo`](ParticipantInfo.md)

ParticipantInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ParticipantInfo`](ParticipantInfo.md)

Defined in: [WAProto/index.d.ts:6422](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6422)

Decodes a ParticipantInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ParticipantInfo`](ParticipantInfo.md)

ParticipantInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ParticipantInfo`](ParticipantInfo.md)

Defined in: [WAProto/index.d.ts:6431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6431)

Decodes a ParticipantInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ParticipantInfo`](ParticipantInfo.md)

ParticipantInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6404](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6404)

Encodes the specified ParticipantInfo message. Does not implicitly [verify](ParticipantInfo.md#verify) messages.

#### Parameters

##### message

[`IParticipantInfo`](../interfaces/IParticipantInfo.md)

ParticipantInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6412](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6412)

Encodes the specified ParticipantInfo message, length delimited. Does not implicitly [verify](ParticipantInfo.md#verify) messages.

#### Parameters

##### message

[`IParticipantInfo`](../interfaces/IParticipantInfo.md)

ParticipantInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ParticipantInfo`](ParticipantInfo.md)

Defined in: [WAProto/index.d.ts:6445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6445)

Creates a ParticipantInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ParticipantInfo`](ParticipantInfo.md)

ParticipantInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6466)

Gets the default type url for ParticipantInfo

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

Defined in: [WAProto/index.d.ts:6453](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6453)

Creates a plain object from a ParticipantInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`ParticipantInfo`](ParticipantInfo.md)

ParticipantInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6438](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6438)

Verifies a ParticipantInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
