# Class: IdentityKeyPairStructure

Defined in: [WAProto/index.d.ts:15106](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15106)

Represents an IdentityKeyPairStructure.

## Implements

- [`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md)

## Constructors

### new IdentityKeyPairStructure()

> **new IdentityKeyPairStructure**(`properties`?): [`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

Defined in: [WAProto/index.d.ts:15112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15112)

Constructs a new IdentityKeyPairStructure.

#### Parameters

##### properties?

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md)

Properties to set

#### Returns

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

## Properties

### privateKey?

> `optional` **privateKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15118](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15118)

IdentityKeyPairStructure privateKey.

#### Implementation of

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md).[`privateKey`](../interfaces/IIdentityKeyPairStructure.md#privatekey)

***

### publicKey?

> `optional` **publicKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15115](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15115)

IdentityKeyPairStructure publicKey.

#### Implementation of

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md).[`publicKey`](../interfaces/IIdentityKeyPairStructure.md#publickey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15188](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15188)

Converts this IdentityKeyPairStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

Defined in: [WAProto/index.d.ts:15125](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15125)

Creates a new IdentityKeyPairStructure instance using the specified properties.

#### Parameters

##### properties?

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md)

Properties to set

#### Returns

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

IdentityKeyPairStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

Defined in: [WAProto/index.d.ts:15151](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15151)

Decodes an IdentityKeyPairStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

IdentityKeyPairStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

Defined in: [WAProto/index.d.ts:15160](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15160)

Decodes an IdentityKeyPairStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

IdentityKeyPairStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15133](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15133)

Encodes the specified IdentityKeyPairStructure message. Does not implicitly [verify](IdentityKeyPairStructure.md#verify) messages.

#### Parameters

##### message

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md)

IdentityKeyPairStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15141)

Encodes the specified IdentityKeyPairStructure message, length delimited. Does not implicitly [verify](IdentityKeyPairStructure.md#verify) messages.

#### Parameters

##### message

[`IIdentityKeyPairStructure`](../interfaces/IIdentityKeyPairStructure.md)

IdentityKeyPairStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

Defined in: [WAProto/index.d.ts:15174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15174)

Creates an IdentityKeyPairStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

IdentityKeyPairStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15195](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15195)

Gets the default type url for IdentityKeyPairStructure

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

Defined in: [WAProto/index.d.ts:15182](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15182)

Creates a plain object from an IdentityKeyPairStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`IdentityKeyPairStructure`](IdentityKeyPairStructure.md)

IdentityKeyPairStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15167](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15167)

Verifies an IdentityKeyPairStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
