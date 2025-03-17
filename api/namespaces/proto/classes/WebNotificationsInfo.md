# Class: WebNotificationsInfo

Defined in: [WAProto/index.d.ts:50286](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50286)

Represents a WebNotificationsInfo.

## Implements

- [`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md)

## Constructors

### new WebNotificationsInfo()

> **new WebNotificationsInfo**(`properties`?): [`WebNotificationsInfo`](WebNotificationsInfo.md)

Defined in: [WAProto/index.d.ts:50292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50292)

Constructs a new WebNotificationsInfo.

#### Parameters

##### properties?

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md)

Properties to set

#### Returns

[`WebNotificationsInfo`](WebNotificationsInfo.md)

## Properties

### notifyMessageCount?

> `optional` **notifyMessageCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:50301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50301)

WebNotificationsInfo notifyMessageCount.

#### Implementation of

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md).[`notifyMessageCount`](../interfaces/IWebNotificationsInfo.md#notifymessagecount)

***

### notifyMessages

> **notifyMessages**: [`IWebMessageInfo`](../interfaces/IWebMessageInfo.md)[]

Defined in: [WAProto/index.d.ts:50304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50304)

WebNotificationsInfo notifyMessages.

#### Implementation of

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md).[`notifyMessages`](../interfaces/IWebNotificationsInfo.md#notifymessages)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:50295](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50295)

WebNotificationsInfo timestamp.

#### Implementation of

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md).[`timestamp`](../interfaces/IWebNotificationsInfo.md#timestamp)

***

### unreadChats?

> `optional` **unreadChats**: `null` \| `number`

Defined in: [WAProto/index.d.ts:50298](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50298)

WebNotificationsInfo unreadChats.

#### Implementation of

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md).[`unreadChats`](../interfaces/IWebNotificationsInfo.md#unreadchats)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:50374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50374)

Converts this WebNotificationsInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WebNotificationsInfo`](WebNotificationsInfo.md)

Defined in: [WAProto/index.d.ts:50311](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50311)

Creates a new WebNotificationsInfo instance using the specified properties.

#### Parameters

##### properties?

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md)

Properties to set

#### Returns

[`WebNotificationsInfo`](WebNotificationsInfo.md)

WebNotificationsInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WebNotificationsInfo`](WebNotificationsInfo.md)

Defined in: [WAProto/index.d.ts:50337](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50337)

Decodes a WebNotificationsInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WebNotificationsInfo`](WebNotificationsInfo.md)

WebNotificationsInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WebNotificationsInfo`](WebNotificationsInfo.md)

Defined in: [WAProto/index.d.ts:50346](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50346)

Decodes a WebNotificationsInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WebNotificationsInfo`](WebNotificationsInfo.md)

WebNotificationsInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:50319](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50319)

Encodes the specified WebNotificationsInfo message. Does not implicitly [verify](WebNotificationsInfo.md#verify) messages.

#### Parameters

##### message

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md)

WebNotificationsInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:50327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50327)

Encodes the specified WebNotificationsInfo message, length delimited. Does not implicitly [verify](WebNotificationsInfo.md#verify) messages.

#### Parameters

##### message

[`IWebNotificationsInfo`](../interfaces/IWebNotificationsInfo.md)

WebNotificationsInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WebNotificationsInfo`](WebNotificationsInfo.md)

Defined in: [WAProto/index.d.ts:50360](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50360)

Creates a WebNotificationsInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WebNotificationsInfo`](WebNotificationsInfo.md)

WebNotificationsInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:50381](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50381)

Gets the default type url for WebNotificationsInfo

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

Defined in: [WAProto/index.d.ts:50368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50368)

Creates a plain object from a WebNotificationsInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`WebNotificationsInfo`](WebNotificationsInfo.md)

WebNotificationsInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:50353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L50353)

Verifies a WebNotificationsInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
