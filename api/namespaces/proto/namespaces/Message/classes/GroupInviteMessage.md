# Class: GroupInviteMessage

Defined in: [WAProto/index.d.ts:21809](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21809)

Represents a GroupInviteMessage.

## Implements

- [`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md)

## Constructors

### new GroupInviteMessage()

> **new GroupInviteMessage**(`properties`?): [`GroupInviteMessage`](GroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:21815](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21815)

Constructs a new GroupInviteMessage.

#### Parameters

##### properties?

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md)

Properties to set

#### Returns

[`GroupInviteMessage`](GroupInviteMessage.md)

## Properties

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21833)

GroupInviteMessage caption.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`caption`](../interfaces/IGroupInviteMessage.md#caption)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:21836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21836)

GroupInviteMessage contextInfo.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`contextInfo`](../interfaces/IGroupInviteMessage.md#contextinfo)

***

### groupJid?

> `optional` **groupJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21818](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21818)

GroupInviteMessage groupJid.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`groupJid`](../interfaces/IGroupInviteMessage.md#groupjid)

***

### groupName?

> `optional` **groupName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21827)

GroupInviteMessage groupName.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`groupName`](../interfaces/IGroupInviteMessage.md#groupname)

***

### groupType?

> `optional` **groupType**: `null` \| [`GroupType`](../namespaces/GroupInviteMessage/enumerations/GroupType.md)

Defined in: [WAProto/index.d.ts:21839](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21839)

GroupInviteMessage groupType.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`groupType`](../interfaces/IGroupInviteMessage.md#grouptype)

***

### inviteCode?

> `optional` **inviteCode**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21821](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21821)

GroupInviteMessage inviteCode.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`inviteCode`](../interfaces/IGroupInviteMessage.md#invitecode)

***

### inviteExpiration?

> `optional` **inviteExpiration**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:21824](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21824)

GroupInviteMessage inviteExpiration.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`inviteExpiration`](../interfaces/IGroupInviteMessage.md#inviteexpiration)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:21830](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21830)

GroupInviteMessage jpegThumbnail.

#### Implementation of

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md).[`jpegThumbnail`](../interfaces/IGroupInviteMessage.md#jpegthumbnail)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21909](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21909)

Converts this GroupInviteMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`GroupInviteMessage`](GroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:21846](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21846)

Creates a new GroupInviteMessage instance using the specified properties.

#### Parameters

##### properties?

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md)

Properties to set

#### Returns

[`GroupInviteMessage`](GroupInviteMessage.md)

GroupInviteMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`GroupInviteMessage`](GroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:21872](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21872)

Decodes a GroupInviteMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`GroupInviteMessage`](GroupInviteMessage.md)

GroupInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`GroupInviteMessage`](GroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:21881](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21881)

Decodes a GroupInviteMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`GroupInviteMessage`](GroupInviteMessage.md)

GroupInviteMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21854)

Encodes the specified GroupInviteMessage message. Does not implicitly [verify](GroupInviteMessage.md#verify) messages.

#### Parameters

##### message

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md)

GroupInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21862)

Encodes the specified GroupInviteMessage message, length delimited. Does not implicitly [verify](GroupInviteMessage.md#verify) messages.

#### Parameters

##### message

[`IGroupInviteMessage`](../interfaces/IGroupInviteMessage.md)

GroupInviteMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`GroupInviteMessage`](GroupInviteMessage.md)

Defined in: [WAProto/index.d.ts:21895](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21895)

Creates a GroupInviteMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`GroupInviteMessage`](GroupInviteMessage.md)

GroupInviteMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21916)

Gets the default type url for GroupInviteMessage

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

Defined in: [WAProto/index.d.ts:21903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21903)

Creates a plain object from a GroupInviteMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`GroupInviteMessage`](GroupInviteMessage.md)

GroupInviteMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21888](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21888)

Verifies a GroupInviteMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
