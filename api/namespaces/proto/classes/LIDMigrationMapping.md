# Class: LIDMigrationMapping

Defined in: [WAProto/index.d.ts:15700](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15700)

Represents a LIDMigrationMapping.

## Implements

- [`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)

## Constructors

### new LIDMigrationMapping()

> **new LIDMigrationMapping**(`properties`?): [`LIDMigrationMapping`](LIDMigrationMapping.md)

Defined in: [WAProto/index.d.ts:15706](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15706)

Constructs a new LIDMigrationMapping.

#### Parameters

##### properties?

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)

Properties to set

#### Returns

[`LIDMigrationMapping`](LIDMigrationMapping.md)

## Properties

### assignedLid

> **assignedLid**: `number` \| `Long`

Defined in: [WAProto/index.d.ts:15712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15712)

LIDMigrationMapping assignedLid.

#### Implementation of

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md).[`assignedLid`](../interfaces/ILIDMigrationMapping.md#assignedlid)

***

### latestLid?

> `optional` **latestLid**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:15715](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15715)

LIDMigrationMapping latestLid.

#### Implementation of

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md).[`latestLid`](../interfaces/ILIDMigrationMapping.md#latestlid)

***

### pn

> **pn**: `number` \| `Long`

Defined in: [WAProto/index.d.ts:15709](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15709)

LIDMigrationMapping pn.

#### Implementation of

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md).[`pn`](../interfaces/ILIDMigrationMapping.md#pn)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15785)

Converts this LIDMigrationMapping to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`LIDMigrationMapping`](LIDMigrationMapping.md)

Defined in: [WAProto/index.d.ts:15722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15722)

Creates a new LIDMigrationMapping instance using the specified properties.

#### Parameters

##### properties?

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)

Properties to set

#### Returns

[`LIDMigrationMapping`](LIDMigrationMapping.md)

LIDMigrationMapping instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`LIDMigrationMapping`](LIDMigrationMapping.md)

Defined in: [WAProto/index.d.ts:15748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15748)

Decodes a LIDMigrationMapping message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`LIDMigrationMapping`](LIDMigrationMapping.md)

LIDMigrationMapping

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`LIDMigrationMapping`](LIDMigrationMapping.md)

Defined in: [WAProto/index.d.ts:15757](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15757)

Decodes a LIDMigrationMapping message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`LIDMigrationMapping`](LIDMigrationMapping.md)

LIDMigrationMapping

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15730](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15730)

Encodes the specified LIDMigrationMapping message. Does not implicitly [verify](LIDMigrationMapping.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)

LIDMigrationMapping message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15738)

Encodes the specified LIDMigrationMapping message, length delimited. Does not implicitly [verify](LIDMigrationMapping.md#verify) messages.

#### Parameters

##### message

[`ILIDMigrationMapping`](../interfaces/ILIDMigrationMapping.md)

LIDMigrationMapping message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`LIDMigrationMapping`](LIDMigrationMapping.md)

Defined in: [WAProto/index.d.ts:15771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15771)

Creates a LIDMigrationMapping message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`LIDMigrationMapping`](LIDMigrationMapping.md)

LIDMigrationMapping

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15792](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15792)

Gets the default type url for LIDMigrationMapping

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

Defined in: [WAProto/index.d.ts:15779](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15779)

Creates a plain object from a LIDMigrationMapping message. Also converts values to other types if specified.

#### Parameters

##### message

[`LIDMigrationMapping`](LIDMigrationMapping.md)

LIDMigrationMapping

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15764](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15764)

Verifies a LIDMigrationMapping message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
