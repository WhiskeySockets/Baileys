# Class: MessageHistoryBundle

Defined in: [WAProto/index.d.ts:26337](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26337)

Represents a MessageHistoryBundle.

## Implements

- [`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md)

## Constructors

### new MessageHistoryBundle()

> **new MessageHistoryBundle**(`properties`?): [`MessageHistoryBundle`](MessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:26343](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26343)

Constructs a new MessageHistoryBundle.

#### Parameters

##### properties?

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md)

Properties to set

#### Returns

[`MessageHistoryBundle`](MessageHistoryBundle.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:26364](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26364)

MessageHistoryBundle contextInfo.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`contextInfo`](../interfaces/IMessageHistoryBundle.md#contextinfo)

***

### directPath?

> `optional` **directPath**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26358](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26358)

MessageHistoryBundle directPath.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`directPath`](../interfaces/IMessageHistoryBundle.md#directpath)

***

### fileEncSha256?

> `optional` **fileEncSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26355](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26355)

MessageHistoryBundle fileEncSha256.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`fileEncSha256`](../interfaces/IMessageHistoryBundle.md#fileencsha256)

***

### fileSha256?

> `optional` **fileSha256**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26349](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26349)

MessageHistoryBundle fileSha256.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`fileSha256`](../interfaces/IMessageHistoryBundle.md#filesha256)

***

### mediaKey?

> `optional` **mediaKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26352](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26352)

MessageHistoryBundle mediaKey.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`mediaKey`](../interfaces/IMessageHistoryBundle.md#mediakey)

***

### mediaKeyTimestamp?

> `optional` **mediaKeyTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:26361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26361)

MessageHistoryBundle mediaKeyTimestamp.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`mediaKeyTimestamp`](../interfaces/IMessageHistoryBundle.md#mediakeytimestamp)

***

### mimetype?

> `optional` **mimetype**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26346](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26346)

MessageHistoryBundle mimetype.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`mimetype`](../interfaces/IMessageHistoryBundle.md#mimetype)

***

### participants

> **participants**: `string`[]

Defined in: [WAProto/index.d.ts:26367](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26367)

MessageHistoryBundle participants.

#### Implementation of

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md).[`participants`](../interfaces/IMessageHistoryBundle.md#participants)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26437)

Converts this MessageHistoryBundle to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MessageHistoryBundle`](MessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:26374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26374)

Creates a new MessageHistoryBundle instance using the specified properties.

#### Parameters

##### properties?

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md)

Properties to set

#### Returns

[`MessageHistoryBundle`](MessageHistoryBundle.md)

MessageHistoryBundle instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MessageHistoryBundle`](MessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:26400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26400)

Decodes a MessageHistoryBundle message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MessageHistoryBundle`](MessageHistoryBundle.md)

MessageHistoryBundle

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MessageHistoryBundle`](MessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:26409](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26409)

Decodes a MessageHistoryBundle message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MessageHistoryBundle`](MessageHistoryBundle.md)

MessageHistoryBundle

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26382)

Encodes the specified MessageHistoryBundle message. Does not implicitly [verify](MessageHistoryBundle.md#verify) messages.

#### Parameters

##### message

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md)

MessageHistoryBundle message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26390)

Encodes the specified MessageHistoryBundle message, length delimited. Does not implicitly [verify](MessageHistoryBundle.md#verify) messages.

#### Parameters

##### message

[`IMessageHistoryBundle`](../interfaces/IMessageHistoryBundle.md)

MessageHistoryBundle message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MessageHistoryBundle`](MessageHistoryBundle.md)

Defined in: [WAProto/index.d.ts:26423](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26423)

Creates a MessageHistoryBundle message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MessageHistoryBundle`](MessageHistoryBundle.md)

MessageHistoryBundle

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26444)

Gets the default type url for MessageHistoryBundle

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

Defined in: [WAProto/index.d.ts:26431](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26431)

Creates a plain object from a MessageHistoryBundle message. Also converts values to other types if specified.

#### Parameters

##### message

[`MessageHistoryBundle`](MessageHistoryBundle.md)

MessageHistoryBundle

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26416](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26416)

Verifies a MessageHistoryBundle message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
