# Class: SignedPreKeyRecordStructure

Defined in: [WAProto/index.d.ts:39937](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39937)

Represents a SignedPreKeyRecordStructure.

## Implements

- [`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md)

## Constructors

### new SignedPreKeyRecordStructure()

> **new SignedPreKeyRecordStructure**(`properties`?): [`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:39943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39943)

Constructs a new SignedPreKeyRecordStructure.

#### Parameters

##### properties?

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md)

Properties to set

#### Returns

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

## Properties

### id?

> `optional` **id**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39946)

SignedPreKeyRecordStructure id.

#### Implementation of

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md).[`id`](../interfaces/ISignedPreKeyRecordStructure.md#id)

***

### privateKey?

> `optional` **privateKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39952](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39952)

SignedPreKeyRecordStructure privateKey.

#### Implementation of

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md).[`privateKey`](../interfaces/ISignedPreKeyRecordStructure.md#privatekey)

***

### publicKey?

> `optional` **publicKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39949)

SignedPreKeyRecordStructure publicKey.

#### Implementation of

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md).[`publicKey`](../interfaces/ISignedPreKeyRecordStructure.md#publickey)

***

### signature?

> `optional` **signature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39955)

SignedPreKeyRecordStructure signature.

#### Implementation of

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md).[`signature`](../interfaces/ISignedPreKeyRecordStructure.md#signature)

***

### timestamp?

> `optional` **timestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:39958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39958)

SignedPreKeyRecordStructure timestamp.

#### Implementation of

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md).[`timestamp`](../interfaces/ISignedPreKeyRecordStructure.md#timestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:40028](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40028)

Converts this SignedPreKeyRecordStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:39965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39965)

Creates a new SignedPreKeyRecordStructure instance using the specified properties.

#### Parameters

##### properties?

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md)

Properties to set

#### Returns

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:39991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39991)

Decodes a SignedPreKeyRecordStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:40000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40000)

Decodes a SignedPreKeyRecordStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39973)

Encodes the specified SignedPreKeyRecordStructure message. Does not implicitly [verify](SignedPreKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39981)

Encodes the specified SignedPreKeyRecordStructure message, length delimited. Does not implicitly [verify](SignedPreKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`ISignedPreKeyRecordStructure`](../interfaces/ISignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:40014](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40014)

Creates a SignedPreKeyRecordStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:40035](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40035)

Gets the default type url for SignedPreKeyRecordStructure

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

Defined in: [WAProto/index.d.ts:40022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40022)

Creates a plain object from a SignedPreKeyRecordStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`SignedPreKeyRecordStructure`](SignedPreKeyRecordStructure.md)

SignedPreKeyRecordStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:40007](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L40007)

Verifies a SignedPreKeyRecordStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
