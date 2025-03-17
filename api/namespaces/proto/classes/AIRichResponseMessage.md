# Class: AIRichResponseMessage

Defined in: [WAProto/index.d.ts:601](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L601)

Represents a AIRichResponseMessage.

## Implements

- [`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

## Constructors

### new AIRichResponseMessage()

> **new AIRichResponseMessage**(`properties`?): [`AIRichResponseMessage`](AIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:607](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L607)

Constructs a new AIRichResponseMessage.

#### Parameters

##### properties?

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

Properties to set

#### Returns

[`AIRichResponseMessage`](AIRichResponseMessage.md)

## Properties

### abstractData?

> `optional` **abstractData**: `null` \| [`IAIRichResponseAbstractData`](../namespaces/AIRichResponseMessage/interfaces/IAIRichResponseAbstractData.md)

Defined in: [WAProto/index.d.ts:616](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L616)

AIRichResponseMessage abstractData.

#### Implementation of

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md).[`abstractData`](../interfaces/IAIRichResponseMessage.md#abstractdata)

***

### messageType?

> `optional` **messageType**: `null` \| [`AIRichResponseMessageType`](../namespaces/AIRichResponseMessage/enumerations/AIRichResponseMessageType.md)

Defined in: [WAProto/index.d.ts:610](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L610)

AIRichResponseMessage messageType.

#### Implementation of

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md).[`messageType`](../interfaces/IAIRichResponseMessage.md#messagetype)

***

### submessages

> **submessages**: [`IAIRichResponseSubMessage`](../namespaces/AIRichResponseMessage/interfaces/IAIRichResponseSubMessage.md)[]

Defined in: [WAProto/index.d.ts:613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L613)

AIRichResponseMessage submessages.

#### Implementation of

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md).[`submessages`](../interfaces/IAIRichResponseMessage.md#submessages)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:686](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L686)

Converts this AIRichResponseMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AIRichResponseMessage`](AIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:623](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L623)

Creates a new AIRichResponseMessage instance using the specified properties.

#### Parameters

##### properties?

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

Properties to set

#### Returns

[`AIRichResponseMessage`](AIRichResponseMessage.md)

AIRichResponseMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AIRichResponseMessage`](AIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:649](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L649)

Decodes a AIRichResponseMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AIRichResponseMessage`](AIRichResponseMessage.md)

AIRichResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AIRichResponseMessage`](AIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L658)

Decodes a AIRichResponseMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AIRichResponseMessage`](AIRichResponseMessage.md)

AIRichResponseMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:631](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L631)

Encodes the specified AIRichResponseMessage message. Does not implicitly [verify](AIRichResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

AIRichResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L639)

Encodes the specified AIRichResponseMessage message, length delimited. Does not implicitly [verify](AIRichResponseMessage.md#verify) messages.

#### Parameters

##### message

[`IAIRichResponseMessage`](../interfaces/IAIRichResponseMessage.md)

AIRichResponseMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AIRichResponseMessage`](AIRichResponseMessage.md)

Defined in: [WAProto/index.d.ts:672](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L672)

Creates a AIRichResponseMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AIRichResponseMessage`](AIRichResponseMessage.md)

AIRichResponseMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:693](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L693)

Gets the default type url for AIRichResponseMessage

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

Defined in: [WAProto/index.d.ts:680](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L680)

Creates a plain object from a AIRichResponseMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`AIRichResponseMessage`](AIRichResponseMessage.md)

AIRichResponseMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:665](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L665)

Verifies a AIRichResponseMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
