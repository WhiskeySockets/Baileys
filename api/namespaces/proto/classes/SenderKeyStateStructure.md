# Class: SenderKeyStateStructure

Defined in: [WAProto/index.d.ts:38545](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38545)

Represents a SenderKeyStateStructure.

## Implements

- [`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)

## Constructors

### new SenderKeyStateStructure()

> **new SenderKeyStateStructure**(`properties`?): [`SenderKeyStateStructure`](SenderKeyStateStructure.md)

Defined in: [WAProto/index.d.ts:38551](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38551)

Constructs a new SenderKeyStateStructure.

#### Parameters

##### properties?

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)

Properties to set

#### Returns

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

## Properties

### senderChainKey?

> `optional` **senderChainKey**: `null` \| [`ISenderChainKey`](../namespaces/SenderKeyStateStructure/interfaces/ISenderChainKey.md)

Defined in: [WAProto/index.d.ts:38557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38557)

SenderKeyStateStructure senderChainKey.

#### Implementation of

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md).[`senderChainKey`](../interfaces/ISenderKeyStateStructure.md#senderchainkey)

***

### senderKeyId?

> `optional` **senderKeyId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38554](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38554)

SenderKeyStateStructure senderKeyId.

#### Implementation of

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md).[`senderKeyId`](../interfaces/ISenderKeyStateStructure.md#senderkeyid)

***

### senderMessageKeys

> **senderMessageKeys**: [`ISenderMessageKey`](../namespaces/SenderKeyStateStructure/interfaces/ISenderMessageKey.md)[]

Defined in: [WAProto/index.d.ts:38563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38563)

SenderKeyStateStructure senderMessageKeys.

#### Implementation of

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md).[`senderMessageKeys`](../interfaces/ISenderKeyStateStructure.md#sendermessagekeys)

***

### senderSigningKey?

> `optional` **senderSigningKey**: `null` \| [`ISenderSigningKey`](../namespaces/SenderKeyStateStructure/interfaces/ISenderSigningKey.md)

Defined in: [WAProto/index.d.ts:38560](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38560)

SenderKeyStateStructure senderSigningKey.

#### Implementation of

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md).[`senderSigningKey`](../interfaces/ISenderKeyStateStructure.md#sendersigningkey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38633)

Converts this SenderKeyStateStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderKeyStateStructure`](SenderKeyStateStructure.md)

Defined in: [WAProto/index.d.ts:38570](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38570)

Creates a new SenderKeyStateStructure instance using the specified properties.

#### Parameters

##### properties?

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)

Properties to set

#### Returns

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

SenderKeyStateStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderKeyStateStructure`](SenderKeyStateStructure.md)

Defined in: [WAProto/index.d.ts:38596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38596)

Decodes a SenderKeyStateStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

SenderKeyStateStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderKeyStateStructure`](SenderKeyStateStructure.md)

Defined in: [WAProto/index.d.ts:38605](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38605)

Decodes a SenderKeyStateStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

SenderKeyStateStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38578)

Encodes the specified SenderKeyStateStructure message. Does not implicitly [verify](SenderKeyStateStructure.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)

SenderKeyStateStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38586](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38586)

Encodes the specified SenderKeyStateStructure message, length delimited. Does not implicitly [verify](SenderKeyStateStructure.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyStateStructure`](../interfaces/ISenderKeyStateStructure.md)

SenderKeyStateStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderKeyStateStructure`](SenderKeyStateStructure.md)

Defined in: [WAProto/index.d.ts:38619](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38619)

Creates a SenderKeyStateStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

SenderKeyStateStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38640)

Gets the default type url for SenderKeyStateStructure

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

Defined in: [WAProto/index.d.ts:38627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38627)

Creates a plain object from a SenderKeyStateStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderKeyStateStructure`](SenderKeyStateStructure.md)

SenderKeyStateStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38612)

Verifies a SenderKeyStateStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
