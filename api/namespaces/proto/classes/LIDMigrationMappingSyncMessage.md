# Class: LIDMigrationMappingSyncMessage

Defined in: [WAProto/index.d.ts:15803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15803)

Represents a LIDMigrationMappingSyncMessage.

## Implements

- [`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md)

## Constructors

### new LIDMigrationMappingSyncMessage()

> **new LIDMigrationMappingSyncMessage**(`properties`?): [`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:15809](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15809)

Constructs a new LIDMigrationMappingSyncMessage.

#### Parameters

##### properties?

[`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md)

Properties to set

#### Returns

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

## Properties

### encodedMappingPayload?

> `optional` **encodedMappingPayload**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:15812](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15812)

LIDMigrationMappingSyncMessage encodedMappingPayload.

#### Implementation of

[`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md).[`encodedMappingPayload`](../interfaces/ILIDMigrationMappingSyncMessage.md#encodedmappingpayload)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15882](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15882)

Converts this LIDMigrationMappingSyncMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:15819](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15819)

Creates a new LIDMigrationMappingSyncMessage instance using the specified properties.

#### Parameters

##### properties?

[`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md)

Properties to set

#### Returns

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:15845](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15845)

Decodes a LIDMigrationMappingSyncMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:15854](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15854)

Decodes a LIDMigrationMappingSyncMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15827](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15827)

Encodes the specified LIDMigrationMappingSyncMessage message. Does not implicitly [verify](LIDMigrationMappingSyncMessage.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15835](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15835)

Encodes the specified LIDMigrationMappingSyncMessage message, length delimited. Does not implicitly [verify](LIDMigrationMappingSyncMessage.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMappingSyncMessage`](../interfaces/ILIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

Defined in: [WAProto/index.d.ts:15868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15868)

Creates a LIDMigrationMappingSyncMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15889](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15889)

Gets the default type url for LIDMigrationMappingSyncMessage

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

Defined in: [WAProto/index.d.ts:15876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15876)

Creates a plain object from a LIDMigrationMappingSyncMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`LIDMigrationMappingSyncMessage`](LIDMigrationMappingSyncMessage.md)

LIDMigrationMappingSyncMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15861](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15861)

Verifies a LIDMigrationMappingSyncMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
