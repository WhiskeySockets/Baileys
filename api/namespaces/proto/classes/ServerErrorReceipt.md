# Class: ServerErrorReceipt

Defined in: [WAProto/index.d.ts:38963](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38963)

Represents a ServerErrorReceipt.

## Implements

- [`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md)

## Constructors

### new ServerErrorReceipt()

> **new ServerErrorReceipt**(`properties`?): [`ServerErrorReceipt`](ServerErrorReceipt.md)

Defined in: [WAProto/index.d.ts:38969](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38969)

Constructs a new ServerErrorReceipt.

#### Parameters

##### properties?

[`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md)

Properties to set

#### Returns

[`ServerErrorReceipt`](ServerErrorReceipt.md)

## Properties

### stanzaId?

> `optional` **stanzaId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:38972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38972)

ServerErrorReceipt stanzaId.

#### Implementation of

[`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md).[`stanzaId`](../interfaces/IServerErrorReceipt.md#stanzaid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39042)

Converts this ServerErrorReceipt to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ServerErrorReceipt`](ServerErrorReceipt.md)

Defined in: [WAProto/index.d.ts:38979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38979)

Creates a new ServerErrorReceipt instance using the specified properties.

#### Parameters

##### properties?

[`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md)

Properties to set

#### Returns

[`ServerErrorReceipt`](ServerErrorReceipt.md)

ServerErrorReceipt instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ServerErrorReceipt`](ServerErrorReceipt.md)

Defined in: [WAProto/index.d.ts:39005](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39005)

Decodes a ServerErrorReceipt message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ServerErrorReceipt`](ServerErrorReceipt.md)

ServerErrorReceipt

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ServerErrorReceipt`](ServerErrorReceipt.md)

Defined in: [WAProto/index.d.ts:39014](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39014)

Decodes a ServerErrorReceipt message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ServerErrorReceipt`](ServerErrorReceipt.md)

ServerErrorReceipt

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38987)

Encodes the specified ServerErrorReceipt message. Does not implicitly [verify](ServerErrorReceipt.md#verify) messages.

#### Parameters

##### message

[`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md)

ServerErrorReceipt message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:38995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L38995)

Encodes the specified ServerErrorReceipt message, length delimited. Does not implicitly [verify](ServerErrorReceipt.md#verify) messages.

#### Parameters

##### message

[`IServerErrorReceipt`](../interfaces/IServerErrorReceipt.md)

ServerErrorReceipt message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ServerErrorReceipt`](ServerErrorReceipt.md)

Defined in: [WAProto/index.d.ts:39028](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39028)

Creates a ServerErrorReceipt message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ServerErrorReceipt`](ServerErrorReceipt.md)

ServerErrorReceipt

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39049)

Gets the default type url for ServerErrorReceipt

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

Defined in: [WAProto/index.d.ts:39036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39036)

Creates a plain object from a ServerErrorReceipt message. Also converts values to other types if specified.

#### Parameters

##### message

[`ServerErrorReceipt`](ServerErrorReceipt.md)

ServerErrorReceipt

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39021](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39021)

Verifies a ServerErrorReceipt message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
