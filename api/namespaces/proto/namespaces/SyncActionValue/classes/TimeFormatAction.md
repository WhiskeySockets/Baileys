# Class: TimeFormatAction

Defined in: [WAProto/index.d.ts:46178](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46178)

Represents a TimeFormatAction.

## Implements

- [`ITimeFormatAction`](../interfaces/ITimeFormatAction.md)

## Constructors

### new TimeFormatAction()

> **new TimeFormatAction**(`properties`?): [`TimeFormatAction`](TimeFormatAction.md)

Defined in: [WAProto/index.d.ts:46184](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46184)

Constructs a new TimeFormatAction.

#### Parameters

##### properties?

[`ITimeFormatAction`](../interfaces/ITimeFormatAction.md)

Properties to set

#### Returns

[`TimeFormatAction`](TimeFormatAction.md)

## Properties

### isTwentyFourHourFormatEnabled?

> `optional` **isTwentyFourHourFormatEnabled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:46187](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46187)

TimeFormatAction isTwentyFourHourFormatEnabled.

#### Implementation of

[`ITimeFormatAction`](../interfaces/ITimeFormatAction.md).[`isTwentyFourHourFormatEnabled`](../interfaces/ITimeFormatAction.md#istwentyfourhourformatenabled)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46257)

Converts this TimeFormatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TimeFormatAction`](TimeFormatAction.md)

Defined in: [WAProto/index.d.ts:46194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46194)

Creates a new TimeFormatAction instance using the specified properties.

#### Parameters

##### properties?

[`ITimeFormatAction`](../interfaces/ITimeFormatAction.md)

Properties to set

#### Returns

[`TimeFormatAction`](TimeFormatAction.md)

TimeFormatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TimeFormatAction`](TimeFormatAction.md)

Defined in: [WAProto/index.d.ts:46220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46220)

Decodes a TimeFormatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TimeFormatAction`](TimeFormatAction.md)

TimeFormatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TimeFormatAction`](TimeFormatAction.md)

Defined in: [WAProto/index.d.ts:46229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46229)

Decodes a TimeFormatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TimeFormatAction`](TimeFormatAction.md)

TimeFormatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46202](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46202)

Encodes the specified TimeFormatAction message. Does not implicitly [verify](TimeFormatAction.md#verify) messages.

#### Parameters

##### message

[`ITimeFormatAction`](../interfaces/ITimeFormatAction.md)

TimeFormatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46210](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46210)

Encodes the specified TimeFormatAction message, length delimited. Does not implicitly [verify](TimeFormatAction.md#verify) messages.

#### Parameters

##### message

[`ITimeFormatAction`](../interfaces/ITimeFormatAction.md)

TimeFormatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TimeFormatAction`](TimeFormatAction.md)

Defined in: [WAProto/index.d.ts:46243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46243)

Creates a TimeFormatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TimeFormatAction`](TimeFormatAction.md)

TimeFormatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46264](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46264)

Gets the default type url for TimeFormatAction

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

Defined in: [WAProto/index.d.ts:46251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46251)

Creates a plain object from a TimeFormatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`TimeFormatAction`](TimeFormatAction.md)

TimeFormatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46236)

Verifies a TimeFormatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
