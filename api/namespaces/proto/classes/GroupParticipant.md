# Class: GroupParticipant

Defined in: [WAProto/index.d.ts:13798](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13798)

Represents a GroupParticipant.

## Implements

- [`IGroupParticipant`](../interfaces/IGroupParticipant.md)

## Constructors

### new GroupParticipant()

> **new GroupParticipant**(`properties`?): [`GroupParticipant`](GroupParticipant.md)

Defined in: [WAProto/index.d.ts:13804](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13804)

Constructs a new GroupParticipant.

#### Parameters

##### properties?

[`IGroupParticipant`](../interfaces/IGroupParticipant.md)

Properties to set

#### Returns

[`GroupParticipant`](GroupParticipant.md)

## Properties

### rank?

> `optional` **rank**: `null` \| [`Rank`](../namespaces/GroupParticipant/enumerations/Rank.md)

Defined in: [WAProto/index.d.ts:13810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13810)

GroupParticipant rank.

#### Implementation of

[`IGroupParticipant`](../interfaces/IGroupParticipant.md).[`rank`](../interfaces/IGroupParticipant.md#rank)

***

### userJid

> **userJid**: `string`

Defined in: [WAProto/index.d.ts:13807](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13807)

GroupParticipant userJid.

#### Implementation of

[`IGroupParticipant`](../interfaces/IGroupParticipant.md).[`userJid`](../interfaces/IGroupParticipant.md#userjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13880](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13880)

Converts this GroupParticipant to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`GroupParticipant`](GroupParticipant.md)

Defined in: [WAProto/index.d.ts:13817](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13817)

Creates a new GroupParticipant instance using the specified properties.

#### Parameters

##### properties?

[`IGroupParticipant`](../interfaces/IGroupParticipant.md)

Properties to set

#### Returns

[`GroupParticipant`](GroupParticipant.md)

GroupParticipant instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`GroupParticipant`](GroupParticipant.md)

Defined in: [WAProto/index.d.ts:13843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13843)

Decodes a GroupParticipant message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`GroupParticipant`](GroupParticipant.md)

GroupParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`GroupParticipant`](GroupParticipant.md)

Defined in: [WAProto/index.d.ts:13852](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13852)

Decodes a GroupParticipant message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`GroupParticipant`](GroupParticipant.md)

GroupParticipant

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13825)

Encodes the specified GroupParticipant message. Does not implicitly [verify](GroupParticipant.md#verify) messages.

#### Parameters

##### message

[`IGroupParticipant`](../interfaces/IGroupParticipant.md)

GroupParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13833](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13833)

Encodes the specified GroupParticipant message, length delimited. Does not implicitly [verify](GroupParticipant.md#verify) messages.

#### Parameters

##### message

[`IGroupParticipant`](../interfaces/IGroupParticipant.md)

GroupParticipant message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`GroupParticipant`](GroupParticipant.md)

Defined in: [WAProto/index.d.ts:13866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13866)

Creates a GroupParticipant message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`GroupParticipant`](GroupParticipant.md)

GroupParticipant

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13887)

Gets the default type url for GroupParticipant

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

Defined in: [WAProto/index.d.ts:13874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13874)

Creates a plain object from a GroupParticipant message. Also converts values to other types if specified.

#### Parameters

##### message

[`GroupParticipant`](GroupParticipant.md)

GroupParticipant

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:13859](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13859)

Verifies a GroupParticipant message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
