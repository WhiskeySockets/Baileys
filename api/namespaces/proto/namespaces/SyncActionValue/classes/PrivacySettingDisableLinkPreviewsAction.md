# Class: PrivacySettingDisableLinkPreviewsAction

Defined in: [WAProto/index.d.ts:44787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44787)

Represents a PrivacySettingDisableLinkPreviewsAction.

## Implements

- [`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md)

## Constructors

### new PrivacySettingDisableLinkPreviewsAction()

> **new PrivacySettingDisableLinkPreviewsAction**(`properties`?): [`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

Defined in: [WAProto/index.d.ts:44793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44793)

Constructs a new PrivacySettingDisableLinkPreviewsAction.

#### Parameters

##### properties?

[`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md)

Properties to set

#### Returns

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

## Properties

### isPreviewsDisabled?

> `optional` **isPreviewsDisabled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:44796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44796)

PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled.

#### Implementation of

[`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md).[`isPreviewsDisabled`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md#ispreviewsdisabled)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44866](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44866)

Converts this PrivacySettingDisableLinkPreviewsAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

Defined in: [WAProto/index.d.ts:44803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44803)

Creates a new PrivacySettingDisableLinkPreviewsAction instance using the specified properties.

#### Parameters

##### properties?

[`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md)

Properties to set

#### Returns

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

Defined in: [WAProto/index.d.ts:44829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44829)

Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

Defined in: [WAProto/index.d.ts:44838](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44838)

Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44811](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44811)

Encodes the specified PrivacySettingDisableLinkPreviewsAction message. Does not implicitly [verify](PrivacySettingDisableLinkPreviewsAction.md#verify) messages.

#### Parameters

##### message

[`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44819)

Encodes the specified PrivacySettingDisableLinkPreviewsAction message, length delimited. Does not implicitly [verify](PrivacySettingDisableLinkPreviewsAction.md#verify) messages.

#### Parameters

##### message

[`IPrivacySettingDisableLinkPreviewsAction`](../interfaces/IPrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

Defined in: [WAProto/index.d.ts:44852](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44852)

Creates a PrivacySettingDisableLinkPreviewsAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44873](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44873)

Gets the default type url for PrivacySettingDisableLinkPreviewsAction

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

Defined in: [WAProto/index.d.ts:44860](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44860)

Creates a plain object from a PrivacySettingDisableLinkPreviewsAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`PrivacySettingDisableLinkPreviewsAction`](PrivacySettingDisableLinkPreviewsAction.md)

PrivacySettingDisableLinkPreviewsAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44845)

Verifies a PrivacySettingDisableLinkPreviewsAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
