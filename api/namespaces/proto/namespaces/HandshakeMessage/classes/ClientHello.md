# Class: ClientHello

Defined in: [WAProto/index.d.ts:14128](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14128)

Represents a ClientHello.

## Implements

- [`IClientHello`](../interfaces/IClientHello.md)

## Constructors

### new ClientHello()

> **new ClientHello**(`properties`?): [`ClientHello`](ClientHello.md)

Defined in: [WAProto/index.d.ts:14134](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14134)

Constructs a new ClientHello.

#### Parameters

##### properties?

[`IClientHello`](../interfaces/IClientHello.md)

Properties to set

#### Returns

[`ClientHello`](ClientHello.md)

## Properties

### ephemeral?

> `optional` **ephemeral**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14137](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14137)

ClientHello ephemeral.

#### Implementation of

[`IClientHello`](../interfaces/IClientHello.md).[`ephemeral`](../interfaces/IClientHello.md#ephemeral)

***

### payload?

> `optional` **payload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14143](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14143)

ClientHello payload.

#### Implementation of

[`IClientHello`](../interfaces/IClientHello.md).[`payload`](../interfaces/IClientHello.md#payload)

***

### static?

> `optional` **static**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:14140](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14140)

ClientHello static.

#### Implementation of

[`IClientHello`](../interfaces/IClientHello.md).[`static`](../interfaces/IClientHello.md#static)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14213)

Converts this ClientHello to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ClientHello`](ClientHello.md)

Defined in: [WAProto/index.d.ts:14150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14150)

Creates a new ClientHello instance using the specified properties.

#### Parameters

##### properties?

[`IClientHello`](../interfaces/IClientHello.md)

Properties to set

#### Returns

[`ClientHello`](ClientHello.md)

ClientHello instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ClientHello`](ClientHello.md)

Defined in: [WAProto/index.d.ts:14176](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14176)

Decodes a ClientHello message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ClientHello`](ClientHello.md)

ClientHello

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ClientHello`](ClientHello.md)

Defined in: [WAProto/index.d.ts:14185](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14185)

Decodes a ClientHello message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ClientHello`](ClientHello.md)

ClientHello

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14158)

Encodes the specified ClientHello message. Does not implicitly [verify](ClientHello.md#verify) messages.

#### Parameters

##### message

[`IClientHello`](../interfaces/IClientHello.md)

ClientHello message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14166)

Encodes the specified ClientHello message, length delimited. Does not implicitly [verify](ClientHello.md#verify) messages.

#### Parameters

##### message

[`IClientHello`](../interfaces/IClientHello.md)

ClientHello message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ClientHello`](ClientHello.md)

Defined in: [WAProto/index.d.ts:14199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14199)

Creates a ClientHello message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ClientHello`](ClientHello.md)

ClientHello

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14220)

Gets the default type url for ClientHello

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

Defined in: [WAProto/index.d.ts:14207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14207)

Creates a plain object from a ClientHello message. Also converts values to other types if specified.

#### Parameters

##### message

[`ClientHello`](ClientHello.md)

ClientHello

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14192](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14192)

Verifies a ClientHello message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
