# Class: Parameters

Defined in: [WAProto/index.d.ts:10096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10096)

Represents a Parameters.

## Implements

- [`IParameters`](../interfaces/IParameters.md)

## Constructors

### new Parameters()

> **new Parameters**(`properties`?): [`Parameters`](Parameters.md)

Defined in: [WAProto/index.d.ts:10102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10102)

Constructs a new Parameters.

#### Parameters

##### properties?

[`IParameters`](../interfaces/IParameters.md)

Properties to set

#### Returns

[`Parameters`](Parameters.md)

## Properties

### contents?

> `optional` **contents**: `null` \| [`IParameters`](../interfaces/IParameters.md)

Defined in: [WAProto/index.d.ts:10117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10117)

Parameters contents.

#### Implementation of

[`IParameters`](../interfaces/IParameters.md).[`contents`](../interfaces/IParameters.md#contents)

***

### floatData?

> `optional` **floatData**: `null` \| `number`

Defined in: [WAProto/index.d.ts:10114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10114)

Parameters floatData.

#### Implementation of

[`IParameters`](../interfaces/IParameters.md).[`floatData`](../interfaces/IParameters.md#floatdata)

***

### intData?

> `optional` **intData**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:10111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10111)

Parameters intData.

#### Implementation of

[`IParameters`](../interfaces/IParameters.md).[`intData`](../interfaces/IParameters.md#intdata)

***

### key?

> `optional` **key**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10105)

Parameters key.

#### Implementation of

[`IParameters`](../interfaces/IParameters.md).[`key`](../interfaces/IParameters.md#key)

***

### stringData?

> `optional` **stringData**: `null` \| `string`

Defined in: [WAProto/index.d.ts:10108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10108)

Parameters stringData.

#### Implementation of

[`IParameters`](../interfaces/IParameters.md).[`stringData`](../interfaces/IParameters.md#stringdata)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:10187](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10187)

Converts this Parameters to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Parameters`](Parameters.md)

Defined in: [WAProto/index.d.ts:10124](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10124)

Creates a new Parameters instance using the specified properties.

#### Parameters

##### properties?

[`IParameters`](../interfaces/IParameters.md)

Properties to set

#### Returns

[`Parameters`](Parameters.md)

Parameters instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Parameters`](Parameters.md)

Defined in: [WAProto/index.d.ts:10150](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10150)

Decodes a Parameters message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Parameters`](Parameters.md)

Parameters

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Parameters`](Parameters.md)

Defined in: [WAProto/index.d.ts:10159](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10159)

Decodes a Parameters message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Parameters`](Parameters.md)

Parameters

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10132)

Encodes the specified Parameters message. Does not implicitly [verify](Parameters.md#verify) messages.

#### Parameters

##### message

[`IParameters`](../interfaces/IParameters.md)

Parameters message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:10140](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10140)

Encodes the specified Parameters message, length delimited. Does not implicitly [verify](Parameters.md#verify) messages.

#### Parameters

##### message

[`IParameters`](../interfaces/IParameters.md)

Parameters message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Parameters`](Parameters.md)

Defined in: [WAProto/index.d.ts:10173](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10173)

Creates a Parameters message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Parameters`](Parameters.md)

Parameters

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:10194](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10194)

Gets the default type url for Parameters

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

Defined in: [WAProto/index.d.ts:10181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10181)

Creates a plain object from a Parameters message. Also converts values to other types if specified.

#### Parameters

##### message

[`Parameters`](Parameters.md)

Parameters

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:10166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L10166)

Verifies a Parameters message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
