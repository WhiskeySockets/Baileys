# Class: StatusNotificationMessage

Defined in: [WAProto/index.d.ts:31259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31259)

Represents a StatusNotificationMessage.

## Implements

- [`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md)

## Constructors

### new StatusNotificationMessage()

> **new StatusNotificationMessage**(`properties`?): [`StatusNotificationMessage`](StatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:31265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31265)

Constructs a new StatusNotificationMessage.

#### Parameters

##### properties?

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md)

Properties to set

#### Returns

[`StatusNotificationMessage`](StatusNotificationMessage.md)

## Properties

### originalMessageKey?

> `optional` **originalMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:31271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31271)

StatusNotificationMessage originalMessageKey.

#### Implementation of

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md).[`originalMessageKey`](../interfaces/IStatusNotificationMessage.md#originalmessagekey)

***

### responseMessageKey?

> `optional` **responseMessageKey**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:31268](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31268)

StatusNotificationMessage responseMessageKey.

#### Implementation of

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md).[`responseMessageKey`](../interfaces/IStatusNotificationMessage.md#responsemessagekey)

***

### type?

> `optional` **type**: `null` \| [`StatusNotificationType`](../namespaces/StatusNotificationMessage/enumerations/StatusNotificationType.md)

Defined in: [WAProto/index.d.ts:31274](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31274)

StatusNotificationMessage type.

#### Implementation of

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md).[`type`](../interfaces/IStatusNotificationMessage.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:31344](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31344)

Converts this StatusNotificationMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StatusNotificationMessage`](StatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:31281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31281)

Creates a new StatusNotificationMessage instance using the specified properties.

#### Parameters

##### properties?

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md)

Properties to set

#### Returns

[`StatusNotificationMessage`](StatusNotificationMessage.md)

StatusNotificationMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StatusNotificationMessage`](StatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:31307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31307)

Decodes a StatusNotificationMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StatusNotificationMessage`](StatusNotificationMessage.md)

StatusNotificationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StatusNotificationMessage`](StatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:31316](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31316)

Decodes a StatusNotificationMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StatusNotificationMessage`](StatusNotificationMessage.md)

StatusNotificationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31289](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31289)

Encodes the specified StatusNotificationMessage message. Does not implicitly [verify](StatusNotificationMessage.md#verify) messages.

#### Parameters

##### message

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md)

StatusNotificationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31297](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31297)

Encodes the specified StatusNotificationMessage message, length delimited. Does not implicitly [verify](StatusNotificationMessage.md#verify) messages.

#### Parameters

##### message

[`IStatusNotificationMessage`](../interfaces/IStatusNotificationMessage.md)

StatusNotificationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StatusNotificationMessage`](StatusNotificationMessage.md)

Defined in: [WAProto/index.d.ts:31330](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31330)

Creates a StatusNotificationMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StatusNotificationMessage`](StatusNotificationMessage.md)

StatusNotificationMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:31351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31351)

Gets the default type url for StatusNotificationMessage

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

Defined in: [WAProto/index.d.ts:31338](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31338)

Creates a plain object from a StatusNotificationMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`StatusNotificationMessage`](StatusNotificationMessage.md)

StatusNotificationMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:31323](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31323)

Verifies a StatusNotificationMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
