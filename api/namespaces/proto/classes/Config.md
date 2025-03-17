# Class: Config

Defined in: [WAProto/index.d.ts:9294](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9294)

Represents a Config.

## Implements

- [`IConfig`](../interfaces/IConfig.md)

## Constructors

### new Config()

> **new Config**(`properties`?): [`Config`](Config.md)

Defined in: [WAProto/index.d.ts:9300](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9300)

Constructs a new Config.

#### Parameters

##### properties?

[`IConfig`](../interfaces/IConfig.md)

Properties to set

#### Returns

[`Config`](Config.md)

## Properties

### field

> **field**: `object`

Defined in: [WAProto/index.d.ts:9303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9303)

Config field.

#### Index Signature

\[`k`: `string`\]: [`IField`](../interfaces/IField.md)

#### Implementation of

[`IConfig`](../interfaces/IConfig.md).[`field`](../interfaces/IConfig.md#field)

***

### version?

> `optional` **version**: `null` \| `number`

Defined in: [WAProto/index.d.ts:9306](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9306)

Config version.

#### Implementation of

[`IConfig`](../interfaces/IConfig.md).[`version`](../interfaces/IConfig.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:9376](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9376)

Converts this Config to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Config`](Config.md)

Defined in: [WAProto/index.d.ts:9313](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9313)

Creates a new Config instance using the specified properties.

#### Parameters

##### properties?

[`IConfig`](../interfaces/IConfig.md)

Properties to set

#### Returns

[`Config`](Config.md)

Config instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Config`](Config.md)

Defined in: [WAProto/index.d.ts:9339](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9339)

Decodes a Config message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Config`](Config.md)

Config

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Config`](Config.md)

Defined in: [WAProto/index.d.ts:9348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9348)

Decodes a Config message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Config`](Config.md)

Config

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9321](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9321)

Encodes the specified Config message. Does not implicitly [verify](Config.md#verify) messages.

#### Parameters

##### message

[`IConfig`](../interfaces/IConfig.md)

Config message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:9329](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9329)

Encodes the specified Config message, length delimited. Does not implicitly [verify](Config.md#verify) messages.

#### Parameters

##### message

[`IConfig`](../interfaces/IConfig.md)

Config message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Config`](Config.md)

Defined in: [WAProto/index.d.ts:9362](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9362)

Creates a Config message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Config`](Config.md)

Config

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:9383](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9383)

Gets the default type url for Config

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

Defined in: [WAProto/index.d.ts:9370](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9370)

Creates a plain object from a Config message. Also converts values to other types if specified.

#### Parameters

##### message

[`Config`](Config.md)

Config

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:9355](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L9355)

Verifies a Config message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
