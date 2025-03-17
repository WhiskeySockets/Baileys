# Class: ExitCode

Defined in: [WAProto/index.d.ts:13139](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13139)

Represents an ExitCode.

## Implements

- [`IExitCode`](../interfaces/IExitCode.md)

## Constructors

### new ExitCode()

> **new ExitCode**(`properties`?): [`ExitCode`](ExitCode.md)

Defined in: [WAProto/index.d.ts:13145](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13145)

Constructs a new ExitCode.

#### Parameters

##### properties?

[`IExitCode`](../interfaces/IExitCode.md)

Properties to set

#### Returns

[`ExitCode`](ExitCode.md)

## Properties

### code?

> `optional` **code**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:13148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13148)

ExitCode code.

#### Implementation of

[`IExitCode`](../interfaces/IExitCode.md).[`code`](../interfaces/IExitCode.md#code)

***

### text?

> `optional` **text**: `null` \| `string`

Defined in: [WAProto/index.d.ts:13151](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13151)

ExitCode text.

#### Implementation of

[`IExitCode`](../interfaces/IExitCode.md).[`text`](../interfaces/IExitCode.md#text)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13221](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13221)

Converts this ExitCode to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ExitCode`](ExitCode.md)

Defined in: [WAProto/index.d.ts:13158](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13158)

Creates a new ExitCode instance using the specified properties.

#### Parameters

##### properties?

[`IExitCode`](../interfaces/IExitCode.md)

Properties to set

#### Returns

[`ExitCode`](ExitCode.md)

ExitCode instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ExitCode`](ExitCode.md)

Defined in: [WAProto/index.d.ts:13184](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13184)

Decodes an ExitCode message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ExitCode`](ExitCode.md)

ExitCode

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ExitCode`](ExitCode.md)

Defined in: [WAProto/index.d.ts:13193](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13193)

Decodes an ExitCode message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ExitCode`](ExitCode.md)

ExitCode

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13166](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13166)

Encodes the specified ExitCode message. Does not implicitly [verify](ExitCode.md#verify) messages.

#### Parameters

##### message

[`IExitCode`](../interfaces/IExitCode.md)

ExitCode message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13174)

Encodes the specified ExitCode message, length delimited. Does not implicitly [verify](ExitCode.md#verify) messages.

#### Parameters

##### message

[`IExitCode`](../interfaces/IExitCode.md)

ExitCode message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ExitCode`](ExitCode.md)

Defined in: [WAProto/index.d.ts:13207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13207)

Creates an ExitCode message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ExitCode`](ExitCode.md)

ExitCode

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13228](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13228)

Gets the default type url for ExitCode

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

Defined in: [WAProto/index.d.ts:13215](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13215)

Creates a plain object from an ExitCode message. Also converts values to other types if specified.

#### Parameters

##### message

[`ExitCode`](ExitCode.md)

ExitCode

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:13200](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13200)

Verifies an ExitCode message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
