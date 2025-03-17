# Class: AppVersion

Defined in: [WAProto/index.d.ts:11902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11902)

Represents an AppVersion.

## Implements

- [`IAppVersion`](../interfaces/IAppVersion.md)

## Constructors

### new AppVersion()

> **new AppVersion**(`properties`?): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:11908](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11908)

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

Defined in: [WAProto/index.d.ts:11911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11911)

AppVersion primary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`primary`](../interfaces/IAppVersion.md#primary)

***

### quaternary?

> `optional` **quaternary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:11920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11920)

AppVersion quaternary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`quaternary`](../interfaces/IAppVersion.md#quaternary)

***

### quinary?

> `optional` **quinary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:11923](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11923)

AppVersion quinary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`quinary`](../interfaces/IAppVersion.md#quinary)

***

### secondary?

> `optional` **secondary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:11914](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11914)

AppVersion secondary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`secondary`](../interfaces/IAppVersion.md#secondary)

***

### tertiary?

> `optional` **tertiary**: `null` \| `number`

Defined in: [WAProto/index.d.ts:11917](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11917)

AppVersion tertiary.

#### Implementation of

[`IAppVersion`](../interfaces/IAppVersion.md).[`tertiary`](../interfaces/IAppVersion.md#tertiary)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:11993](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11993)

Converts this AppVersion to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`AppVersion`](AppVersion.md)

Defined in: [WAProto/index.d.ts:11930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11930)

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

Defined in: [WAProto/index.d.ts:11956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11956)

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

Defined in: [WAProto/index.d.ts:11965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11965)

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

Defined in: [WAProto/index.d.ts:11938](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11938)

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

Defined in: [WAProto/index.d.ts:11946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11946)

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

Defined in: [WAProto/index.d.ts:11979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11979)

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

Defined in: [WAProto/index.d.ts:12000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12000)

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

Defined in: [WAProto/index.d.ts:11987](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11987)

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

Defined in: [WAProto/index.d.ts:11972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11972)

Verifies an AppVersion message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
