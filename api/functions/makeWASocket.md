# Function: makeWASocket()

> **makeWASocket**(`config`): `object`

Defined in: [src/Socket/index.ts:6](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Socket/index.ts#L6)

## Parameters

### config

[`UserFacingSocketConfig`](../type-aliases/UserFacingSocketConfig.md)

## Returns

`object`

### addChatLabel()

> **addChatLabel**: (`jid`, `labelId`) => `Promise`\<`void`\>

Adds label for the chats

#### Parameters

##### jid

`string`

##### labelId

`string`

#### Returns

`Promise`\<`void`\>

### addLabel()

> **addLabel**: (`jid`, `labels`) => `Promise`\<`void`\>

Adds label

#### Parameters

##### jid

`string`

##### labels

`LabelActionBody`

#### Returns

`Promise`\<`void`\>

### addMessageLabel()

> **addMessageLabel**: (`jid`, `messageId`, `labelId`) => `Promise`\<`void`\>

Adds label for the message

#### Parameters

##### jid

`string`

##### messageId

`string`

##### labelId

`string`

#### Returns

`Promise`\<`void`\>

### appPatch()

> **appPatch**: (`patchCreate`) => `Promise`\<`void`\>

#### Parameters

##### patchCreate

[`WAPatchCreate`](../type-aliases/WAPatchCreate.md)

#### Returns

`Promise`\<`void`\>

### assertSessions()

> **assertSessions**: (`jids`, `force`) => `Promise`\<`boolean`\>

#### Parameters

##### jids

`string`[]

##### force

`boolean`

#### Returns

`Promise`\<`boolean`\>

### authState

> **authState**: `object`

#### authState.creds

> **creds**: [`AuthenticationCreds`](../type-aliases/AuthenticationCreds.md)

#### authState.keys

> **keys**: [`SignalKeyStoreWithTransaction`](../type-aliases/SignalKeyStoreWithTransaction.md)

### chatModify()

> **chatModify**: (`mod`, `jid`) => `Promise`\<`void`\>

modify a chat -- mark unread, read etc.
lastMessages must be sorted in reverse chronologically
requires the last messages till the last message received; required for archive & unread

#### Parameters

##### mod

[`ChatModification`](../type-aliases/ChatModification.md)

##### jid

`string`

#### Returns

`Promise`\<`void`\>

### cleanDirtyBits()

> **cleanDirtyBits**: (`type`, `fromTimestamp`?) => `Promise`\<`void`\>

#### Parameters

##### type

`"account_sync"` | `"groups"`

##### fromTimestamp?

`string` | `number`

#### Returns

`Promise`\<`void`\>

### createParticipantNodes()

> **createParticipantNodes**: (`jids`, `message`, `extraAttrs`?) => `Promise`\<\{ `nodes`: [`BinaryNode`](../type-aliases/BinaryNode.md)[]; `shouldIncludeDeviceIdentity`: `boolean`; \}\>

#### Parameters

##### jids

`string`[]

##### message

[`IMessage`](../namespaces/proto/interfaces/IMessage.md)

##### extraAttrs?

#### Returns

`Promise`\<\{ `nodes`: [`BinaryNode`](../type-aliases/BinaryNode.md)[]; `shouldIncludeDeviceIdentity`: `boolean`; \}\>

### end()

> **end**: (`error`) => `void`

#### Parameters

##### error

`undefined` | `Error`

#### Returns

`void`

### ev

> **ev**: `BaileysBufferableEventEmitter`

### executeUSyncQuery()

> **executeUSyncQuery**: (`usyncQuery`) => `Promise`\<`undefined` \| [`USyncQueryResult`](../type-aliases/USyncQueryResult.md)\>

#### Parameters

##### usyncQuery

[`USyncQuery`](../classes/USyncQuery.md)

#### Returns

`Promise`\<`undefined` \| [`USyncQueryResult`](../type-aliases/USyncQueryResult.md)\>

### fetchBlocklist()

> **fetchBlocklist**: () => `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

### fetchDisappearingDuration()

> **fetchDisappearingDuration**: (...`jids`) => `Promise`\<`undefined` \| [`USyncQueryResultList`](../type-aliases/USyncQueryResultList.md)[]\>

#### Parameters

##### jids

...`string`[]

#### Returns

`Promise`\<`undefined` \| [`USyncQueryResultList`](../type-aliases/USyncQueryResultList.md)[]\>

### fetchMessageHistory()

> **fetchMessageHistory**: (`count`, `oldestMsgKey`, `oldestMsgTimestamp`) => `Promise`\<`string`\>

#### Parameters

##### count

`number`

##### oldestMsgKey

[`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)

##### oldestMsgTimestamp

`number` | `Long`

#### Returns

`Promise`\<`string`\>

### fetchPrivacySettings()

> **fetchPrivacySettings**: (`force`) => `Promise`\<\{\}\>

#### Parameters

##### force

`boolean` = `false`

#### Returns

`Promise`\<\{\}\>

### fetchStatus()

> **fetchStatus**: (...`jids`) => `Promise`\<`undefined` \| [`USyncQueryResultList`](../type-aliases/USyncQueryResultList.md)[]\>

#### Parameters

##### jids

...`string`[]

#### Returns

`Promise`\<`undefined` \| [`USyncQueryResultList`](../type-aliases/USyncQueryResultList.md)[]\>

### generateMessageTag()

> **generateMessageTag**: () => `string`

#### Returns

`string`

### getBusinessProfile()

> **getBusinessProfile**: (`jid`) => `Promise`\<`void` \| [`WABusinessProfile`](../type-aliases/WABusinessProfile.md)\>

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<`void` \| [`WABusinessProfile`](../type-aliases/WABusinessProfile.md)\>

### getCatalog()

> **getCatalog**: (`__namedParameters`) => `Promise`\<\{ `nextPageCursor`: `undefined` \| `string`; `products`: [`Product`](../type-aliases/Product.md)[]; \}\>

#### Parameters

##### \_\_namedParameters

[`GetCatalogOptions`](../type-aliases/GetCatalogOptions.md)

#### Returns

`Promise`\<\{ `nextPageCursor`: `undefined` \| `string`; `products`: [`Product`](../type-aliases/Product.md)[]; \}\>

### getCollections()

> **getCollections**: (`jid`?, `limit`) => `Promise`\<\{ `collections`: [`CatalogCollection`](../type-aliases/CatalogCollection.md)[]; \}\>

#### Parameters

##### jid?

`string`

##### limit?

`number` = `51`

#### Returns

`Promise`\<\{ `collections`: [`CatalogCollection`](../type-aliases/CatalogCollection.md)[]; \}\>

### getOrderDetails()

> **getOrderDetails**: (`orderId`, `tokenBase64`) => `Promise`\<[`OrderDetails`](../type-aliases/OrderDetails.md)\>

#### Parameters

##### orderId

`string`

##### tokenBase64

`string`

#### Returns

`Promise`\<[`OrderDetails`](../type-aliases/OrderDetails.md)\>

### getPrivacyTokens()

> **getPrivacyTokens**: (`jids`) => `Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

#### Parameters

##### jids

`string`[]

#### Returns

`Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

### getUSyncDevices()

> **getUSyncDevices**: (`jids`, `useCache`, `ignoreZeroDevices`) => `Promise`\<[`JidWithDevice`](../type-aliases/JidWithDevice.md)[]\>

Fetch all the devices we've to send a message to

#### Parameters

##### jids

`string`[]

##### useCache

`boolean`

##### ignoreZeroDevices

`boolean`

#### Returns

`Promise`\<[`JidWithDevice`](../type-aliases/JidWithDevice.md)[]\>

### groupAcceptInvite()

> **groupAcceptInvite**: (`code`) => `Promise`\<`undefined` \| `string`\>

#### Parameters

##### code

`string`

#### Returns

`Promise`\<`undefined` \| `string`\>

### groupAcceptInviteV4()

> **groupAcceptInviteV4**: (...`args`) => `Promise`\<`string`\>

accept a GroupInviteMessage

#### Parameters

##### args

...\[`string` \| [`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md), [`IGroupInviteMessage`](../namespaces/proto/namespaces/Message/interfaces/IGroupInviteMessage.md)\]

#### Returns

`Promise`\<`string`\>

### groupCreate()

> **groupCreate**: (`subject`, `participants`) => `Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

#### Parameters

##### subject

`string`

##### participants

`string`[]

#### Returns

`Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

### groupFetchAllParticipating()

> **groupFetchAllParticipating**: () => `Promise`\<\{\}\>

#### Returns

`Promise`\<\{\}\>

### groupGetInviteInfo()

> **groupGetInviteInfo**: (`code`) => `Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

### groupInviteCode()

> **groupInviteCode**: (`jid`) => `Promise`\<`undefined` \| `string`\>

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<`undefined` \| `string`\>

### groupJoinApprovalMode()

> **groupJoinApprovalMode**: (`jid`, `mode`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### mode

`"on"` | `"off"`

#### Returns

`Promise`\<`void`\>

### groupLeave()

> **groupLeave**: (`id`) => `Promise`\<`void`\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

### groupMemberAddMode()

> **groupMemberAddMode**: (`jid`, `mode`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### mode

`"all_member_add"` | `"admin_add"`

#### Returns

`Promise`\<`void`\>

### groupMetadata()

> **groupMetadata**: (`jid`) => `Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<[`GroupMetadata`](../interfaces/GroupMetadata.md)\>

### groupParticipantsUpdate()

> **groupParticipantsUpdate**: (`jid`, `participants`, `action`) => `Promise`\<`object`[]\>

#### Parameters

##### jid

`string`

##### participants

`string`[]

##### action

[`ParticipantAction`](../type-aliases/ParticipantAction.md)

#### Returns

`Promise`\<`object`[]\>

### groupRequestParticipantsList()

> **groupRequestParticipantsList**: (`jid`) => `Promise`\<`object`[]\>

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<`object`[]\>

### groupRequestParticipantsUpdate()

> **groupRequestParticipantsUpdate**: (`jid`, `participants`, `action`) => `Promise`\<`object`[]\>

#### Parameters

##### jid

`string`

##### participants

`string`[]

##### action

`"reject"` | `"approve"`

#### Returns

`Promise`\<`object`[]\>

### groupRevokeInvite()

> **groupRevokeInvite**: (`jid`) => `Promise`\<`undefined` \| `string`\>

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<`undefined` \| `string`\>

### groupRevokeInviteV4()

> **groupRevokeInviteV4**: (`groupJid`, `invitedJid`) => `Promise`\<`boolean`\>

revoke a v4 invite for someone

#### Parameters

##### groupJid

`string`

group jid

##### invitedJid

`string`

jid of person you invited

#### Returns

`Promise`\<`boolean`\>

true if successful

### groupSettingUpdate()

> **groupSettingUpdate**: (`jid`, `setting`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### setting

`"announcement"` | `"locked"` | `"not_announcement"` | `"unlocked"`

#### Returns

`Promise`\<`void`\>

### groupToggleEphemeral()

> **groupToggleEphemeral**: (`jid`, `ephemeralExpiration`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### ephemeralExpiration

`number`

#### Returns

`Promise`\<`void`\>

### groupUpdateDescription()

> **groupUpdateDescription**: (`jid`, `description`?) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### description?

`string`

#### Returns

`Promise`\<`void`\>

### groupUpdateSubject()

> **groupUpdateSubject**: (`jid`, `subject`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### subject

`string`

#### Returns

`Promise`\<`void`\>

### logger

> **logger**: `ILogger` = `config.logger`

### logout()

> **logout**: (`msg`?) => `Promise`\<`void`\>

logout & invalidate connection

#### Parameters

##### msg?

`string`

#### Returns

`Promise`\<`void`\>

### onUnexpectedError()

> **onUnexpectedError**: (`err`, `msg`) => `void`

log & process any unexpected errors

#### Parameters

##### err

`Error` | `Boom`\<`any`\>

##### msg

`string`

#### Returns

`void`

### onWhatsApp()

> **onWhatsApp**: (...`jids`) => `Promise`\<`undefined` \| `object`[]\>

#### Parameters

##### jids

...`string`[]

#### Returns

`Promise`\<`undefined` \| `object`[]\>

### presenceSubscribe()

> **presenceSubscribe**: (`toJid`, `tcToken`?) => `Promise`\<`void`\>

#### Parameters

##### toJid

`string`

the jid to subscribe to

##### tcToken?

`Buffer`\<`ArrayBufferLike`\>

token for subscription, use if present

#### Returns

`Promise`\<`void`\>

### processingMutex

> **processingMutex**: `object`

#### processingMutex.mutex()

##### Type Parameters

• **T**

##### Parameters

###### code

() => `T` \| `Promise`\<`T`\>

##### Returns

`Promise`\<`T`\>

### productCreate()

> **productCreate**: (`create`) => `Promise`\<[`Product`](../type-aliases/Product.md)\>

#### Parameters

##### create

[`ProductCreate`](../type-aliases/ProductCreate.md)

#### Returns

`Promise`\<[`Product`](../type-aliases/Product.md)\>

### productDelete()

> **productDelete**: (`productIds`) => `Promise`\<\{ `deleted`: `number`; \}\>

#### Parameters

##### productIds

`string`[]

#### Returns

`Promise`\<\{ `deleted`: `number`; \}\>

### productUpdate()

> **productUpdate**: (`productId`, `update`) => `Promise`\<[`Product`](../type-aliases/Product.md)\>

#### Parameters

##### productId

`string`

##### update

[`ProductUpdate`](../type-aliases/ProductUpdate.md)

#### Returns

`Promise`\<[`Product`](../type-aliases/Product.md)\>

### profilePictureUrl()

> **profilePictureUrl**: (`jid`, `type`, `timeoutMs`?) => `Promise`\<`undefined` \| `string`\>

fetch the profile picture of a user/group
type = "preview" for a low res picture
type = "image for the high res picture"

#### Parameters

##### jid

`string`

##### type

`"image"` | `"preview"`

##### timeoutMs?

`number`

#### Returns

`Promise`\<`undefined` \| `string`\>

### query()

> **query**: (`node`, `timeoutMs`?) => `Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

send a query, and wait for its response. auto-generates message ID if not provided

#### Parameters

##### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

##### timeoutMs?

`number`

#### Returns

`Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

### readMessages()

> **readMessages**: (`keys`) => `Promise`\<`void`\>

Bulk read messages. Keys can be from different chats & participants

#### Parameters

##### keys

[`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)[]

#### Returns

`Promise`\<`void`\>

### refreshMediaConn()

> **refreshMediaConn**: (`forceGet`) => `Promise`\<[`MediaConnInfo`](../type-aliases/MediaConnInfo.md)\>

#### Parameters

##### forceGet

`boolean` = `false`

#### Returns

`Promise`\<[`MediaConnInfo`](../type-aliases/MediaConnInfo.md)\>

### rejectCall()

> **rejectCall**: (`callId`, `callFrom`) => `Promise`\<`void`\>

#### Parameters

##### callId

`string`

##### callFrom

`string`

#### Returns

`Promise`\<`void`\>

### relayMessage()

> **relayMessage**: (`jid`, `message`, `__namedParameters`) => `Promise`\<`string`\>

#### Parameters

##### jid

`string`

##### message

[`IMessage`](../namespaces/proto/interfaces/IMessage.md)

##### \_\_namedParameters

[`MessageRelayOptions`](../type-aliases/MessageRelayOptions.md)

#### Returns

`Promise`\<`string`\>

### removeChatLabel()

> **removeChatLabel**: (`jid`, `labelId`) => `Promise`\<`void`\>

Removes label for the chat

#### Parameters

##### jid

`string`

##### labelId

`string`

#### Returns

`Promise`\<`void`\>

### removeMessageLabel()

> **removeMessageLabel**: (`jid`, `messageId`, `labelId`) => `Promise`\<`void`\>

Removes label for the message

#### Parameters

##### jid

`string`

##### messageId

`string`

##### labelId

`string`

#### Returns

`Promise`\<`void`\>

### removeProfilePicture()

> **removeProfilePicture**: (`jid`) => `Promise`\<`void`\>

remove the profile picture for yourself or a group

#### Parameters

##### jid

`string`

#### Returns

`Promise`\<`void`\>

### requestPairingCode()

> **requestPairingCode**: (`phoneNumber`) => `Promise`\<`string`\>

#### Parameters

##### phoneNumber

`string`

#### Returns

`Promise`\<`string`\>

### requestPlaceholderResend()

> **requestPlaceholderResend**: (`messageKey`) => `Promise`\<`undefined` \| `string`\>

#### Parameters

##### messageKey

[`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)

#### Returns

`Promise`\<`undefined` \| `string`\>

### resyncAppState()

> **resyncAppState**: (...`args`) => `Promise`\<`void`\>

#### Parameters

##### args

...\[readonly (`"critical_block"` \| `"critical_unblock_low"` \| `"regular_high"` \| `"regular_low"` \| `"regular"`)[], `boolean`\]

#### Returns

`Promise`\<`void`\>

### sendMessage()

> **sendMessage**: (`jid`, `content`, `options`) => `Promise`\<`undefined` \| [`WebMessageInfo`](../namespaces/proto/classes/WebMessageInfo.md)\>

#### Parameters

##### jid

`string`

##### content

[`AnyMessageContent`](../type-aliases/AnyMessageContent.md)

##### options

[`MiscMessageGenerationOptions`](../type-aliases/MiscMessageGenerationOptions.md) = `{}`

#### Returns

`Promise`\<`undefined` \| [`WebMessageInfo`](../namespaces/proto/classes/WebMessageInfo.md)\>

### sendMessageAck()

> **sendMessageAck**: (`__namedParameters`, `errorCode`?) => `Promise`\<`void`\>

#### Parameters

##### \_\_namedParameters

[`BinaryNode`](../type-aliases/BinaryNode.md)

##### errorCode?

`number`

#### Returns

`Promise`\<`void`\>

### sendNode()

> **sendNode**: (`frame`) => `Promise`\<`void`\>

send a binary node

#### Parameters

##### frame

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Returns

`Promise`\<`void`\>

### sendPeerDataOperationMessage()

> **sendPeerDataOperationMessage**: (`pdoMessage`) => `Promise`\<`string`\>

#### Parameters

##### pdoMessage

[`IPeerDataOperationRequestMessage`](../namespaces/proto/namespaces/Message/interfaces/IPeerDataOperationRequestMessage.md)

#### Returns

`Promise`\<`string`\>

### sendPresenceUpdate()

> **sendPresenceUpdate**: (`type`, `toJid`?) => `Promise`\<`void`\>

#### Parameters

##### type

[`WAPresence`](../type-aliases/WAPresence.md)

##### toJid?

`string`

#### Returns

`Promise`\<`void`\>

### sendRawMessage()

> **sendRawMessage**: (`data`) => `Promise`\<`void`\>

send a raw buffer

#### Parameters

##### data

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`void`\>

### sendReceipt()

> **sendReceipt**: (`jid`, `participant`, `messageIds`, `type`) => `Promise`\<`void`\>

generic send receipt function
used for receipts of phone call, read, delivery etc.

#### Parameters

##### jid

`string`

##### participant

`undefined` | `string`

##### messageIds

`string`[]

##### type

[`MessageReceiptType`](../type-aliases/MessageReceiptType.md)

#### Returns

`Promise`\<`void`\>

### sendReceipts()

> **sendReceipts**: (`keys`, `type`) => `Promise`\<`void`\>

Correctly bulk send receipts to multiple chats, participants

#### Parameters

##### keys

[`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)[]

##### type

[`MessageReceiptType`](../type-aliases/MessageReceiptType.md)

#### Returns

`Promise`\<`void`\>

### sendRetryRequest()

> **sendRetryRequest**: (`node`, `forceIncludeKeys`) => `Promise`\<`void`\>

#### Parameters

##### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

##### forceIncludeKeys

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

### sendWAMBuffer()

> **sendWAMBuffer**: (`wamBuffer`) => `Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

#### Parameters

##### wamBuffer

`Buffer`

#### Returns

`Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

### signalRepository

> **signalRepository**: [`SignalRepository`](../type-aliases/SignalRepository.md)

### star()

> **star**: (`jid`, `messages`, `star`) => `Promise`\<`void`\>

Star or Unstar a message

#### Parameters

##### jid

`string`

##### messages

`object`[]

##### star

`boolean`

#### Returns

`Promise`\<`void`\>

### type

> **type**: `"md"`

### updateBlockStatus()

> **updateBlockStatus**: (`jid`, `action`) => `Promise`\<`void`\>

#### Parameters

##### jid

`string`

##### action

`"block"` | `"unblock"`

#### Returns

`Promise`\<`void`\>

### updateCallPrivacy()

> **updateCallPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyCallValue`](../type-aliases/WAPrivacyCallValue.md)

#### Returns

`Promise`\<`void`\>

### updateDefaultDisappearingMode()

> **updateDefaultDisappearingMode**: (`duration`) => `Promise`\<`void`\>

#### Parameters

##### duration

`number`

#### Returns

`Promise`\<`void`\>

### updateGroupsAddPrivacy()

> **updateGroupsAddPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyGroupAddValue`](../type-aliases/WAPrivacyGroupAddValue.md)

#### Returns

`Promise`\<`void`\>

### updateLastSeenPrivacy()

> **updateLastSeenPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyValue`](../type-aliases/WAPrivacyValue.md)

#### Returns

`Promise`\<`void`\>

### updateMediaMessage()

> **updateMediaMessage**: (`message`) => `Promise`\<[`IWebMessageInfo`](../namespaces/proto/interfaces/IWebMessageInfo.md)\>

#### Parameters

##### message

[`IWebMessageInfo`](../namespaces/proto/interfaces/IWebMessageInfo.md)

#### Returns

`Promise`\<[`IWebMessageInfo`](../namespaces/proto/interfaces/IWebMessageInfo.md)\>

### updateMessagesPrivacy()

> **updateMessagesPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyMessagesValue`](../type-aliases/WAPrivacyMessagesValue.md)

#### Returns

`Promise`\<`void`\>

### updateOnlinePrivacy()

> **updateOnlinePrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyOnlineValue`](../type-aliases/WAPrivacyOnlineValue.md)

#### Returns

`Promise`\<`void`\>

### updateProfileName()

> **updateProfileName**: (`name`) => `Promise`\<`void`\>

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`void`\>

### updateProfilePicture()

> **updateProfilePicture**: (`jid`, `content`) => `Promise`\<`void`\>

update the profile picture for yourself or a group

#### Parameters

##### jid

`string`

##### content

[`WAMediaUpload`](../type-aliases/WAMediaUpload.md)

#### Returns

`Promise`\<`void`\>

### updateProfilePicturePrivacy()

> **updateProfilePicturePrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyValue`](../type-aliases/WAPrivacyValue.md)

#### Returns

`Promise`\<`void`\>

### updateProfileStatus()

> **updateProfileStatus**: (`status`) => `Promise`\<`void`\>

update the profile status for yourself

#### Parameters

##### status

`string`

#### Returns

`Promise`\<`void`\>

### updateReadReceiptsPrivacy()

> **updateReadReceiptsPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAReadReceiptsValue`](../type-aliases/WAReadReceiptsValue.md)

#### Returns

`Promise`\<`void`\>

### updateStatusPrivacy()

> **updateStatusPrivacy**: (`value`) => `Promise`\<`void`\>

#### Parameters

##### value

[`WAPrivacyValue`](../type-aliases/WAPrivacyValue.md)

#### Returns

`Promise`\<`void`\>

### uploadPreKeys()

> **uploadPreKeys**: (`count`) => `Promise`\<`void`\>

generates and uploads a set of pre-keys to the server

#### Parameters

##### count

`number` = `INITIAL_PREKEY_COUNT`

#### Returns

`Promise`\<`void`\>

### uploadPreKeysToServerIfRequired()

> **uploadPreKeysToServerIfRequired**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### upsertMessage()

> **upsertMessage**: (...`args`) => `Promise`\<`void`\>

#### Parameters

##### args

...\[[`IWebMessageInfo`](../namespaces/proto/interfaces/IWebMessageInfo.md), [`MessageUpsertType`](../type-aliases/MessageUpsertType.md)\]

#### Returns

`Promise`\<`void`\>

### user

> **user**: `undefined` \| [`Contact`](../interfaces/Contact.md)

### waitForConnectionUpdate()

> **waitForConnectionUpdate**: (`check`, `timeoutMs`?) => `Promise`\<`void`\>

Waits for the connection to WA to reach a state

#### Parameters

##### check

(`u`) => `Promise`\<`undefined` \| `boolean`\>

##### timeoutMs?

`number`

#### Returns

`Promise`\<`void`\>

### waitForMessage()

> **waitForMessage**: \<`T`\>(`msgId`, `timeoutMs`) => `Promise`\<`T`\>

Wait for a message with a certain tag to be received

#### Type Parameters

• **T**

#### Parameters

##### msgId

`string`

the message tag to await

##### timeoutMs

timeout after which the promise will reject

`undefined` | `number`

#### Returns

`Promise`\<`T`\>

### waitForSocketOpen()

> **waitForSocketOpen**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### waUploadToServer

> **waUploadToServer**: [`WAMediaUploadFunction`](../type-aliases/WAMediaUploadFunction.md)

### ws

> **ws**: `WebSocketClient`
