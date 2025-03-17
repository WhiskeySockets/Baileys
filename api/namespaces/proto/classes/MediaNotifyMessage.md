# Class: MediaNotifyMessage

Defined in: [WAProto/index.d.ts:16533](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16533)

Represents a MediaNotifyMessage.

## Implements

- [`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md)

## Constructors

### new MediaNotifyMessage()

> **new MediaNotifyMessage**(`properties`?): [`MediaNotifyMessage`](MediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:16539](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16539)

Constructs a new MediaNotifyMessage.

#### Parameters

##### properties?

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md)

Properties to set

#### Returns

[`MediaNotifyMessage`](MediaNotifyMessage.md)

## Properties

### expressPathUrl?

> `optional` **expressPathUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:16542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16542)

MediaNotifyMessage expressPathUrl.

#### Implementation of

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md).[`expressPathUrl`](../interfaces/IMediaNotifyMessage.md#expresspathurl)

***

### fileEncSha256?

> `optional` **fileEncSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:16545](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16545)

MediaNotifyMessage fileEncSha256.

#### Implementation of

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md).[`fileEncSha256`](../interfaces/IMediaNotifyMessage.md#fileencsha256)

***

### fileLength?

> `optional` **fileLength**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:16548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16548)

MediaNotifyMessage fileLength.

#### Implementation of

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md).[`fileLength`](../interfaces/IMediaNotifyMessage.md#filelength)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:16618](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16618)

Converts this MediaNotifyMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MediaNotifyMessage`](MediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:16555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16555)

Creates a new MediaNotifyMessage instance using the specified properties.

#### Parameters

##### properties?

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md)

Properties to set

#### Returns

[`MediaNotifyMessage`](MediaNotifyMessage.md)

MediaNotifyMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MediaNotifyMessage`](MediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:16581](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16581)

Decodes a MediaNotifyMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MediaNotifyMessage`](MediaNotifyMessage.md)

MediaNotifyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MediaNotifyMessage`](MediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:16590](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16590)

Decodes a MediaNotifyMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MediaNotifyMessage`](MediaNotifyMessage.md)

MediaNotifyMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16563)

Encodes the specified MediaNotifyMessage message. Does not implicitly [verify](MediaNotifyMessage.md#verify) messages.

#### Parameters

##### message

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md)

MediaNotifyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:16571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16571)

Encodes the specified MediaNotifyMessage message, length delimited. Does not implicitly [verify](MediaNotifyMessage.md#verify) messages.

#### Parameters

##### message

[`IMediaNotifyMessage`](../interfaces/IMediaNotifyMessage.md)

MediaNotifyMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MediaNotifyMessage`](MediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:16604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16604)

Creates a MediaNotifyMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MediaNotifyMessage`](MediaNotifyMessage.md)

MediaNotifyMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:16625](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16625)

Gets the default type url for MediaNotifyMessage

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

Defined in: [WAProto/index.d.ts:16612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16612)

Creates a plain object from a MediaNotifyMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`MediaNotifyMessage`](MediaNotifyMessage.md)

MediaNotifyMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:16597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L16597)

Verifies a MediaNotifyMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
