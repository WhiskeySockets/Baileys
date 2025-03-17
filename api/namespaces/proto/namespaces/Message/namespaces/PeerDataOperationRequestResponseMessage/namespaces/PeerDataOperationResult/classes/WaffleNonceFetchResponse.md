# Class: WaffleNonceFetchResponse

Defined in: [WAProto/index.d.ts:28369](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28369)

Represents a WaffleNonceFetchResponse.

## Implements

- [`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md)

## Constructors

### new WaffleNonceFetchResponse()

> **new WaffleNonceFetchResponse**(`properties`?): [`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:28375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28375)

Constructs a new WaffleNonceFetchResponse.

#### Parameters

##### properties?

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md)

Properties to set

#### Returns

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

## Properties

### nonce?

> `optional` **nonce**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28378)

WaffleNonceFetchResponse nonce.

#### Implementation of

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md).[`nonce`](../interfaces/IWaffleNonceFetchResponse.md#nonce)

***

### waEntFbid?

> `optional` **waEntFbid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28381](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28381)

WaffleNonceFetchResponse waEntFbid.

#### Implementation of

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md).[`waEntFbid`](../interfaces/IWaffleNonceFetchResponse.md#waentfbid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28451](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28451)

Converts this WaffleNonceFetchResponse to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:28388](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28388)

Creates a new WaffleNonceFetchResponse instance using the specified properties.

#### Parameters

##### properties?

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md)

Properties to set

#### Returns

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

WaffleNonceFetchResponse instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:28414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28414)

Decodes a WaffleNonceFetchResponse message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

WaffleNonceFetchResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:28423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28423)

Decodes a WaffleNonceFetchResponse message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

WaffleNonceFetchResponse

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28396)

Encodes the specified WaffleNonceFetchResponse message. Does not implicitly [verify](WaffleNonceFetchResponse.md#verify) messages.

#### Parameters

##### message

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md)

WaffleNonceFetchResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28404](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28404)

Encodes the specified WaffleNonceFetchResponse message, length delimited. Does not implicitly [verify](WaffleNonceFetchResponse.md#verify) messages.

#### Parameters

##### message

[`IWaffleNonceFetchResponse`](../interfaces/IWaffleNonceFetchResponse.md)

WaffleNonceFetchResponse message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

Defined in: [WAProto/index.d.ts:28437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28437)

Creates a WaffleNonceFetchResponse message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

WaffleNonceFetchResponse

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28458](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28458)

Gets the default type url for WaffleNonceFetchResponse

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

Defined in: [WAProto/index.d.ts:28445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28445)

Creates a plain object from a WaffleNonceFetchResponse message. Also converts values to other types if specified.

#### Parameters

##### message

[`WaffleNonceFetchResponse`](WaffleNonceFetchResponse.md)

WaffleNonceFetchResponse

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28430](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28430)

Verifies a WaffleNonceFetchResponse message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
