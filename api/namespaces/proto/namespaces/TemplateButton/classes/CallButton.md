# Class: CallButton

Defined in: [WAProto/index.d.ts:47873](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47873)

Represents a CallButton.

## Implements

- [`ICallButton`](../interfaces/ICallButton.md)

## Constructors

### new CallButton()

> **new CallButton**(`properties`?): [`CallButton`](CallButton.md)

Defined in: [WAProto/index.d.ts:47879](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47879)

Constructs a new CallButton.

#### Parameters

##### properties?

[`ICallButton`](../interfaces/ICallButton.md)

Properties to set

#### Returns

[`CallButton`](CallButton.md)

## Properties

### displayText?

> `optional` **displayText**: `null` \| [`IHighlyStructuredMessage`](../../Message/interfaces/IHighlyStructuredMessage.md)

Defined in: [WAProto/index.d.ts:47882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47882)

CallButton displayText.

#### Implementation of

[`ICallButton`](../interfaces/ICallButton.md).[`displayText`](../interfaces/ICallButton.md#displaytext)

***

### phoneNumber?

> `optional` **phoneNumber**: `null` \| [`IHighlyStructuredMessage`](../../Message/interfaces/IHighlyStructuredMessage.md)

Defined in: [WAProto/index.d.ts:47885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47885)

CallButton phoneNumber.

#### Implementation of

[`ICallButton`](../interfaces/ICallButton.md).[`phoneNumber`](../interfaces/ICallButton.md#phonenumber)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47955)

Converts this CallButton to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CallButton`](CallButton.md)

Defined in: [WAProto/index.d.ts:47892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47892)

Creates a new CallButton instance using the specified properties.

#### Parameters

##### properties?

[`ICallButton`](../interfaces/ICallButton.md)

Properties to set

#### Returns

[`CallButton`](CallButton.md)

CallButton instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CallButton`](CallButton.md)

Defined in: [WAProto/index.d.ts:47918](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47918)

Decodes a CallButton message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CallButton`](CallButton.md)

CallButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CallButton`](CallButton.md)

Defined in: [WAProto/index.d.ts:47927](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47927)

Decodes a CallButton message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CallButton`](CallButton.md)

CallButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47900)

Encodes the specified CallButton message. Does not implicitly [verify](CallButton.md#verify) messages.

#### Parameters

##### message

[`ICallButton`](../interfaces/ICallButton.md)

CallButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47908)

Encodes the specified CallButton message, length delimited. Does not implicitly [verify](CallButton.md#verify) messages.

#### Parameters

##### message

[`ICallButton`](../interfaces/ICallButton.md)

CallButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CallButton`](CallButton.md)

Defined in: [WAProto/index.d.ts:47941](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47941)

Creates a CallButton message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CallButton`](CallButton.md)

CallButton

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47962)

Gets the default type url for CallButton

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

Defined in: [WAProto/index.d.ts:47949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47949)

Creates a plain object from a CallButton message. Also converts values to other types if specified.

#### Parameters

##### message

[`CallButton`](CallButton.md)

CallButton

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47934)

Verifies a CallButton message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
