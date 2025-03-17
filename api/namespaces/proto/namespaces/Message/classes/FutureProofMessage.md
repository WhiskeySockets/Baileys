# Class: FutureProofMessage

Defined in: [WAProto/index.d.ts:21691](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21691)

Represents a FutureProofMessage.

## Implements

- [`IFutureProofMessage`](../interfaces/IFutureProofMessage.md)

## Constructors

### new FutureProofMessage()

> **new FutureProofMessage**(`properties`?): [`FutureProofMessage`](FutureProofMessage.md)

Defined in: [WAProto/index.d.ts:21697](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21697)

Constructs a new FutureProofMessage.

#### Parameters

##### properties?

[`IFutureProofMessage`](../interfaces/IFutureProofMessage.md)

Properties to set

#### Returns

[`FutureProofMessage`](FutureProofMessage.md)

## Properties

### message?

> `optional` **message**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:21700](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21700)

FutureProofMessage message.

#### Implementation of

[`IFutureProofMessage`](../interfaces/IFutureProofMessage.md).[`message`](../interfaces/IFutureProofMessage.md#message)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21770](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21770)

Converts this FutureProofMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`FutureProofMessage`](FutureProofMessage.md)

Defined in: [WAProto/index.d.ts:21707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21707)

Creates a new FutureProofMessage instance using the specified properties.

#### Parameters

##### properties?

[`IFutureProofMessage`](../interfaces/IFutureProofMessage.md)

Properties to set

#### Returns

[`FutureProofMessage`](FutureProofMessage.md)

FutureProofMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`FutureProofMessage`](FutureProofMessage.md)

Defined in: [WAProto/index.d.ts:21733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21733)

Decodes a FutureProofMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`FutureProofMessage`](FutureProofMessage.md)

FutureProofMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`FutureProofMessage`](FutureProofMessage.md)

Defined in: [WAProto/index.d.ts:21742](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21742)

Decodes a FutureProofMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`FutureProofMessage`](FutureProofMessage.md)

FutureProofMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21715](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21715)

Encodes the specified FutureProofMessage message. Does not implicitly [verify](FutureProofMessage.md#verify) messages.

#### Parameters

##### message

[`IFutureProofMessage`](../interfaces/IFutureProofMessage.md)

FutureProofMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21723)

Encodes the specified FutureProofMessage message, length delimited. Does not implicitly [verify](FutureProofMessage.md#verify) messages.

#### Parameters

##### message

[`IFutureProofMessage`](../interfaces/IFutureProofMessage.md)

FutureProofMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`FutureProofMessage`](FutureProofMessage.md)

Defined in: [WAProto/index.d.ts:21756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21756)

Creates a FutureProofMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`FutureProofMessage`](FutureProofMessage.md)

FutureProofMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21777)

Gets the default type url for FutureProofMessage

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

Defined in: [WAProto/index.d.ts:21764](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21764)

Creates a plain object from a FutureProofMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`FutureProofMessage`](FutureProofMessage.md)

FutureProofMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21749)

Verifies a FutureProofMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
