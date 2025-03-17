# Class: TapLinkAction

Defined in: [WAProto/index.d.ts:47650](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47650)

Represents a TapLinkAction.

## Implements

- [`ITapLinkAction`](../interfaces/ITapLinkAction.md)

## Constructors

### new TapLinkAction()

> **new TapLinkAction**(`properties`?): [`TapLinkAction`](TapLinkAction.md)

Defined in: [WAProto/index.d.ts:47656](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47656)

Constructs a new TapLinkAction.

#### Parameters

##### properties?

[`ITapLinkAction`](../interfaces/ITapLinkAction.md)

Properties to set

#### Returns

[`TapLinkAction`](TapLinkAction.md)

## Properties

### tapUrl?

> `optional` **tapUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:47662](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47662)

TapLinkAction tapUrl.

#### Implementation of

[`ITapLinkAction`](../interfaces/ITapLinkAction.md).[`tapUrl`](../interfaces/ITapLinkAction.md#tapurl)

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [WAProto/index.d.ts:47659](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47659)

TapLinkAction title.

#### Implementation of

[`ITapLinkAction`](../interfaces/ITapLinkAction.md).[`title`](../interfaces/ITapLinkAction.md#title)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47732](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47732)

Converts this TapLinkAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TapLinkAction`](TapLinkAction.md)

Defined in: [WAProto/index.d.ts:47669](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47669)

Creates a new TapLinkAction instance using the specified properties.

#### Parameters

##### properties?

[`ITapLinkAction`](../interfaces/ITapLinkAction.md)

Properties to set

#### Returns

[`TapLinkAction`](TapLinkAction.md)

TapLinkAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TapLinkAction`](TapLinkAction.md)

Defined in: [WAProto/index.d.ts:47695](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47695)

Decodes a TapLinkAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TapLinkAction`](TapLinkAction.md)

TapLinkAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TapLinkAction`](TapLinkAction.md)

Defined in: [WAProto/index.d.ts:47704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47704)

Decodes a TapLinkAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TapLinkAction`](TapLinkAction.md)

TapLinkAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47677](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47677)

Encodes the specified TapLinkAction message. Does not implicitly [verify](TapLinkAction.md#verify) messages.

#### Parameters

##### message

[`ITapLinkAction`](../interfaces/ITapLinkAction.md)

TapLinkAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47685](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47685)

Encodes the specified TapLinkAction message, length delimited. Does not implicitly [verify](TapLinkAction.md#verify) messages.

#### Parameters

##### message

[`ITapLinkAction`](../interfaces/ITapLinkAction.md)

TapLinkAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TapLinkAction`](TapLinkAction.md)

Defined in: [WAProto/index.d.ts:47718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47718)

Creates a TapLinkAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TapLinkAction`](TapLinkAction.md)

TapLinkAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47739)

Gets the default type url for TapLinkAction

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

Defined in: [WAProto/index.d.ts:47726](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47726)

Creates a plain object from a TapLinkAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`TapLinkAction`](TapLinkAction.md)

TapLinkAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47711)

Verifies a TapLinkAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
