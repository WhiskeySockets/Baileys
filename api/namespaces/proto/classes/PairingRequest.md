# Class: PairingRequest

Defined in: [WAProto/index.d.ts:35090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35090)

Represents a PairingRequest.

## Implements

- [`IPairingRequest`](../interfaces/IPairingRequest.md)

## Constructors

### new PairingRequest()

> **new PairingRequest**(`properties`?): [`PairingRequest`](PairingRequest.md)

Defined in: [WAProto/index.d.ts:35096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35096)

Constructs a new PairingRequest.

#### Parameters

##### properties?

[`IPairingRequest`](../interfaces/IPairingRequest.md)

Properties to set

#### Returns

[`PairingRequest`](PairingRequest.md)

## Properties

### advSecret?

> `optional` **advSecret**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35105)

PairingRequest advSecret.

#### Implementation of

[`IPairingRequest`](../interfaces/IPairingRequest.md).[`advSecret`](../interfaces/IPairingRequest.md#advsecret)

***

### companionIdentityKey?

> `optional` **companionIdentityKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35102)

PairingRequest companionIdentityKey.

#### Implementation of

[`IPairingRequest`](../interfaces/IPairingRequest.md).[`companionIdentityKey`](../interfaces/IPairingRequest.md#companionidentitykey)

***

### companionPublicKey?

> `optional` **companionPublicKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:35099](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35099)

PairingRequest companionPublicKey.

#### Implementation of

[`IPairingRequest`](../interfaces/IPairingRequest.md).[`companionPublicKey`](../interfaces/IPairingRequest.md#companionpublickey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:35175](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35175)

Converts this PairingRequest to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PairingRequest`](PairingRequest.md)

Defined in: [WAProto/index.d.ts:35112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35112)

Creates a new PairingRequest instance using the specified properties.

#### Parameters

##### properties?

[`IPairingRequest`](../interfaces/IPairingRequest.md)

Properties to set

#### Returns

[`PairingRequest`](PairingRequest.md)

PairingRequest instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PairingRequest`](PairingRequest.md)

Defined in: [WAProto/index.d.ts:35138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35138)

Decodes a PairingRequest message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PairingRequest`](PairingRequest.md)

PairingRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PairingRequest`](PairingRequest.md)

Defined in: [WAProto/index.d.ts:35147](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35147)

Decodes a PairingRequest message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PairingRequest`](PairingRequest.md)

PairingRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35120)

Encodes the specified PairingRequest message. Does not implicitly [verify](PairingRequest.md#verify) messages.

#### Parameters

##### message

[`IPairingRequest`](../interfaces/IPairingRequest.md)

PairingRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35128](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35128)

Encodes the specified PairingRequest message, length delimited. Does not implicitly [verify](PairingRequest.md#verify) messages.

#### Parameters

##### message

[`IPairingRequest`](../interfaces/IPairingRequest.md)

PairingRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PairingRequest`](PairingRequest.md)

Defined in: [WAProto/index.d.ts:35161](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35161)

Creates a PairingRequest message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PairingRequest`](PairingRequest.md)

PairingRequest

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:35182](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35182)

Gets the default type url for PairingRequest

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

Defined in: [WAProto/index.d.ts:35169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35169)

Creates a plain object from a PairingRequest message. Also converts values to other types if specified.

#### Parameters

##### message

[`PairingRequest`](PairingRequest.md)

PairingRequest

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:35154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35154)

Verifies a PairingRequest message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
