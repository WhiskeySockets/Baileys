# Class: PlaceholderMessage

Defined in: [WAProto/index.d.ts:28602](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28602)

Represents a PlaceholderMessage.

## Implements

- [`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md)

## Constructors

### new PlaceholderMessage()

> **new PlaceholderMessage**(`properties`?): [`PlaceholderMessage`](PlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:28608](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28608)

Constructs a new PlaceholderMessage.

#### Parameters

##### properties?

[`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md)

Properties to set

#### Returns

[`PlaceholderMessage`](PlaceholderMessage.md)

## Properties

### type?

> `optional` **type**: `null` \| [`MASK_LINKED_DEVICES`](../namespaces/PlaceholderMessage/enumerations/PlaceholderType.md#mask_linked_devices)

Defined in: [WAProto/index.d.ts:28611](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28611)

PlaceholderMessage type.

#### Implementation of

[`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md).[`type`](../interfaces/IPlaceholderMessage.md#type)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:28681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28681)

Converts this PlaceholderMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PlaceholderMessage`](PlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:28618](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28618)

Creates a new PlaceholderMessage instance using the specified properties.

#### Parameters

##### properties?

[`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md)

Properties to set

#### Returns

[`PlaceholderMessage`](PlaceholderMessage.md)

PlaceholderMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PlaceholderMessage`](PlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:28644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28644)

Decodes a PlaceholderMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PlaceholderMessage`](PlaceholderMessage.md)

PlaceholderMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PlaceholderMessage`](PlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:28653](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28653)

Decodes a PlaceholderMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PlaceholderMessage`](PlaceholderMessage.md)

PlaceholderMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28626)

Encodes the specified PlaceholderMessage message. Does not implicitly [verify](PlaceholderMessage.md#verify) messages.

#### Parameters

##### message

[`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md)

PlaceholderMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:28634](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28634)

Encodes the specified PlaceholderMessage message, length delimited. Does not implicitly [verify](PlaceholderMessage.md#verify) messages.

#### Parameters

##### message

[`IPlaceholderMessage`](../interfaces/IPlaceholderMessage.md)

PlaceholderMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PlaceholderMessage`](PlaceholderMessage.md)

Defined in: [WAProto/index.d.ts:28667](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28667)

Creates a PlaceholderMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PlaceholderMessage`](PlaceholderMessage.md)

PlaceholderMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:28688](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28688)

Gets the default type url for PlaceholderMessage

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

Defined in: [WAProto/index.d.ts:28675](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28675)

Creates a plain object from a PlaceholderMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`PlaceholderMessage`](PlaceholderMessage.md)

PlaceholderMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:28660](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L28660)

Verifies a PlaceholderMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
