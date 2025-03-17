# Class: MerchantPaymentPartnerAction

Defined in: [WAProto/index.d.ts:43743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43743)

Represents a MerchantPaymentPartnerAction.

## Implements

- [`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md)

## Constructors

### new MerchantPaymentPartnerAction()

> **new MerchantPaymentPartnerAction**(`properties`?): [`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

Defined in: [WAProto/index.d.ts:43749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43749)

Constructs a new MerchantPaymentPartnerAction.

#### Parameters

##### properties?

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md)

Properties to set

#### Returns

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

## Properties

### country

> **country**: `string`

Defined in: [WAProto/index.d.ts:43755](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43755)

MerchantPaymentPartnerAction country.

#### Implementation of

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md).[`country`](../interfaces/IMerchantPaymentPartnerAction.md#country)

***

### credentialId?

> `optional` **credentialId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43761](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43761)

MerchantPaymentPartnerAction credentialId.

#### Implementation of

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md).[`credentialId`](../interfaces/IMerchantPaymentPartnerAction.md#credentialid)

***

### gatewayName?

> `optional` **gatewayName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:43758](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43758)

MerchantPaymentPartnerAction gatewayName.

#### Implementation of

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md).[`gatewayName`](../interfaces/IMerchantPaymentPartnerAction.md#gatewayname)

***

### status

> **status**: [`Status`](../namespaces/MerchantPaymentPartnerAction/enumerations/Status.md)

Defined in: [WAProto/index.d.ts:43752](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43752)

MerchantPaymentPartnerAction status.

#### Implementation of

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md).[`status`](../interfaces/IMerchantPaymentPartnerAction.md#status)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43831](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43831)

Converts this MerchantPaymentPartnerAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

Defined in: [WAProto/index.d.ts:43768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43768)

Creates a new MerchantPaymentPartnerAction instance using the specified properties.

#### Parameters

##### properties?

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md)

Properties to set

#### Returns

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

Defined in: [WAProto/index.d.ts:43794](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43794)

Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

Defined in: [WAProto/index.d.ts:43803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43803)

Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43776](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43776)

Encodes the specified MerchantPaymentPartnerAction message. Does not implicitly [verify](MerchantPaymentPartnerAction.md#verify) messages.

#### Parameters

##### message

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43784)

Encodes the specified MerchantPaymentPartnerAction message, length delimited. Does not implicitly [verify](MerchantPaymentPartnerAction.md#verify) messages.

#### Parameters

##### message

[`IMerchantPaymentPartnerAction`](../interfaces/IMerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

Defined in: [WAProto/index.d.ts:43817](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43817)

Creates a MerchantPaymentPartnerAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43838](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43838)

Gets the default type url for MerchantPaymentPartnerAction

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

Defined in: [WAProto/index.d.ts:43825](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43825)

Creates a plain object from a MerchantPaymentPartnerAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`MerchantPaymentPartnerAction`](MerchantPaymentPartnerAction.md)

MerchantPaymentPartnerAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43810](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43810)

Verifies a MerchantPaymentPartnerAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
