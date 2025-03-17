# Class: StarAction

Defined in: [WAProto/index.d.ts:45490](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45490)

Represents a StarAction.

## Implements

- [`IStarAction`](../interfaces/IStarAction.md)

## Constructors

### new StarAction()

> **new StarAction**(`properties`?): [`StarAction`](StarAction.md)

Defined in: [WAProto/index.d.ts:45496](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45496)

Constructs a new StarAction.

#### Parameters

##### properties?

[`IStarAction`](../interfaces/IStarAction.md)

Properties to set

#### Returns

[`StarAction`](StarAction.md)

## Properties

### starred?

> `optional` **starred**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:45499](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45499)

StarAction starred.

#### Implementation of

[`IStarAction`](../interfaces/IStarAction.md).[`starred`](../interfaces/IStarAction.md#starred)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45569](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45569)

Converts this StarAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`StarAction`](StarAction.md)

Defined in: [WAProto/index.d.ts:45506](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45506)

Creates a new StarAction instance using the specified properties.

#### Parameters

##### properties?

[`IStarAction`](../interfaces/IStarAction.md)

Properties to set

#### Returns

[`StarAction`](StarAction.md)

StarAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`StarAction`](StarAction.md)

Defined in: [WAProto/index.d.ts:45532](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45532)

Decodes a StarAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`StarAction`](StarAction.md)

StarAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`StarAction`](StarAction.md)

Defined in: [WAProto/index.d.ts:45541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45541)

Decodes a StarAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`StarAction`](StarAction.md)

StarAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45514](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45514)

Encodes the specified StarAction message. Does not implicitly [verify](StarAction.md#verify) messages.

#### Parameters

##### message

[`IStarAction`](../interfaces/IStarAction.md)

StarAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45522](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45522)

Encodes the specified StarAction message, length delimited. Does not implicitly [verify](StarAction.md#verify) messages.

#### Parameters

##### message

[`IStarAction`](../interfaces/IStarAction.md)

StarAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`StarAction`](StarAction.md)

Defined in: [WAProto/index.d.ts:45555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45555)

Creates a StarAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`StarAction`](StarAction.md)

StarAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45576](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45576)

Gets the default type url for StarAction

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

Defined in: [WAProto/index.d.ts:45563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45563)

Creates a plain object from a StarAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`StarAction`](StarAction.md)

StarAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45548](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45548)

Verifies a StarAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
