# Class: StatusMentionMessage

Defined in: [WAProto/index.d.ts:40046](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40046)

Represents a StatusMentionMessage.

## Implements

- [`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md)

## Constructors

### new StatusMentionMessage()

> **new StatusMentionMessage**(`properties`?): [`StatusMentionMessage`](StatusMentionMessage.md)

Defined in: [WAProto/index.d.ts:40052](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40052)

Constructs a new StatusMentionMessage.

#### Parameters

##### properties?

[`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md)

Properties to set

#### Returns

[`StatusMentionMessage`](StatusMentionMessage.md)

## Properties

### quotedStatus?

> `optional` **quotedStatus**: `null` \| [`IMessage`](../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:40055](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40055)

StatusMentionMessage quotedStatus.

#### Implementation of

[`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md).[`quotedStatus`](../interfaces/IStatusMentionMessage.md#quotedstatus)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:40125](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40125)

Converts this StatusMentionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StatusMentionMessage`](StatusMentionMessage.md)

Defined in: [WAProto/index.d.ts:40062](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40062)

Creates a new StatusMentionMessage instance using the specified properties.

#### Parameters

##### properties?

[`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md)

Properties to set

#### Returns

[`StatusMentionMessage`](StatusMentionMessage.md)

StatusMentionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StatusMentionMessage`](StatusMentionMessage.md)

Defined in: [WAProto/index.d.ts:40088](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40088)

Decodes a StatusMentionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StatusMentionMessage`](StatusMentionMessage.md)

StatusMentionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StatusMentionMessage`](StatusMentionMessage.md)

Defined in: [WAProto/index.d.ts:40097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40097)

Decodes a StatusMentionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StatusMentionMessage`](StatusMentionMessage.md)

StatusMentionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40070](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40070)

Encodes the specified StatusMentionMessage message. Does not implicitly [verify](StatusMentionMessage.md#verify) messages.

#### Parameters

##### message

[`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md)

StatusMentionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:40078](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40078)

Encodes the specified StatusMentionMessage message, length delimited. Does not implicitly [verify](StatusMentionMessage.md#verify) messages.

#### Parameters

##### message

[`IStatusMentionMessage`](../interfaces/IStatusMentionMessage.md)

StatusMentionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StatusMentionMessage`](StatusMentionMessage.md)

Defined in: [WAProto/index.d.ts:40111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40111)

Creates a StatusMentionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StatusMentionMessage`](StatusMentionMessage.md)

StatusMentionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:40132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40132)

Gets the default type url for StatusMentionMessage

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

Defined in: [WAProto/index.d.ts:40119](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40119)

Creates a plain object from a StatusMentionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`StatusMentionMessage`](StatusMentionMessage.md)

StatusMentionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:40104](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40104)

Verifies a StatusMentionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
