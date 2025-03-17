# Class: ProtocolMessage

Defined in: [WAProto/index.d.ts:30048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30048)

Represents a ProtocolMessage.

## Implements

- [`IProtocolMessage`](../interfaces/IProtocolMessage.md)

## Constructors

### new ProtocolMessage()

> **new ProtocolMessage**(`properties`?): [`ProtocolMessage`](ProtocolMessage.md)

Defined in: [WAProto/index.d.ts:30054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30054)

Constructs a new ProtocolMessage.

#### Parameters

##### properties?

[`IProtocolMessage`](../interfaces/IProtocolMessage.md)

Properties to set

#### Returns

[`ProtocolMessage`](ProtocolMessage.md)

## Properties

### appStateFatalExceptionNotification?

> `optional` **appStateFatalExceptionNotification**: `null` \| [`IAppStateFatalExceptionNotification`](../interfaces/IAppStateFatalExceptionNotification.md)

Defined in: [WAProto/index.d.ts:30081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30081)

ProtocolMessage appStateFatalExceptionNotification.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`appStateFatalExceptionNotification`](../interfaces/IProtocolMessage.md#appstatefatalexceptionnotification)

***

### appStateSyncKeyRequest?

> `optional` **appStateSyncKeyRequest**: `null` \| [`IAppStateSyncKeyRequest`](../interfaces/IAppStateSyncKeyRequest.md)

Defined in: [WAProto/index.d.ts:30075](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30075)

ProtocolMessage appStateSyncKeyRequest.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`appStateSyncKeyRequest`](../interfaces/IProtocolMessage.md#appstatesynckeyrequest)

***

### appStateSyncKeyShare?

> `optional` **appStateSyncKeyShare**: `null` \| [`IAppStateSyncKeyShare`](../interfaces/IAppStateSyncKeyShare.md)

Defined in: [WAProto/index.d.ts:30072](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30072)

ProtocolMessage appStateSyncKeyShare.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`appStateSyncKeyShare`](../interfaces/IProtocolMessage.md#appstatesynckeyshare)

***

### botFeedbackMessage?

> `optional` **botFeedbackMessage**: `null` \| [`IBotFeedbackMessage`](../interfaces/IBotFeedbackMessage.md)

Defined in: [WAProto/index.d.ts:30099](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30099)

ProtocolMessage botFeedbackMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`botFeedbackMessage`](../interfaces/IProtocolMessage.md#botfeedbackmessage)

***

### cloudApiThreadControlNotification?

> `optional` **cloudApiThreadControlNotification**: `null` \| [`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:30111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30111)

ProtocolMessage cloudApiThreadControlNotification.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`cloudApiThreadControlNotification`](../interfaces/IProtocolMessage.md#cloudapithreadcontrolnotification)

***

### disappearingMode?

> `optional` **disappearingMode**: `null` \| [`IDisappearingMode`](../../../interfaces/IDisappearingMode.md)

Defined in: [WAProto/index.d.ts:30084](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30084)

ProtocolMessage disappearingMode.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`disappearingMode`](../interfaces/IProtocolMessage.md#disappearingmode)

***

### editedMessage?

> `optional` **editedMessage**: `null` \| [`IMessage`](../../../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:30087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30087)

ProtocolMessage editedMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`editedMessage`](../interfaces/IProtocolMessage.md#editedmessage)

***

### ephemeralExpiration?

> `optional` **ephemeralExpiration**: `null` \| `number`

Defined in: [WAProto/index.d.ts:30063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30063)

ProtocolMessage ephemeralExpiration.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`ephemeralExpiration`](../interfaces/IProtocolMessage.md#ephemeralexpiration)

***

### ephemeralSettingTimestamp?

> `optional` **ephemeralSettingTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30066](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30066)

ProtocolMessage ephemeralSettingTimestamp.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`ephemeralSettingTimestamp`](../interfaces/IProtocolMessage.md#ephemeralsettingtimestamp)

***

### historySyncNotification?

> `optional` **historySyncNotification**: `null` \| [`IHistorySyncNotification`](../interfaces/IHistorySyncNotification.md)

Defined in: [WAProto/index.d.ts:30069](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30069)

ProtocolMessage historySyncNotification.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`historySyncNotification`](../interfaces/IProtocolMessage.md#historysyncnotification)

***

### initialSecurityNotificationSettingSync?

> `optional` **initialSecurityNotificationSettingSync**: `null` \| [`IInitialSecurityNotificationSettingSync`](../interfaces/IInitialSecurityNotificationSettingSync.md)

Defined in: [WAProto/index.d.ts:30078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30078)

ProtocolMessage initialSecurityNotificationSettingSync.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`initialSecurityNotificationSettingSync`](../interfaces/IProtocolMessage.md#initialsecuritynotificationsettingsync)

***

### invokerJid?

> `optional` **invokerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:30102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30102)

ProtocolMessage invokerJid.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`invokerJid`](../interfaces/IProtocolMessage.md#invokerjid)

***

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:30057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30057)

ProtocolMessage key.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`key`](../interfaces/IProtocolMessage.md#key)

***

### lidMigrationMappingSyncMessage?

> `optional` **lidMigrationMappingSyncMessage**: `null` \| [`ILIDMigrationMappingSyncMessage`](../../../interfaces/ILIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:30114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30114)

ProtocolMessage lidMigrationMappingSyncMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`lidMigrationMappingSyncMessage`](../interfaces/IProtocolMessage.md#lidmigrationmappingsyncmessage)

***

### limitSharing?

> `optional` **limitSharing**: `null` \| [`ILimitSharing`](../../../interfaces/ILimitSharing.md)

Defined in: [WAProto/index.d.ts:30117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30117)

ProtocolMessage limitSharing.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`limitSharing`](../interfaces/IProtocolMessage.md#limitsharing)

***

### mediaNotifyMessage?

> `optional` **mediaNotifyMessage**: `null` \| [`IMediaNotifyMessage`](../../../interfaces/IMediaNotifyMessage.md)

Defined in: [WAProto/index.d.ts:30108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30108)

ProtocolMessage mediaNotifyMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`mediaNotifyMessage`](../interfaces/IProtocolMessage.md#medianotifymessage)

***

### peerDataOperationRequestMessage?

> `optional` **peerDataOperationRequestMessage**: `null` \| [`IPeerDataOperationRequestMessage`](../interfaces/IPeerDataOperationRequestMessage.md)

Defined in: [WAProto/index.d.ts:30093](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30093)

ProtocolMessage peerDataOperationRequestMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`peerDataOperationRequestMessage`](../interfaces/IProtocolMessage.md#peerdataoperationrequestmessage)

***

### peerDataOperationRequestResponseMessage?

> `optional` **peerDataOperationRequestResponseMessage**: `null` \| [`IPeerDataOperationRequestResponseMessage`](../interfaces/IPeerDataOperationRequestResponseMessage.md)

Defined in: [WAProto/index.d.ts:30096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30096)

ProtocolMessage peerDataOperationRequestResponseMessage.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`peerDataOperationRequestResponseMessage`](../interfaces/IProtocolMessage.md#peerdataoperationrequestresponsemessage)

***

### requestWelcomeMessageMetadata?

> `optional` **requestWelcomeMessageMetadata**: `null` \| [`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30105)

ProtocolMessage requestWelcomeMessageMetadata.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`requestWelcomeMessageMetadata`](../interfaces/IProtocolMessage.md#requestwelcomemessagemetadata)

***

### timestampMs?

> `optional` **timestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:30090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30090)

ProtocolMessage timestampMs.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`timestampMs`](../interfaces/IProtocolMessage.md#timestampms)

***

### type?

> `optional` **type**: `null` \| [`Type`](../namespaces/ProtocolMessage/enumerations/Type.md)

Defined in: [WAProto/index.d.ts:30060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30060)

ProtocolMessage type.

#### Implementation of

[`IProtocolMessage`](../interfaces/IProtocolMessage.md).[`type`](../interfaces/IProtocolMessage.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30187](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30187)

Converts this ProtocolMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProtocolMessage`](ProtocolMessage.md)

Defined in: [WAProto/index.d.ts:30124](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30124)

Creates a new ProtocolMessage instance using the specified properties.

#### Parameters

##### properties?

[`IProtocolMessage`](../interfaces/IProtocolMessage.md)

Properties to set

#### Returns

[`ProtocolMessage`](ProtocolMessage.md)

ProtocolMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProtocolMessage`](ProtocolMessage.md)

Defined in: [WAProto/index.d.ts:30150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30150)

Decodes a ProtocolMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProtocolMessage`](ProtocolMessage.md)

ProtocolMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProtocolMessage`](ProtocolMessage.md)

Defined in: [WAProto/index.d.ts:30159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30159)

Decodes a ProtocolMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProtocolMessage`](ProtocolMessage.md)

ProtocolMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30132)

Encodes the specified ProtocolMessage message. Does not implicitly [verify](ProtocolMessage.md#verify) messages.

#### Parameters

##### message

[`IProtocolMessage`](../interfaces/IProtocolMessage.md)

ProtocolMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30140](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30140)

Encodes the specified ProtocolMessage message, length delimited. Does not implicitly [verify](ProtocolMessage.md#verify) messages.

#### Parameters

##### message

[`IProtocolMessage`](../interfaces/IProtocolMessage.md)

ProtocolMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProtocolMessage`](ProtocolMessage.md)

Defined in: [WAProto/index.d.ts:30173](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30173)

Creates a ProtocolMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProtocolMessage`](ProtocolMessage.md)

ProtocolMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30194)

Gets the default type url for ProtocolMessage

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

Defined in: [WAProto/index.d.ts:30181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30181)

Creates a plain object from a ProtocolMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProtocolMessage`](ProtocolMessage.md)

ProtocolMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30166)

Verifies a ProtocolMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
