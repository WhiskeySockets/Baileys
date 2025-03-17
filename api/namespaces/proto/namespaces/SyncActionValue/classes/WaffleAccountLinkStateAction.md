# Class: WaffleAccountLinkStateAction

Defined in: [WAProto/index.d.ts:46575](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46575)

Represents a WaffleAccountLinkStateAction.

## Implements

- [`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md)

## Constructors

### new WaffleAccountLinkStateAction()

> **new WaffleAccountLinkStateAction**(`properties`?): [`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

Defined in: [WAProto/index.d.ts:46581](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46581)

Constructs a new WaffleAccountLinkStateAction.

#### Parameters

##### properties?

[`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md)

Properties to set

#### Returns

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

## Properties

### linkState?

> `optional` **linkState**: `null` \| [`ACTIVE`](../namespaces/WaffleAccountLinkStateAction/enumerations/AccountLinkState.md#active)

Defined in: [WAProto/index.d.ts:46584](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46584)

WaffleAccountLinkStateAction linkState.

#### Implementation of

[`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md).[`linkState`](../interfaces/IWaffleAccountLinkStateAction.md#linkstate)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46654](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46654)

Converts this WaffleAccountLinkStateAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

Defined in: [WAProto/index.d.ts:46591](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46591)

Creates a new WaffleAccountLinkStateAction instance using the specified properties.

#### Parameters

##### properties?

[`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md)

Properties to set

#### Returns

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

Defined in: [WAProto/index.d.ts:46617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46617)

Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

Defined in: [WAProto/index.d.ts:46626](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46626)

Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46599)

Encodes the specified WaffleAccountLinkStateAction message. Does not implicitly [verify](WaffleAccountLinkStateAction.md#verify) messages.

#### Parameters

##### message

[`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46607](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46607)

Encodes the specified WaffleAccountLinkStateAction message, length delimited. Does not implicitly [verify](WaffleAccountLinkStateAction.md#verify) messages.

#### Parameters

##### message

[`IWaffleAccountLinkStateAction`](../interfaces/IWaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

Defined in: [WAProto/index.d.ts:46640](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46640)

Creates a WaffleAccountLinkStateAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46661](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46661)

Gets the default type url for WaffleAccountLinkStateAction

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

Defined in: [WAProto/index.d.ts:46648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46648)

Creates a plain object from a WaffleAccountLinkStateAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`WaffleAccountLinkStateAction`](WaffleAccountLinkStateAction.md)

WaffleAccountLinkStateAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46633)

Verifies a WaffleAccountLinkStateAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
