# Class: SenderKeyDistributionMessage

Defined in: [WAProto/index.d.ts:31153](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31153)

Represents a SenderKeyDistributionMessage.

## Implements

- [`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

## Constructors

### new SenderKeyDistributionMessage()

> **new SenderKeyDistributionMessage**(`properties`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:31159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31159)

Constructs a new SenderKeyDistributionMessage.

#### Parameters

##### properties?

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

Properties to set

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

## Properties

### axolotlSenderKeyDistributionMessage?

> `optional` **axolotlSenderKeyDistributionMessage**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:31165](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31165)

SenderKeyDistributionMessage axolotlSenderKeyDistributionMessage.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`axolotlSenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md#axolotlsenderkeydistributionmessage)

***

### groupId?

> `optional` **groupId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:31162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31162)

SenderKeyDistributionMessage groupId.

#### Implementation of

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md).[`groupId`](../interfaces/ISenderKeyDistributionMessage.md#groupid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:31235](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31235)

Converts this SenderKeyDistributionMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:31172](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31172)

Creates a new SenderKeyDistributionMessage instance using the specified properties.

#### Parameters

##### properties?

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

Properties to set

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:31198](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31198)

Decodes a SenderKeyDistributionMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:31207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31207)

Decodes a SenderKeyDistributionMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31180](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31180)

Encodes the specified SenderKeyDistributionMessage message. Does not implicitly [verify](SenderKeyDistributionMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

SenderKeyDistributionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:31188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31188)

Encodes the specified SenderKeyDistributionMessage message, length delimited. Does not implicitly [verify](SenderKeyDistributionMessage.md#verify) messages.

#### Parameters

##### message

[`ISenderKeyDistributionMessage`](../interfaces/ISenderKeyDistributionMessage.md)

SenderKeyDistributionMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

Defined in: [WAProto/index.d.ts:31221](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31221)

Creates a SenderKeyDistributionMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:31242](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31242)

Gets the default type url for SenderKeyDistributionMessage

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

Defined in: [WAProto/index.d.ts:31229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31229)

Creates a plain object from a SenderKeyDistributionMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`SenderKeyDistributionMessage`](SenderKeyDistributionMessage.md)

SenderKeyDistributionMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:31214](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L31214)

Verifies a SenderKeyDistributionMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
