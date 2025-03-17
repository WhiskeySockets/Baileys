# Class: AppStateFatalExceptionNotification

Defined in: [WAProto/index.d.ts:17466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17466)

Represents an AppStateFatalExceptionNotification.

## Implements

- [`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

## Constructors

### new AppStateFatalExceptionNotification()

> **new AppStateFatalExceptionNotification**(`properties`?): [`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:17472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17472)

Constructs a new AppStateFatalExceptionNotification.

#### Parameters

##### properties?

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

Properties to set

#### Returns

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

## Properties

### collectionNames

> **collectionNames**: `string`[]

Defined in: [WAProto/index.d.ts:17475](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17475)

AppStateFatalExceptionNotification collectionNames.

#### Implementation of

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md).[`collectionNames`](../interfaces/IAppStateFatalExceptionNotification.md#collectionnames)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:17478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17478)

AppStateFatalExceptionNotification timestamp.

#### Implementation of

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md).[`timestamp`](../interfaces/IAppStateFatalExceptionNotification.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17548)

Converts this AppStateFatalExceptionNotification to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:17485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17485)

Creates a new AppStateFatalExceptionNotification instance using the specified properties.

#### Parameters

##### properties?

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

Properties to set

#### Returns

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:17511](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17511)

Decodes an AppStateFatalExceptionNotification message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:17520](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17520)

Decodes an AppStateFatalExceptionNotification message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17493](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17493)

Encodes the specified AppStateFatalExceptionNotification message. Does not implicitly [verify](AppStateFatalExceptionNotification.md#verify) messages.

#### Parameters

##### message

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17501](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17501)

Encodes the specified AppStateFatalExceptionNotification message, length delimited. Does not implicitly [verify](AppStateFatalExceptionNotification.md#verify) messages.

#### Parameters

##### message

[`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:17534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17534)

Creates an AppStateFatalExceptionNotification message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17555)

Gets the default type url for AppStateFatalExceptionNotification

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

Defined in: [WAProto/index.d.ts:17542](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17542)

Creates a plain object from an AppStateFatalExceptionNotification message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppStateFatalExceptionNotification`](AppStateFatalExceptionNotification.md)

AppStateFatalExceptionNotification

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17527)

Verifies an AppStateFatalExceptionNotification message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
