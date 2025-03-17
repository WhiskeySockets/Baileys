# Class: HydratedQuickReplyButton

Defined in: [WAProto/index.d.ts:14877](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14877)

Represents a HydratedQuickReplyButton.

## Implements

- [`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md)

## Constructors

### new HydratedQuickReplyButton()

> **new HydratedQuickReplyButton**(`properties`?): [`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:14883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14883)

Constructs a new HydratedQuickReplyButton.

#### Parameters

##### properties?

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md)

Properties to set

#### Returns

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

## Properties

### displayText?

> `optional` **displayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14886](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14886)

HydratedQuickReplyButton displayText.

#### Implementation of

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md).[`displayText`](../interfaces/IHydratedQuickReplyButton.md#displaytext)

***

### id?

> `optional` **id**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14889)

HydratedQuickReplyButton id.

#### Implementation of

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md).[`id`](../interfaces/IHydratedQuickReplyButton.md#id)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14959](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14959)

Converts this HydratedQuickReplyButton to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:14896](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14896)

Creates a new HydratedQuickReplyButton instance using the specified properties.

#### Parameters

##### properties?

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md)

Properties to set

#### Returns

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

HydratedQuickReplyButton instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:14922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14922)

Decodes a HydratedQuickReplyButton message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

HydratedQuickReplyButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:14931](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14931)

Decodes a HydratedQuickReplyButton message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

HydratedQuickReplyButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14904](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14904)

Encodes the specified HydratedQuickReplyButton message. Does not implicitly [verify](HydratedQuickReplyButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md)

HydratedQuickReplyButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14912)

Encodes the specified HydratedQuickReplyButton message, length delimited. Does not implicitly [verify](HydratedQuickReplyButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedQuickReplyButton`](../interfaces/IHydratedQuickReplyButton.md)

HydratedQuickReplyButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:14945](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14945)

Creates a HydratedQuickReplyButton message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

HydratedQuickReplyButton

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14966](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14966)

Gets the default type url for HydratedQuickReplyButton

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

Defined in: [WAProto/index.d.ts:14953](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14953)

Creates a plain object from a HydratedQuickReplyButton message. Also converts values to other types if specified.

#### Parameters

##### message

[`HydratedQuickReplyButton`](HydratedQuickReplyButton.md)

HydratedQuickReplyButton

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14938)

Verifies a HydratedQuickReplyButton message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
