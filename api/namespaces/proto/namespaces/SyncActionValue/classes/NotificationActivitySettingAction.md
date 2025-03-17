# Class: NotificationActivitySettingAction

Defined in: [WAProto/index.d.ts:44097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44097)

Represents a NotificationActivitySettingAction.

## Implements

- [`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md)

## Constructors

### new NotificationActivitySettingAction()

> **new NotificationActivitySettingAction**(`properties`?): [`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

Defined in: [WAProto/index.d.ts:44103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44103)

Constructs a new NotificationActivitySettingAction.

#### Parameters

##### properties?

[`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md)

Properties to set

#### Returns

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

## Properties

### notificationActivitySetting?

> `optional` **notificationActivitySetting**: `null` \| [`NotificationActivitySetting`](../namespaces/NotificationActivitySettingAction/enumerations/NotificationActivitySetting.md)

Defined in: [WAProto/index.d.ts:44106](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44106)

NotificationActivitySettingAction notificationActivitySetting.

#### Implementation of

[`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md).[`notificationActivitySetting`](../interfaces/INotificationActivitySettingAction.md#notificationactivitysetting)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44176](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44176)

Converts this NotificationActivitySettingAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

Defined in: [WAProto/index.d.ts:44113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44113)

Creates a new NotificationActivitySettingAction instance using the specified properties.

#### Parameters

##### properties?

[`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md)

Properties to set

#### Returns

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

NotificationActivitySettingAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

Defined in: [WAProto/index.d.ts:44139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44139)

Decodes a NotificationActivitySettingAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

NotificationActivitySettingAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

Defined in: [WAProto/index.d.ts:44148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44148)

Decodes a NotificationActivitySettingAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

NotificationActivitySettingAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44121](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44121)

Encodes the specified NotificationActivitySettingAction message. Does not implicitly [verify](NotificationActivitySettingAction.md#verify) messages.

#### Parameters

##### message

[`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md)

NotificationActivitySettingAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44129)

Encodes the specified NotificationActivitySettingAction message, length delimited. Does not implicitly [verify](NotificationActivitySettingAction.md#verify) messages.

#### Parameters

##### message

[`INotificationActivitySettingAction`](../interfaces/INotificationActivitySettingAction.md)

NotificationActivitySettingAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

Defined in: [WAProto/index.d.ts:44162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44162)

Creates a NotificationActivitySettingAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

NotificationActivitySettingAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44183)

Gets the default type url for NotificationActivitySettingAction

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

Defined in: [WAProto/index.d.ts:44170](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44170)

Creates a plain object from a NotificationActivitySettingAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`NotificationActivitySettingAction`](NotificationActivitySettingAction.md)

NotificationActivitySettingAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44155)

Verifies a NotificationActivitySettingAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
