# Class: MsgOpaqueData

Defined in: [WAProto/index.d.ts:33864](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33864)

Represents a MsgOpaqueData.

## Implements

- [`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

## Constructors

### new MsgOpaqueData()

> **new MsgOpaqueData**(`properties`?): [`MsgOpaqueData`](MsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:33870](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33870)

Constructs a new MsgOpaqueData.

#### Parameters

##### properties?

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

Properties to set

#### Returns

[`MsgOpaqueData`](MsgOpaqueData.md)

## Properties

### body?

> `optional` **body**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33873](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33873)

MsgOpaqueData body.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`body`](../interfaces/IMsgOpaqueData.md#body)

***

### botMessageSecret?

> `optional` **botMessageSecret**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33954](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33954)

MsgOpaqueData botMessageSecret.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`botMessageSecret`](../interfaces/IMsgOpaqueData.md#botmessagesecret)

***

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33876)

MsgOpaqueData caption.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`caption`](../interfaces/IMsgOpaqueData.md#caption)

***

### clientUrl?

> `optional` **clientUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33906](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33906)

MsgOpaqueData clientUrl.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`clientUrl`](../interfaces/IMsgOpaqueData.md#clienturl)

***

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33900)

MsgOpaqueData description.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`description`](../interfaces/IMsgOpaqueData.md#description)

***

### encIv?

> `optional` **encIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33963](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33963)

MsgOpaqueData encIv.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encIv`](../interfaces/IMsgOpaqueData.md#enciv)

***

### encPayload?

> `optional` **encPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33960](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33960)

MsgOpaqueData encPayload.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encPayload`](../interfaces/IMsgOpaqueData.md#encpayload)

***

### encPollVote?

> `optional` **encPollVote**: `null` \| [`IPollEncValue`](../interfaces/IPollEncValue.md)

Defined in: [WAProto/index.d.ts:33933](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33933)

MsgOpaqueData encPollVote.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encPollVote`](../interfaces/IMsgOpaqueData.md#encpollvote)

***

### encReactionEncIv?

> `optional` **encReactionEncIv**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33951](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33951)

MsgOpaqueData encReactionEncIv.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encReactionEncIv`](../interfaces/IMsgOpaqueData.md#encreactionenciv)

***

### encReactionEncPayload?

> `optional` **encReactionEncPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33948](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33948)

MsgOpaqueData encReactionEncPayload.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encReactionEncPayload`](../interfaces/IMsgOpaqueData.md#encreactionencpayload)

***

### encReactionTargetMessageKey?

> `optional` **encReactionTargetMessageKey**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33945](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33945)

MsgOpaqueData encReactionTargetMessageKey.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`encReactionTargetMessageKey`](../interfaces/IMsgOpaqueData.md#encreactiontargetmessagekey)

***

### eventDescription?

> `optional` **eventDescription**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33972)

MsgOpaqueData eventDescription.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventDescription`](../interfaces/IMsgOpaqueData.md#eventdescription)

***

### eventEndTime?

> `optional` **eventEndTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:33984](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33984)

MsgOpaqueData eventEndTime.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventEndTime`](../interfaces/IMsgOpaqueData.md#eventendtime)

***

### eventJoinLink?

> `optional` **eventJoinLink**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33975](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33975)

MsgOpaqueData eventJoinLink.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventJoinLink`](../interfaces/IMsgOpaqueData.md#eventjoinlink)

***

### eventLocation?

> `optional` **eventLocation**: `null` \| [`IEventLocation`](../namespaces/MsgOpaqueData/interfaces/IEventLocation.md)

Defined in: [WAProto/index.d.ts:33981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33981)

MsgOpaqueData eventLocation.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventLocation`](../interfaces/IMsgOpaqueData.md#eventlocation)

***

### eventName?

> `optional` **eventName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33966](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33966)

MsgOpaqueData eventName.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventName`](../interfaces/IMsgOpaqueData.md#eventname)

***

### eventStartTime?

> `optional` **eventStartTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:33978](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33978)

MsgOpaqueData eventStartTime.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`eventStartTime`](../interfaces/IMsgOpaqueData.md#eventstarttime)

***

### futureproofBuffer?

> `optional` **futureproofBuffer**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33903)

MsgOpaqueData futureproofBuffer.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`futureproofBuffer`](../interfaces/IMsgOpaqueData.md#futureproofbuffer)

***

### isEventCanceled?

> `optional` **isEventCanceled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:33969](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33969)

MsgOpaqueData isEventCanceled.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`isEventCanceled`](../interfaces/IMsgOpaqueData.md#iseventcanceled)

***

### isLive?

> `optional` **isLive**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:33882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33882)

MsgOpaqueData isLive.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`isLive`](../interfaces/IMsgOpaqueData.md#islive)

***

### isSentCagPollCreation?

> `optional` **isSentCagPollCreation**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:33936](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33936)

MsgOpaqueData isSentCagPollCreation.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`isSentCagPollCreation`](../interfaces/IMsgOpaqueData.md#issentcagpollcreation)

***

### lat?

> `optional` **lat**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33885)

MsgOpaqueData lat.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`lat`](../interfaces/IMsgOpaqueData.md#lat)

***

### lng?

> `optional` **lng**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33879](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33879)

MsgOpaqueData lng.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`lng`](../interfaces/IMsgOpaqueData.md#lng)

***

### loc?

> `optional` **loc**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33909](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33909)

MsgOpaqueData loc.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`loc`](../interfaces/IMsgOpaqueData.md#loc)

***

### matchedText?

> `optional` **matchedText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33894](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33894)

MsgOpaqueData matchedText.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`matchedText`](../interfaces/IMsgOpaqueData.md#matchedtext)

***

### messageSecret?

> `optional` **messageSecret**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:33921](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33921)

MsgOpaqueData messageSecret.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`messageSecret`](../interfaces/IMsgOpaqueData.md#messagesecret)

***

### originalSelfAuthor?

> `optional` **originalSelfAuthor**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33924)

MsgOpaqueData originalSelfAuthor.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`originalSelfAuthor`](../interfaces/IMsgOpaqueData.md#originalselfauthor)

***

### paymentAmount1000?

> `optional` **paymentAmount1000**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33888](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33888)

MsgOpaqueData paymentAmount1000.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`paymentAmount1000`](../interfaces/IMsgOpaqueData.md#paymentamount1000)

***

### paymentNoteMsgBody?

> `optional` **paymentNoteMsgBody**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33891](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33891)

MsgOpaqueData paymentNoteMsgBody.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`paymentNoteMsgBody`](../interfaces/IMsgOpaqueData.md#paymentnotemsgbody)

***

### pollContentType?

> `optional` **pollContentType**: `null` \| [`PollContentType`](../namespaces/MsgOpaqueData/enumerations/PollContentType.md)

Defined in: [WAProto/index.d.ts:33939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33939)

MsgOpaqueData pollContentType.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollContentType`](../interfaces/IMsgOpaqueData.md#pollcontenttype)

***

### pollName?

> `optional` **pollName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33912)

MsgOpaqueData pollName.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollName`](../interfaces/IMsgOpaqueData.md#pollname)

***

### pollOptions

> **pollOptions**: [`IPollOption`](../namespaces/MsgOpaqueData/interfaces/IPollOption.md)[]

Defined in: [WAProto/index.d.ts:33915](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33915)

MsgOpaqueData pollOptions.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollOptions`](../interfaces/IMsgOpaqueData.md#polloptions)

***

### pollSelectableOptionsCount?

> `optional` **pollSelectableOptionsCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33918](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33918)

MsgOpaqueData pollSelectableOptionsCount.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollSelectableOptionsCount`](../interfaces/IMsgOpaqueData.md#pollselectableoptionscount)

***

### pollUpdateParentKey?

> `optional` **pollUpdateParentKey**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33930)

MsgOpaqueData pollUpdateParentKey.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollUpdateParentKey`](../interfaces/IMsgOpaqueData.md#pollupdateparentkey)

***

### pollVotesSnapshot?

> `optional` **pollVotesSnapshot**: `null` \| [`IPollVotesSnapshot`](../namespaces/MsgOpaqueData/interfaces/IPollVotesSnapshot.md)

Defined in: [WAProto/index.d.ts:33942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33942)

MsgOpaqueData pollVotesSnapshot.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`pollVotesSnapshot`](../interfaces/IMsgOpaqueData.md#pollvotessnapshot)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:33927](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33927)

MsgOpaqueData senderTimestampMs.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`senderTimestampMs`](../interfaces/IMsgOpaqueData.md#sendertimestampms)

***

### targetMessageKey?

> `optional` **targetMessageKey**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33957)

MsgOpaqueData targetMessageKey.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`targetMessageKey`](../interfaces/IMsgOpaqueData.md#targetmessagekey)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:33897](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33897)

MsgOpaqueData title.

#### Implementation of

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md).[`title`](../interfaces/IMsgOpaqueData.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:34054](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34054)

Converts this MsgOpaqueData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MsgOpaqueData`](MsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:33991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33991)

Creates a new MsgOpaqueData instance using the specified properties.

#### Parameters

##### properties?

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

Properties to set

#### Returns

[`MsgOpaqueData`](MsgOpaqueData.md)

MsgOpaqueData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MsgOpaqueData`](MsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:34017](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34017)

Decodes a MsgOpaqueData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MsgOpaqueData`](MsgOpaqueData.md)

MsgOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MsgOpaqueData`](MsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:34026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34026)

Decodes a MsgOpaqueData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MsgOpaqueData`](MsgOpaqueData.md)

MsgOpaqueData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:33999](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33999)

Encodes the specified MsgOpaqueData message. Does not implicitly [verify](MsgOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

MsgOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:34007](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34007)

Encodes the specified MsgOpaqueData message, length delimited. Does not implicitly [verify](MsgOpaqueData.md#verify) messages.

#### Parameters

##### message

[`IMsgOpaqueData`](../interfaces/IMsgOpaqueData.md)

MsgOpaqueData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MsgOpaqueData`](MsgOpaqueData.md)

Defined in: [WAProto/index.d.ts:34040](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34040)

Creates a MsgOpaqueData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MsgOpaqueData`](MsgOpaqueData.md)

MsgOpaqueData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:34061](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34061)

Gets the default type url for MsgOpaqueData

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

Defined in: [WAProto/index.d.ts:34048](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34048)

Creates a plain object from a MsgOpaqueData message. Also converts values to other types if specified.

#### Parameters

##### message

[`MsgOpaqueData`](MsgOpaqueData.md)

MsgOpaqueData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:34033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L34033)

Verifies a MsgOpaqueData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
