# Class: AppVersion

Defined in: [WAProto/index.d.ts:8529](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8529)

Represents an AppVersion.

## Implements

- [`IAppVersion`](../interfaces/IAppVersion.md)

## Constructors

### new AppVersion()

> **new AppVersion**(`properties`?): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:8535](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8535)

Constructs a new AppVersion.

#### Parameters

##### properties?

[`IAppVersion`](../interfaces/IAppVersion.md)

Properties to set

#### Returns

[`AppVersion`](AppVersion.md)

## Properties

### primary?

> `optional` **primary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8538](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8538)

AppVersion primary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`primary`](../interfaces/IAppVersion.md#primary)

***

### quaternary?

> `optional` **quaternary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8547)

AppVersion quaternary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`quaternary`](../interfaces/IAppVersion.md#quaternary)

***

### quinary?

> `optional` **quinary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8550](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8550)

AppVersion quinary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`quinary`](../interfaces/IAppVersion.md#quinary)

***

### secondary?

> `optional` **secondary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8541)

AppVersion secondary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`secondary`](../interfaces/IAppVersion.md#secondary)

***

### tertiary?

> `optional` **tertiary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:8544](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8544)

AppVersion tertiary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`tertiary`](../interfaces/IAppVersion.md#tertiary)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:8620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8620)

Converts this AppVersion to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:8557](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8557)

Creates a new AppVersion instance using the specified properties.

#### Parameters

##### properties?

[`IAppVersion`](../interfaces/IAppVersion.md)

Properties to set

#### Returns

[`AppVersion`](AppVersion.md)

AppVersion instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:8583](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8583)

Decodes an AppVersion message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`AppVersion`](AppVersion.md)

AppVersion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:8592](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8592)

Decodes an AppVersion message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`AppVersion`](AppVersion.md)

AppVersion

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8565](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8565)

Encodes the specified AppVersion message. Does not implicitly [verify](AppVersion.md#verify) messages.

#### Parameters

##### message

[`IAppVersion`](../interfaces/IAppVersion.md)

AppVersion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8573](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8573)

Encodes the specified AppVersion message, length delimited. Does not implicitly [verify](AppVersion.md#verify) messages.

#### Parameters

##### message

[`IAppVersion`](../interfaces/IAppVersion.md)

AppVersion message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:8606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8606)

Creates an AppVersion message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`AppVersion`](AppVersion.md)

AppVersion

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:8627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8627)

Gets the default type url for AppVersion

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

Defined in: [WAProto/index.d.ts:8614](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8614)

Creates a plain object from an AppVersion message. Also converts values to other types if specified.

#### Parameters

##### message

[`AppVersion`](AppVersion.md)

AppVersion

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:8599](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8599)

Verifies an AppVersion message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
