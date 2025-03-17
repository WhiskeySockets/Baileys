# Class: PeerDataOperationRequestMessage

Defined in: [WAProto/index.d.ts:26901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26901)

Represents a PeerDataOperationRequestMessage.

## Implements

- [`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

## Constructors

### new PeerDataOperationRequestMessage()

> **new PeerDataOperationRequestMessage**(`properties`?): [`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:26907](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26907)

Constructs a new PeerDataOperationRequestMessage.

#### Parameters

##### properties?

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

Properties to set

#### Returns

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

## Properties

### fullHistorySyncOnDemandRequest?

> `optional` **fullHistorySyncOnDemandRequest**: `null` \| [`IFullHistorySyncOnDemandRequest`](../namespaces/PeerDataOperationRequestMessage/interfaces/IFullHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:26925](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26925)

PeerDataOperationRequestMessage fullHistorySyncOnDemandRequest.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`fullHistorySyncOnDemandRequest`](../interfaces/IPeerDataOperationRequestMessage.md#fullhistorysyncondemandrequest)

***

### historySyncOnDemandRequest?

> `optional` **historySyncOnDemandRequest**: `null` \| [`IHistorySyncOnDemandRequest`](../namespaces/PeerDataOperationRequestMessage/interfaces/IHistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:26919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26919)

PeerDataOperationRequestMessage historySyncOnDemandRequest.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`historySyncOnDemandRequest`](../interfaces/IPeerDataOperationRequestMessage.md#historysyncondemandrequest)

***

### peerDataOperationRequestType?

> `optional` **peerDataOperationRequestType**: `null` \| [`PeerDataOperationRequestType`](../enumerations/PeerDataOperationRequestType.md)

Defined in: [WAProto/index.d.ts:26910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26910)

PeerDataOperationRequestMessage peerDataOperationRequestType.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`peerDataOperationRequestType`](../interfaces/IPeerDataOperationRequestMessage.md#peerdataoperationrequesttype)

***

### placeholderMessageResendRequest

> **placeholderMessageResendRequest**: [`IPlaceholderMessageResendRequest`](../namespaces/PeerDataOperationRequestMessage/interfaces/IPlaceholderMessageResendRequest.md)[]

Defined in: [WAProto/index.d.ts:26922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26922)

PeerDataOperationRequestMessage placeholderMessageResendRequest.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`placeholderMessageResendRequest`](../interfaces/IPeerDataOperationRequestMessage.md#placeholdermessageresendrequest)

***

### requestStickerReupload

> **requestStickerReupload**: [`IRequestStickerReupload`](../namespaces/PeerDataOperationRequestMessage/interfaces/IRequestStickerReupload.md)[]

Defined in: [WAProto/index.d.ts:26913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26913)

PeerDataOperationRequestMessage requestStickerReupload.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`requestStickerReupload`](../interfaces/IPeerDataOperationRequestMessage.md#requeststickerreupload)

***

### requestUrlPreview

> **requestUrlPreview**: [`IRequestUrlPreview`](../namespaces/PeerDataOperationRequestMessage/interfaces/IRequestUrlPreview.md)[]

Defined in: [WAProto/index.d.ts:26916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26916)

PeerDataOperationRequestMessage requestUrlPreview.

#### Implementation of

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md).[`requestUrlPreview`](../interfaces/IPeerDataOperationRequestMessage.md#requesturlpreview)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26995)

Converts this PeerDataOperationRequestMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:26932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26932)

Creates a new PeerDataOperationRequestMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

Properties to set

#### Returns

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:26958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26958)

Decodes a PeerDataOperationRequestMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:26967](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26967)

Decodes a PeerDataOperationRequestMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26940)

Encodes the specified PeerDataOperationRequestMessage message. Does not implicitly [verify](PeerDataOperationRequestMessage.md#verify) messages.

#### Parameters

##### message

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26948](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26948)

Encodes the specified PeerDataOperationRequestMessage message, length delimited. Does not implicitly [verify](PeerDataOperationRequestMessage.md#verify) messages.

#### Parameters

##### message

[`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:26981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26981)

Creates a PeerDataOperationRequestMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27002](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27002)

Gets the default type url for PeerDataOperationRequestMessage

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

Defined in: [WAProto/index.d.ts:26989](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26989)

Creates a plain object from a PeerDataOperationRequestMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PeerDataOperationRequestMessage`](PeerDataOperationRequestMessage.md)

PeerDataOperationRequestMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26974)

Verifies a PeerDataOperationRequestMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
