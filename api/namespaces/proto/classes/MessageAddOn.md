# Class: MessageAddOn

Defined in: [WAProto/index.d.ts:32887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32887)

Represents a MessageAddOn.

## Implements

- [`IMessageAddOn`](../interfaces/IMessageAddOn.md)

## Constructors

### new MessageAddOn()

> **new MessageAddOn**(`properties`?): [`MessageAddOn`](MessageAddOn.md)

Defined in: [WAProto/index.d.ts:32893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32893)

Constructs a new MessageAddOn.

#### Parameters

##### properties?

[`IMessageAddOn`](../interfaces/IMessageAddOn.md)

Properties to set

#### Returns

[`MessageAddOn`](MessageAddOn.md)

## Properties

### addOnContextInfo?

> `optional` **addOnContextInfo**: `null` \| [`IMessageAddOnContextInfo`](../interfaces/IMessageAddOnContextInfo.md)

Defined in: [WAProto/index.d.ts:32911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32911)

MessageAddOn addOnContextInfo.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`addOnContextInfo`](../interfaces/IMessageAddOn.md#addoncontextinfo)

***

### legacyMessage?

> `optional` **legacyMessage**: `null` \| [`ILegacyMessage`](../interfaces/ILegacyMessage.md)

Defined in: [WAProto/index.d.ts:32917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32917)

MessageAddOn legacyMessage.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`legacyMessage`](../interfaces/IMessageAddOn.md#legacymessage)

***

### messageAddOn?

> `optional` **messageAddOn**: `null` \| [`IMessage`](../interfaces/IMessage.md)

Defined in: [WAProto/index.d.ts:32899](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32899)

MessageAddOn messageAddOn.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`messageAddOn`](../interfaces/IMessageAddOn.md#messageaddon)

***

### messageAddOnKey?

> `optional` **messageAddOnKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:32914](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32914)

MessageAddOn messageAddOnKey.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`messageAddOnKey`](../interfaces/IMessageAddOn.md#messageaddonkey)

***

### messageAddOnType?

> `optional` **messageAddOnType**: `null` \| [`MessageAddOnType`](../namespaces/MessageAddOn/enumerations/MessageAddOnType.md)

Defined in: [WAProto/index.d.ts:32896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32896)

MessageAddOn messageAddOnType.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`messageAddOnType`](../interfaces/IMessageAddOn.md#messageaddontype)

***

### senderTimestampMs?

> `optional` **senderTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:32902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32902)

MessageAddOn senderTimestampMs.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`senderTimestampMs`](../interfaces/IMessageAddOn.md#sendertimestampms)

***

### serverTimestampMs?

> `optional` **serverTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:32905](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32905)

MessageAddOn serverTimestampMs.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`serverTimestampMs`](../interfaces/IMessageAddOn.md#servertimestampms)

***

### status?

> `optional` **status**: `null` \| [`Status`](../namespaces/WebMessageInfo/enumerations/Status.md)

Defined in: [WAProto/index.d.ts:32908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32908)

MessageAddOn status.

#### Implementation of

[`IMessageAddOn`](../interfaces/IMessageAddOn.md).[`status`](../interfaces/IMessageAddOn.md#status)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:32987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32987)

Converts this MessageAddOn to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MessageAddOn`](MessageAddOn.md)

Defined in: [WAProto/index.d.ts:32924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32924)

Creates a new MessageAddOn instance using the specified properties.

#### Parameters

##### properties?

[`IMessageAddOn`](../interfaces/IMessageAddOn.md)

Properties to set

#### Returns

[`MessageAddOn`](MessageAddOn.md)

MessageAddOn instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MessageAddOn`](MessageAddOn.md)

Defined in: [WAProto/index.d.ts:32950](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32950)

Decodes a MessageAddOn message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MessageAddOn`](MessageAddOn.md)

MessageAddOn

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MessageAddOn`](MessageAddOn.md)

Defined in: [WAProto/index.d.ts:32959](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32959)

Decodes a MessageAddOn message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MessageAddOn`](MessageAddOn.md)

MessageAddOn

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32932)

Encodes the specified MessageAddOn message. Does not implicitly [verify](MessageAddOn.md#verify) messages.

#### Parameters

##### message

[`IMessageAddOn`](../interfaces/IMessageAddOn.md)

MessageAddOn message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:32940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32940)

Encodes the specified MessageAddOn message, length delimited. Does not implicitly [verify](MessageAddOn.md#verify) messages.

#### Parameters

##### message

[`IMessageAddOn`](../interfaces/IMessageAddOn.md)

MessageAddOn message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MessageAddOn`](MessageAddOn.md)

Defined in: [WAProto/index.d.ts:32973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32973)

Creates a MessageAddOn message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MessageAddOn`](MessageAddOn.md)

MessageAddOn

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:32994](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32994)

Gets the default type url for MessageAddOn

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

Defined in: [WAProto/index.d.ts:32981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32981)

Creates a plain object from a MessageAddOn message. Also converts values to other types if specified.

#### Parameters

##### message

[`MessageAddOn`](MessageAddOn.md)

MessageAddOn

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:32966](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L32966)

Verifies a MessageAddOn message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
