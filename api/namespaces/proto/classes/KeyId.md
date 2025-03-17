# Class: KeyId

Defined in: [WAProto/index.d.ts:15597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15597)

Represents a KeyId.

## Implements

- [`IKeyId`](../interfaces/IKeyId.md)

## Constructors

### new KeyId()

> **new KeyId**(`properties`?): [`KeyId`](KeyId.md)

Defined in: [WAProto/index.d.ts:15603](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15603)

Constructs a new KeyId.

#### Parameters

##### properties?

[`IKeyId`](../interfaces/IKeyId.md)

Properties to set

#### Returns

[`KeyId`](KeyId.md)

## Properties

### id?

> `optional` **id**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15606)

KeyId id.

#### Implementation of

[`IKeyId`](../interfaces/IKeyId.md).[`id`](../interfaces/IKeyId.md#id)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15676)

Converts this KeyId to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`KeyId`](KeyId.md)

Defined in: [WAProto/index.d.ts:15613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15613)

Creates a new KeyId instance using the specified properties.

#### Parameters

##### properties?

[`IKeyId`](../interfaces/IKeyId.md)

Properties to set

#### Returns

[`KeyId`](KeyId.md)

KeyId instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`KeyId`](KeyId.md)

Defined in: [WAProto/index.d.ts:15639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15639)

Decodes a KeyId message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`KeyId`](KeyId.md)

KeyId

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`KeyId`](KeyId.md)

Defined in: [WAProto/index.d.ts:15648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15648)

Decodes a KeyId message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`KeyId`](KeyId.md)

KeyId

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15621)

Encodes the specified KeyId message. Does not implicitly [verify](KeyId.md#verify) messages.

#### Parameters

##### message

[`IKeyId`](../interfaces/IKeyId.md)

KeyId message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15629](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15629)

Encodes the specified KeyId message, length delimited. Does not implicitly [verify](KeyId.md#verify) messages.

#### Parameters

##### message

[`IKeyId`](../interfaces/IKeyId.md)

KeyId message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`KeyId`](KeyId.md)

Defined in: [WAProto/index.d.ts:15662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15662)

Creates a KeyId message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`KeyId`](KeyId.md)

KeyId

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15683](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15683)

Gets the default type url for KeyId

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

Defined in: [WAProto/index.d.ts:15670](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15670)

Creates a plain object from a KeyId message. Also converts values to other types if specified.

#### Parameters

##### message

[`KeyId`](KeyId.md)

KeyId

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15655](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15655)

Verifies a KeyId message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
