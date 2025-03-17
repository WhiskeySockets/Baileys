# Class: NuxAction

Defined in: [WAProto/index.d.ts:44205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44205)

Represents a NuxAction.

## Implements

- [`INuxAction`](../interfaces/INuxAction.md)

## Constructors

### new NuxAction()

> **new NuxAction**(`properties`?): [`NuxAction`](NuxAction.md)

Defined in: [WAProto/index.d.ts:44211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44211)

Constructs a new NuxAction.

#### Parameters

##### properties?

[`INuxAction`](../interfaces/INuxAction.md)

Properties to set

#### Returns

[`NuxAction`](NuxAction.md)

## Properties

### acknowledged?

> `optional` **acknowledged**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:44214](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44214)

NuxAction acknowledged.

#### Implementation of

[`INuxAction`](../interfaces/INuxAction.md).[`acknowledged`](../interfaces/INuxAction.md#acknowledged)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:44284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44284)

Converts this NuxAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`NuxAction`](NuxAction.md)

Defined in: [WAProto/index.d.ts:44221](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44221)

Creates a new NuxAction instance using the specified properties.

#### Parameters

##### properties?

[`INuxAction`](../interfaces/INuxAction.md)

Properties to set

#### Returns

[`NuxAction`](NuxAction.md)

NuxAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`NuxAction`](NuxAction.md)

Defined in: [WAProto/index.d.ts:44247](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44247)

Decodes a NuxAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`NuxAction`](NuxAction.md)

NuxAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`NuxAction`](NuxAction.md)

Defined in: [WAProto/index.d.ts:44256](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44256)

Decodes a NuxAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`NuxAction`](NuxAction.md)

NuxAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44229](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44229)

Encodes the specified NuxAction message. Does not implicitly [verify](NuxAction.md#verify) messages.

#### Parameters

##### message

[`INuxAction`](../interfaces/INuxAction.md)

NuxAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:44237](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44237)

Encodes the specified NuxAction message, length delimited. Does not implicitly [verify](NuxAction.md#verify) messages.

#### Parameters

##### message

[`INuxAction`](../interfaces/INuxAction.md)

NuxAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`NuxAction`](NuxAction.md)

Defined in: [WAProto/index.d.ts:44270](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44270)

Creates a NuxAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`NuxAction`](NuxAction.md)

NuxAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:44291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44291)

Gets the default type url for NuxAction

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

Defined in: [WAProto/index.d.ts:44278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44278)

Creates a plain object from a NuxAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`NuxAction`](NuxAction.md)

NuxAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:44263](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L44263)

Verifies a NuxAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
