# Class: AppStateSyncKey

Defined in: [WAProto/index.d.ts:17569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17569)

Represents an AppStateSyncKey.

## Implements

- [`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)

## Constructors

### new AppStateSyncKey()

> **new AppStateSyncKey**(`properties`?): [`AppStateSyncKey`](AppStateSyncKey.md)

Defined in: [WAProto/index.d.ts:17575](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17575)

Constructs a new AppStateSyncKey.

#### Parameters

##### properties?

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)

Properties to set

#### Returns

[`AppStateSyncKey`](AppStateSyncKey.md)

## Properties

### keyData?

> `optional` **keyData**: `null` \| [`IAppStateSyncKeyData`](../interfaces/IAppStateSyncKeyData.md)

Defined in: [WAProto/index.d.ts:17581](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17581)

AppStateSyncKey keyData.

#### Implementation of

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md).[`keyData`](../interfaces/IAppStateSyncKey.md#keydata)

***

### keyId?

> `optional` **keyId**: `null` \| [`IAppStateSyncKeyId`](../interfaces/IAppStateSyncKeyId.md)

Defined in: [WAProto/index.d.ts:17578](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17578)

AppStateSyncKey keyId.

#### Implementation of

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md).[`keyId`](../interfaces/IAppStateSyncKey.md#keyid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17651](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17651)

Converts this AppStateSyncKey to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKey`](AppStateSyncKey.md)

Defined in: [WAProto/index.d.ts:17588](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17588)

Creates a new AppStateSyncKey instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)

Properties to set

#### Returns

[`AppStateSyncKey`](AppStateSyncKey.md)

AppStateSyncKey instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKey`](AppStateSyncKey.md)

Defined in: [WAProto/index.d.ts:17614](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17614)

Decodes an AppStateSyncKey message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKey`](AppStateSyncKey.md)

AppStateSyncKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKey`](AppStateSyncKey.md)

Defined in: [WAProto/index.d.ts:17623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17623)

Decodes an AppStateSyncKey message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKey`](AppStateSyncKey.md)

AppStateSyncKey

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17596)

Encodes the specified AppStateSyncKey message. Does not implicitly [verify](AppStateSyncKey.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)

AppStateSyncKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17604)

Encodes the specified AppStateSyncKey message, length delimited. Does not implicitly [verify](AppStateSyncKey.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)

AppStateSyncKey message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKey`](AppStateSyncKey.md)

Defined in: [WAProto/index.d.ts:17637](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17637)

Creates an AppStateSyncKey message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKey`](AppStateSyncKey.md)

AppStateSyncKey

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17658)

Gets the default type url for AppStateSyncKey

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

Defined in: [WAProto/index.d.ts:17645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17645)

Creates a plain object from an AppStateSyncKey message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKey`](AppStateSyncKey.md)

AppStateSyncKey

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17630)

Verifies an AppStateSyncKey message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
