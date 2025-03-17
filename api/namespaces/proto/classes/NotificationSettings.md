# Class: NotificationSettings

Defined in: [WAProto/index.d.ts:34972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34972)

Represents a NotificationSettings.

## Implements

- [`INotificationSettings`](../interfaces/INotificationSettings.md)

## Constructors

### new NotificationSettings()

> **new NotificationSettings**(`properties`?): [`NotificationSettings`](NotificationSettings.md)

Defined in: [WAProto/index.d.ts:34978](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34978)

Constructs a new NotificationSettings.

#### Parameters

##### properties?

[`INotificationSettings`](../interfaces/INotificationSettings.md)

Properties to set

#### Returns

[`NotificationSettings`](NotificationSettings.md)

## Properties

### callVibrate?

> `optional` **callVibrate**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34996](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34996)

NotificationSettings callVibrate.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`callVibrate`](../interfaces/INotificationSettings.md#callvibrate)

***

### lowPriorityNotifications?

> `optional` **lowPriorityNotifications**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:34990](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34990)

NotificationSettings lowPriorityNotifications.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`lowPriorityNotifications`](../interfaces/INotificationSettings.md#lowprioritynotifications)

***

### messageLight?

> `optional` **messageLight**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34987)

NotificationSettings messageLight.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`messageLight`](../interfaces/INotificationSettings.md#messagelight)

***

### messagePopup?

> `optional` **messagePopup**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34984)

NotificationSettings messagePopup.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`messagePopup`](../interfaces/INotificationSettings.md#messagepopup)

***

### messageVibrate?

> `optional` **messageVibrate**: `null` \| `string`

Defined in: [WAProto/index.d.ts:34981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34981)

NotificationSettings messageVibrate.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`messageVibrate`](../interfaces/INotificationSettings.md#messagevibrate)

***

### reactionsMuted?

> `optional` **reactionsMuted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:34993](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34993)

NotificationSettings reactionsMuted.

#### Implementation of

[`INotificationSettings`](../interfaces/INotificationSettings.md).[`reactionsMuted`](../interfaces/INotificationSettings.md#reactionsmuted)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:35066](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35066)

Converts this NotificationSettings to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NotificationSettings`](NotificationSettings.md)

Defined in: [WAProto/index.d.ts:35003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35003)

Creates a new NotificationSettings instance using the specified properties.

#### Parameters

##### properties?

[`INotificationSettings`](../interfaces/INotificationSettings.md)

Properties to set

#### Returns

[`NotificationSettings`](NotificationSettings.md)

NotificationSettings instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NotificationSettings`](NotificationSettings.md)

Defined in: [WAProto/index.d.ts:35029](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35029)

Decodes a NotificationSettings message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NotificationSettings`](NotificationSettings.md)

NotificationSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NotificationSettings`](NotificationSettings.md)

Defined in: [WAProto/index.d.ts:35038](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35038)

Decodes a NotificationSettings message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NotificationSettings`](NotificationSettings.md)

NotificationSettings

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35011](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35011)

Encodes the specified NotificationSettings message. Does not implicitly [verify](NotificationSettings.md#verify) messages.

#### Parameters

##### message

[`INotificationSettings`](../interfaces/INotificationSettings.md)

NotificationSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35019)

Encodes the specified NotificationSettings message, length delimited. Does not implicitly [verify](NotificationSettings.md#verify) messages.

#### Parameters

##### message

[`INotificationSettings`](../interfaces/INotificationSettings.md)

NotificationSettings message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NotificationSettings`](NotificationSettings.md)

Defined in: [WAProto/index.d.ts:35052](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35052)

Creates a NotificationSettings message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NotificationSettings`](NotificationSettings.md)

NotificationSettings

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:35073](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35073)

Gets the default type url for NotificationSettings

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

Defined in: [WAProto/index.d.ts:35060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35060)

Creates a plain object from a NotificationSettings message. Also converts values to other types if specified.

#### Parameters

##### message

[`NotificationSettings`](NotificationSettings.md)

NotificationSettings

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:35045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35045)

Verifies a NotificationSettings message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
