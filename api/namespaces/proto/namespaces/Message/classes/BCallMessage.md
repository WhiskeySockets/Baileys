# Class: BCallMessage

Defined in: [WAProto/index.d.ts:18374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18374)

Represents a BCallMessage.

## Implements

- [`IBCallMessage`](../interfaces/IBCallMessage.md)

## Constructors

### new BCallMessage()

> **new BCallMessage**(`properties`?): [`BCallMessage`](BCallMessage.md)

Defined in: [WAProto/index.d.ts:18380](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18380)

Constructs a new BCallMessage.

#### Parameters

##### properties?

[`IBCallMessage`](../interfaces/IBCallMessage.md)

Properties to set

#### Returns

[`BCallMessage`](BCallMessage.md)

## Properties

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18392](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18392)

BCallMessage caption.

#### Implementation of

[`IBCallMessage`](../interfaces/IBCallMessage.md).[`caption`](../interfaces/IBCallMessage.md#caption)

***

### masterKey?

> `optional` **masterKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:18389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18389)

BCallMessage masterKey.

#### Implementation of

[`IBCallMessage`](../interfaces/IBCallMessage.md).[`masterKey`](../interfaces/IBCallMessage.md#masterkey)

***

### mediaType?

> `optional` **mediaType**: `null` \| [`MediaType`](../namespaces/BCallMessage/enumerations/MediaType.md)

Defined in: [WAProto/index.d.ts:18386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18386)

BCallMessage mediaType.

#### Implementation of

[`IBCallMessage`](../interfaces/IBCallMessage.md).[`mediaType`](../interfaces/IBCallMessage.md#mediatype)

***

### sessionId?

> `optional` **sessionId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:18383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18383)

BCallMessage sessionId.

#### Implementation of

[`IBCallMessage`](../interfaces/IBCallMessage.md).[`sessionId`](../interfaces/IBCallMessage.md#sessionid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18462](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18462)

Converts this BCallMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BCallMessage`](BCallMessage.md)

Defined in: [WAProto/index.d.ts:18399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18399)

Creates a new BCallMessage instance using the specified properties.

#### Parameters

##### properties?

[`IBCallMessage`](../interfaces/IBCallMessage.md)

Properties to set

#### Returns

[`BCallMessage`](BCallMessage.md)

BCallMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BCallMessage`](BCallMessage.md)

Defined in: [WAProto/index.d.ts:18425](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18425)

Decodes a BCallMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BCallMessage`](BCallMessage.md)

BCallMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BCallMessage`](BCallMessage.md)

Defined in: [WAProto/index.d.ts:18434](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18434)

Decodes a BCallMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BCallMessage`](BCallMessage.md)

BCallMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18407)

Encodes the specified BCallMessage message. Does not implicitly [verify](BCallMessage.md#verify) messages.

#### Parameters

##### message

[`IBCallMessage`](../interfaces/IBCallMessage.md)

BCallMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18415](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18415)

Encodes the specified BCallMessage message, length delimited. Does not implicitly [verify](BCallMessage.md#verify) messages.

#### Parameters

##### message

[`IBCallMessage`](../interfaces/IBCallMessage.md)

BCallMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BCallMessage`](BCallMessage.md)

Defined in: [WAProto/index.d.ts:18448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18448)

Creates a BCallMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BCallMessage`](BCallMessage.md)

BCallMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18469)

Gets the default type url for BCallMessage

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

Defined in: [WAProto/index.d.ts:18456](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18456)

Creates a plain object from a BCallMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`BCallMessage`](BCallMessage.md)

BCallMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18441)

Verifies a BCallMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
