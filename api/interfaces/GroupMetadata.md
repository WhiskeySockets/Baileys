# Interface: GroupMetadata

Defined in: [src/Types/GroupMetadata.ts:11](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L11)

## Properties

### announce?

> `optional` **announce**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:28](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L28)

is set when the group only allows admins to write messages

***

### author?

> `optional` **author**: `string`

Defined in: [src/Types/GroupMetadata.ts:44](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L44)

the person who added you to group or changed some setting in group

***

### creation?

> `optional` **creation**: `number`

Defined in: [src/Types/GroupMetadata.ts:19](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L19)

***

### desc?

> `optional` **desc**: `string`

Defined in: [src/Types/GroupMetadata.ts:20](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L20)

***

### descId?

> `optional` **descId**: `string`

Defined in: [src/Types/GroupMetadata.ts:22](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L22)

***

### descOwner?

> `optional` **descOwner**: `string`

Defined in: [src/Types/GroupMetadata.ts:21](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L21)

***

### ephemeralDuration?

> `optional` **ephemeralDuration**: `number`

Defined in: [src/Types/GroupMetadata.ts:41](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L41)

***

### id

> **id**: `string`

Defined in: [src/Types/GroupMetadata.ts:12](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L12)

***

### inviteCode?

> `optional` **inviteCode**: `string`

Defined in: [src/Types/GroupMetadata.ts:42](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L42)

***

### isCommunity?

> `optional` **isCommunity**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:34](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L34)

is this a community

***

### isCommunityAnnounce?

> `optional` **isCommunityAnnounce**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:36](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L36)

is this the announce of a community

***

### joinApprovalMode?

> `optional` **joinApprovalMode**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:32](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L32)

Request approval to join the group

***

### linkedParent?

> `optional` **linkedParent**: `string`

Defined in: [src/Types/GroupMetadata.ts:24](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L24)

if this group is part of a community, it returns the jid of the community to which it belongs

***

### memberAddMode?

> `optional` **memberAddMode**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:30](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L30)

is set when the group also allows members to add participants

***

### owner

> **owner**: `undefined` \| `string`

Defined in: [src/Types/GroupMetadata.ts:13](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L13)

***

### participants

> **participants**: [`GroupParticipant`](../type-aliases/GroupParticipant.md)[]

Defined in: [src/Types/GroupMetadata.ts:40](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L40)

***

### restrict?

> `optional` **restrict**: `boolean`

Defined in: [src/Types/GroupMetadata.ts:26](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L26)

is set when the group only allows admins to change group settings

***

### size?

> `optional` **size**: `number`

Defined in: [src/Types/GroupMetadata.ts:38](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L38)

number of group participants

***

### subject

> **subject**: `string`

Defined in: [src/Types/GroupMetadata.ts:14](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L14)

***

### subjectOwner?

> `optional` **subjectOwner**: `string`

Defined in: [src/Types/GroupMetadata.ts:16](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L16)

group subject owner

***

### subjectTime?

> `optional` **subjectTime**: `number`

Defined in: [src/Types/GroupMetadata.ts:18](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/GroupMetadata.ts#L18)

group subject modification date
