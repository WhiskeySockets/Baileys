# Class: AppStateSyncKeyData

Defined in: [WAProto/index.d.ts:17675](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17675)

Represents an AppStateSyncKeyData.

## Implements

- [`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

## Constructors

### new AppStateSyncKeyData()

> **new AppStateSyncKeyData**(`properties`?): [`AppStateSyncKeyData`](AppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17681)

Constructs a new AppStateSyncKeyData.

#### Parameters

##### properties?

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

Properties to set

#### Returns

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

## Properties

### fingerprint?

> `optional` **fingerprint**: `null` \| [`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17687](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17687)

AppStateSyncKeyData fingerprint.

#### Implementation of

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md).[`fingerprint`](../interfaces/IAppStateSyncKeyData.md#fingerprint)

***

### keyData?

> `optional` **keyData**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:17684](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17684)

AppStateSyncKeyData keyData.

#### Implementation of

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md).[`keyData`](../interfaces/IAppStateSyncKeyData.md#keydata)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:17690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17690)

AppStateSyncKeyData timestamp.

#### Implementation of

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md).[`timestamp`](../interfaces/IAppStateSyncKeyData.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17760](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17760)

Converts this AppStateSyncKeyData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKeyData`](AppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17697](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17697)

Creates a new AppStateSyncKeyData instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

Properties to set

#### Returns

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

AppStateSyncKeyData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKeyData`](AppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17723)

Decodes an AppStateSyncKeyData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

AppStateSyncKeyData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKeyData`](AppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17732)

Decodes an AppStateSyncKeyData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

AppStateSyncKeyData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17705](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17705)

Encodes the specified AppStateSyncKeyData message. Does not implicitly [verify](AppStateSyncKeyData.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

AppStateSyncKeyData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17713](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17713)

Encodes the specified AppStateSyncKeyData message, length delimited. Does not implicitly [verify](AppStateSyncKeyData.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

AppStateSyncKeyData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKeyData`](AppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17746)

Creates an AppStateSyncKeyData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

AppStateSyncKeyData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17767](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17767)

Gets the default type url for AppStateSyncKeyData

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

Defined in: [WAProto/index.d.ts:17754](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17754)

Creates a plain object from an AppStateSyncKeyData message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKeyData`](AppStateSyncKeyData.md)

AppStateSyncKeyData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17739)

Verifies an AppStateSyncKeyData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
