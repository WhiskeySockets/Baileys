# Class: Value

Defined in: [WAProto/index.d.ts:48633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48633)

Represents a Value.

## Implements

- [`IValue`](../interfaces/IValue.md)

## Constructors

### new Value()

> **new Value**(`properties`?): [`Value`](Value.md)

Defined in: [WAProto/index.d.ts:48639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48639)

Constructs a new Value.

#### Parameters

##### properties?

[`IValue`](../interfaces/IValue.md)

Properties to set

#### Returns

[`Value`](Value.md)

## Properties

### asBlob?

> `optional` **asBlob**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:48642](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48642)

Value asBlob.

#### Implementation of

[`IValue`](../interfaces/IValue.md).[`asBlob`](../interfaces/IValue.md#asblob)

***

### asUnsignedInteger?

> `optional` **asUnsignedInteger**: `null` \| `number`

Defined in: [WAProto/index.d.ts:48645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48645)

Value asUnsignedInteger.

#### Implementation of

[`IValue`](../interfaces/IValue.md).[`asUnsignedInteger`](../interfaces/IValue.md#asunsignedinteger)

***

### value?

> `optional` **value**: `"asBlob"` \| `"asUnsignedInteger"`

Defined in: [WAProto/index.d.ts:48648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48648)

Value value.

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48718)

Converts this Value to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Value`](Value.md)

Defined in: [WAProto/index.d.ts:48655](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48655)

Creates a new Value instance using the specified properties.

#### Parameters

##### properties?

[`IValue`](../interfaces/IValue.md)

Properties to set

#### Returns

[`Value`](Value.md)

Value instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Value`](Value.md)

Defined in: [WAProto/index.d.ts:48681](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48681)

Decodes a Value message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Value`](Value.md)

Value

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Value`](Value.md)

Defined in: [WAProto/index.d.ts:48690](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48690)

Decodes a Value message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Value`](Value.md)

Value

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48663](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48663)

Encodes the specified Value message. Does not implicitly [verify](Value.md#verify) messages.

#### Parameters

##### message

[`IValue`](../interfaces/IValue.md)

Value message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48671](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48671)

Encodes the specified Value message, length delimited. Does not implicitly [verify](Value.md#verify) messages.

#### Parameters

##### message

[`IValue`](../interfaces/IValue.md)

Value message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Value`](Value.md)

Defined in: [WAProto/index.d.ts:48704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48704)

Creates a Value message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Value`](Value.md)

Value

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48725](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48725)

Gets the default type url for Value

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

Defined in: [WAProto/index.d.ts:48712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48712)

Creates a plain object from a Value message. Also converts values to other types if specified.

#### Parameters

##### message

[`Value`](Value.md)

Value

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48697](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48697)

Verifies a Value message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
