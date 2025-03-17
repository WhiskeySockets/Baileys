# Class: SignalMessage

Defined in: [WAProto/index.d.ts:39819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39819)

Represents a SignalMessage.

## Implements

- [`ISignalMessage`](../interfaces/ISignalMessage.md)

## Constructors

### new SignalMessage()

> **new SignalMessage**(`properties`?): [`SignalMessage`](SignalMessage.md)

Defined in: [WAProto/index.d.ts:39825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39825)

Constructs a new SignalMessage.

#### Parameters

##### properties?

[`ISignalMessage`](../interfaces/ISignalMessage.md)

Properties to set

#### Returns

[`SignalMessage`](SignalMessage.md)

## Properties

### ciphertext?

> `optional` **ciphertext**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39837](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39837)

SignalMessage ciphertext.

#### Implementation of

[`ISignalMessage`](../interfaces/ISignalMessage.md).[`ciphertext`](../interfaces/ISignalMessage.md#ciphertext)

***

### counter?

> `optional` **counter**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39831)

SignalMessage counter.

#### Implementation of

[`ISignalMessage`](../interfaces/ISignalMessage.md).[`counter`](../interfaces/ISignalMessage.md#counter)

***

### previousCounter?

> `optional` **previousCounter**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39834](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39834)

SignalMessage previousCounter.

#### Implementation of

[`ISignalMessage`](../interfaces/ISignalMessage.md).[`previousCounter`](../interfaces/ISignalMessage.md#previouscounter)

***

### ratchetKey?

> `optional` **ratchetKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39828](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39828)

SignalMessage ratchetKey.

#### Implementation of

[`ISignalMessage`](../interfaces/ISignalMessage.md).[`ratchetKey`](../interfaces/ISignalMessage.md#ratchetkey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39907](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39907)

Converts this SignalMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SignalMessage`](SignalMessage.md)

Defined in: [WAProto/index.d.ts:39844](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39844)

Creates a new SignalMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISignalMessage`](../interfaces/ISignalMessage.md)

Properties to set

#### Returns

[`SignalMessage`](SignalMessage.md)

SignalMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SignalMessage`](SignalMessage.md)

Defined in: [WAProto/index.d.ts:39870](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39870)

Decodes a SignalMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SignalMessage`](SignalMessage.md)

SignalMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SignalMessage`](SignalMessage.md)

Defined in: [WAProto/index.d.ts:39879](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39879)

Decodes a SignalMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SignalMessage`](SignalMessage.md)

SignalMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39852](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39852)

Encodes the specified SignalMessage message. Does not implicitly [verify](SignalMessage.md#verify) messages.

#### Parameters

##### message

[`ISignalMessage`](../interfaces/ISignalMessage.md)

SignalMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39860](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39860)

Encodes the specified SignalMessage message, length delimited. Does not implicitly [verify](SignalMessage.md#verify) messages.

#### Parameters

##### message

[`ISignalMessage`](../interfaces/ISignalMessage.md)

SignalMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SignalMessage`](SignalMessage.md)

Defined in: [WAProto/index.d.ts:39893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39893)

Creates a SignalMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SignalMessage`](SignalMessage.md)

SignalMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39914](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39914)

Gets the default type url for SignalMessage

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

Defined in: [WAProto/index.d.ts:39901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39901)

Creates a plain object from a SignalMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SignalMessage`](SignalMessage.md)

SignalMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39886](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39886)

Verifies a SignalMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
