# Class: InteropData

Defined in: [WAProto/index.d.ts:8211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8211)

Represents an InteropData.

## Implements

- [`IInteropData`](../interfaces/IInteropData.md)

## Constructors

### new InteropData()

> **new InteropData**(`properties`?): [`InteropData`](InteropData.md)

Defined in: [WAProto/index.d.ts:8217](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8217)

Constructs a new InteropData.

#### Parameters

##### properties?

[`IInteropData`](../interfaces/IInteropData.md)

Properties to set

#### Returns

[`InteropData`](InteropData.md)

## Properties

### accountId?

> `optional` **accountId**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:8220](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8220)

InteropData accountId.

#### Implementation of

[`IInteropData`](../interfaces/IInteropData.md).[`accountId`](../interfaces/IInteropData.md#accountid)

***

### enableReadReceipts?

> `optional` **enableReadReceipts**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:8226](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8226)

InteropData enableReadReceipts.

#### Implementation of

[`IInteropData`](../interfaces/IInteropData.md).[`enableReadReceipts`](../interfaces/IInteropData.md#enablereadreceipts)

***

### token?

> `optional` **token**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:8223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8223)

InteropData token.

#### Implementation of

[`IInteropData`](../interfaces/IInteropData.md).[`token`](../interfaces/IInteropData.md#token)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:8296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8296)

Converts this InteropData to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`InteropData`](InteropData.md)

Defined in: [WAProto/index.d.ts:8233](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8233)

Creates a new InteropData instance using the specified properties.

#### Parameters

##### properties?

[`IInteropData`](../interfaces/IInteropData.md)

Properties to set

#### Returns

[`InteropData`](InteropData.md)

InteropData instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`InteropData`](InteropData.md)

Defined in: [WAProto/index.d.ts:8259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8259)

Decodes an InteropData message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`InteropData`](InteropData.md)

InteropData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`InteropData`](InteropData.md)

Defined in: [WAProto/index.d.ts:8268](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8268)

Decodes an InteropData message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`InteropData`](InteropData.md)

InteropData

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8241](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8241)

Encodes the specified InteropData message. Does not implicitly [verify](InteropData.md#verify) messages.

#### Parameters

##### message

[`IInteropData`](../interfaces/IInteropData.md)

InteropData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:8249](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8249)

Encodes the specified InteropData message, length delimited. Does not implicitly [verify](InteropData.md#verify) messages.

#### Parameters

##### message

[`IInteropData`](../interfaces/IInteropData.md)

InteropData message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`InteropData`](InteropData.md)

Defined in: [WAProto/index.d.ts:8282](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8282)

Creates an InteropData message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`InteropData`](InteropData.md)

InteropData

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:8303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8303)

Gets the default type url for InteropData

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

Defined in: [WAProto/index.d.ts:8290](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8290)

Creates a plain object from an InteropData message. Also converts values to other types if specified.

#### Parameters

##### message

[`InteropData`](InteropData.md)

InteropData

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:8275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8275)

Verifies an InteropData message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
