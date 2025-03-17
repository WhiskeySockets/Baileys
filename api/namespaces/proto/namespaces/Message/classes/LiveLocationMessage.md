# Class: LiveLocationMessage

Defined in: [WAProto/index.d.ts:25896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25896)

Represents a LiveLocationMessage.

## Implements

- [`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md)

## Constructors

### new LiveLocationMessage()

> **new LiveLocationMessage**(`properties`?): [`LiveLocationMessage`](LiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:25902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25902)

Constructs a new LiveLocationMessage.

#### Parameters

##### properties?

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md)

Properties to set

#### Returns

[`LiveLocationMessage`](LiveLocationMessage.md)

## Properties

### accuracyInMeters?

> `optional` **accuracyInMeters**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25911)

LiveLocationMessage accuracyInMeters.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`accuracyInMeters`](../interfaces/ILiveLocationMessage.md#accuracyinmeters)

***

### caption?

> `optional` **caption**: `null` \| `string`

Defined in: [WAProto/index.d.ts:25920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25920)

LiveLocationMessage caption.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`caption`](../interfaces/ILiveLocationMessage.md#caption)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:25932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25932)

LiveLocationMessage contextInfo.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`contextInfo`](../interfaces/ILiveLocationMessage.md#contextinfo)

***

### degreesClockwiseFromMagneticNorth?

> `optional` **degreesClockwiseFromMagneticNorth**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25917)

LiveLocationMessage degreesClockwiseFromMagneticNorth.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`degreesClockwiseFromMagneticNorth`](../interfaces/ILiveLocationMessage.md#degreesclockwisefrommagneticnorth)

***

### degreesLatitude?

> `optional` **degreesLatitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25905](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25905)

LiveLocationMessage degreesLatitude.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`degreesLatitude`](../interfaces/ILiveLocationMessage.md#degreeslatitude)

***

### degreesLongitude?

> `optional` **degreesLongitude**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25908)

LiveLocationMessage degreesLongitude.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`degreesLongitude`](../interfaces/ILiveLocationMessage.md#degreeslongitude)

***

### jpegThumbnail?

> `optional` **jpegThumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:25929](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25929)

LiveLocationMessage jpegThumbnail.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`jpegThumbnail`](../interfaces/ILiveLocationMessage.md#jpegthumbnail)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:25923](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25923)

LiveLocationMessage sequenceNumber.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`sequenceNumber`](../interfaces/ILiveLocationMessage.md#sequencenumber)

***

### speedInMps?

> `optional` **speedInMps**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25914](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25914)

LiveLocationMessage speedInMps.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`speedInMps`](../interfaces/ILiveLocationMessage.md#speedinmps)

***

### timeOffset?

> `optional` **timeOffset**: `null` \| `number`

Defined in: [WAProto/index.d.ts:25926](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25926)

LiveLocationMessage timeOffset.

#### Implementation of

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md).[`timeOffset`](../interfaces/ILiveLocationMessage.md#timeoffset)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26002](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26002)

Converts this LiveLocationMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LiveLocationMessage`](LiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:25939](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25939)

Creates a new LiveLocationMessage instance using the specified properties.

#### Parameters

##### properties?

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md)

Properties to set

#### Returns

[`LiveLocationMessage`](LiveLocationMessage.md)

LiveLocationMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LiveLocationMessage`](LiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:25965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25965)

Decodes a LiveLocationMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LiveLocationMessage`](LiveLocationMessage.md)

LiveLocationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LiveLocationMessage`](LiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:25974](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25974)

Decodes a LiveLocationMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LiveLocationMessage`](LiveLocationMessage.md)

LiveLocationMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25947](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25947)

Encodes the specified LiveLocationMessage message. Does not implicitly [verify](LiveLocationMessage.md#verify) messages.

#### Parameters

##### message

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md)

LiveLocationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:25955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25955)

Encodes the specified LiveLocationMessage message, length delimited. Does not implicitly [verify](LiveLocationMessage.md#verify) messages.

#### Parameters

##### message

[`ILiveLocationMessage`](../interfaces/ILiveLocationMessage.md)

LiveLocationMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LiveLocationMessage`](LiveLocationMessage.md)

Defined in: [WAProto/index.d.ts:25988](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25988)

Creates a LiveLocationMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LiveLocationMessage`](LiveLocationMessage.md)

LiveLocationMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26009](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26009)

Gets the default type url for LiveLocationMessage

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

Defined in: [WAProto/index.d.ts:25996](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25996)

Creates a plain object from a LiveLocationMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`LiveLocationMessage`](LiveLocationMessage.md)

LiveLocationMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:25981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L25981)

Verifies a LiveLocationMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
