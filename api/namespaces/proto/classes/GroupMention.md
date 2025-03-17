# Class: GroupMention

Defined in: [WAProto/index.d.ts:13695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13695)

Represents a GroupMention.

## Implements

- [`IGroupMention`](../interfaces/IGroupMention.md)

## Constructors

### new GroupMention()

> **new GroupMention**(`properties`?): [`GroupMention`](GroupMention.md)

Defined in: [WAProto/index.d.ts:13701](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13701)

Constructs a new GroupMention.

#### Parameters

##### properties?

[`IGroupMention`](../interfaces/IGroupMention.md)

Properties to set

#### Returns

[`GroupMention`](GroupMention.md)

## Properties

### groupJid?

> `optional` **groupJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:13704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13704)

GroupMention groupJid.

#### Implementation of

[`IGroupMention`](../interfaces/IGroupMention.md).[`groupJid`](../interfaces/IGroupMention.md#groupjid)

***

### groupSubject?

> `optional` **groupSubject**: `null` \| `string`

Defined in: [WAProto/index.d.ts:13707](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13707)

GroupMention groupSubject.

#### Implementation of

[`IGroupMention`](../interfaces/IGroupMention.md).[`groupSubject`](../interfaces/IGroupMention.md#groupsubject)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13777)

Converts this GroupMention to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`GroupMention`](GroupMention.md)

Defined in: [WAProto/index.d.ts:13714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13714)

Creates a new GroupMention instance using the specified properties.

#### Parameters

##### properties?

[`IGroupMention`](../interfaces/IGroupMention.md)

Properties to set

#### Returns

[`GroupMention`](GroupMention.md)

GroupMention instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`GroupMention`](GroupMention.md)

Defined in: [WAProto/index.d.ts:13740](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13740)

Decodes a GroupMention message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`GroupMention`](GroupMention.md)

GroupMention

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`GroupMention`](GroupMention.md)

Defined in: [WAProto/index.d.ts:13749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13749)

Decodes a GroupMention message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`GroupMention`](GroupMention.md)

GroupMention

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13722)

Encodes the specified GroupMention message. Does not implicitly [verify](GroupMention.md#verify) messages.

#### Parameters

##### message

[`IGroupMention`](../interfaces/IGroupMention.md)

GroupMention message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13730)

Encodes the specified GroupMention message, length delimited. Does not implicitly [verify](GroupMention.md#verify) messages.

#### Parameters

##### message

[`IGroupMention`](../interfaces/IGroupMention.md)

GroupMention message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`GroupMention`](GroupMention.md)

Defined in: [WAProto/index.d.ts:13763](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13763)

Creates a GroupMention message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`GroupMention`](GroupMention.md)

GroupMention

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13784)

Gets the default type url for GroupMention

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

Defined in: [WAProto/index.d.ts:13771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13771)

Creates a plain object from a GroupMention message. Also converts values to other types if specified.

#### Parameters

##### message

[`GroupMention`](GroupMention.md)

GroupMention

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:13756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13756)

Verifies a GroupMention message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
