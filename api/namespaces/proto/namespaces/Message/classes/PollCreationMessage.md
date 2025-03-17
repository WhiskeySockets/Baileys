# Class: PollCreationMessage

Defined in: [WAProto/index.d.ts:28735](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28735)

Represents a PollCreationMessage.

## Implements

- [`IPollCreationMessage`](../interfaces/IPollCreationMessage.md)

## Constructors

### new PollCreationMessage()

> **new PollCreationMessage**(`properties`?): [`PollCreationMessage`](PollCreationMessage.md)

Defined in: [WAProto/index.d.ts:28741](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28741)

Constructs a new PollCreationMessage.

#### Parameters

##### properties?

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md)

Properties to set

#### Returns

[`PollCreationMessage`](PollCreationMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:28756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28756)

PollCreationMessage contextInfo.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`contextInfo`](../interfaces/IPollCreationMessage.md#contextinfo)

***

### correctAnswer?

> `optional` **correctAnswer**: `null` \| [`IOption`](../namespaces/PollCreationMessage/interfaces/IOption.md)

Defined in: [WAProto/index.d.ts:28765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28765)

PollCreationMessage correctAnswer.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`correctAnswer`](../interfaces/IPollCreationMessage.md#correctanswer)

***

### encKey?

> `optional` **encKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:28744](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28744)

PollCreationMessage encKey.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`encKey`](../interfaces/IPollCreationMessage.md#enckey)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:28747](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28747)

PollCreationMessage name.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`name`](../interfaces/IPollCreationMessage.md#name)

***

### options

> **options**: [`IOption`](../namespaces/PollCreationMessage/interfaces/IOption.md)[]

Defined in: [WAProto/index.d.ts:28750](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28750)

PollCreationMessage options.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`options`](../interfaces/IPollCreationMessage.md#options)

***

### pollContentType?

> `optional` **pollContentType**: `null` \| [`PollContentType`](../enumerations/PollContentType.md)

Defined in: [WAProto/index.d.ts:28759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28759)

PollCreationMessage pollContentType.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`pollContentType`](../interfaces/IPollCreationMessage.md#pollcontenttype)

***

### pollType?

> `optional` **pollType**: `null` \| [`PollType`](../namespaces/PollCreationMessage/enumerations/PollType.md)

Defined in: [WAProto/index.d.ts:28762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28762)

PollCreationMessage pollType.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`pollType`](../interfaces/IPollCreationMessage.md#polltype)

***

### selectableOptionsCount?

> `optional` **selectableOptionsCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:28753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28753)

PollCreationMessage selectableOptionsCount.

#### Implementation of

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md).[`selectableOptionsCount`](../interfaces/IPollCreationMessage.md#selectableoptionscount)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28835)

Converts this PollCreationMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollCreationMessage`](PollCreationMessage.md)

Defined in: [WAProto/index.d.ts:28772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28772)

Creates a new PollCreationMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md)

Properties to set

#### Returns

[`PollCreationMessage`](PollCreationMessage.md)

PollCreationMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollCreationMessage`](PollCreationMessage.md)

Defined in: [WAProto/index.d.ts:28798](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28798)

Decodes a PollCreationMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollCreationMessage`](PollCreationMessage.md)

PollCreationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollCreationMessage`](PollCreationMessage.md)

Defined in: [WAProto/index.d.ts:28807](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28807)

Decodes a PollCreationMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollCreationMessage`](PollCreationMessage.md)

PollCreationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28780)

Encodes the specified PollCreationMessage message. Does not implicitly [verify](PollCreationMessage.md#verify) messages.

#### Parameters

##### message

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md)

PollCreationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28788](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28788)

Encodes the specified PollCreationMessage message, length delimited. Does not implicitly [verify](PollCreationMessage.md#verify) messages.

#### Parameters

##### message

[`IPollCreationMessage`](../interfaces/IPollCreationMessage.md)

PollCreationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollCreationMessage`](PollCreationMessage.md)

Defined in: [WAProto/index.d.ts:28821](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28821)

Creates a PollCreationMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollCreationMessage`](PollCreationMessage.md)

PollCreationMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28842](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28842)

Gets the default type url for PollCreationMessage

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

Defined in: [WAProto/index.d.ts:28829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28829)

Creates a plain object from a PollCreationMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollCreationMessage`](PollCreationMessage.md)

PollCreationMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28814)

Verifies a PollCreationMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
