# Class: SenderKeyDistributionMessage

Defined in: [WAProto/index.d.ts:38224](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38224)

Represents a SenderKeyDistributionMessage.

## Implements

- [`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

## Constructors

### new SenderKeyDistributionMessage()

> **new SenderKeyDistributionMessage**(`properties`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:38230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38230)

Constructs a new SenderKeyDistributionMessage.

#### Parameters

##### properties?

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

Properties to set

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

## Properties

### chainKey?

> `optional` **chainKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38239](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38239)

SenderKeyDistributionMessage chainKey.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`chainKey`](../interfaces/ISenderKeyDistributionMessage.md#chainkey)

***

### id?

> `optional` **id**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38233](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38233)

SenderKeyDistributionMessage id.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`id`](../interfaces/ISenderKeyDistributionMessage.md#id)

***

### iteration?

> `optional` **iteration**: `null` \| `number`

Defined in: [WAProto/index.d.ts:38236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38236)

SenderKeyDistributionMessage iteration.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`iteration`](../interfaces/ISenderKeyDistributionMessage.md#iteration)

***

### signingKey?

> `optional` **signingKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:38242](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38242)

SenderKeyDistributionMessage signingKey.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`signingKey`](../interfaces/ISenderKeyDistributionMessage.md#signingkey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:38312](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38312)

Converts this SenderKeyDistributionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:38249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38249)

Creates a new SenderKeyDistributionMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

Properties to set

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:38275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38275)

Decodes a SenderKeyDistributionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:38284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38284)

Decodes a SenderKeyDistributionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38257)

Encodes the specified SenderKeyDistributionMessage message. Does not implicitly [verify](SenderKeyDistributionMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

SenderKeyDistributionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38265)

Encodes the specified SenderKeyDistributionMessage message, length delimited. Does not implicitly [verify](SenderKeyDistributionMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

SenderKeyDistributionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:38298](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38298)

Creates a SenderKeyDistributionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:38319](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38319)

Gets the default type url for SenderKeyDistributionMessage

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

Defined in: [WAProto/index.d.ts:38306](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38306)

Creates a plain object from a SenderKeyDistributionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:38291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38291)

Verifies a SenderKeyDistributionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
