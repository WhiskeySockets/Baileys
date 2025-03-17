# Class: EventMessage

Defined in: [WAProto/index.d.ts:21073](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21073)

Represents an EventMessage.

## Implements

- [`IEventMessage`](../interfaces/IEventMessage.md)

## Constructors

### new EventMessage()

> **new EventMessage**(`properties`?): [`EventMessage`](EventMessage.md)

Defined in: [WAProto/index.d.ts:21079](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21079)

Constructs a new EventMessage.

#### Parameters

##### properties?

[`IEventMessage`](../interfaces/IEventMessage.md)

Properties to set

#### Returns

[`EventMessage`](EventMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:21082](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21082)

EventMessage contextInfo.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`contextInfo`](../interfaces/IEventMessage.md#contextinfo)

***

### description?

> `optional` **description**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21091](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21091)

EventMessage description.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`description`](../interfaces/IEventMessage.md#description)

***

### endTime?

> `optional` **endTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:21103](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21103)

EventMessage endTime.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`endTime`](../interfaces/IEventMessage.md#endtime)

***

### extraGuestsAllowed?

> `optional` **extraGuestsAllowed**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:21106](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21106)

EventMessage extraGuestsAllowed.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`extraGuestsAllowed`](../interfaces/IEventMessage.md#extraguestsallowed)

***

### isCanceled?

> `optional` **isCanceled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:21085](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21085)

EventMessage isCanceled.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`isCanceled`](../interfaces/IEventMessage.md#iscanceled)

***

### joinLink?

> `optional` **joinLink**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21097](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21097)

EventMessage joinLink.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`joinLink`](../interfaces/IEventMessage.md#joinlink)

***

### location?

> `optional` **location**: `null` \| [`ILocationMessage`](../interfaces/ILocationMessage.md)

Defined in: [WAProto/index.d.ts:21094](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21094)

EventMessage location.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`location`](../interfaces/IEventMessage.md#location)

***

### name?

> `optional` **name**: `null` \| `string`

Defined in: [WAProto/index.d.ts:21088](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21088)

EventMessage name.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`name`](../interfaces/IEventMessage.md#name)

***

### startTime?

> `optional` **startTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:21100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21100)

EventMessage startTime.

#### Implementation of

[`IEventMessage`](../interfaces/IEventMessage.md).[`startTime`](../interfaces/IEventMessage.md#starttime)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:21176](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21176)

Converts this EventMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EventMessage`](EventMessage.md)

Defined in: [WAProto/index.d.ts:21113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21113)

Creates a new EventMessage instance using the specified properties.

#### Parameters

##### properties?

[`IEventMessage`](../interfaces/IEventMessage.md)

Properties to set

#### Returns

[`EventMessage`](EventMessage.md)

EventMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EventMessage`](EventMessage.md)

Defined in: [WAProto/index.d.ts:21139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21139)

Decodes an EventMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EventMessage`](EventMessage.md)

EventMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EventMessage`](EventMessage.md)

Defined in: [WAProto/index.d.ts:21148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21148)

Decodes an EventMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EventMessage`](EventMessage.md)

EventMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21121](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21121)

Encodes the specified EventMessage message. Does not implicitly [verify](EventMessage.md#verify) messages.

#### Parameters

##### message

[`IEventMessage`](../interfaces/IEventMessage.md)

EventMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:21129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21129)

Encodes the specified EventMessage message, length delimited. Does not implicitly [verify](EventMessage.md#verify) messages.

#### Parameters

##### message

[`IEventMessage`](../interfaces/IEventMessage.md)

EventMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EventMessage`](EventMessage.md)

Defined in: [WAProto/index.d.ts:21162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21162)

Creates an EventMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EventMessage`](EventMessage.md)

EventMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:21183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21183)

Gets the default type url for EventMessage

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

Defined in: [WAProto/index.d.ts:21170](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21170)

Creates a plain object from an EventMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`EventMessage`](EventMessage.md)

EventMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:21155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L21155)

Verifies an EventMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
