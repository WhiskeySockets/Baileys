# Class: ServerHello

Defined in: [WAProto/index.d.ts:14237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14237)

Represents a ServerHello.

## Implements

- [`IServerHello`](../interfaces/IServerHello.md)

## Constructors

### new ServerHello()

> **new ServerHello**(`properties`?): [`ServerHello`](ServerHello.md)

Defined in: [WAProto/index.d.ts:14243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14243)

Constructs a new ServerHello.

#### Parameters

##### properties?

[`IServerHello`](../interfaces/IServerHello.md)

Properties to set

#### Returns

[`ServerHello`](ServerHello.md)

## Properties

### ephemeral?

> `optional` **ephemeral**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14246)

ServerHello ephemeral.

#### Implementation of

[`IServerHello`](../interfaces/IServerHello.md).[`ephemeral`](../interfaces/IServerHello.md#ephemeral)

***

### payload?

> `optional` **payload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14252](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14252)

ServerHello payload.

#### Implementation of

[`IServerHello`](../interfaces/IServerHello.md).[`payload`](../interfaces/IServerHello.md#payload)

***

### static?

> `optional` **static**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14249)

ServerHello static.

#### Implementation of

[`IServerHello`](../interfaces/IServerHello.md).[`static`](../interfaces/IServerHello.md#static)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14322](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14322)

Converts this ServerHello to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ServerHello`](ServerHello.md)

Defined in: [WAProto/index.d.ts:14259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14259)

Creates a new ServerHello instance using the specified properties.

#### Parameters

##### properties?

[`IServerHello`](../interfaces/IServerHello.md)

Properties to set

#### Returns

[`ServerHello`](ServerHello.md)

ServerHello instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ServerHello`](ServerHello.md)

Defined in: [WAProto/index.d.ts:14285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14285)

Decodes a ServerHello message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ServerHello`](ServerHello.md)

ServerHello

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ServerHello`](ServerHello.md)

Defined in: [WAProto/index.d.ts:14294](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14294)

Decodes a ServerHello message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ServerHello`](ServerHello.md)

ServerHello

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14267](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14267)

Encodes the specified ServerHello message. Does not implicitly [verify](ServerHello.md#verify) messages.

#### Parameters

##### message

[`IServerHello`](../interfaces/IServerHello.md)

ServerHello message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14275)

Encodes the specified ServerHello message, length delimited. Does not implicitly [verify](ServerHello.md#verify) messages.

#### Parameters

##### message

[`IServerHello`](../interfaces/IServerHello.md)

ServerHello message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ServerHello`](ServerHello.md)

Defined in: [WAProto/index.d.ts:14308](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14308)

Creates a ServerHello message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ServerHello`](ServerHello.md)

ServerHello

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14329](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14329)

Gets the default type url for ServerHello

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

Defined in: [WAProto/index.d.ts:14316](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14316)

Creates a plain object from a ServerHello message. Also converts values to other types if specified.

#### Parameters

##### message

[`ServerHello`](ServerHello.md)

ServerHello

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14301)

Verifies a ServerHello message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
