# Class: PollOption

Defined in: [WAProto/index.d.ts:34211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34211)

Represents a PollOption.

## Implements

- [`IPollOption`](../interfaces/IPollOption.md)

## Constructors

### new PollOption()

> **new PollOption**(`properties`?): [`PollOption`](PollOption.md)

Defined in: [WAProto/index.d.ts:34217](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34217)

Constructs a new PollOption.

#### Parameters

##### properties?

[`IPollOption`](../interfaces/IPollOption.md)

Properties to set

#### Returns

[`PollOption`](PollOption.md)

## Properties

### hash?

> `optional` **hash**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34223)

PollOption hash.

#### Implementation of

[`IPollOption`](../interfaces/IPollOption.md).[`hash`](../interfaces/IPollOption.md#hash)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34220)

PollOption name.

#### Implementation of

[`IPollOption`](../interfaces/IPollOption.md).[`name`](../interfaces/IPollOption.md#name)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34293](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34293)

Converts this PollOption to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollOption`](PollOption.md)

Defined in: [WAProto/index.d.ts:34230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34230)

Creates a new PollOption instance using the specified properties.

#### Parameters

##### properties?

[`IPollOption`](../interfaces/IPollOption.md)

Properties to set

#### Returns

[`PollOption`](PollOption.md)

PollOption instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollOption`](PollOption.md)

Defined in: [WAProto/index.d.ts:34256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34256)

Decodes a PollOption message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollOption`](PollOption.md)

PollOption

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollOption`](PollOption.md)

Defined in: [WAProto/index.d.ts:34265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34265)

Decodes a PollOption message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollOption`](PollOption.md)

PollOption

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34238)

Encodes the specified PollOption message. Does not implicitly [verify](PollOption.md#verify) messages.

#### Parameters

##### message

[`IPollOption`](../interfaces/IPollOption.md)

PollOption message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34246)

Encodes the specified PollOption message, length delimited. Does not implicitly [verify](PollOption.md#verify) messages.

#### Parameters

##### message

[`IPollOption`](../interfaces/IPollOption.md)

PollOption message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollOption`](PollOption.md)

Defined in: [WAProto/index.d.ts:34279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34279)

Creates a PollOption message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollOption`](PollOption.md)

PollOption

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34300](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34300)

Gets the default type url for PollOption

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

Defined in: [WAProto/index.d.ts:34287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34287)

Creates a plain object from a PollOption message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollOption`](PollOption.md)

PollOption

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34272)

Verifies a PollOption message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
