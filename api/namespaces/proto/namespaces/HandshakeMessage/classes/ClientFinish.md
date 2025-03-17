# Class: ClientFinish

Defined in: [WAProto/index.d.ts:14022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14022)

Represents a ClientFinish.

## Implements

- [`IClientFinish`](../interfaces/IClientFinish.md)

## Constructors

### new ClientFinish()

> **new ClientFinish**(`properties`?): [`ClientFinish`](ClientFinish.md)

Defined in: [WAProto/index.d.ts:14028](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14028)

Constructs a new ClientFinish.

#### Parameters

##### properties?

[`IClientFinish`](../interfaces/IClientFinish.md)

Properties to set

#### Returns

[`ClientFinish`](ClientFinish.md)

## Properties

### payload?

> `optional` **payload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14034](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14034)

ClientFinish payload.

#### Implementation of

[`IClientFinish`](../interfaces/IClientFinish.md).[`payload`](../interfaces/IClientFinish.md#payload)

***

### static?

> `optional` **static**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14031](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14031)

ClientFinish static.

#### Implementation of

[`IClientFinish`](../interfaces/IClientFinish.md).[`static`](../interfaces/IClientFinish.md#static)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14104)

Converts this ClientFinish to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ClientFinish`](ClientFinish.md)

Defined in: [WAProto/index.d.ts:14041](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14041)

Creates a new ClientFinish instance using the specified properties.

#### Parameters

##### properties?

[`IClientFinish`](../interfaces/IClientFinish.md)

Properties to set

#### Returns

[`ClientFinish`](ClientFinish.md)

ClientFinish instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ClientFinish`](ClientFinish.md)

Defined in: [WAProto/index.d.ts:14067](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14067)

Decodes a ClientFinish message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ClientFinish`](ClientFinish.md)

ClientFinish

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ClientFinish`](ClientFinish.md)

Defined in: [WAProto/index.d.ts:14076](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14076)

Decodes a ClientFinish message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ClientFinish`](ClientFinish.md)

ClientFinish

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14049)

Encodes the specified ClientFinish message. Does not implicitly [verify](ClientFinish.md#verify) messages.

#### Parameters

##### message

[`IClientFinish`](../interfaces/IClientFinish.md)

ClientFinish message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14057)

Encodes the specified ClientFinish message, length delimited. Does not implicitly [verify](ClientFinish.md#verify) messages.

#### Parameters

##### message

[`IClientFinish`](../interfaces/IClientFinish.md)

ClientFinish message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ClientFinish`](ClientFinish.md)

Defined in: [WAProto/index.d.ts:14090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14090)

Creates a ClientFinish message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ClientFinish`](ClientFinish.md)

ClientFinish

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14111)

Gets the default type url for ClientFinish

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

Defined in: [WAProto/index.d.ts:14098](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14098)

Creates a plain object from a ClientFinish message. Also converts values to other types if specified.

#### Parameters

##### message

[`ClientFinish`](ClientFinish.md)

ClientFinish

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14083](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14083)

Verifies a ClientFinish message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
