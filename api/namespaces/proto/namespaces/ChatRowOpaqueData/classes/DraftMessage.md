# Class: DraftMessage

Defined in: [WAProto/index.d.ts:7033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7033)

Represents a DraftMessage.

## Implements

- [`IDraftMessage`](../interfaces/IDraftMessage.md)

## Constructors

### new DraftMessage()

> **new DraftMessage**(`properties`?): [`DraftMessage`](DraftMessage.md)

Defined in: [WAProto/index.d.ts:7039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7039)

Constructs a new DraftMessage.

#### Parameters

##### properties?

[`IDraftMessage`](../interfaces/IDraftMessage.md)

Properties to set

#### Returns

[`DraftMessage`](DraftMessage.md)

## Properties

### ctwaContext?

> `optional` **ctwaContext**: `null` \| [`ICtwaContextData`](../namespaces/DraftMessage/interfaces/ICtwaContextData.md)

Defined in: [WAProto/index.d.ts:7051](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7051)

DraftMessage ctwaContext.

#### Implementation of

[`IDraftMessage`](../interfaces/IDraftMessage.md).[`ctwaContext`](../interfaces/IDraftMessage.md#ctwacontext)

***

### ctwaContextLinkData?

> `optional` **ctwaContextLinkData**: `null` \| [`ICtwaContextLinkData`](../namespaces/DraftMessage/interfaces/ICtwaContextLinkData.md)

Defined in: [WAProto/index.d.ts:7048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7048)

DraftMessage ctwaContextLinkData.

#### Implementation of

[`IDraftMessage`](../interfaces/IDraftMessage.md).[`ctwaContextLinkData`](../interfaces/IDraftMessage.md#ctwacontextlinkdata)

***

### omittedUrl?

> `optional` **omittedUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7045)

DraftMessage omittedUrl.

#### Implementation of

[`IDraftMessage`](../interfaces/IDraftMessage.md).[`omittedUrl`](../interfaces/IDraftMessage.md#omittedurl)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7042)

DraftMessage text.

#### Implementation of

[`IDraftMessage`](../interfaces/IDraftMessage.md).[`text`](../interfaces/IDraftMessage.md#text)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:7054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7054)

DraftMessage timestamp.

#### Implementation of

[`IDraftMessage`](../interfaces/IDraftMessage.md).[`timestamp`](../interfaces/IDraftMessage.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7124](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7124)

Converts this DraftMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DraftMessage`](DraftMessage.md)

Defined in: [WAProto/index.d.ts:7061](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7061)

Creates a new DraftMessage instance using the specified properties.

#### Parameters

##### properties?

[`IDraftMessage`](../interfaces/IDraftMessage.md)

Properties to set

#### Returns

[`DraftMessage`](DraftMessage.md)

DraftMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DraftMessage`](DraftMessage.md)

Defined in: [WAProto/index.d.ts:7087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7087)

Decodes a DraftMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DraftMessage`](DraftMessage.md)

DraftMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DraftMessage`](DraftMessage.md)

Defined in: [WAProto/index.d.ts:7096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7096)

Decodes a DraftMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DraftMessage`](DraftMessage.md)

DraftMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7069](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7069)

Encodes the specified DraftMessage message. Does not implicitly [verify](DraftMessage.md#verify) messages.

#### Parameters

##### message

[`IDraftMessage`](../interfaces/IDraftMessage.md)

DraftMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7077](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7077)

Encodes the specified DraftMessage message, length delimited. Does not implicitly [verify](DraftMessage.md#verify) messages.

#### Parameters

##### message

[`IDraftMessage`](../interfaces/IDraftMessage.md)

DraftMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DraftMessage`](DraftMessage.md)

Defined in: [WAProto/index.d.ts:7110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7110)

Creates a DraftMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DraftMessage`](DraftMessage.md)

DraftMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7131](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7131)

Gets the default type url for DraftMessage

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

Defined in: [WAProto/index.d.ts:7118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7118)

Creates a plain object from a DraftMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`DraftMessage`](DraftMessage.md)

DraftMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:7103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7103)

Verifies a DraftMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
