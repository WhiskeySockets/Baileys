# Class: Call

Defined in: [WAProto/index.d.ts:19295](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19295)

Represents a Call.

## Implements

- [`ICall`](../interfaces/ICall.md)

## Constructors

### new Call()

> **new Call**(`properties`?): [`Call`](Call.md)

Defined in: [WAProto/index.d.ts:19301](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19301)

Constructs a new Call.

#### Parameters

##### properties?

[`ICall`](../interfaces/ICall.md)

Properties to set

#### Returns

[`Call`](Call.md)

## Properties

### callKey?

> `optional` **callKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:19304](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19304)

Call callKey.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`callKey`](../interfaces/ICall.md#callkey)

***

### conversionData?

> `optional` **conversionData**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:19310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19310)

Call conversionData.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`conversionData`](../interfaces/ICall.md#conversiondata)

***

### conversionDelaySeconds?

> `optional` **conversionDelaySeconds**: `null` \| `number`

Defined in: [WAProto/index.d.ts:19313](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19313)

Call conversionDelaySeconds.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`conversionDelaySeconds`](../interfaces/ICall.md#conversiondelayseconds)

***

### conversionSource?

> `optional` **conversionSource**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19307)

Call conversionSource.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`conversionSource`](../interfaces/ICall.md#conversionsource)

***

### ctwaPayload?

> `optional` **ctwaPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:19319](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19319)

Call ctwaPayload.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`ctwaPayload`](../interfaces/ICall.md#ctwapayload)

***

### ctwaSignals?

> `optional` **ctwaSignals**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19316](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19316)

Call ctwaSignals.

#### Implementation of

[`ICall`](../interfaces/ICall.md).[`ctwaSignals`](../interfaces/ICall.md#ctwasignals)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19389)

Converts this Call to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Call`](Call.md)

Defined in: [WAProto/index.d.ts:19326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19326)

Creates a new Call instance using the specified properties.

#### Parameters

##### properties?

[`ICall`](../interfaces/ICall.md)

Properties to set

#### Returns

[`Call`](Call.md)

Call instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Call`](Call.md)

Defined in: [WAProto/index.d.ts:19352](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19352)

Decodes a Call message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Call`](Call.md)

Call

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Call`](Call.md)

Defined in: [WAProto/index.d.ts:19361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19361)

Decodes a Call message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Call`](Call.md)

Call

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19334](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19334)

Encodes the specified Call message. Does not implicitly [verify](Call.md#verify) messages.

#### Parameters

##### message

[`ICall`](../interfaces/ICall.md)

Call message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19342](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19342)

Encodes the specified Call message, length delimited. Does not implicitly [verify](Call.md#verify) messages.

#### Parameters

##### message

[`ICall`](../interfaces/ICall.md)

Call message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Call`](Call.md)

Defined in: [WAProto/index.d.ts:19375](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19375)

Creates a Call message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Call`](Call.md)

Call

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19396)

Gets the default type url for Call

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

Defined in: [WAProto/index.d.ts:19383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19383)

Creates a plain object from a Call message. Also converts values to other types if specified.

#### Parameters

##### message

[`Call`](Call.md)

Call

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19368)

Verifies a Call message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
