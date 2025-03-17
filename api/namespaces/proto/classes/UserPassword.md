# Class: UserPassword

Defined in: [WAProto/index.d.ts:48404](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48404)

Represents a UserPassword.

## Implements

- [`IUserPassword`](../interfaces/IUserPassword.md)

## Constructors

### new UserPassword()

> **new UserPassword**(`properties`?): [`UserPassword`](UserPassword.md)

Defined in: [WAProto/index.d.ts:48410](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48410)

Constructs a new UserPassword.

#### Parameters

##### properties?

[`IUserPassword`](../interfaces/IUserPassword.md)

Properties to set

#### Returns

[`UserPassword`](UserPassword.md)

## Properties

### encoding?

> `optional` **encoding**: `null` \| [`Encoding`](../namespaces/UserPassword/enumerations/Encoding.md)

Defined in: [WAProto/index.d.ts:48413](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48413)

UserPassword encoding.

#### Implementation of

[`IUserPassword`](../interfaces/IUserPassword.md).[`encoding`](../interfaces/IUserPassword.md#encoding)

***

### transformedData?

> `optional` **transformedData**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:48422](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48422)

UserPassword transformedData.

#### Implementation of

[`IUserPassword`](../interfaces/IUserPassword.md).[`transformedData`](../interfaces/IUserPassword.md#transformeddata)

***

### transformer?

> `optional` **transformer**: `null` \| [`Transformer`](../namespaces/UserPassword/enumerations/Transformer.md)

Defined in: [WAProto/index.d.ts:48416](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48416)

UserPassword transformer.

#### Implementation of

[`IUserPassword`](../interfaces/IUserPassword.md).[`transformer`](../interfaces/IUserPassword.md#transformer)

***

### transformerArg

> **transformerArg**: [`ITransformerArg`](../namespaces/UserPassword/interfaces/ITransformerArg.md)[]

Defined in: [WAProto/index.d.ts:48419](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48419)

UserPassword transformerArg.

#### Implementation of

[`IUserPassword`](../interfaces/IUserPassword.md).[`transformerArg`](../interfaces/IUserPassword.md#transformerarg)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48492)

Converts this UserPassword to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UserPassword`](UserPassword.md)

Defined in: [WAProto/index.d.ts:48429](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48429)

Creates a new UserPassword instance using the specified properties.

#### Parameters

##### properties?

[`IUserPassword`](../interfaces/IUserPassword.md)

Properties to set

#### Returns

[`UserPassword`](UserPassword.md)

UserPassword instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UserPassword`](UserPassword.md)

Defined in: [WAProto/index.d.ts:48455](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48455)

Decodes a UserPassword message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UserPassword`](UserPassword.md)

UserPassword

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UserPassword`](UserPassword.md)

Defined in: [WAProto/index.d.ts:48464](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48464)

Decodes a UserPassword message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UserPassword`](UserPassword.md)

UserPassword

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48437](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48437)

Encodes the specified UserPassword message. Does not implicitly [verify](UserPassword.md#verify) messages.

#### Parameters

##### message

[`IUserPassword`](../interfaces/IUserPassword.md)

UserPassword message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48445](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48445)

Encodes the specified UserPassword message, length delimited. Does not implicitly [verify](UserPassword.md#verify) messages.

#### Parameters

##### message

[`IUserPassword`](../interfaces/IUserPassword.md)

UserPassword message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UserPassword`](UserPassword.md)

Defined in: [WAProto/index.d.ts:48478](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48478)

Creates a UserPassword message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UserPassword`](UserPassword.md)

UserPassword

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48499)

Gets the default type url for UserPassword

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

Defined in: [WAProto/index.d.ts:48486](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48486)

Creates a plain object from a UserPassword message. Also converts values to other types if specified.

#### Parameters

##### message

[`UserPassword`](UserPassword.md)

UserPassword

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48471](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48471)

Verifies a UserPassword message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
