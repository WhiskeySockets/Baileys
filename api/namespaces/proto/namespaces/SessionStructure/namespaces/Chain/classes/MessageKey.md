# Class: MessageKey

Defined in: [WAProto/index.d.ts:39460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39460)

Represents a MessageKey.

## Implements

- [`IMessageKey`](../interfaces/IMessageKey.md)

## Constructors

### new MessageKey()

> **new MessageKey**(`properties`?): [`MessageKey`](MessageKey.md)

Defined in: [WAProto/index.d.ts:39466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39466)

Constructs a new MessageKey.

#### Parameters

##### properties?

[`IMessageKey`](../interfaces/IMessageKey.md)

Properties to set

#### Returns

[`MessageKey`](MessageKey.md)

## Properties

### cipherKey?

> `optional` **cipherKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39472)

MessageKey cipherKey.

#### Implementation of

[`IMessageKey`](../interfaces/IMessageKey.md).[`cipherKey`](../interfaces/IMessageKey.md#cipherkey)

***

### index?

> `optional` **index**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39469)

MessageKey index.

#### Implementation of

[`IMessageKey`](../interfaces/IMessageKey.md).[`index`](../interfaces/IMessageKey.md#index)

***

### iv?

> `optional` **iv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39478)

MessageKey iv.

#### Implementation of

[`IMessageKey`](../interfaces/IMessageKey.md).[`iv`](../interfaces/IMessageKey.md#iv)

***

### macKey?

> `optional` **macKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39475)

MessageKey macKey.

#### Implementation of

[`IMessageKey`](../interfaces/IMessageKey.md).[`macKey`](../interfaces/IMessageKey.md#mackey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39548)

Converts this MessageKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MessageKey`](MessageKey.md)

Defined in: [WAProto/index.d.ts:39485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39485)

Creates a new MessageKey instance using the specified properties.

#### Parameters

##### properties?

[`IMessageKey`](../interfaces/IMessageKey.md)

Properties to set

#### Returns

[`MessageKey`](MessageKey.md)

MessageKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MessageKey`](MessageKey.md)

Defined in: [WAProto/index.d.ts:39511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39511)

Decodes a MessageKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MessageKey`](MessageKey.md)

MessageKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MessageKey`](MessageKey.md)

Defined in: [WAProto/index.d.ts:39520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39520)

Decodes a MessageKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MessageKey`](MessageKey.md)

MessageKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39493](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39493)

Encodes the specified MessageKey message. Does not implicitly [verify](MessageKey.md#verify) messages.

#### Parameters

##### message

[`IMessageKey`](../interfaces/IMessageKey.md)

MessageKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39501)

Encodes the specified MessageKey message, length delimited. Does not implicitly [verify](MessageKey.md#verify) messages.

#### Parameters

##### message

[`IMessageKey`](../interfaces/IMessageKey.md)

MessageKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MessageKey`](MessageKey.md)

Defined in: [WAProto/index.d.ts:39534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39534)

Creates a MessageKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MessageKey`](MessageKey.md)

MessageKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39555)

Gets the default type url for MessageKey

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

Defined in: [WAProto/index.d.ts:39542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39542)

Creates a plain object from a MessageKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`MessageKey`](MessageKey.md)

MessageKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39527)

Verifies a MessageKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
