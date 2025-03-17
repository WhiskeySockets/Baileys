# Class: StatusPrivacyAction

Defined in: [WAProto/index.d.ts:45590](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45590)

Represents a StatusPrivacyAction.

## Implements

- [`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md)

## Constructors

### new StatusPrivacyAction()

> **new StatusPrivacyAction**(`properties`?): [`StatusPrivacyAction`](StatusPrivacyAction.md)

Defined in: [WAProto/index.d.ts:45596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45596)

Constructs a new StatusPrivacyAction.

#### Parameters

##### properties?

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md)

Properties to set

#### Returns

[`StatusPrivacyAction`](StatusPrivacyAction.md)

## Properties

### mode?

> `optional` **mode**: `null` \| [`StatusDistributionMode`](../namespaces/StatusPrivacyAction/enumerations/StatusDistributionMode.md)

Defined in: [WAProto/index.d.ts:45599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45599)

StatusPrivacyAction mode.

#### Implementation of

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md).[`mode`](../interfaces/IStatusPrivacyAction.md#mode)

***

### userJid

> **userJid**: `string`[]

Defined in: [WAProto/index.d.ts:45602](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45602)

StatusPrivacyAction userJid.

#### Implementation of

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md).[`userJid`](../interfaces/IStatusPrivacyAction.md#userjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45672](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45672)

Converts this StatusPrivacyAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StatusPrivacyAction`](StatusPrivacyAction.md)

Defined in: [WAProto/index.d.ts:45609](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45609)

Creates a new StatusPrivacyAction instance using the specified properties.

#### Parameters

##### properties?

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md)

Properties to set

#### Returns

[`StatusPrivacyAction`](StatusPrivacyAction.md)

StatusPrivacyAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StatusPrivacyAction`](StatusPrivacyAction.md)

Defined in: [WAProto/index.d.ts:45635](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45635)

Decodes a StatusPrivacyAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StatusPrivacyAction`](StatusPrivacyAction.md)

StatusPrivacyAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StatusPrivacyAction`](StatusPrivacyAction.md)

Defined in: [WAProto/index.d.ts:45644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45644)

Decodes a StatusPrivacyAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StatusPrivacyAction`](StatusPrivacyAction.md)

StatusPrivacyAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45617)

Encodes the specified StatusPrivacyAction message. Does not implicitly [verify](StatusPrivacyAction.md#verify) messages.

#### Parameters

##### message

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md)

StatusPrivacyAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45625](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45625)

Encodes the specified StatusPrivacyAction message, length delimited. Does not implicitly [verify](StatusPrivacyAction.md#verify) messages.

#### Parameters

##### message

[`IStatusPrivacyAction`](../interfaces/IStatusPrivacyAction.md)

StatusPrivacyAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StatusPrivacyAction`](StatusPrivacyAction.md)

Defined in: [WAProto/index.d.ts:45658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45658)

Creates a StatusPrivacyAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StatusPrivacyAction`](StatusPrivacyAction.md)

StatusPrivacyAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45679](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45679)

Gets the default type url for StatusPrivacyAction

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

Defined in: [WAProto/index.d.ts:45666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45666)

Creates a plain object from a StatusPrivacyAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`StatusPrivacyAction`](StatusPrivacyAction.md)

StatusPrivacyAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45651](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45651)

Verifies a StatusPrivacyAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
