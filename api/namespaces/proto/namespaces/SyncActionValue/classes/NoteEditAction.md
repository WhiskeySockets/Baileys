# Class: NoteEditAction

Defined in: [WAProto/index.d.ts:43979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43979)

Represents a NoteEditAction.

## Implements

- [`INoteEditAction`](../interfaces/INoteEditAction.md)

## Constructors

### new NoteEditAction()

> **new NoteEditAction**(`properties`?): [`NoteEditAction`](NoteEditAction.md)

Defined in: [WAProto/index.d.ts:43985](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43985)

Constructs a new NoteEditAction.

#### Parameters

##### properties?

[`INoteEditAction`](../interfaces/INoteEditAction.md)

Properties to set

#### Returns

[`NoteEditAction`](NoteEditAction.md)

## Properties

### chatJid?

> `optional` **chatJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43991)

NoteEditAction chatJid.

#### Implementation of

[`INoteEditAction`](../interfaces/INoteEditAction.md).[`chatJid`](../interfaces/INoteEditAction.md#chatjid)

***

### createdAt?

> `optional` **createdAt**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:43994](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43994)

NoteEditAction createdAt.

#### Implementation of

[`INoteEditAction`](../interfaces/INoteEditAction.md).[`createdAt`](../interfaces/INoteEditAction.md#createdat)

***

### deleted?

> `optional` **deleted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43997)

NoteEditAction deleted.

#### Implementation of

[`INoteEditAction`](../interfaces/INoteEditAction.md).[`deleted`](../interfaces/INoteEditAction.md#deleted)

***

### type?

> `optional` **type**: `null` \| [`NoteType`](../namespaces/NoteEditAction/enumerations/NoteType.md)

Defined in: [WAProto/index.d.ts:43988](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43988)

NoteEditAction type.

#### Implementation of

[`INoteEditAction`](../interfaces/INoteEditAction.md).[`type`](../interfaces/INoteEditAction.md#type)

***

### unstructuredContent?

> `optional` **unstructuredContent**: `null` \| `string`

Defined in: [WAProto/index.d.ts:44000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44000)

NoteEditAction unstructuredContent.

#### Implementation of

[`INoteEditAction`](../interfaces/INoteEditAction.md).[`unstructuredContent`](../interfaces/INoteEditAction.md#unstructuredcontent)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44070)

Converts this NoteEditAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NoteEditAction`](NoteEditAction.md)

Defined in: [WAProto/index.d.ts:44007](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44007)

Creates a new NoteEditAction instance using the specified properties.

#### Parameters

##### properties?

[`INoteEditAction`](../interfaces/INoteEditAction.md)

Properties to set

#### Returns

[`NoteEditAction`](NoteEditAction.md)

NoteEditAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NoteEditAction`](NoteEditAction.md)

Defined in: [WAProto/index.d.ts:44033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44033)

Decodes a NoteEditAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NoteEditAction`](NoteEditAction.md)

NoteEditAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NoteEditAction`](NoteEditAction.md)

Defined in: [WAProto/index.d.ts:44042](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44042)

Decodes a NoteEditAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NoteEditAction`](NoteEditAction.md)

NoteEditAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44015](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44015)

Encodes the specified NoteEditAction message. Does not implicitly [verify](NoteEditAction.md#verify) messages.

#### Parameters

##### message

[`INoteEditAction`](../interfaces/INoteEditAction.md)

NoteEditAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44023](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44023)

Encodes the specified NoteEditAction message, length delimited. Does not implicitly [verify](NoteEditAction.md#verify) messages.

#### Parameters

##### message

[`INoteEditAction`](../interfaces/INoteEditAction.md)

NoteEditAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NoteEditAction`](NoteEditAction.md)

Defined in: [WAProto/index.d.ts:44056](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44056)

Creates a NoteEditAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NoteEditAction`](NoteEditAction.md)

NoteEditAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44077](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44077)

Gets the default type url for NoteEditAction

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

Defined in: [WAProto/index.d.ts:44064](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44064)

Creates a plain object from a NoteEditAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`NoteEditAction`](NoteEditAction.md)

NoteEditAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44049](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44049)

Verifies a NoteEditAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
