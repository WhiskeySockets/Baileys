# Class: ScheduledCallEditMessage

Defined in: [WAProto/index.d.ts:30808](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30808)

Represents a ScheduledCallEditMessage.

## Implements

- [`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md)

## Constructors

### new ScheduledCallEditMessage()

> **new ScheduledCallEditMessage**(`properties`?): [`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:30814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30814)

Constructs a new ScheduledCallEditMessage.

#### Parameters

##### properties?

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md)

Properties to set

#### Returns

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

## Properties

### editType?

> `optional` **editType**: `null` \| [`EditType`](../namespaces/ScheduledCallEditMessage/enumerations/EditType.md)

Defined in: [WAProto/index.d.ts:30820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30820)

ScheduledCallEditMessage editType.

#### Implementation of

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md).[`editType`](../interfaces/IScheduledCallEditMessage.md#edittype)

***

### key?

> `optional` **key**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:30817](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30817)

ScheduledCallEditMessage key.

#### Implementation of

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md).[`key`](../interfaces/IScheduledCallEditMessage.md#key)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30890)

Converts this ScheduledCallEditMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:30827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30827)

Creates a new ScheduledCallEditMessage instance using the specified properties.

#### Parameters

##### properties?

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md)

Properties to set

#### Returns

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

ScheduledCallEditMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:30853](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30853)

Decodes a ScheduledCallEditMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

ScheduledCallEditMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:30862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30862)

Decodes a ScheduledCallEditMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

ScheduledCallEditMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30835)

Encodes the specified ScheduledCallEditMessage message. Does not implicitly [verify](ScheduledCallEditMessage.md#verify) messages.

#### Parameters

##### message

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md)

ScheduledCallEditMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30843](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30843)

Encodes the specified ScheduledCallEditMessage message, length delimited. Does not implicitly [verify](ScheduledCallEditMessage.md#verify) messages.

#### Parameters

##### message

[`IScheduledCallEditMessage`](../interfaces/IScheduledCallEditMessage.md)

ScheduledCallEditMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

Defined in: [WAProto/index.d.ts:30876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30876)

Creates a ScheduledCallEditMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

ScheduledCallEditMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30897](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30897)

Gets the default type url for ScheduledCallEditMessage

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

Defined in: [WAProto/index.d.ts:30884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30884)

Creates a plain object from a ScheduledCallEditMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`ScheduledCallEditMessage`](ScheduledCallEditMessage.md)

ScheduledCallEditMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30869](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30869)

Verifies a ScheduledCallEditMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
