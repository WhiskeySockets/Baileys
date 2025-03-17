# Class: EventResponseMessage

Defined in: [WAProto/index.d.ts:21200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21200)

Represents an EventResponseMessage.

## Implements

- [`IEventResponseMessage`](../interfaces/IEventResponseMessage.md)

## Constructors

### new EventResponseMessage()

> **new EventResponseMessage**(`properties`?): [`EventResponseMessage`](EventResponseMessage.md)

Defined in: [WAProto/index.d.ts:21206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21206)

Constructs a new EventResponseMessage.

#### Parameters

##### properties?

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md)

Properties to set

#### Returns

[`EventResponseMessage`](EventResponseMessage.md)

## Properties

### extraGuestCount?

> `optional` **extraGuestCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:21215](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21215)

EventResponseMessage extraGuestCount.

#### Implementation of

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md).[`extraGuestCount`](../interfaces/IEventResponseMessage.md#extraguestcount)

***

### response?

> `optional` **response**: `null` \| [`EventResponseType`](../namespaces/EventResponseMessage/enumerations/EventResponseType.md)

Defined in: [WAProto/index.d.ts:21209](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21209)

EventResponseMessage response.

#### Implementation of

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md).[`response`](../interfaces/IEventResponseMessage.md#response)

***

### timestampMs?

> `optional` **timestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:21212](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21212)

EventResponseMessage timestampMs.

#### Implementation of

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md).[`timestampMs`](../interfaces/IEventResponseMessage.md#timestampms)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21285)

Converts this EventResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EventResponseMessage`](EventResponseMessage.md)

Defined in: [WAProto/index.d.ts:21222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21222)

Creates a new EventResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md)

Properties to set

#### Returns

[`EventResponseMessage`](EventResponseMessage.md)

EventResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EventResponseMessage`](EventResponseMessage.md)

Defined in: [WAProto/index.d.ts:21248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21248)

Decodes an EventResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EventResponseMessage`](EventResponseMessage.md)

EventResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EventResponseMessage`](EventResponseMessage.md)

Defined in: [WAProto/index.d.ts:21257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21257)

Decodes an EventResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EventResponseMessage`](EventResponseMessage.md)

EventResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21230)

Encodes the specified EventResponseMessage message. Does not implicitly [verify](EventResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md)

EventResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21238)

Encodes the specified EventResponseMessage message, length delimited. Does not implicitly [verify](EventResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IEventResponseMessage`](../interfaces/IEventResponseMessage.md)

EventResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EventResponseMessage`](EventResponseMessage.md)

Defined in: [WAProto/index.d.ts:21271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21271)

Creates an EventResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EventResponseMessage`](EventResponseMessage.md)

EventResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21292)

Gets the default type url for EventResponseMessage

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

Defined in: [WAProto/index.d.ts:21279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21279)

Creates a plain object from an EventResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EventResponseMessage`](EventResponseMessage.md)

EventResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21264)

Verifies an EventResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
