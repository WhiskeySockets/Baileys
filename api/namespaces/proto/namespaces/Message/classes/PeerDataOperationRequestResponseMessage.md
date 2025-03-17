# Class: PeerDataOperationRequestResponseMessage

Defined in: [WAProto/index.d.ts:27549](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27549)

Represents a PeerDataOperationRequestResponseMessage.

## Implements

- [`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

## Constructors

### new PeerDataOperationRequestResponseMessage()

> **new PeerDataOperationRequestResponseMessage**(`properties`?): [`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:27555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27555)

Constructs a new PeerDataOperationRequestResponseMessage.

#### Parameters

##### properties?

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

Properties to set

#### Returns

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

## Properties

### peerDataOperationRequestType?

> `optional` **peerDataOperationRequestType**: `null` \| [`PeerDataOperationRequestType`](../enumerations/PeerDataOperationRequestType.md)

Defined in: [WAProto/index.d.ts:27558](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27558)

PeerDataOperationRequestResponseMessage peerDataOperationRequestType.

#### Implementation of

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md).[`peerDataOperationRequestType`](../interfaces/IPeerDataOperationRequestResponseMessage.md#peerdataoperationrequesttype)

***

### peerDataOperationResult

> **peerDataOperationResult**: [`IPeerDataOperationResult`](../namespaces/PeerDataOperationRequestResponseMessage/interfaces/IPeerDataOperationResult.md)[]

Defined in: [WAProto/index.d.ts:27564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27564)

PeerDataOperationRequestResponseMessage peerDataOperationResult.

#### Implementation of

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md).[`peerDataOperationResult`](../interfaces/IPeerDataOperationRequestResponseMessage.md#peerdataoperationresult)

***

### stanzaId?

> `optional` **stanzaId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27561](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27561)

PeerDataOperationRequestResponseMessage stanzaId.

#### Implementation of

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md).[`stanzaId`](../interfaces/IPeerDataOperationRequestResponseMessage.md#stanzaid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27634](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27634)

Converts this PeerDataOperationRequestResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:27571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27571)

Creates a new PeerDataOperationRequestResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

Properties to set

#### Returns

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:27597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27597)

Decodes a PeerDataOperationRequestResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:27606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27606)

Decodes a PeerDataOperationRequestResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27579](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27579)

Encodes the specified PeerDataOperationRequestResponseMessage message. Does not implicitly [verify](PeerDataOperationRequestResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27587](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27587)

Encodes the specified PeerDataOperationRequestResponseMessage message, length delimited. Does not implicitly [verify](PeerDataOperationRequestResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:27620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27620)

Creates a PeerDataOperationRequestResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27641](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27641)

Gets the default type url for PeerDataOperationRequestResponseMessage

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

Defined in: [WAProto/index.d.ts:27628](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27628)

Creates a plain object from a PeerDataOperationRequestResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PeerDataOperationRequestResponseMessage`](PeerDataOperationRequestResponseMessage.md)

PeerDataOperationRequestResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27613)

Verifies a PeerDataOperationRequestResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
