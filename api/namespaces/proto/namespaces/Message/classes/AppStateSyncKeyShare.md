# Class: AppStateSyncKeyShare

Defined in: [WAProto/index.d.ts:18081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18081)

Represents an AppStateSyncKeyShare.

## Implements

- [`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

## Constructors

### new AppStateSyncKeyShare()

> **new AppStateSyncKeyShare**(`properties`?): [`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:18087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18087)

Constructs a new AppStateSyncKeyShare.

#### Parameters

##### properties?

[`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

Properties to set

#### Returns

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

## Properties

### keys

> **keys**: [`IAppStateSyncKey`](../interfaces/IAppStateSyncKey.md)[]

Defined in: [WAProto/index.d.ts:18090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18090)

AppStateSyncKeyShare keys.

#### Implementation of

[`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md).[`keys`](../interfaces/IAppStateSyncKeyShare.md#keys)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:18160](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18160)

Converts this AppStateSyncKeyShare to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:18097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18097)

Creates a new AppStateSyncKeyShare instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

Properties to set

#### Returns

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

AppStateSyncKeyShare instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:18123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18123)

Decodes an AppStateSyncKeyShare message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

AppStateSyncKeyShare

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:18132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18132)

Decodes an AppStateSyncKeyShare message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

AppStateSyncKeyShare

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18105)

Encodes the specified AppStateSyncKeyShare message. Does not implicitly [verify](AppStateSyncKeyShare.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

AppStateSyncKeyShare message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:18113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18113)

Encodes the specified AppStateSyncKeyShare message, length delimited. Does not implicitly [verify](AppStateSyncKeyShare.md#verify) messages.

#### Parameters

##### message

[`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

AppStateSyncKeyShare message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:18146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18146)

Creates an AppStateSyncKeyShare message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

AppStateSyncKeyShare

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:18167](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18167)

Gets the default type url for AppStateSyncKeyShare

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

Defined in: [WAProto/index.d.ts:18154](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18154)

Creates a plain object from an AppStateSyncKeyShare message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateSyncKeyShare`](AppStateSyncKeyShare.md)

AppStateSyncKeyShare

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:18139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L18139)

Verifies an AppStateSyncKeyShare message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
