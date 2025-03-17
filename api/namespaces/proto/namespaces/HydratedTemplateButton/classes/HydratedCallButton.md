# Class: HydratedCallButton

Defined in: [WAProto/index.d.ts:14774](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14774)

Represents a HydratedCallButton.

## Implements

- [`IHydratedCallButton`](../interfaces/IHydratedCallButton.md)

## Constructors

### new HydratedCallButton()

> **new HydratedCallButton**(`properties`?): [`HydratedCallButton`](HydratedCallButton.md)

Defined in: [WAProto/index.d.ts:14780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14780)

Constructs a new HydratedCallButton.

#### Parameters

##### properties?

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md)

Properties to set

#### Returns

[`HydratedCallButton`](HydratedCallButton.md)

## Properties

### displayText?

> `optional` **displayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14783](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14783)

HydratedCallButton displayText.

#### Implementation of

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md).[`displayText`](../interfaces/IHydratedCallButton.md#displaytext)

***

### phoneNumber?

> `optional` **phoneNumber**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14786](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14786)

HydratedCallButton phoneNumber.

#### Implementation of

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md).[`phoneNumber`](../interfaces/IHydratedCallButton.md#phonenumber)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:14856](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14856)

Converts this HydratedCallButton to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HydratedCallButton`](HydratedCallButton.md)

Defined in: [WAProto/index.d.ts:14793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14793)

Creates a new HydratedCallButton instance using the specified properties.

#### Parameters

##### properties?

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md)

Properties to set

#### Returns

[`HydratedCallButton`](HydratedCallButton.md)

HydratedCallButton instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HydratedCallButton`](HydratedCallButton.md)

Defined in: [WAProto/index.d.ts:14819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14819)

Decodes a HydratedCallButton message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HydratedCallButton`](HydratedCallButton.md)

HydratedCallButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HydratedCallButton`](HydratedCallButton.md)

Defined in: [WAProto/index.d.ts:14828](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14828)

Decodes a HydratedCallButton message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HydratedCallButton`](HydratedCallButton.md)

HydratedCallButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14801](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14801)

Encodes the specified HydratedCallButton message. Does not implicitly [verify](HydratedCallButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md)

HydratedCallButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:14809](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14809)

Encodes the specified HydratedCallButton message, length delimited. Does not implicitly [verify](HydratedCallButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedCallButton`](../interfaces/IHydratedCallButton.md)

HydratedCallButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HydratedCallButton`](HydratedCallButton.md)

Defined in: [WAProto/index.d.ts:14842](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14842)

Creates a HydratedCallButton message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HydratedCallButton`](HydratedCallButton.md)

HydratedCallButton

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:14863](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14863)

Gets the default type url for HydratedCallButton

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

Defined in: [WAProto/index.d.ts:14850](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14850)

Creates a plain object from a HydratedCallButton message. Also converts values to other types if specified.

#### Parameters

##### message

[`HydratedCallButton`](HydratedCallButton.md)

HydratedCallButton

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:14835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14835)

Verifies a HydratedCallButton message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
