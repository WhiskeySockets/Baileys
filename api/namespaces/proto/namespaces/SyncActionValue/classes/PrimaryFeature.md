# Class: PrimaryFeature

Defined in: [WAProto/index.d.ts:44593](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44593)

Represents a PrimaryFeature.

## Implements

- [`IPrimaryFeature`](../interfaces/IPrimaryFeature.md)

## Constructors

### new PrimaryFeature()

> **new PrimaryFeature**(`properties`?): [`PrimaryFeature`](PrimaryFeature.md)

Defined in: [WAProto/index.d.ts:44599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44599)

Constructs a new PrimaryFeature.

#### Parameters

##### properties?

[`IPrimaryFeature`](../interfaces/IPrimaryFeature.md)

Properties to set

#### Returns

[`PrimaryFeature`](PrimaryFeature.md)

## Properties

### flags

> **flags**: `string`[]

Defined in: [WAProto/index.d.ts:44602](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44602)

PrimaryFeature flags.

#### Implementation of

[`IPrimaryFeature`](../interfaces/IPrimaryFeature.md).[`flags`](../interfaces/IPrimaryFeature.md#flags)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44672](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44672)

Converts this PrimaryFeature to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PrimaryFeature`](PrimaryFeature.md)

Defined in: [WAProto/index.d.ts:44609](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44609)

Creates a new PrimaryFeature instance using the specified properties.

#### Parameters

##### properties?

[`IPrimaryFeature`](../interfaces/IPrimaryFeature.md)

Properties to set

#### Returns

[`PrimaryFeature`](PrimaryFeature.md)

PrimaryFeature instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PrimaryFeature`](PrimaryFeature.md)

Defined in: [WAProto/index.d.ts:44635](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44635)

Decodes a PrimaryFeature message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PrimaryFeature`](PrimaryFeature.md)

PrimaryFeature

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PrimaryFeature`](PrimaryFeature.md)

Defined in: [WAProto/index.d.ts:44644](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44644)

Decodes a PrimaryFeature message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PrimaryFeature`](PrimaryFeature.md)

PrimaryFeature

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44617)

Encodes the specified PrimaryFeature message. Does not implicitly [verify](PrimaryFeature.md#verify) messages.

#### Parameters

##### message

[`IPrimaryFeature`](../interfaces/IPrimaryFeature.md)

PrimaryFeature message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44625](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44625)

Encodes the specified PrimaryFeature message, length delimited. Does not implicitly [verify](PrimaryFeature.md#verify) messages.

#### Parameters

##### message

[`IPrimaryFeature`](../interfaces/IPrimaryFeature.md)

PrimaryFeature message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PrimaryFeature`](PrimaryFeature.md)

Defined in: [WAProto/index.d.ts:44658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44658)

Creates a PrimaryFeature message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PrimaryFeature`](PrimaryFeature.md)

PrimaryFeature

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44679](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44679)

Gets the default type url for PrimaryFeature

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

Defined in: [WAProto/index.d.ts:44666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44666)

Creates a plain object from a PrimaryFeature message. Also converts values to other types if specified.

#### Parameters

##### message

[`PrimaryFeature`](PrimaryFeature.md)

PrimaryFeature

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44651](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44651)

Verifies a PrimaryFeature message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
