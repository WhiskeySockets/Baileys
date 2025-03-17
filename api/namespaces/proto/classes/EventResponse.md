# Class: EventResponse

Defined in: [WAProto/index.d.ts:13030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13030)

Represents an EventResponse.

## Implements

- [`IEventResponse`](../interfaces/IEventResponse.md)

## Constructors

### new EventResponse()

> **new EventResponse**(`properties`?): [`EventResponse`](EventResponse.md)

Defined in: [WAProto/index.d.ts:13036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13036)

Constructs a new EventResponse.

#### Parameters

##### properties?

[`IEventResponse`](../interfaces/IEventResponse.md)

Properties to set

#### Returns

[`EventResponse`](EventResponse.md)

## Properties

### eventResponseMessage?

> `optional` **eventResponseMessage**: `null` \| [`IEventResponseMessage`](../namespaces/Message/interfaces/IEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:13045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13045)

EventResponse eventResponseMessage.

#### Implementation of

[`IEventResponse`](../interfaces/IEventResponse.md).[`eventResponseMessage`](../interfaces/IEventResponse.md#eventresponsemessage)

***

### eventResponseMessageKey?

> `optional` **eventResponseMessageKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:13039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13039)

EventResponse eventResponseMessageKey.

#### Implementation of

[`IEventResponse`](../interfaces/IEventResponse.md).[`eventResponseMessageKey`](../interfaces/IEventResponse.md#eventresponsemessagekey)

***

### timestampMs?

> `optional` **timestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:13042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13042)

EventResponse timestampMs.

#### Implementation of

[`IEventResponse`](../interfaces/IEventResponse.md).[`timestampMs`](../interfaces/IEventResponse.md#timestampms)

***

### unread?

> `optional` **unread**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:13048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13048)

EventResponse unread.

#### Implementation of

[`IEventResponse`](../interfaces/IEventResponse.md).[`unread`](../interfaces/IEventResponse.md#unread)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13118)

Converts this EventResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EventResponse`](EventResponse.md)

Defined in: [WAProto/index.d.ts:13055](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13055)

Creates a new EventResponse instance using the specified properties.

#### Parameters

##### properties?

[`IEventResponse`](../interfaces/IEventResponse.md)

Properties to set

#### Returns

[`EventResponse`](EventResponse.md)

EventResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EventResponse`](EventResponse.md)

Defined in: [WAProto/index.d.ts:13081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13081)

Decodes an EventResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EventResponse`](EventResponse.md)

EventResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EventResponse`](EventResponse.md)

Defined in: [WAProto/index.d.ts:13090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13090)

Decodes an EventResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EventResponse`](EventResponse.md)

EventResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13063)

Encodes the specified EventResponse message. Does not implicitly [verify](EventResponse.md#verify) messages.

#### Parameters

##### message

[`IEventResponse`](../interfaces/IEventResponse.md)

EventResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13071](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13071)

Encodes the specified EventResponse message, length delimited. Does not implicitly [verify](EventResponse.md#verify) messages.

#### Parameters

##### message

[`IEventResponse`](../interfaces/IEventResponse.md)

EventResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EventResponse`](EventResponse.md)

Defined in: [WAProto/index.d.ts:13104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13104)

Creates an EventResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EventResponse`](EventResponse.md)

EventResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13125](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13125)

Gets the default type url for EventResponse

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

Defined in: [WAProto/index.d.ts:13112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13112)

Creates a plain object from an EventResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`EventResponse`](EventResponse.md)

EventResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:13097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13097)

Verifies an EventResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
