# Class: KeyExpiration

Defined in: [WAProto/index.d.ts:42762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42762)

Represents a KeyExpiration.

## Implements

- [`IKeyExpiration`](../interfaces/IKeyExpiration.md)

## Constructors

### new KeyExpiration()

> **new KeyExpiration**(`properties`?): [`KeyExpiration`](KeyExpiration.md)

Defined in: [WAProto/index.d.ts:42768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42768)

Constructs a new KeyExpiration.

#### Parameters

##### properties?

[`IKeyExpiration`](../interfaces/IKeyExpiration.md)

Properties to set

#### Returns

[`KeyExpiration`](KeyExpiration.md)

## Properties

### expiredKeyEpoch?

> `optional` **expiredKeyEpoch**: `null` \| `number`

Defined in: [WAProto/index.d.ts:42771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42771)

KeyExpiration expiredKeyEpoch.

#### Implementation of

[`IKeyExpiration`](../interfaces/IKeyExpiration.md).[`expiredKeyEpoch`](../interfaces/IKeyExpiration.md#expiredkeyepoch)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42841)

Converts this KeyExpiration to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`KeyExpiration`](KeyExpiration.md)

Defined in: [WAProto/index.d.ts:42778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42778)

Creates a new KeyExpiration instance using the specified properties.

#### Parameters

##### properties?

[`IKeyExpiration`](../interfaces/IKeyExpiration.md)

Properties to set

#### Returns

[`KeyExpiration`](KeyExpiration.md)

KeyExpiration instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`KeyExpiration`](KeyExpiration.md)

Defined in: [WAProto/index.d.ts:42804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42804)

Decodes a KeyExpiration message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`KeyExpiration`](KeyExpiration.md)

KeyExpiration

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`KeyExpiration`](KeyExpiration.md)

Defined in: [WAProto/index.d.ts:42813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42813)

Decodes a KeyExpiration message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`KeyExpiration`](KeyExpiration.md)

KeyExpiration

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42786](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42786)

Encodes the specified KeyExpiration message. Does not implicitly [verify](KeyExpiration.md#verify) messages.

#### Parameters

##### message

[`IKeyExpiration`](../interfaces/IKeyExpiration.md)

KeyExpiration message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42794](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42794)

Encodes the specified KeyExpiration message, length delimited. Does not implicitly [verify](KeyExpiration.md#verify) messages.

#### Parameters

##### message

[`IKeyExpiration`](../interfaces/IKeyExpiration.md)

KeyExpiration message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`KeyExpiration`](KeyExpiration.md)

Defined in: [WAProto/index.d.ts:42827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42827)

Creates a KeyExpiration message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`KeyExpiration`](KeyExpiration.md)

KeyExpiration

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42848](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42848)

Gets the default type url for KeyExpiration

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

Defined in: [WAProto/index.d.ts:42835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42835)

Creates a plain object from a KeyExpiration message. Also converts values to other types if specified.

#### Parameters

##### message

[`KeyExpiration`](KeyExpiration.md)

KeyExpiration

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42820)

Verifies a KeyExpiration message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
