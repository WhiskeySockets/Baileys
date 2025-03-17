# Class: FeatureEligibilities

Defined in: [WAProto/index.d.ts:10448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10448)

Represents a FeatureEligibilities.

## Implements

- [`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md)

## Constructors

### new FeatureEligibilities()

> **new FeatureEligibilities**(`properties`?): [`FeatureEligibilities`](FeatureEligibilities.md)

Defined in: [WAProto/index.d.ts:10454](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10454)

Constructs a new FeatureEligibilities.

#### Parameters

##### properties?

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md)

Properties to set

#### Returns

[`FeatureEligibilities`](FeatureEligibilities.md)

## Properties

### canBeReshared?

> `optional` **canBeReshared**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:10466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10466)

FeatureEligibilities canBeReshared.

#### Implementation of

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md).[`canBeReshared`](../interfaces/IFeatureEligibilities.md#canbereshared)

***

### cannotBeRanked?

> `optional` **cannotBeRanked**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:10460](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10460)

FeatureEligibilities cannotBeRanked.

#### Implementation of

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md).[`cannotBeRanked`](../interfaces/IFeatureEligibilities.md#cannotberanked)

***

### cannotBeReactedTo?

> `optional` **cannotBeReactedTo**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:10457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10457)

FeatureEligibilities cannotBeReactedTo.

#### Implementation of

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md).[`cannotBeReactedTo`](../interfaces/IFeatureEligibilities.md#cannotbereactedto)

***

### canRequestFeedback?

> `optional` **canRequestFeedback**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:10463](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10463)

FeatureEligibilities canRequestFeedback.

#### Implementation of

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md).[`canRequestFeedback`](../interfaces/IFeatureEligibilities.md#canrequestfeedback)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:10536](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10536)

Converts this FeatureEligibilities to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`FeatureEligibilities`](FeatureEligibilities.md)

Defined in: [WAProto/index.d.ts:10473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10473)

Creates a new FeatureEligibilities instance using the specified properties.

#### Parameters

##### properties?

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md)

Properties to set

#### Returns

[`FeatureEligibilities`](FeatureEligibilities.md)

FeatureEligibilities instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`FeatureEligibilities`](FeatureEligibilities.md)

Defined in: [WAProto/index.d.ts:10499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10499)

Decodes a FeatureEligibilities message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`FeatureEligibilities`](FeatureEligibilities.md)

FeatureEligibilities

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`FeatureEligibilities`](FeatureEligibilities.md)

Defined in: [WAProto/index.d.ts:10508](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10508)

Decodes a FeatureEligibilities message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`FeatureEligibilities`](FeatureEligibilities.md)

FeatureEligibilities

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10481](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10481)

Encodes the specified FeatureEligibilities message. Does not implicitly [verify](FeatureEligibilities.md#verify) messages.

#### Parameters

##### message

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md)

FeatureEligibilities message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10489](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10489)

Encodes the specified FeatureEligibilities message, length delimited. Does not implicitly [verify](FeatureEligibilities.md#verify) messages.

#### Parameters

##### message

[`IFeatureEligibilities`](../interfaces/IFeatureEligibilities.md)

FeatureEligibilities message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`FeatureEligibilities`](FeatureEligibilities.md)

Defined in: [WAProto/index.d.ts:10522](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10522)

Creates a FeatureEligibilities message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`FeatureEligibilities`](FeatureEligibilities.md)

FeatureEligibilities

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:10543](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10543)

Gets the default type url for FeatureEligibilities

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

Defined in: [WAProto/index.d.ts:10530](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10530)

Creates a plain object from a FeatureEligibilities message. Also converts values to other types if specified.

#### Parameters

##### message

[`FeatureEligibilities`](FeatureEligibilities.md)

FeatureEligibilities

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:10515](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10515)

Verifies a FeatureEligibilities message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
