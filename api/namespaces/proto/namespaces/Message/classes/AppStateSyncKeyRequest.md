# Class: AppStateSyncKeyRequest

Defined in: [WAProto/index.d.ts:17984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17984)

Represents an AppStateSyncKeyRequest.

## Implements

- [`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

## Constructors

### new AppStateSyncKeyRequest()

> **new AppStateSyncKeyRequest**(`properties`?): [`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:17990](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17990)

Constructs a new AppStateSyncKeyRequest.

#### Parameters

##### properties?

[`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

Properties to set

#### Returns

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

## Properties

### keyIds

> **keyIds**: [`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)[]

Defined in: [WAProto/index.d.ts:17993](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17993)

AppStateSyncKeyRequest keyIds.

#### Implementation of

[`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md).[`keyIds`](../interfaces/IAppStateSyncKeyRequest.md#keyids)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18063)

Converts this AppStateSyncKeyRequest to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:18000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18000)

Creates a new AppStateSyncKeyRequest instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

Properties to set

#### Returns

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

AppStateSyncKeyRequest instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:18026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18026)

Decodes an AppStateSyncKeyRequest message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

AppStateSyncKeyRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:18035](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18035)

Decodes an AppStateSyncKeyRequest message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

AppStateSyncKeyRequest

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18008](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18008)

Encodes the specified AppStateSyncKeyRequest message. Does not implicitly [verify](AppStateSyncKeyRequest.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

AppStateSyncKeyRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18016](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18016)

Encodes the specified AppStateSyncKeyRequest message, length delimited. Does not implicitly [verify](AppStateSyncKeyRequest.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

AppStateSyncKeyRequest message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:18049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18049)

Creates an AppStateSyncKeyRequest message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

AppStateSyncKeyRequest

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18070)

Gets the default type url for AppStateSyncKeyRequest

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

Defined in: [WAProto/index.d.ts:18057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18057)

Creates a plain object from an AppStateSyncKeyRequest message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKeyRequest`](AppStateSyncKeyRequest.md)

AppStateSyncKeyRequest

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18042)

Verifies an AppStateSyncKeyRequest message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
