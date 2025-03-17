# Class: KeyExchangeMessage

Defined in: [WAProto/index.d.ts:15488](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15488)

Represents a KeyExchangeMessage.

## Implements

- [`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md)

## Constructors

### new KeyExchangeMessage()

> **new KeyExchangeMessage**(`properties`?): [`KeyExchangeMessage`](KeyExchangeMessage.md)

Defined in: [WAProto/index.d.ts:15494](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15494)

Constructs a new KeyExchangeMessage.

#### Parameters

##### properties?

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md)

Properties to set

#### Returns

[`KeyExchangeMessage`](KeyExchangeMessage.md)

## Properties

### baseKey?

> `optional` **baseKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15500](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15500)

KeyExchangeMessage baseKey.

#### Implementation of

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md).[`baseKey`](../interfaces/IKeyExchangeMessage.md#basekey)

***

### baseKeySignature?

> `optional` **baseKeySignature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15509](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15509)

KeyExchangeMessage baseKeySignature.

#### Implementation of

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md).[`baseKeySignature`](../interfaces/IKeyExchangeMessage.md#basekeysignature)

***

### id?

> `optional` **id**: `null` \| `number`

Defined in: [WAProto/index.d.ts:15497](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15497)

KeyExchangeMessage id.

#### Implementation of

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md).[`id`](../interfaces/IKeyExchangeMessage.md#id)

***

### identityKey?

> `optional` **identityKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15506](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15506)

KeyExchangeMessage identityKey.

#### Implementation of

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md).[`identityKey`](../interfaces/IKeyExchangeMessage.md#identitykey)

***

### ratchetKey?

> `optional` **ratchetKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15503](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15503)

KeyExchangeMessage ratchetKey.

#### Implementation of

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md).[`ratchetKey`](../interfaces/IKeyExchangeMessage.md#ratchetkey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15579](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15579)

Converts this KeyExchangeMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`KeyExchangeMessage`](KeyExchangeMessage.md)

Defined in: [WAProto/index.d.ts:15516](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15516)

Creates a new KeyExchangeMessage instance using the specified properties.

#### Parameters

##### properties?

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md)

Properties to set

#### Returns

[`KeyExchangeMessage`](KeyExchangeMessage.md)

KeyExchangeMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`KeyExchangeMessage`](KeyExchangeMessage.md)

Defined in: [WAProto/index.d.ts:15542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15542)

Decodes a KeyExchangeMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`KeyExchangeMessage`](KeyExchangeMessage.md)

KeyExchangeMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`KeyExchangeMessage`](KeyExchangeMessage.md)

Defined in: [WAProto/index.d.ts:15551](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15551)

Decodes a KeyExchangeMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`KeyExchangeMessage`](KeyExchangeMessage.md)

KeyExchangeMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15524](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15524)

Encodes the specified KeyExchangeMessage message. Does not implicitly [verify](KeyExchangeMessage.md#verify) messages.

#### Parameters

##### message

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md)

KeyExchangeMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15532](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15532)

Encodes the specified KeyExchangeMessage message, length delimited. Does not implicitly [verify](KeyExchangeMessage.md#verify) messages.

#### Parameters

##### message

[`IKeyExchangeMessage`](../interfaces/IKeyExchangeMessage.md)

KeyExchangeMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`KeyExchangeMessage`](KeyExchangeMessage.md)

Defined in: [WAProto/index.d.ts:15565](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15565)

Creates a KeyExchangeMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`KeyExchangeMessage`](KeyExchangeMessage.md)

KeyExchangeMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15586](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15586)

Gets the default type url for KeyExchangeMessage

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

Defined in: [WAProto/index.d.ts:15573](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15573)

Creates a plain object from a KeyExchangeMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`KeyExchangeMessage`](KeyExchangeMessage.md)

KeyExchangeMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15558](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15558)

Verifies a KeyExchangeMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
