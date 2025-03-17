# Class: CallLogAction

Defined in: [WAProto/index.d.ts:41347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41347)

Represents a CallLogAction.

## Implements

- [`ICallLogAction`](../interfaces/ICallLogAction.md)

## Constructors

### new CallLogAction()

> **new CallLogAction**(`properties`?): [`CallLogAction`](CallLogAction.md)

Defined in: [WAProto/index.d.ts:41353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41353)

Constructs a new CallLogAction.

#### Parameters

##### properties?

[`ICallLogAction`](../interfaces/ICallLogAction.md)

Properties to set

#### Returns

[`CallLogAction`](CallLogAction.md)

## Properties

### callLogRecord?

> `optional` **callLogRecord**: `null` \| [`ICallLogRecord`](../../../interfaces/ICallLogRecord.md)

Defined in: [WAProto/index.d.ts:41356](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41356)

CallLogAction callLogRecord.

#### Implementation of

[`ICallLogAction`](../interfaces/ICallLogAction.md).[`callLogRecord`](../interfaces/ICallLogAction.md#calllogrecord)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:41426](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41426)

Converts this CallLogAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CallLogAction`](CallLogAction.md)

Defined in: [WAProto/index.d.ts:41363](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41363)

Creates a new CallLogAction instance using the specified properties.

#### Parameters

##### properties?

[`ICallLogAction`](../interfaces/ICallLogAction.md)

Properties to set

#### Returns

[`CallLogAction`](CallLogAction.md)

CallLogAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CallLogAction`](CallLogAction.md)

Defined in: [WAProto/index.d.ts:41389](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41389)

Decodes a CallLogAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CallLogAction`](CallLogAction.md)

CallLogAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CallLogAction`](CallLogAction.md)

Defined in: [WAProto/index.d.ts:41398](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41398)

Decodes a CallLogAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CallLogAction`](CallLogAction.md)

CallLogAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41371](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41371)

Encodes the specified CallLogAction message. Does not implicitly [verify](CallLogAction.md#verify) messages.

#### Parameters

##### message

[`ICallLogAction`](../interfaces/ICallLogAction.md)

CallLogAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:41379](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41379)

Encodes the specified CallLogAction message, length delimited. Does not implicitly [verify](CallLogAction.md#verify) messages.

#### Parameters

##### message

[`ICallLogAction`](../interfaces/ICallLogAction.md)

CallLogAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CallLogAction`](CallLogAction.md)

Defined in: [WAProto/index.d.ts:41412](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41412)

Creates a CallLogAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CallLogAction`](CallLogAction.md)

CallLogAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:41433](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41433)

Gets the default type url for CallLogAction

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

Defined in: [WAProto/index.d.ts:41420](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41420)

Creates a plain object from a CallLogAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`CallLogAction`](CallLogAction.md)

CallLogAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:41405](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L41405)

Verifies a CallLogAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
