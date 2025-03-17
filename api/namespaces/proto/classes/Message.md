# Class: Message

Defined in: [WAProto/index.d.ts:17012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17012)

Represents a Message.

## Implements

- [`IMessage`](../interfaces/IMessage.md)

## Constructors

### new Message()

> **new Message**(`properties`?): [`Message`](Message.md)

Defined in: [WAProto/index.d.ts:17018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17018)

Constructs a new Message.

#### Parameters

##### properties?

[`IMessage`](../interfaces/IMessage.md)

Properties to set

#### Returns

[`Message`](Message.md)

## Properties

### albumMessage?

> `optional` **albumMessage**: `null` \| [`IAlbumMessage`](../namespaces/Message/interfaces/IAlbumMessage.md)

Defined in: [WAProto/index.d.ts:17225](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17225)

Message albumMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`albumMessage`](../interfaces/IMessage.md#albummessage)

***

### associatedChildMessage?

> `optional` **associatedChildMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17243)

Message associatedChildMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`associatedChildMessage`](../interfaces/IMessage.md#associatedchildmessage)

***

### audioMessage?

> `optional` **audioMessage**: `null` \| [`IAudioMessage`](../namespaces/Message/interfaces/IAudioMessage.md)

Defined in: [WAProto/index.d.ts:17042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17042)

Message audioMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`audioMessage`](../interfaces/IMessage.md#audiomessage)

***

### bcallMessage?

> `optional` **bcallMessage**: `null` \| [`IBCallMessage`](../namespaces/Message/interfaces/IBCallMessage.md)

Defined in: [WAProto/index.d.ts:17201](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17201)

Message bcallMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`bcallMessage`](../interfaces/IMessage.md#bcallmessage)

***

### botInvokeMessage?

> `optional` **botInvokeMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17189](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17189)

Message botInvokeMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`botInvokeMessage`](../interfaces/IMessage.md#botinvokemessage)

***

### buttonsMessage?

> `optional` **buttonsMessage**: `null` \| [`IButtonsMessage`](../namespaces/Message/interfaces/IButtonsMessage.md)

Defined in: [WAProto/index.d.ts:17120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17120)

Message buttonsMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`buttonsMessage`](../interfaces/IMessage.md#buttonsmessage)

***

### buttonsResponseMessage?

> `optional` **buttonsResponseMessage**: `null` \| [`IButtonsResponseMessage`](../namespaces/Message/interfaces/IButtonsResponseMessage.md)

Defined in: [WAProto/index.d.ts:17123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17123)

Message buttonsResponseMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`buttonsResponseMessage`](../interfaces/IMessage.md#buttonsresponsemessage)

***

### call?

> `optional` **call**: `null` \| [`ICall`](../namespaces/Message/interfaces/ICall.md)

Defined in: [WAProto/index.d.ts:17048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17048)

Message call.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`call`](../interfaces/IMessage.md#call)

***

### callLogMesssage?

> `optional` **callLogMesssage**: `null` \| [`ICallLogMessage`](../namespaces/Message/interfaces/ICallLogMessage.md)

Defined in: [WAProto/index.d.ts:17192](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17192)

Message callLogMesssage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`callLogMesssage`](../interfaces/IMessage.md#calllogmesssage)

***

### cancelPaymentRequestMessage?

> `optional` **cancelPaymentRequestMessage**: `null` \| [`ICancelPaymentRequestMessage`](../namespaces/Message/interfaces/ICancelPaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:17078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17078)

Message cancelPaymentRequestMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`cancelPaymentRequestMessage`](../interfaces/IMessage.md#cancelpaymentrequestmessage)

***

### chat?

> `optional` **chat**: `null` \| [`IChat`](../namespaces/Message/interfaces/IChat.md)

Defined in: [WAProto/index.d.ts:17051](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17051)

Message chat.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`chat`](../interfaces/IMessage.md#chat)

***

### commentMessage?

> `optional` **commentMessage**: `null` \| [`ICommentMessage`](../namespaces/Message/interfaces/ICommentMessage.md)

Defined in: [WAProto/index.d.ts:17213](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17213)

Message commentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`commentMessage`](../interfaces/IMessage.md#commentmessage)

***

### contactMessage?

> `optional` **contactMessage**: `null` \| [`IContactMessage`](../namespaces/Message/interfaces/IContactMessage.md)

Defined in: [WAProto/index.d.ts:17030](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17030)

Message contactMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`contactMessage`](../interfaces/IMessage.md#contactmessage)

***

### contactsArrayMessage?

> `optional` **contactsArrayMessage**: `null` \| [`IContactsArrayMessage`](../namespaces/Message/interfaces/IContactsArrayMessage.md)

Defined in: [WAProto/index.d.ts:17057](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17057)

Message contactsArrayMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`contactsArrayMessage`](../interfaces/IMessage.md#contactsarraymessage)

***

### conversation?

> `optional` **conversation**: `null` \| `string`

Defined in: [WAProto/index.d.ts:17021](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17021)

Message conversation.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`conversation`](../interfaces/IMessage.md#conversation)

***

### declinePaymentRequestMessage?

> `optional` **declinePaymentRequestMessage**: `null` \| [`IDeclinePaymentRequestMessage`](../namespaces/Message/interfaces/IDeclinePaymentRequestMessage.md)

Defined in: [WAProto/index.d.ts:17075](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17075)

Message declinePaymentRequestMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`declinePaymentRequestMessage`](../interfaces/IMessage.md#declinepaymentrequestmessage)

***

### deviceSentMessage?

> `optional` **deviceSentMessage**: `null` \| [`IDeviceSentMessage`](../namespaces/Message/interfaces/IDeviceSentMessage.md)

Defined in: [WAProto/index.d.ts:17096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17096)

Message deviceSentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`deviceSentMessage`](../interfaces/IMessage.md#devicesentmessage)

***

### documentMessage?

> `optional` **documentMessage**: `null` \| [`IDocumentMessage`](../namespaces/Message/interfaces/IDocumentMessage.md)

Defined in: [WAProto/index.d.ts:17039](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17039)

Message documentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`documentMessage`](../interfaces/IMessage.md#documentmessage)

***

### documentWithCaptionMessage?

> `optional` **documentWithCaptionMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17150)

Message documentWithCaptionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`documentWithCaptionMessage`](../interfaces/IMessage.md#documentwithcaptionmessage)

***

### editedMessage?

> `optional` **editedMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17162)

Message editedMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`editedMessage`](../interfaces/IMessage.md#editedmessage)

***

### encCommentMessage?

> `optional` **encCommentMessage**: `null` \| [`IEncCommentMessage`](../namespaces/Message/interfaces/IEncCommentMessage.md)

Defined in: [WAProto/index.d.ts:17198](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17198)

Message encCommentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`encCommentMessage`](../interfaces/IMessage.md#enccommentmessage)

***

### encEventResponseMessage?

> `optional` **encEventResponseMessage**: `null` \| [`IEncEventResponseMessage`](../namespaces/Message/interfaces/IEncEventResponseMessage.md)

Defined in: [WAProto/index.d.ts:17210](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17210)

Message encEventResponseMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`encEventResponseMessage`](../interfaces/IMessage.md#enceventresponsemessage)

***

### encReactionMessage?

> `optional` **encReactionMessage**: `null` \| [`IEncReactionMessage`](../namespaces/Message/interfaces/IEncReactionMessage.md)

Defined in: [WAProto/index.d.ts:17159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17159)

Message encReactionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`encReactionMessage`](../interfaces/IMessage.md#encreactionmessage)

***

### ephemeralMessage?

> `optional` **ephemeralMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17114)

Message ephemeralMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`ephemeralMessage`](../interfaces/IMessage.md#ephemeralmessage)

***

### eventCoverImage?

> `optional` **eventCoverImage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17228](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17228)

Message eventCoverImage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`eventCoverImage`](../interfaces/IMessage.md#eventcoverimage)

***

### eventMessage?

> `optional` **eventMessage**: `null` \| [`IEventMessage`](../namespaces/Message/interfaces/IEventMessage.md)

Defined in: [WAProto/index.d.ts:17207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17207)

Message eventMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`eventMessage`](../interfaces/IMessage.md#eventmessage)

***

### extendedTextMessage?

> `optional` **extendedTextMessage**: `null` \| [`IExtendedTextMessage`](../namespaces/Message/interfaces/IExtendedTextMessage.md)

Defined in: [WAProto/index.d.ts:17036](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17036)

Message extendedTextMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`extendedTextMessage`](../interfaces/IMessage.md#extendedtextmessage)

***

### fastRatchetKeySenderKeyDistributionMessage?

> `optional` **fastRatchetKeySenderKeyDistributionMessage**: `null` \| [`ISenderKeyDistributionMessage`](../namespaces/Message/interfaces/ISenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:17063](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17063)

Message fastRatchetKeySenderKeyDistributionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`fastRatchetKeySenderKeyDistributionMessage`](../interfaces/IMessage.md#fastratchetkeysenderkeydistributionmessage)

***

### groupInviteMessage?

> `optional` **groupInviteMessage**: `null` \| [`IGroupInviteMessage`](../namespaces/Message/interfaces/IGroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:17087](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17087)

Message groupInviteMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`groupInviteMessage`](../interfaces/IMessage.md#groupinvitemessage)

***

### groupMentionedMessage?

> `optional` **groupMentionedMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17174)

Message groupMentionedMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`groupMentionedMessage`](../interfaces/IMessage.md#groupmentionedmessage)

***

### groupStatusMentionMessage?

> `optional` **groupStatusMentionMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17246](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17246)

Message groupStatusMentionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`groupStatusMentionMessage`](../interfaces/IMessage.md#groupstatusmentionmessage)

***

### groupStatusMessage?

> `optional` **groupStatusMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17258](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17258)

Message groupStatusMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`groupStatusMessage`](../interfaces/IMessage.md#groupstatusmessage)

***

### highlyStructuredMessage?

> `optional` **highlyStructuredMessage**: `null` \| [`IHighlyStructuredMessage`](../namespaces/Message/interfaces/IHighlyStructuredMessage.md)

Defined in: [WAProto/index.d.ts:17060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17060)

Message highlyStructuredMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`highlyStructuredMessage`](../interfaces/IMessage.md#highlystructuredmessage)

***

### imageMessage?

> `optional` **imageMessage**: `null` \| [`IImageMessage`](../namespaces/Message/interfaces/IImageMessage.md)

Defined in: [WAProto/index.d.ts:17027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17027)

Message imageMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`imageMessage`](../interfaces/IMessage.md#imagemessage)

***

### interactiveMessage?

> `optional` **interactiveMessage**: `null` \| [`IInteractiveMessage`](../namespaces/Message/interfaces/IInteractiveMessage.md)

Defined in: [WAProto/index.d.ts:17129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17129)

Message interactiveMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`interactiveMessage`](../interfaces/IMessage.md#interactivemessage)

***

### interactiveResponseMessage?

> `optional` **interactiveResponseMessage**: `null` \| [`IInteractiveResponseMessage`](../namespaces/Message/interfaces/IInteractiveResponseMessage.md)

Defined in: [WAProto/index.d.ts:17138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17138)

Message interactiveResponseMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`interactiveResponseMessage`](../interfaces/IMessage.md#interactiveresponsemessage)

***

### invoiceMessage?

> `optional` **invoiceMessage**: `null` \| [`IInvoiceMessage`](../namespaces/Message/interfaces/IInvoiceMessage.md)

Defined in: [WAProto/index.d.ts:17117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17117)

Message invoiceMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`invoiceMessage`](../interfaces/IMessage.md#invoicemessage)

***

### keepInChatMessage?

> `optional` **keepInChatMessage**: `null` \| [`IKeepInChatMessage`](../namespaces/Message/interfaces/IKeepInChatMessage.md)

Defined in: [WAProto/index.d.ts:17147](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17147)

Message keepInChatMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`keepInChatMessage`](../interfaces/IMessage.md#keepinchatmessage)

***

### listMessage?

> `optional` **listMessage**: `null` \| [`IListMessage`](../namespaces/Message/interfaces/IListMessage.md)

Defined in: [WAProto/index.d.ts:17102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17102)

Message listMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`listMessage`](../interfaces/IMessage.md#listmessage)

***

### listResponseMessage?

> `optional` **listResponseMessage**: `null` \| [`IListResponseMessage`](../namespaces/Message/interfaces/IListResponseMessage.md)

Defined in: [WAProto/index.d.ts:17111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17111)

Message listResponseMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`listResponseMessage`](../interfaces/IMessage.md#listresponsemessage)

***

### liveLocationMessage?

> `optional` **liveLocationMessage**: `null` \| [`ILiveLocationMessage`](../namespaces/Message/interfaces/ILiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:17069](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17069)

Message liveLocationMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`liveLocationMessage`](../interfaces/IMessage.md#livelocationmessage)

***

### locationMessage?

> `optional` **locationMessage**: `null` \| [`ILocationMessage`](../namespaces/Message/interfaces/ILocationMessage.md)

Defined in: [WAProto/index.d.ts:17033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17033)

Message locationMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`locationMessage`](../interfaces/IMessage.md#locationmessage)

***

### lottieStickerMessage?

> `optional` **lottieStickerMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17204](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17204)

Message lottieStickerMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`lottieStickerMessage`](../interfaces/IMessage.md#lottiestickermessage)

***

### messageContextInfo?

> `optional` **messageContextInfo**: `null` \| [`IMessageContextInfo`](../interfaces/IMessageContextInfo.md)

Defined in: [WAProto/index.d.ts:17099](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17099)

Message messageContextInfo.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`messageContextInfo`](../interfaces/IMessage.md#messagecontextinfo)

***

### messageHistoryBundle?

> `optional` **messageHistoryBundle**: `null` \| [`IMessageHistoryBundle`](../namespaces/Message/interfaces/IMessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:17195](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17195)

Message messageHistoryBundle.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`messageHistoryBundle`](../interfaces/IMessage.md#messagehistorybundle)

***

### newsletterAdminInviteMessage?

> `optional` **newsletterAdminInviteMessage**: `null` \| [`INewsletterAdminInviteMessage`](../namespaces/Message/interfaces/INewsletterAdminInviteMessage.md)

Defined in: [WAProto/index.d.ts:17216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17216)

Message newsletterAdminInviteMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`newsletterAdminInviteMessage`](../interfaces/IMessage.md#newsletteradmininvitemessage)

***

### orderMessage?

> `optional` **orderMessage**: `null` \| [`IOrderMessage`](../namespaces/Message/interfaces/IOrderMessage.md)

Defined in: [WAProto/index.d.ts:17108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17108)

Message orderMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`orderMessage`](../interfaces/IMessage.md#ordermessage)

***

### paymentInviteMessage?

> `optional` **paymentInviteMessage**: `null` \| [`IPaymentInviteMessage`](../namespaces/Message/interfaces/IPaymentInviteMessage.md)

Defined in: [WAProto/index.d.ts:17126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17126)

Message paymentInviteMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`paymentInviteMessage`](../interfaces/IMessage.md#paymentinvitemessage)

***

### pinInChatMessage?

> `optional` **pinInChatMessage**: `null` \| [`IPinInChatMessage`](../namespaces/Message/interfaces/IPinInChatMessage.md)

Defined in: [WAProto/index.d.ts:17177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17177)

Message pinInChatMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pinInChatMessage`](../interfaces/IMessage.md#pininchatmessage)

***

### placeholderMessage?

> `optional` **placeholderMessage**: `null` \| [`IPlaceholderMessage`](../namespaces/Message/interfaces/IPlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:17219](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17219)

Message placeholderMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`placeholderMessage`](../interfaces/IMessage.md#placeholdermessage)

***

### pollCreationMessage?

> `optional` **pollCreationMessage**: `null` \| [`IPollCreationMessage`](../namespaces/Message/interfaces/IPollCreationMessage.md)

Defined in: [WAProto/index.d.ts:17141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17141)

Message pollCreationMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationMessage`](../interfaces/IMessage.md#pollcreationmessage)

***

### pollCreationMessageV2?

> `optional` **pollCreationMessageV2**: `null` \| [`IPollCreationMessage`](../namespaces/Message/interfaces/IPollCreationMessage.md)

Defined in: [WAProto/index.d.ts:17168](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17168)

Message pollCreationMessageV2.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationMessageV2`](../interfaces/IMessage.md#pollcreationmessagev2)

***

### pollCreationMessageV3?

> `optional` **pollCreationMessageV3**: `null` \| [`IPollCreationMessage`](../namespaces/Message/interfaces/IPollCreationMessage.md)

Defined in: [WAProto/index.d.ts:17180](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17180)

Message pollCreationMessageV3.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationMessageV3`](../interfaces/IMessage.md#pollcreationmessagev3)

***

### pollCreationMessageV4?

> `optional` **pollCreationMessageV4**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17249)

Message pollCreationMessageV4.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationMessageV4`](../interfaces/IMessage.md#pollcreationmessagev4)

***

### pollCreationMessageV5?

> `optional` **pollCreationMessageV5**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17252](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17252)

Message pollCreationMessageV5.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationMessageV5`](../interfaces/IMessage.md#pollcreationmessagev5)

***

### pollCreationOptionImageMessage?

> `optional` **pollCreationOptionImageMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17240](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17240)

Message pollCreationOptionImageMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollCreationOptionImageMessage`](../interfaces/IMessage.md#pollcreationoptionimagemessage)

***

### pollResultSnapshotMessage?

> `optional` **pollResultSnapshotMessage**: `null` \| [`IPollResultSnapshotMessage`](../namespaces/Message/interfaces/IPollResultSnapshotMessage.md)

Defined in: [WAProto/index.d.ts:17237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17237)

Message pollResultSnapshotMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollResultSnapshotMessage`](../interfaces/IMessage.md#pollresultsnapshotmessage)

***

### pollUpdateMessage?

> `optional` **pollUpdateMessage**: `null` \| [`IPollUpdateMessage`](../namespaces/Message/interfaces/IPollUpdateMessage.md)

Defined in: [WAProto/index.d.ts:17144](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17144)

Message pollUpdateMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`pollUpdateMessage`](../interfaces/IMessage.md#pollupdatemessage)

***

### productMessage?

> `optional` **productMessage**: `null` \| [`IProductMessage`](../namespaces/Message/interfaces/IProductMessage.md)

Defined in: [WAProto/index.d.ts:17093](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17093)

Message productMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`productMessage`](../interfaces/IMessage.md#productmessage)

***

### protocolMessage?

> `optional` **protocolMessage**: `null` \| [`IProtocolMessage`](../namespaces/Message/interfaces/IProtocolMessage.md)

Defined in: [WAProto/index.d.ts:17054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17054)

Message protocolMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`protocolMessage`](../interfaces/IMessage.md#protocolmessage)

***

### ptvMessage?

> `optional` **ptvMessage**: `null` \| [`IVideoMessage`](../namespaces/Message/interfaces/IVideoMessage.md)

Defined in: [WAProto/index.d.ts:17186](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17186)

Message ptvMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`ptvMessage`](../interfaces/IMessage.md#ptvmessage)

***

### reactionMessage?

> `optional` **reactionMessage**: `null` \| [`IReactionMessage`](../namespaces/Message/interfaces/IReactionMessage.md)

Defined in: [WAProto/index.d.ts:17132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17132)

Message reactionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`reactionMessage`](../interfaces/IMessage.md#reactionmessage)

***

### requestPaymentMessage?

> `optional` **requestPaymentMessage**: `null` \| [`IRequestPaymentMessage`](../namespaces/Message/interfaces/IRequestPaymentMessage.md)

Defined in: [WAProto/index.d.ts:17072](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17072)

Message requestPaymentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`requestPaymentMessage`](../interfaces/IMessage.md#requestpaymentmessage)

***

### requestPhoneNumberMessage?

> `optional` **requestPhoneNumberMessage**: `null` \| [`IRequestPhoneNumberMessage`](../namespaces/Message/interfaces/IRequestPhoneNumberMessage.md)

Defined in: [WAProto/index.d.ts:17153](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17153)

Message requestPhoneNumberMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`requestPhoneNumberMessage`](../interfaces/IMessage.md#requestphonenumbermessage)

***

### richResponseMessage?

> `optional` **richResponseMessage**: `null` \| [`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:17261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17261)

Message richResponseMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`richResponseMessage`](../interfaces/IMessage.md#richresponsemessage)

***

### scheduledCallCreationMessage?

> `optional` **scheduledCallCreationMessage**: `null` \| [`IScheduledCallCreationMessage`](../namespaces/Message/interfaces/IScheduledCallCreationMessage.md)

Defined in: [WAProto/index.d.ts:17171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17171)

Message scheduledCallCreationMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`scheduledCallCreationMessage`](../interfaces/IMessage.md#scheduledcallcreationmessage)

***

### scheduledCallEditMessage?

> `optional` **scheduledCallEditMessage**: `null` \| [`IScheduledCallEditMessage`](../namespaces/Message/interfaces/IScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:17183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17183)

Message scheduledCallEditMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`scheduledCallEditMessage`](../interfaces/IMessage.md#scheduledcalleditmessage)

***

### secretEncryptedMessage?

> `optional` **secretEncryptedMessage**: `null` \| [`ISecretEncryptedMessage`](../namespaces/Message/interfaces/ISecretEncryptedMessage.md)

Defined in: [WAProto/index.d.ts:17222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17222)

Message secretEncryptedMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`secretEncryptedMessage`](../interfaces/IMessage.md#secretencryptedmessage)

***

### senderKeyDistributionMessage?

> `optional` **senderKeyDistributionMessage**: `null` \| [`ISenderKeyDistributionMessage`](../namespaces/Message/interfaces/ISenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:17024](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17024)

Message senderKeyDistributionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`senderKeyDistributionMessage`](../interfaces/IMessage.md#senderkeydistributionmessage)

***

### sendPaymentMessage?

> `optional` **sendPaymentMessage**: `null` \| [`ISendPaymentMessage`](../namespaces/Message/interfaces/ISendPaymentMessage.md)

Defined in: [WAProto/index.d.ts:17066](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17066)

Message sendPaymentMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`sendPaymentMessage`](../interfaces/IMessage.md#sendpaymentmessage)

***

### statusAddYours?

> `optional` **statusAddYours**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17255](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17255)

Message statusAddYours.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`statusAddYours`](../interfaces/IMessage.md#statusaddyours)

***

### statusMentionMessage?

> `optional` **statusMentionMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17234](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17234)

Message statusMentionMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`statusMentionMessage`](../interfaces/IMessage.md#statusmentionmessage)

***

### statusNotificationMessage?

> `optional` **statusNotificationMessage**: `null` \| [`IStatusNotificationMessage`](../namespaces/Message/interfaces/IStatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:17264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17264)

Message statusNotificationMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`statusNotificationMessage`](../interfaces/IMessage.md#statusnotificationmessage)

***

### stickerMessage?

> `optional` **stickerMessage**: `null` \| [`IStickerMessage`](../namespaces/Message/interfaces/IStickerMessage.md)

Defined in: [WAProto/index.d.ts:17084](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17084)

Message stickerMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`stickerMessage`](../interfaces/IMessage.md#stickermessage)

***

### stickerPackMessage?

> `optional` **stickerPackMessage**: `null` \| [`IStickerPackMessage`](../namespaces/Message/interfaces/IStickerPackMessage.md)

Defined in: [WAProto/index.d.ts:17231](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17231)

Message stickerPackMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`stickerPackMessage`](../interfaces/IMessage.md#stickerpackmessage)

***

### stickerSyncRmrMessage?

> `optional` **stickerSyncRmrMessage**: `null` \| [`IStickerSyncRMRMessage`](../namespaces/Message/interfaces/IStickerSyncRMRMessage.md)

Defined in: [WAProto/index.d.ts:17135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17135)

Message stickerSyncRmrMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`stickerSyncRmrMessage`](../interfaces/IMessage.md#stickersyncrmrmessage)

***

### templateButtonReplyMessage?

> `optional` **templateButtonReplyMessage**: `null` \| [`ITemplateButtonReplyMessage`](../namespaces/Message/interfaces/ITemplateButtonReplyMessage.md)

Defined in: [WAProto/index.d.ts:17090](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17090)

Message templateButtonReplyMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`templateButtonReplyMessage`](../interfaces/IMessage.md#templatebuttonreplymessage)

***

### templateMessage?

> `optional` **templateMessage**: `null` \| [`ITemplateMessage`](../namespaces/Message/interfaces/ITemplateMessage.md)

Defined in: [WAProto/index.d.ts:17081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17081)

Message templateMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`templateMessage`](../interfaces/IMessage.md#templatemessage)

***

### videoMessage?

> `optional` **videoMessage**: `null` \| [`IVideoMessage`](../namespaces/Message/interfaces/IVideoMessage.md)

Defined in: [WAProto/index.d.ts:17045](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17045)

Message videoMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`videoMessage`](../interfaces/IMessage.md#videomessage)

***

### viewOnceMessage?

> `optional` **viewOnceMessage**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17105)

Message viewOnceMessage.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`viewOnceMessage`](../interfaces/IMessage.md#viewoncemessage)

***

### viewOnceMessageV2?

> `optional` **viewOnceMessageV2**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17156)

Message viewOnceMessageV2.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`viewOnceMessageV2`](../interfaces/IMessage.md#viewoncemessagev2)

***

### viewOnceMessageV2Extension?

> `optional` **viewOnceMessageV2Extension**: `null` \| [`IFutureProofMessage`](../namespaces/Message/interfaces/IFutureProofMessage.md)

Defined in: [WAProto/index.d.ts:17165](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17165)

Message viewOnceMessageV2Extension.

#### Implementation of

[`IMessage`](../interfaces/IMessage.md).[`viewOnceMessageV2Extension`](../interfaces/IMessage.md#viewoncemessagev2extension)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:17334](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17334)

Converts this Message to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Message`](Message.md)

Defined in: [WAProto/index.d.ts:17271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17271)

Creates a new Message instance using the specified properties.

#### Parameters

##### properties?

[`IMessage`](../interfaces/IMessage.md)

Properties to set

#### Returns

[`Message`](Message.md)

Message instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Message`](Message.md)

Defined in: [WAProto/index.d.ts:17297](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17297)

Decodes a Message message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Message`](Message.md)

Message

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Message`](Message.md)

Defined in: [WAProto/index.d.ts:17306](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17306)

Decodes a Message message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Message`](Message.md)

Message

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17279](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17279)

Encodes the specified Message message. Does not implicitly [verify](Message.md#verify) messages.

#### Parameters

##### message

[`IMessage`](../interfaces/IMessage.md)

Message message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:17287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17287)

Encodes the specified Message message, length delimited. Does not implicitly [verify](Message.md#verify) messages.

#### Parameters

##### message

[`IMessage`](../interfaces/IMessage.md)

Message message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Message`](Message.md)

Defined in: [WAProto/index.d.ts:17320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17320)

Creates a Message message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Message`](Message.md)

Message

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:17341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17341)

Gets the default type url for Message

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

Defined in: [WAProto/index.d.ts:17328](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17328)

Creates a plain object from a Message message. Also converts values to other types if specified.

#### Parameters

##### message

[`Message`](Message.md)

Message

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:17313](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L17313)

Verifies a Message message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
