# Class: AppStateSyncKeyId

Defined in: [WAProto/index.d.ts:17887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17887)

Represents an AppStateSyncKeyId.

## Implements

- [`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

## Constructors

### new AppStateSyncKeyId()

> **new AppStateSyncKeyId**(`properties`?): [`AppStateSyncKeyId`](AppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17893)

Constructs a new AppStateSyncKeyId.

#### Parameters

##### properties?

[`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

Properties to set

#### Returns

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

## Properties

### keyId?

> `optional` **keyId**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:17896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17896)

AppStateSyncKeyId keyId.

#### Implementation of

[`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md).[`keyId`](../interfaces/IAppStateSyncKeyId.md#keyid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17966](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17966)

Converts this AppStateSyncKeyId to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKeyId`](AppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17903)

Creates a new AppStateSyncKeyId instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

Properties to set

#### Returns

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

AppStateSyncKeyId instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKeyId`](AppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17929](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17929)

Decodes an AppStateSyncKeyId message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

AppStateSyncKeyId

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKeyId`](AppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17938)

Decodes an AppStateSyncKeyId message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

AppStateSyncKeyId

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17911)

Encodes the specified AppStateSyncKeyId message. Does not implicitly [verify](AppStateSyncKeyId.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

AppStateSyncKeyId message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17919)

Encodes the specified AppStateSyncKeyId message, length delimited. Does not implicitly [verify](AppStateSyncKeyId.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

AppStateSyncKeyId message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKeyId`](AppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17952](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17952)

Creates an AppStateSyncKeyId message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

AppStateSyncKeyId

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17973)

Gets the default type url for AppStateSyncKeyId

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

Defined in: [WAProto/index.d.ts:17960](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17960)

Creates a plain object from an AppStateSyncKeyId message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKeyId`](AppStateSyncKeyId.md)

AppStateSyncKeyId

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17945](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17945)

Verifies an AppStateSyncKeyId message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
