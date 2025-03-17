# Class: PrivacySettingRelayAllCalls

Defined in: [WAProto/index.d.ts:44884](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44884)

Represents a PrivacySettingRelayAllCalls.

## Implements

- [`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md)

## Constructors

### new PrivacySettingRelayAllCalls()

> **new PrivacySettingRelayAllCalls**(`properties`?): [`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

Defined in: [WAProto/index.d.ts:44890](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44890)

Constructs a new PrivacySettingRelayAllCalls.

#### Parameters

##### properties?

[`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md)

Properties to set

#### Returns

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

## Properties

### isEnabled?

> `optional` **isEnabled**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:44893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44893)

PrivacySettingRelayAllCalls isEnabled.

#### Implementation of

[`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md).[`isEnabled`](../interfaces/IPrivacySettingRelayAllCalls.md#isenabled)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44963](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44963)

Converts this PrivacySettingRelayAllCalls to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

Defined in: [WAProto/index.d.ts:44900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44900)

Creates a new PrivacySettingRelayAllCalls instance using the specified properties.

#### Parameters

##### properties?

[`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md)

Properties to set

#### Returns

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

Defined in: [WAProto/index.d.ts:44926](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44926)

Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

Defined in: [WAProto/index.d.ts:44935](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44935)

Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44908)

Encodes the specified PrivacySettingRelayAllCalls message. Does not implicitly [verify](PrivacySettingRelayAllCalls.md#verify) messages.

#### Parameters

##### message

[`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44916)

Encodes the specified PrivacySettingRelayAllCalls message, length delimited. Does not implicitly [verify](PrivacySettingRelayAllCalls.md#verify) messages.

#### Parameters

##### message

[`IPrivacySettingRelayAllCalls`](../interfaces/IPrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

Defined in: [WAProto/index.d.ts:44949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44949)

Creates a PrivacySettingRelayAllCalls message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44970](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44970)

Gets the default type url for PrivacySettingRelayAllCalls

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

Defined in: [WAProto/index.d.ts:44957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44957)

Creates a plain object from a PrivacySettingRelayAllCalls message. Also converts values to other types if specified.

#### Parameters

##### message

[`PrivacySettingRelayAllCalls`](PrivacySettingRelayAllCalls.md)

PrivacySettingRelayAllCalls

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44942)

Verifies a PrivacySettingRelayAllCalls message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
