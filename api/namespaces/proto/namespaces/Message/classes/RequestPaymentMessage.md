# Class: RequestPaymentMessage

Defined in: [WAProto/index.d.ts:30368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30368)

Represents a RequestPaymentMessage.

## Implements

- [`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md)

## Constructors

### new RequestPaymentMessage()

> **new RequestPaymentMessage**(`properties`?): [`RequestPaymentMessage`](RequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:30374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30374)

Constructs a new RequestPaymentMessage.

#### Parameters

##### properties?

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md)

Properties to set

#### Returns

[`RequestPaymentMessage`](RequestPaymentMessage.md)

## Properties

### amount?

> `optional` **amount**: `null` \| [`IMoney`](../../../interfaces/IMoney.md)

Defined in: [WAProto/index.d.ts:30392](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30392)

RequestPaymentMessage amount.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`amount`](../interfaces/IRequestPaymentMessage.md#amount)

***

### amount1000?

> `optional` **amount1000**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30383)

RequestPaymentMessage amount1000.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`amount1000`](../interfaces/IRequestPaymentMessage.md#amount1000)

***

### background?

> `optional` **background**: `null` \| [`IPaymentBackground`](../../../interfaces/IPaymentBackground.md)

Defined in: [WAProto/index.d.ts:30395](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30395)

RequestPaymentMessage background.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`background`](../interfaces/IRequestPaymentMessage.md#background)

***

### currencyCodeIso4217?

> `optional` **currencyCodeIso4217**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30380](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30380)

RequestPaymentMessage currencyCodeIso4217.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`currencyCodeIso4217`](../interfaces/IRequestPaymentMessage.md#currencycodeiso4217)

***

### expiryTimestamp?

> `optional` **expiryTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30389)

RequestPaymentMessage expiryTimestamp.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`expiryTimestamp`](../interfaces/IRequestPaymentMessage.md#expirytimestamp)

***

### noteMessage?

> `optional` **noteMessage**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:30377](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30377)

RequestPaymentMessage noteMessage.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`noteMessage`](../interfaces/IRequestPaymentMessage.md#notemessage)

***

### requestFrom?

> `optional` **requestFrom**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30386)

RequestPaymentMessage requestFrom.

#### Implementation of

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md).[`requestFrom`](../interfaces/IRequestPaymentMessage.md#requestfrom)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30465](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30465)

Converts this RequestPaymentMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RequestPaymentMessage`](RequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:30402](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30402)

Creates a new RequestPaymentMessage instance using the specified properties.

#### Parameters

##### properties?

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md)

Properties to set

#### Returns

[`RequestPaymentMessage`](RequestPaymentMessage.md)

RequestPaymentMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RequestPaymentMessage`](RequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:30428](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30428)

Decodes a RequestPaymentMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RequestPaymentMessage`](RequestPaymentMessage.md)

RequestPaymentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RequestPaymentMessage`](RequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:30437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30437)

Decodes a RequestPaymentMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RequestPaymentMessage`](RequestPaymentMessage.md)

RequestPaymentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30410](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30410)

Encodes the specified RequestPaymentMessage message. Does not implicitly [verify](RequestPaymentMessage.md#verify) messages.

#### Parameters

##### message

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md)

RequestPaymentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30418](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30418)

Encodes the specified RequestPaymentMessage message, length delimited. Does not implicitly [verify](RequestPaymentMessage.md#verify) messages.

#### Parameters

##### message

[`IRequestPaymentMessage`](../interfaces/IRequestPaymentMessage.md)

RequestPaymentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RequestPaymentMessage`](RequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:30451](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30451)

Creates a RequestPaymentMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RequestPaymentMessage`](RequestPaymentMessage.md)

RequestPaymentMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30472)

Gets the default type url for RequestPaymentMessage

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

Defined in: [WAProto/index.d.ts:30459](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30459)

Creates a plain object from a RequestPaymentMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`RequestPaymentMessage`](RequestPaymentMessage.md)

RequestPaymentMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30444)

Verifies a RequestPaymentMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
