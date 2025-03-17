# Class: LIDMigrationMappingSyncPayload

Defined in: [WAProto/index.d.ts:15900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15900)

Represents a LIDMigrationMappingSyncPayload.

## Implements

- [`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md)

## Constructors

### new LIDMigrationMappingSyncPayload()

> **new LIDMigrationMappingSyncPayload**(`properties`?): [`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

Defined in: [WAProto/index.d.ts:15906](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15906)

Constructs a new LIDMigrationMappingSyncPayload.

#### Parameters

##### properties?

[`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md)

Properties to set

#### Returns

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

## Properties

### pnToLidMappings

> **pnToLidMappings**: [`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)[]

Defined in: [WAProto/index.d.ts:15909](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15909)

LIDMigrationMappingSyncPayload pnToLidMappings.

#### Implementation of

[`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md).[`pnToLidMappings`](../interfaces/ILIDMigrationMappingSyncPayload.md#pntolidmappings)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15979](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15979)

Converts this LIDMigrationMappingSyncPayload to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

Defined in: [WAProto/index.d.ts:15916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15916)

Creates a new LIDMigrationMappingSyncPayload instance using the specified properties.

#### Parameters

##### properties?

[`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md)

Properties to set

#### Returns

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

Defined in: [WAProto/index.d.ts:15942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15942)

Decodes a LIDMigrationMappingSyncPayload message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

Defined in: [WAProto/index.d.ts:15951](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15951)

Decodes a LIDMigrationMappingSyncPayload message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15924)

Encodes the specified LIDMigrationMappingSyncPayload message. Does not implicitly [verify](LIDMigrationMappingSyncPayload.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15932](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15932)

Encodes the specified LIDMigrationMappingSyncPayload message, length delimited. Does not implicitly [verify](LIDMigrationMappingSyncPayload.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMappingSyncPayload`](../interfaces/ILIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

Defined in: [WAProto/index.d.ts:15965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15965)

Creates a LIDMigrationMappingSyncPayload message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15986](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15986)

Gets the default type url for LIDMigrationMappingSyncPayload

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

Defined in: [WAProto/index.d.ts:15973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15973)

Creates a plain object from a LIDMigrationMappingSyncPayload message. Also converts values to other types if specified.

#### Parameters

##### message

[`LIDMigrationMappingSyncPayload`](LIDMigrationMappingSyncPayload.md)

LIDMigrationMappingSyncPayload

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15958)

Verifies a LIDMigrationMappingSyncPayload message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
