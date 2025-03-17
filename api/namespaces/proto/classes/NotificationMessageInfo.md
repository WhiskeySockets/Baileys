# Class: NotificationMessageInfo

Defined in: [WAProto/index.d.ts:34851](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34851)

Represents a NotificationMessageInfo.

## Implements

- [`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md)

## Constructors

### new NotificationMessageInfo()

> **new NotificationMessageInfo**(`properties`?): [`NotificationMessageInfo`](NotificationMessageInfo.md)

Defined in: [WAProto/index.d.ts:34857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34857)

Constructs a new NotificationMessageInfo.

#### Parameters

##### properties?

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md)

Properties to set

#### Returns

[`NotificationMessageInfo`](NotificationMessageInfo.md)

## Properties

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:34860](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34860)

NotificationMessageInfo key.

#### Implementation of

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md).[`key`](../interfaces/INotificationMessageInfo.md#key)

***

### message?

> `optional` **message**: `null` \| [`IMessage`](../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:34863](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34863)

NotificationMessageInfo message.

#### Implementation of

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md).[`message`](../interfaces/INotificationMessageInfo.md#message)

***

### messageTimestamp?

> `optional` **messageTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:34866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34866)

NotificationMessageInfo messageTimestamp.

#### Implementation of

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md).[`messageTimestamp`](../interfaces/INotificationMessageInfo.md#messagetimestamp)

***

### participant?

> `optional` **participant**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34869](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34869)

NotificationMessageInfo participant.

#### Implementation of

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md).[`participant`](../interfaces/INotificationMessageInfo.md#participant)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34939)

Converts this NotificationMessageInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NotificationMessageInfo`](NotificationMessageInfo.md)

Defined in: [WAProto/index.d.ts:34876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34876)

Creates a new NotificationMessageInfo instance using the specified properties.

#### Parameters

##### properties?

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md)

Properties to set

#### Returns

[`NotificationMessageInfo`](NotificationMessageInfo.md)

NotificationMessageInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NotificationMessageInfo`](NotificationMessageInfo.md)

Defined in: [WAProto/index.d.ts:34902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34902)

Decodes a NotificationMessageInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NotificationMessageInfo`](NotificationMessageInfo.md)

NotificationMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NotificationMessageInfo`](NotificationMessageInfo.md)

Defined in: [WAProto/index.d.ts:34911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34911)

Decodes a NotificationMessageInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NotificationMessageInfo`](NotificationMessageInfo.md)

NotificationMessageInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34884)

Encodes the specified NotificationMessageInfo message. Does not implicitly [verify](NotificationMessageInfo.md#verify) messages.

#### Parameters

##### message

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md)

NotificationMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34892)

Encodes the specified NotificationMessageInfo message, length delimited. Does not implicitly [verify](NotificationMessageInfo.md#verify) messages.

#### Parameters

##### message

[`INotificationMessageInfo`](../interfaces/INotificationMessageInfo.md)

NotificationMessageInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NotificationMessageInfo`](NotificationMessageInfo.md)

Defined in: [WAProto/index.d.ts:34925](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34925)

Creates a NotificationMessageInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NotificationMessageInfo`](NotificationMessageInfo.md)

NotificationMessageInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34946)

Gets the default type url for NotificationMessageInfo

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

Defined in: [WAProto/index.d.ts:34933](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34933)

Creates a plain object from a NotificationMessageInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`NotificationMessageInfo`](NotificationMessageInfo.md)

NotificationMessageInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34918](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34918)

Verifies a NotificationMessageInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
