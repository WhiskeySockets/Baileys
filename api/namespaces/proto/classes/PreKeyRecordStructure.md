# Class: PreKeyRecordStructure

Defined in: [WAProto/index.d.ts:36883](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36883)

Represents a PreKeyRecordStructure.

## Implements

- [`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md)

## Constructors

### new PreKeyRecordStructure()

> **new PreKeyRecordStructure**(`properties`?): [`PreKeyRecordStructure`](PreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:36889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36889)

Constructs a new PreKeyRecordStructure.

#### Parameters

##### properties?

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md)

Properties to set

#### Returns

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

## Properties

### id?

> `optional` **id**: `null` \| `number`

Defined in: [WAProto/index.d.ts:36892](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36892)

PreKeyRecordStructure id.

#### Implementation of

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md).[`id`](../interfaces/IPreKeyRecordStructure.md#id)

***

### privateKey?

> `optional` **privateKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:36898](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36898)

PreKeyRecordStructure privateKey.

#### Implementation of

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md).[`privateKey`](../interfaces/IPreKeyRecordStructure.md#privatekey)

***

### publicKey?

> `optional` **publicKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:36895](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36895)

PreKeyRecordStructure publicKey.

#### Implementation of

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md).[`publicKey`](../interfaces/IPreKeyRecordStructure.md#publickey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36968](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36968)

Converts this PreKeyRecordStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PreKeyRecordStructure`](PreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:36905](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36905)

Creates a new PreKeyRecordStructure instance using the specified properties.

#### Parameters

##### properties?

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md)

Properties to set

#### Returns

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

PreKeyRecordStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PreKeyRecordStructure`](PreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:36931](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36931)

Decodes a PreKeyRecordStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

PreKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PreKeyRecordStructure`](PreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:36940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36940)

Decodes a PreKeyRecordStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

PreKeyRecordStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36913)

Encodes the specified PreKeyRecordStructure message. Does not implicitly [verify](PreKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md)

PreKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36921](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36921)

Encodes the specified PreKeyRecordStructure message, length delimited. Does not implicitly [verify](PreKeyRecordStructure.md#verify) messages.

#### Parameters

##### message

[`IPreKeyRecordStructure`](../interfaces/IPreKeyRecordStructure.md)

PreKeyRecordStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PreKeyRecordStructure`](PreKeyRecordStructure.md)

Defined in: [WAProto/index.d.ts:36954](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36954)

Creates a PreKeyRecordStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

PreKeyRecordStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36975](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36975)

Gets the default type url for PreKeyRecordStructure

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

Defined in: [WAProto/index.d.ts:36962](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36962)

Creates a plain object from a PreKeyRecordStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`PreKeyRecordStructure`](PreKeyRecordStructure.md)

PreKeyRecordStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36947](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36947)

Verifies a PreKeyRecordStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
