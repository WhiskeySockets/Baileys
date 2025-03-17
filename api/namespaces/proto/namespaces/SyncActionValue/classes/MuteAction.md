# Class: MuteAction

Defined in: [WAProto/index.d.ts:43864](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43864)

Represents a MuteAction.

## Implements

- [`IMuteAction`](../interfaces/IMuteAction.md)

## Constructors

### new MuteAction()

> **new MuteAction**(`properties`?): [`MuteAction`](MuteAction.md)

Defined in: [WAProto/index.d.ts:43870](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43870)

Constructs a new MuteAction.

#### Parameters

##### properties?

[`IMuteAction`](../interfaces/IMuteAction.md)

Properties to set

#### Returns

[`MuteAction`](MuteAction.md)

## Properties

### autoMuted?

> `optional` **autoMuted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43879](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43879)

MuteAction autoMuted.

#### Implementation of

[`IMuteAction`](../interfaces/IMuteAction.md).[`autoMuted`](../interfaces/IMuteAction.md#automuted)

***

### muted?

> `optional` **muted**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:43873](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43873)

MuteAction muted.

#### Implementation of

[`IMuteAction`](../interfaces/IMuteAction.md).[`muted`](../interfaces/IMuteAction.md#muted)

***

### muteEndTimestamp?

> `optional` **muteEndTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:43876](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43876)

MuteAction muteEndTimestamp.

#### Implementation of

[`IMuteAction`](../interfaces/IMuteAction.md).[`muteEndTimestamp`](../interfaces/IMuteAction.md#muteendtimestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:43949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43949)

Converts this MuteAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MuteAction`](MuteAction.md)

Defined in: [WAProto/index.d.ts:43886](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43886)

Creates a new MuteAction instance using the specified properties.

#### Parameters

##### properties?

[`IMuteAction`](../interfaces/IMuteAction.md)

Properties to set

#### Returns

[`MuteAction`](MuteAction.md)

MuteAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MuteAction`](MuteAction.md)

Defined in: [WAProto/index.d.ts:43912](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43912)

Decodes a MuteAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MuteAction`](MuteAction.md)

MuteAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MuteAction`](MuteAction.md)

Defined in: [WAProto/index.d.ts:43921](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43921)

Decodes a MuteAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MuteAction`](MuteAction.md)

MuteAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43894](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43894)

Encodes the specified MuteAction message. Does not implicitly [verify](MuteAction.md#verify) messages.

#### Parameters

##### message

[`IMuteAction`](../interfaces/IMuteAction.md)

MuteAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:43902](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43902)

Encodes the specified MuteAction message, length delimited. Does not implicitly [verify](MuteAction.md#verify) messages.

#### Parameters

##### message

[`IMuteAction`](../interfaces/IMuteAction.md)

MuteAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MuteAction`](MuteAction.md)

Defined in: [WAProto/index.d.ts:43935](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43935)

Creates a MuteAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MuteAction`](MuteAction.md)

MuteAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:43956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43956)

Gets the default type url for MuteAction

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

Defined in: [WAProto/index.d.ts:43943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43943)

Creates a plain object from a MuteAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`MuteAction`](MuteAction.md)

MuteAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:43928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L43928)

Verifies a MuteAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
