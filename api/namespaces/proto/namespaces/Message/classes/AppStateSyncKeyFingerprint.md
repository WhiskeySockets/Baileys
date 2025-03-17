# Class: AppStateSyncKeyFingerprint

Defined in: [WAProto/index.d.ts:17784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17784)

Represents an AppStateSyncKeyFingerprint.

## Implements

- [`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

## Constructors

### new AppStateSyncKeyFingerprint()

> **new AppStateSyncKeyFingerprint**(`properties`?): [`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17790](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17790)

Constructs a new AppStateSyncKeyFingerprint.

#### Parameters

##### properties?

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

Properties to set

#### Returns

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

## Properties

### currentIndex?

> `optional` **currentIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:17796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17796)

AppStateSyncKeyFingerprint currentIndex.

#### Implementation of

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md).[`currentIndex`](../interfaces/IAppStateSyncKeyFingerprint.md#currentindex)

***

### deviceIndexes

> **deviceIndexes**: `number`[]

Defined in: [WAProto/index.d.ts:17799](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17799)

AppStateSyncKeyFingerprint deviceIndexes.

#### Implementation of

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md).[`deviceIndexes`](../interfaces/IAppStateSyncKeyFingerprint.md#deviceindexes)

***

### rawId?

> `optional` **rawId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:17793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17793)

AppStateSyncKeyFingerprint rawId.

#### Implementation of

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md).[`rawId`](../interfaces/IAppStateSyncKeyFingerprint.md#rawid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17869](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17869)

Converts this AppStateSyncKeyFingerprint to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17806)

Creates a new AppStateSyncKeyFingerprint instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

Properties to set

#### Returns

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17832](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17832)

Decodes an AppStateSyncKeyFingerprint message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17841](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17841)

Decodes an AppStateSyncKeyFingerprint message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17814)

Encodes the specified AppStateSyncKeyFingerprint message. Does not implicitly [verify](AppStateSyncKeyFingerprint.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17822)

Encodes the specified AppStateSyncKeyFingerprint message, length delimited. Does not implicitly [verify](AppStateSyncKeyFingerprint.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyFingerprint`](../interfaces/IAppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

Defined in: [WAProto/index.d.ts:17855](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17855)

Creates an AppStateSyncKeyFingerprint message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17876)

Gets the default type url for AppStateSyncKeyFingerprint

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

Defined in: [WAProto/index.d.ts:17863](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17863)

Creates a plain object from an AppStateSyncKeyFingerprint message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKeyFingerprint`](AppStateSyncKeyFingerprint.md)

AppStateSyncKeyFingerprint

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17848](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17848)

Verifies an AppStateSyncKeyFingerprint message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
