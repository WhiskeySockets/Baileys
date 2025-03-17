# Class: DeviceSentMessage

Defined in: [WAProto/index.d.ts:20402](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20402)

Represents a DeviceSentMessage.

## Implements

- [`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md)

## Constructors

### new DeviceSentMessage()

> **new DeviceSentMessage**(`properties`?): [`DeviceSentMessage`](DeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:20408](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20408)

Constructs a new DeviceSentMessage.

#### Parameters

##### properties?

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md)

Properties to set

#### Returns

[`DeviceSentMessage`](DeviceSentMessage.md)

## Properties

### destinationJid?

> `optional` **destinationJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:20411](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20411)

DeviceSentMessage destinationJid.

#### Implementation of

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md).[`destinationJid`](../interfaces/IDeviceSentMessage.md#destinationjid)

***

### message?

> `optional` **message**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:20414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20414)

DeviceSentMessage message.

#### Implementation of

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md).[`message`](../interfaces/IDeviceSentMessage.md#message)

***

### phash?

> `optional` **phash**: `null` \| `string`

Defined in: [WAProto/index.d.ts:20417](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20417)

DeviceSentMessage phash.

#### Implementation of

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md).[`phash`](../interfaces/IDeviceSentMessage.md#phash)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:20487](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20487)

Converts this DeviceSentMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeviceSentMessage`](DeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:20424](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20424)

Creates a new DeviceSentMessage instance using the specified properties.

#### Parameters

##### properties?

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md)

Properties to set

#### Returns

[`DeviceSentMessage`](DeviceSentMessage.md)

DeviceSentMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeviceSentMessage`](DeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:20450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20450)

Decodes a DeviceSentMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeviceSentMessage`](DeviceSentMessage.md)

DeviceSentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeviceSentMessage`](DeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:20459](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20459)

Decodes a DeviceSentMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeviceSentMessage`](DeviceSentMessage.md)

DeviceSentMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20432](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20432)

Encodes the specified DeviceSentMessage message. Does not implicitly [verify](DeviceSentMessage.md#verify) messages.

#### Parameters

##### message

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md)

DeviceSentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:20440](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20440)

Encodes the specified DeviceSentMessage message, length delimited. Does not implicitly [verify](DeviceSentMessage.md#verify) messages.

#### Parameters

##### message

[`IDeviceSentMessage`](../interfaces/IDeviceSentMessage.md)

DeviceSentMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeviceSentMessage`](DeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:20473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20473)

Creates a DeviceSentMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeviceSentMessage`](DeviceSentMessage.md)

DeviceSentMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:20494](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20494)

Gets the default type url for DeviceSentMessage

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

Defined in: [WAProto/index.d.ts:20481](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20481)

Creates a plain object from a DeviceSentMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeviceSentMessage`](DeviceSentMessage.md)

DeviceSentMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:20466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L20466)

Verifies a DeviceSentMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
