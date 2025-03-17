# Class: Chain

Defined in: [WAProto/index.d.ts:39240](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39240)

Represents a Chain.

## Implements

- [`IChain`](../interfaces/IChain.md)

## Constructors

### new Chain()

> **new Chain**(`properties`?): [`Chain`](Chain.md)

Defined in: [WAProto/index.d.ts:39246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39246)

Constructs a new Chain.

#### Parameters

##### properties?

[`IChain`](../interfaces/IChain.md)

Properties to set

#### Returns

[`Chain`](Chain.md)

## Properties

### chainKey?

> `optional` **chainKey**: `null` \| [`IChainKey`](../namespaces/Chain/interfaces/IChainKey.md)

Defined in: [WAProto/index.d.ts:39255](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39255)

Chain chainKey.

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`chainKey`](../interfaces/IChain.md#chainkey)

***

### messageKeys

> **messageKeys**: [`IMessageKey`](../namespaces/Chain/interfaces/IMessageKey.md)[]

Defined in: [WAProto/index.d.ts:39258](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39258)

Chain messageKeys.

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`messageKeys`](../interfaces/IChain.md#messagekeys)

***

### senderRatchetKey?

> `optional` **senderRatchetKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39249)

Chain senderRatchetKey.

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`senderRatchetKey`](../interfaces/IChain.md#senderratchetkey)

***

### senderRatchetKeyPrivate?

> `optional` **senderRatchetKeyPrivate**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39252](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39252)

Chain senderRatchetKeyPrivate.

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`senderRatchetKeyPrivate`](../interfaces/IChain.md#senderratchetkeyprivate)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39328](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39328)

Converts this Chain to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Chain`](Chain.md)

Defined in: [WAProto/index.d.ts:39265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39265)

Creates a new Chain instance using the specified properties.

#### Parameters

##### properties?

[`IChain`](../interfaces/IChain.md)

Properties to set

#### Returns

[`Chain`](Chain.md)

Chain instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Chain`](Chain.md)

Defined in: [WAProto/index.d.ts:39291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39291)

Decodes a Chain message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Chain`](Chain.md)

Chain

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Chain`](Chain.md)

Defined in: [WAProto/index.d.ts:39300](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39300)

Decodes a Chain message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Chain`](Chain.md)

Chain

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39273](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39273)

Encodes the specified Chain message. Does not implicitly [verify](Chain.md#verify) messages.

#### Parameters

##### message

[`IChain`](../interfaces/IChain.md)

Chain message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39281)

Encodes the specified Chain message, length delimited. Does not implicitly [verify](Chain.md#verify) messages.

#### Parameters

##### message

[`IChain`](../interfaces/IChain.md)

Chain message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Chain`](Chain.md)

Defined in: [WAProto/index.d.ts:39314](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39314)

Creates a Chain message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Chain`](Chain.md)

Chain

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39335](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39335)

Gets the default type url for Chain

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

Defined in: [WAProto/index.d.ts:39322](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39322)

Creates a plain object from a Chain message. Also converts values to other types if specified.

#### Parameters

##### message

[`Chain`](Chain.md)

Chain

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39307)

Verifies a Chain message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
