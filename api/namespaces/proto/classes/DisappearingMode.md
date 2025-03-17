# Class: DisappearingMode

Defined in: [WAProto/index.d.ts:12225](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12225)

Represents a DisappearingMode.

## Implements

- [`IDisappearingMode`](../interfaces/IDisappearingMode.md)

## Constructors

### new DisappearingMode()

> **new DisappearingMode**(`properties`?): [`DisappearingMode`](DisappearingMode.md)

Defined in: [WAProto/index.d.ts:12231](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12231)

Constructs a new DisappearingMode.

#### Parameters

##### properties?

[`IDisappearingMode`](../interfaces/IDisappearingMode.md)

Properties to set

#### Returns

[`DisappearingMode`](DisappearingMode.md)

## Properties

### initiatedByMe?

> `optional` **initiatedByMe**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:12243](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12243)

DisappearingMode initiatedByMe.

#### Implementation of

[`IDisappearingMode`](../interfaces/IDisappearingMode.md).[`initiatedByMe`](../interfaces/IDisappearingMode.md#initiatedbyme)

***

### initiator?

> `optional` **initiator**: `null` \| [`Initiator`](../namespaces/DisappearingMode/enumerations/Initiator.md)

Defined in: [WAProto/index.d.ts:12234](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12234)

DisappearingMode initiator.

#### Implementation of

[`IDisappearingMode`](../interfaces/IDisappearingMode.md).[`initiator`](../interfaces/IDisappearingMode.md#initiator)

***

### initiatorDeviceJid?

> `optional` **initiatorDeviceJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:12240](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12240)

DisappearingMode initiatorDeviceJid.

#### Implementation of

[`IDisappearingMode`](../interfaces/IDisappearingMode.md).[`initiatorDeviceJid`](../interfaces/IDisappearingMode.md#initiatordevicejid)

***

### trigger?

> `optional` **trigger**: `null` \| [`Trigger`](../namespaces/DisappearingMode/enumerations/Trigger.md)

Defined in: [WAProto/index.d.ts:12237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12237)

DisappearingMode trigger.

#### Implementation of

[`IDisappearingMode`](../interfaces/IDisappearingMode.md).[`trigger`](../interfaces/IDisappearingMode.md#trigger)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:12313](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12313)

Converts this DisappearingMode to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DisappearingMode`](DisappearingMode.md)

Defined in: [WAProto/index.d.ts:12250](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12250)

Creates a new DisappearingMode instance using the specified properties.

#### Parameters

##### properties?

[`IDisappearingMode`](../interfaces/IDisappearingMode.md)

Properties to set

#### Returns

[`DisappearingMode`](DisappearingMode.md)

DisappearingMode instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DisappearingMode`](DisappearingMode.md)

Defined in: [WAProto/index.d.ts:12276](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12276)

Decodes a DisappearingMode message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DisappearingMode`](DisappearingMode.md)

DisappearingMode

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DisappearingMode`](DisappearingMode.md)

Defined in: [WAProto/index.d.ts:12285](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12285)

Decodes a DisappearingMode message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DisappearingMode`](DisappearingMode.md)

DisappearingMode

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12258](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12258)

Encodes the specified DisappearingMode message. Does not implicitly [verify](DisappearingMode.md#verify) messages.

#### Parameters

##### message

[`IDisappearingMode`](../interfaces/IDisappearingMode.md)

DisappearingMode message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12266](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12266)

Encodes the specified DisappearingMode message, length delimited. Does not implicitly [verify](DisappearingMode.md#verify) messages.

#### Parameters

##### message

[`IDisappearingMode`](../interfaces/IDisappearingMode.md)

DisappearingMode message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DisappearingMode`](DisappearingMode.md)

Defined in: [WAProto/index.d.ts:12299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12299)

Creates a DisappearingMode message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DisappearingMode`](DisappearingMode.md)

DisappearingMode

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:12320](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12320)

Gets the default type url for DisappearingMode

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

Defined in: [WAProto/index.d.ts:12307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12307)

Creates a plain object from a DisappearingMode message. Also converts values to other types if specified.

#### Parameters

##### message

[`DisappearingMode`](DisappearingMode.md)

DisappearingMode

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12292)

Verifies a DisappearingMode message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
