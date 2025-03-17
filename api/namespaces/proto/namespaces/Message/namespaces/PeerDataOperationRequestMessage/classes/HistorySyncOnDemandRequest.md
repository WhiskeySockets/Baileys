# Class: HistorySyncOnDemandRequest

Defined in: [WAProto/index.d.ts:27133](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27133)

Represents a HistorySyncOnDemandRequest.

## Implements

- [`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md)

## Constructors

### new HistorySyncOnDemandRequest()

> **new HistorySyncOnDemandRequest**(`properties`?): [`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27139)

Constructs a new HistorySyncOnDemandRequest.

#### Parameters

##### properties?

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md)

Properties to set

#### Returns

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

## Properties

### accountLid?

> `optional` **accountLid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27157](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27157)

HistorySyncOnDemandRequest accountLid.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`accountLid`](../interfaces/IHistorySyncOnDemandRequest.md#accountlid)

***

### chatJid?

> `optional` **chatJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27142](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27142)

HistorySyncOnDemandRequest chatJid.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`chatJid`](../interfaces/IHistorySyncOnDemandRequest.md#chatjid)

***

### oldestMsgFromMe?

> `optional` **oldestMsgFromMe**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:27148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27148)

HistorySyncOnDemandRequest oldestMsgFromMe.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`oldestMsgFromMe`](../interfaces/IHistorySyncOnDemandRequest.md#oldestmsgfromme)

***

### oldestMsgId?

> `optional` **oldestMsgId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:27145](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27145)

HistorySyncOnDemandRequest oldestMsgId.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`oldestMsgId`](../interfaces/IHistorySyncOnDemandRequest.md#oldestmsgid)

***

### oldestMsgTimestampMs?

> `optional` **oldestMsgTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:27154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27154)

HistorySyncOnDemandRequest oldestMsgTimestampMs.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`oldestMsgTimestampMs`](../interfaces/IHistorySyncOnDemandRequest.md#oldestmsgtimestampms)

***

### onDemandMsgCount?

> `optional` **onDemandMsgCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:27151](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27151)

HistorySyncOnDemandRequest onDemandMsgCount.

#### Implementation of

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md).[`onDemandMsgCount`](../interfaces/IHistorySyncOnDemandRequest.md#ondemandmsgcount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:27227](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27227)

Converts this HistorySyncOnDemandRequest to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27164)

Creates a new HistorySyncOnDemandRequest instance using the specified properties.

#### Parameters

##### properties?

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md)

Properties to set

#### Returns

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27190)

Decodes a HistorySyncOnDemandRequest message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27199](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27199)

Decodes a HistorySyncOnDemandRequest message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27172](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27172)

Encodes the specified HistorySyncOnDemandRequest message. Does not implicitly [verify](HistorySyncOnDemandRequest.md#verify) messages.

#### Parameters

##### message

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:27180](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27180)

Encodes the specified HistorySyncOnDemandRequest message, length delimited. Does not implicitly [verify](HistorySyncOnDemandRequest.md#verify) messages.

#### Parameters

##### message

[`IHistorySyncOnDemandRequest`](../interfaces/IHistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

Defined in: [WAProto/index.d.ts:27213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27213)

Creates a HistorySyncOnDemandRequest message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:27234](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27234)

Gets the default type url for HistorySyncOnDemandRequest

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

Defined in: [WAProto/index.d.ts:27221](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27221)

Creates a plain object from a HistorySyncOnDemandRequest message. Also converts values to other types if specified.

#### Parameters

##### message

[`HistorySyncOnDemandRequest`](HistorySyncOnDemandRequest.md)

HistorySyncOnDemandRequest

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:27206](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L27206)

Verifies a HistorySyncOnDemandRequest message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
