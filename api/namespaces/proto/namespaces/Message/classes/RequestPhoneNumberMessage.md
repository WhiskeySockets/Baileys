# Class: RequestPhoneNumberMessage

Defined in: [WAProto/index.d.ts:30483](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30483)

Represents a RequestPhoneNumberMessage.

## Implements

- [`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md)

## Constructors

### new RequestPhoneNumberMessage()

> **new RequestPhoneNumberMessage**(`properties`?): [`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:30489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30489)

Constructs a new RequestPhoneNumberMessage.

#### Parameters

##### properties?

[`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md)

Properties to set

#### Returns

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:30492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30492)

RequestPhoneNumberMessage contextInfo.

#### Implementation of

[`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md).[`contextInfo`](../interfaces/IRequestPhoneNumberMessage.md#contextinfo)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30562)

Converts this RequestPhoneNumberMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:30499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30499)

Creates a new RequestPhoneNumberMessage instance using the specified properties.

#### Parameters

##### properties?

[`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md)

Properties to set

#### Returns

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

RequestPhoneNumberMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:30525](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30525)

Decodes a RequestPhoneNumberMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

RequestPhoneNumberMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:30534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30534)

Decodes a RequestPhoneNumberMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

RequestPhoneNumberMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30507](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30507)

Encodes the specified RequestPhoneNumberMessage message. Does not implicitly [verify](RequestPhoneNumberMessage.md#verify) messages.

#### Parameters

##### message

[`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md)

RequestPhoneNumberMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30515](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30515)

Encodes the specified RequestPhoneNumberMessage message, length delimited. Does not implicitly [verify](RequestPhoneNumberMessage.md#verify) messages.

#### Parameters

##### message

[`IRequestPhoneNumberMessage`](../interfaces/IRequestPhoneNumberMessage.md)

RequestPhoneNumberMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:30548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30548)

Creates a RequestPhoneNumberMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

RequestPhoneNumberMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30569)

Gets the default type url for RequestPhoneNumberMessage

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

Defined in: [WAProto/index.d.ts:30556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30556)

Creates a plain object from a RequestPhoneNumberMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`RequestPhoneNumberMessage`](RequestPhoneNumberMessage.md)

RequestPhoneNumberMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30541)

Verifies a RequestPhoneNumberMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
