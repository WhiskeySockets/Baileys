# Class: HSMDateTime

Defined in: [WAProto/index.d.ts:22303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22303)

Represents a HSMDateTime.

## Implements

- [`IHSMDateTime`](../interfaces/IHSMDateTime.md)

## Constructors

### new HSMDateTime()

> **new HSMDateTime**(`properties`?): [`HSMDateTime`](HSMDateTime.md)

Defined in: [WAProto/index.d.ts:22309](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22309)

Constructs a new HSMDateTime.

#### Parameters

##### properties?

[`IHSMDateTime`](../interfaces/IHSMDateTime.md)

Properties to set

#### Returns

[`HSMDateTime`](HSMDateTime.md)

## Properties

### component?

> `optional` **component**: `null` \| [`IHSMDateTimeComponent`](../namespaces/HSMDateTime/interfaces/IHSMDateTimeComponent.md)

Defined in: [WAProto/index.d.ts:22312](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22312)

HSMDateTime component.

#### Implementation of

[`IHSMDateTime`](../interfaces/IHSMDateTime.md).[`component`](../interfaces/IHSMDateTime.md#component)

***

### datetimeOneof?

> `optional` **datetimeOneof**: `"component"` \| `"unixEpoch"`

Defined in: [WAProto/index.d.ts:22318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22318)

HSMDateTime datetimeOneof.

***

### unixEpoch?

> `optional` **unixEpoch**: `null` \| [`IHSMDateTimeUnixEpoch`](../namespaces/HSMDateTime/interfaces/IHSMDateTimeUnixEpoch.md)

Defined in: [WAProto/index.d.ts:22315](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22315)

HSMDateTime unixEpoch.

#### Implementation of

[`IHSMDateTime`](../interfaces/IHSMDateTime.md).[`unixEpoch`](../interfaces/IHSMDateTime.md#unixepoch)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:22388](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22388)

Converts this HSMDateTime to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HSMDateTime`](HSMDateTime.md)

Defined in: [WAProto/index.d.ts:22325](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22325)

Creates a new HSMDateTime instance using the specified properties.

#### Parameters

##### properties?

[`IHSMDateTime`](../interfaces/IHSMDateTime.md)

Properties to set

#### Returns

[`HSMDateTime`](HSMDateTime.md)

HSMDateTime instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HSMDateTime`](HSMDateTime.md)

Defined in: [WAProto/index.d.ts:22351](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22351)

Decodes a HSMDateTime message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HSMDateTime`](HSMDateTime.md)

HSMDateTime

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HSMDateTime`](HSMDateTime.md)

Defined in: [WAProto/index.d.ts:22360](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22360)

Decodes a HSMDateTime message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HSMDateTime`](HSMDateTime.md)

HSMDateTime

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22333)

Encodes the specified HSMDateTime message. Does not implicitly [verify](HSMDateTime.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTime`](../interfaces/IHSMDateTime.md)

HSMDateTime message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:22341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22341)

Encodes the specified HSMDateTime message, length delimited. Does not implicitly [verify](HSMDateTime.md#verify) messages.

#### Parameters

##### message

[`IHSMDateTime`](../interfaces/IHSMDateTime.md)

HSMDateTime message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HSMDateTime`](HSMDateTime.md)

Defined in: [WAProto/index.d.ts:22374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22374)

Creates a HSMDateTime message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HSMDateTime`](HSMDateTime.md)

HSMDateTime

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:22395](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22395)

Gets the default type url for HSMDateTime

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

Defined in: [WAProto/index.d.ts:22382](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22382)

Creates a plain object from a HSMDateTime message. Also converts values to other types if specified.

#### Parameters

##### message

[`HSMDateTime`](HSMDateTime.md)

HSMDateTime

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:22367](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L22367)

Verifies a HSMDateTime message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
